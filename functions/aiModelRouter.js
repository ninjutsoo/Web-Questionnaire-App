/* eslint-env node */
const axios = require("axios");
const { defineString, defineInt } = require("firebase-functions/params");

const openrouterApiKeyParam = defineString("OPENROUTER_API_KEY", { default: "" });
const frontendUrlParam = defineString("FRONTEND_URL", { default: "https://web-app-new-efb66.web.app" });
const paidModelParam = defineString("PAID_MODEL", { default: "deepseek/deepseek-v4-flash" });
const modelCooldownMsParam = defineInt("MODEL_COOLDOWN_MS", { default: 600000 });
const deprecatedCooldownMsParam = defineInt("DEPRECATED_COOLDOWN_MS", { default: 3600000 });
const globalFreeRetryMsParam = defineInt("GLOBAL_FREE_RETRY_MS", { default: 1800000 });
const routingCacheTtlMsParam = defineInt("ROUTING_CACHE_TTL_MS", { default: 30000 });
const probeBackoffMsParam = defineInt("PROBE_BACKOFF_MS", { default: 900000 });
const maxProbeBackoffMsParam = defineInt("MAX_PROBE_BACKOFF_MS", { default: 7200000 });

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const ROUTING_DOC_PATH = "system/aiModelRouting";
const PROBE_MODEL = "deepseek/deepseek-v4-flash:free";

const FREE_MODELS = [
  "deepseek/deepseek-v4-flash:free",
  "z-ai/glm-4.5-air:free",
  "deepseek/deepseek-chat-v3-0324:free",
  "qwen/qwen3-coder:free",
  "tngtech/deepseek-r1t2-chimera:free",
  "meta-llama/llama-3.1-8b-instruct:free",
];

let db = null;
let cache = { state: null, fetchedAt: 0 };

function initRouter(admin) {
  db = admin.firestore();
}

function getPaidModel() {
  return paidModelParam.value();
}

function toMs(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value instanceof Date) return value.getTime();
  return Number(value) || 0;
}

function defaultModelEntries() {
  const models = {};
  FREE_MODELS.forEach((id) => {
    models[id] = { openUntil: null, lastError: null };
  });
  return models;
}

function normalizeState(raw) {
  const now = Date.now();
  const models = defaultModelEntries();
  if (raw?.models) {
    Object.entries(raw.models).forEach(([id, entry]) => {
      if (!models[id] && !FREE_MODELS.includes(id)) return;
      models[id] = {
        openUntil: toMs(entry?.openUntil) || null,
        lastError: entry?.lastError || null,
      };
    });
  }

  let tier = raw?.tier === "paid" ? "paid" : "free";
  const paidUntil = toMs(raw?.paidUntil) || null;

  if (tier === "paid" && paidUntil && paidUntil <= now) {
    tier = "free";
  }

  return {
    tier,
    paidUntil: paidUntil && paidUntil > now ? paidUntil : null,
    lastPaidAt: toMs(raw?.lastPaidAt) || null,
    models,
    stats: {
      freeSuccess: raw?.stats?.freeSuccess || 0,
      paidSuccess: raw?.stats?.paidSuccess || 0,
      lastRecoveryAt: toMs(raw?.stats?.lastRecoveryAt) || null,
    },
    updatedAt: toMs(raw?.updatedAt) || now,
  };
}

function isCircuitOpen(modelEntry, now = Date.now()) {
  return modelEntry?.openUntil != null && modelEntry.openUntil > now;
}

function classifyOpenRouterError(err) {
  const status = err?.response?.status;
  const message = (err?.response?.data?.error?.message || err?.message || "").toLowerCase();

  if (status === 401 || message.includes("invalid api key") || message.includes("unauthorized")) {
    return { kind: "auth", status, message };
  }
  if (status === 402 || message.includes("insufficient credits")) {
    return { kind: "auth", status, message };
  }
  if (
    status === 429 ||
    status === 503 ||
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("overloaded") ||
    message.includes("capacity") ||
    message.includes("provider returned error")
  ) {
    return { kind: "rate_limit", status, message };
  }
  if (message.includes("no endpoints found")) {
    return { kind: "unavailable", status, message };
  }
  return { kind: "other", status, message };
}

