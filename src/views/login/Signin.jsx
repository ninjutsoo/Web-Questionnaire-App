// File: src/views/login/Signin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useEmotionCss } from "@ant-design/use-emotion-css";

import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { Tabs } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";

import logoSrc from "../../assets/logo.svg";

// —— Make sure this path correctly points to your authService.js file ——
// If authService.js lives in src/services/authService.js, and this file is at src/views/login/Signin.jsx,
// then the relative import is "../../services/authService".
import {
  signInWithEmail,
  signInWithUsername,
  getCurrentUser,
} from "../../services/authService";

export default function Signin() {
  const navigate = useNavigate();
  const [type, setType] = useState("account"); // “account” = username login, “email” = email login
  const [loading, setLoading] = useState(false);

  // style wrapper (optional, copied from your previous code)
  const containerClassName = useEmotionCss(() => ({
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "auto",
    backgroundImage:
      "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
    backgroundSize: "100% 100%",
  }));

  return (
    <div className={containerClassName}>
      <ToastContainer position="top-center" autoClose={3000} />
      <div style={{ flex: "1", padding: "32px 0" }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: "75vw" }}
          logo={
            <img
              alt="logo"
              src={logoSrc}
              style={{ width: "80%", maxWidth: "150px", height: "auto" }}
            />
          }
          title="Log In"
          initialValues={{ autoLogin: true }}
          submitter={{ searchConfig: { submitText: "Log In" }, loading }}
          onFinish={async (values) => {
            setLoading(true);
            let result;

            if (type === "account") {
              // username + password flow
              result = await signInWithUsername({
                username: values.username,
                password: values.password,
              });
            } else {
              // email + password flow
              result = await signInWithEmail({
                email: values.email,
                password: values.password,
              });
            }

            setLoading(false);

            if (result.success) {
              toast.success("Logged in successfully!");
              console.log("Global user object:", getCurrentUser());
              navigate("/home"); // or wherever your home page is
            } else {
              toast.error(result.message || "Login failed");
            }
          }}
        >
          {/* ─── Tabs: choose “Username” vs “Email” ─── */}
          <Tabs
            activeKey={type}
            onChange={(key) => setType(key)}
            centered
            items={[
              { key: "account", label: "Login with Username" },
              { key: "email",   label: "Login with Email" },
            ]}
            style={{ marginBottom: 24 }}
          />

          {type === "account" && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined />,
                }}
                placeholder="Username"
                rules={[{ required: true, message: "Username is required." }]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                placeholder="Password"
                rules={[{ required: true, message: "Password is required." }]}
              />
            </>
          )}

          {type === "email" && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: "large",
                  prefix: <MailOutlined />,
                }}
                placeholder="Email"
                rules={[
                  { required: true, message: "Email is required." },
                  { type: "email", message: "Must be a valid email." },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                placeholder="Password"
                rules={[{ required: true, message: "Password is required." }]}
              />
            </>
          )}

          <div style={{ marginTop: 8 }}>
            Don’t have an account?{" "}
            <a
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
}