async function loadRoutingState(force = false) {
  const ttl = routingCacheTtlMsParam.value();
  const now = Date.now();
  if (!force && cache.state && now - cache.fetchedAt < ttl) {
    return cache.state;
  }

  const snap = await db.doc(ROUTING_DOC_PATH).get();
  const state = normalizeState(snap.exists ? snap.data() : null);
  cache = { state, fetchedAt: now };
  return state;
}

function invalidateCache() {
  cache = { state: null, fetchedAt: 0 };
}

async function persistRoutingState(state) {
  const docRef = db.doc(ROUTING_DOC_PATH);
  const payload = {
    tier: state.tier,
    paidUntil: state.paidUntil ? new Date(state.paidUntil) : null,
    lastPaidAt: state.lastPaidAt ? new Date(state.lastPaidAt) : null,
    models: {},
    stats: {
      freeSuccess: state.stats.freeSuccess,
      paidSuccess: state.stats.paidSuccess,
      lastRecoveryAt: state.stats.lastRecoveryAt ? new Date(state.stats.lastRecoveryAt) : null,
    },
    updatedAt: new Date(),
  };

  Object.entries(state.models).forEach(([id, entry]) => {
    payload.models[id] = {
      openUntil: entry.openUntil ? new Date(entry.openUntil) : null,
      lastError: entry.lastError || null,
    };
  });

  await docRef.set(payload, { merge: true });
  cache = { state, fetchedAt: Date.now() };
}

function getAvailableFreeModels(state, now = Date.now()) {
  return FREE_MODELS.filter((id) => !isCircuitOpen(state.models[id], now));
}

function buildModelPlan(state, now = Date.now()) {
  const paidModel = getPaidModel();
  const availableFree = getAvailableFreeModels(state, now);
  const allFreeOpen = availableFree.length === 0;
  const onPaidTier = state.tier === "paid" && state.paidUntil && state.paidUntil > now;

  if (onPaidTier || allFreeOpen) {
    return { models: [paidModel], mode: onPaidTier ? "paid" : "paid_fallback", availableFree };
  }
  return { models: [...availableFree, paidModel], mode: "free_first", availableFree };
}

function getOpenRouterHeaders(req) {
  const origin = req?.headers?.origin || frontendUrlParam.value();
  return {
    Authorization: `Bearer ${openrouterApiKeyParam.value()}`,
    "Content-Type": "application/json",
    "HTTP-Referer": origin,
    "X-Title": "4Ms Health Questionnaire App",
  };
}

async function callModel(model, messages, req, temperature, maxTokens) {
  const payload = { model, messages, temperature };
  if (maxTokens) payload.max_tokens = maxTokens;
  const response = await axios.post(OPENROUTER_API_URL, payload, {
    headers: getOpenRouterHeaders(req),
    timeout: 60000,
  });
  return response;
}

async function recordSuccess(modelId, previousState) {
  const now = Date.now();
  const paidModel = getPaidModel();
  const isPaid = modelId === paidModel;
  const isFree = FREE_MODELS.includes(modelId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(db.doc(ROUTING_DOC_PATH));
    const state = normalizeState(snap.exists ? snap.data() : null);

    if (state.models[modelId]) {
      state.models[modelId].openUntil = null;
      state.models[modelId].lastError = null;
    }

    if (isPaid) {
      state.stats.paidSuccess += 1;
    } else if (isFree) {
      state.stats.freeSuccess += 1;
      if (previousState.tier === "paid" || state.tier === "paid") {
        state.tier = "free";
        state.paidUntil = null;
        state.stats.lastRecoveryAt = now;
        console.log("Recovered to free tier after successful free model call:", modelId);
      }
    }

    state.updatedAt = now;
    const docRef = db.doc(ROUTING_DOC_PATH);
    tx.set(docRef, {
      tier: state.tier,
      paidUntil: state.paidUntil ? new Date(state.paidUntil) : null,
      lastPaidAt: state.lastPaidAt ? new Date(state.lastPaidAt) : null,
      models: Object.fromEntries(
        Object.entries(state.models).map(([id, entry]) => [
          id,
          {
            openUntil: entry.openUntil ? new Date(entry.openUntil) : null,
            lastError: entry.lastError || null,
          },
        ])
      ),
      stats: {
        freeSuccess: state.stats.freeSuccess,
        paidSuccess: state.stats.paidSuccess,
        lastRecoveryAt: state.stats.lastRecoveryAt ? new Date(state.stats.lastRecoveryAt) : null,
      },
      updatedAt: new Date(now),
    }, { merge: true });
  });

  invalidateCache();
}

async function recordFailure(modelId, err, triedFreeModels) {
  const classified = classifyOpenRouterError(err);
  if (classified.kind === "auth") {
    return { escalated: false, kind: "auth" };
  }

  const now = Date.now();
  const paidModel = getPaidModel();
  const isFree = FREE_MODELS.includes(modelId);
  if (!isFree && modelId !== paidModel) {
    return { escalated: false, kind: classified.kind };
  }

  let cooldownMs = modelCooldownMsParam.value();
  if (classified.kind === "unavailable") {
    cooldownMs = deprecatedCooldownMsParam.value();
  } else if (classified.kind !== "rate_limit") {
    cooldownMs = Math.floor(modelCooldownMsParam.value() / 2);
  }

  let escalated = false;

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(db.doc(ROUTING_DOC_PATH));
    const state = normalizeState(snap.exists ? snap.data() : null);

    if (isFree && state.models[modelId]) {
      state.models[modelId].openUntil = now + cooldownMs;
      state.models[modelId].lastError = String(classified.status || classified.kind);
    }

    const availableFree = getAvailableFreeModels(state, now);
    const allFreeRateLimited =
      isFree &&
      triedFreeModels.length > 0 &&
      triedFreeModels.every((id) => FREE_MODELS.includes(id)) &&
      availableFree.length === 0;

    if (availableFree.length === 0 || allFreeRateLimited) {
      state.tier = "paid";
      state.paidUntil = now + globalFreeRetryMsParam.value();
      state.lastPaidAt = now;
      escalated = true;
      console.log("Escalated to paid tier until", new Date(state.paidUntil).toISOString());
    }

    state.updatedAt = now;
    tx.set(db.doc(ROUTING_DOC_PATH), {
      tier: state.tier,
      paidUntil: state.paidUntil ? new Date(state.paidUntil) : null,
      lastPaidAt: state.lastPaidAt ? new Date(state.lastPaidAt) : null,
      models: Object.fromEntries(
        Object.entries(state.models).map(([id, entry]) => [
          id,
          {
            openUntil: entry.openUntil ? new Date(entry.openUntil) : null,
            lastError: entry.lastError || null,
          },
        ])
      ),
      updatedAt: new Date(now),
    }, { merge: true });
  });

  invalidateCache();
  return { escalated, kind: classified.kind };
}

async function callOpenRouterWithRouting({ messages, req, temperature = 0.3, maxTokens }) {
  const apiKey = openrouterApiKeyParam.value();
  if (!apiKey) return { error: "no_key" };

  let state = await loadRoutingState(true);
  let plan = buildModelPlan(state);
  const triedFree = [];
  let lastError;
  let authError = false;

  for (const model of plan.models) {
    try {
      console.log(`Trying OpenRouter model (${plan.mode}): ${model}`);
      const response = await callModel(model, messages, req, temperature, maxTokens);
      await recordSuccess(model, state);
      return { response, model, routingMode: plan.mode };
    } catch (err) {
      lastError = err;
      const classified = classifyOpenRouterError(err);
      console.error(`OpenRouter ${model} failed (${classified.kind}):`, classified.message);

      if (classified.kind === "auth") {
        authError = true;
        break;
      }

      if (FREE_MODELS.includes(model)) {
        triedFree.push(model);
      }

      const failureResult = await recordFailure(model, err, triedFree);
      if (failureResult.kind === "auth") {
        authError = true;
        break;
      }

      if (failureResult.escalated) {
        state = await loadRoutingState(true);
        const paidModel = getPaidModel();
        if (model !== paidModel && !plan.models.includes(paidModel)) {
          plan = { models: [paidModel], mode: "paid", availableFree: [] };
        }
      }
    }
  }

  if (authError) {
    return { error: "no_key", lastError };
  }
  return { error: "all_failed", lastError, routingMode: plan.mode };
}

async function probeFreeTierRecovery() {
  if (!openrouterApiKeyParam.value()) {
    console.log("Probe skipped: OPENROUTER_API_KEY not set");
    return { probed: false, reason: "no_key" };
  }

  const state = await loadRoutingState(true);
  const now = Date.now();

  if (state.tier !== "paid") {
    return { probed: false, reason: "not_on_paid_tier" };
  }
  if (state.paidUntil && state.paidUntil > now) {
    return { probed: false, reason: "cooldown_active", paidUntil: state.paidUntil };
  }

  console.log("Probing free tier recovery with", PROBE_MODEL);
  try {
    await callModel(
      PROBE_MODEL,
      [{ role: "user", content: "Reply with OK." }],
      null,
      0,
      8
    );

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(db.doc(ROUTING_DOC_PATH));
      const current = normalizeState(snap.exists ? snap.data() : null);
      current.tier = "free";
      current.paidUntil = null;
      current.stats.lastRecoveryAt = now;
      Object.keys(current.models).forEach((id) => {
        current.models[id].openUntil = null;
        current.models[id].lastError = null;
      });
      tx.set(db.doc(ROUTING_DOC_PATH), {
        tier: "free",
        paidUntil: null,
        models: Object.fromEntries(
          Object.keys(current.models).map((id) => [id, { openUntil: null, lastError: null }])
        ),
        stats: {
          freeSuccess: current.stats.freeSuccess,
          paidSuccess: current.stats.paidSuccess,
          lastRecoveryAt: new Date(now),
        },
        updatedAt: new Date(now),
      }, { merge: true });
    });

    invalidateCache();
    console.log("Recovered to free tier via scheduled probe");
    return { probed: true, recovered: true };
  } catch (err) {
    const classified = classifyOpenRouterError(err);
    console.error("Free tier probe failed:", classified.message);

    const backoffMs = probeBackoffMsParam.value();
    const maxBackoff = maxProbeBackoffMsParam.value();
    const newPaidUntil = Math.min(
      (state.paidUntil || now) + backoffMs,
      now + maxBackoff
    );

    await persistRoutingState({
      ...state,
      tier: "paid",
      paidUntil: newPaidUntil,
      updatedAt: now,
    });

    return { probed: true, recovered: false, extendedUntil: newPaidUntil };
  }
}

async function getRoutingStatusForDebug() {
  const state = await loadRoutingState(true);
  const now = Date.now();
  const availableFree = getAvailableFreeModels(state, now);
  const openCircuits = FREE_MODELS.filter((id) => isCircuitOpen(state.models[id], now));

  return {
    tier: state.tier,
    paidUntil: state.paidUntil || null,
    nextFreeRetryAt: state.paidUntil && state.paidUntil > now ? state.paidUntil : null,
    availableFreeModels: availableFree,
    openCircuits,
    primaryFreeModel: FREE_MODELS[0],
    paidFallbackModel: getPaidModel(),
    stats: state.stats,
  };
}

module.exports = {
  FREE_MODELS,
  initRouter,
  getPaidModel,
  classifyOpenRouterError,
  loadRoutingState,
  buildModelPlan,
  recordSuccess,
  recordFailure,
  callOpenRouterWithRouting,
  probeFreeTierRecovery,
  getRoutingStatusForDebug,
};
