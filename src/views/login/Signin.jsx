// File: src/views/login/Signin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useEmotionCss } from "@ant-design/use-emotion-css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logoSrc from "../../assets/logo.svg";
import {
  getCurrentUser,
  sendPasswordReset,
  signInWithEmail,
  signInWithUsername,
} from "../../services/authService";

const { Text, Title } = Typography;

export default function Signin() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  const pageClassName = useEmotionCss(() => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    background: "#eef3f7",
  }));

  const panelClassName = useEmotionCss(() => ({
    width: "100%",
    maxWidth: 520,
    background: "#ffffff",
    border: "1px solid #d7dee6",
    borderRadius: 8,
    boxShadow: "0 16px 42px rgba(18, 38, 63, 0.16)",
    padding: "36px 32px",
    ".signin-logo": {
      display: "block",
      width: 132,
      height: "auto",
      margin: "0 auto 20px",
    },
    ".ant-typography": {
      color: "#1f2a33",
    },
    ".ant-form-item-label > label": {
      minHeight: 24,
      color: "#1f2a33",
      fontSize: 16,
      fontWeight: 700,
    },
    ".ant-input-affix-wrapper": {
      minHeight: 48,
      borderColor: "#66717c",
      borderRadius: 8,
      fontSize: 16,
    },
    ".ant-input": {
      fontSize: 16,
    },
    ".ant-btn": {
      minHeight: 48,
      borderRadius: 8,
      fontSize: 16,
      fontWeight: 700,
    },
    ".signin-submit": {
      background: "#003366",
      borderColor: "#003366",
      color: "#ffffff",
    },
    ".signin-submit:hover": {
      background: "#052746 !important",
      borderColor: "#052746 !important",
      color: "#ffffff !important",
    },
    ".signin-links": {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 18,
      fontSize: 16,
    },
    ".signin-link-button": {
      minHeight: 44,
      paddingInline: 12,
      border: "1px solid #003366",
      color: "#003366",
      background: "#ffffff",
    },
  }));

  const handleSubmit = async (values) => {
    setLoading(true);
    setFormMessage(null);

    const loginValue = values.loginValue.trim();
    const password = values.password;
    const result = loginValue.includes("@")
      ? await signInWithEmail({ email: loginValue, password })
      : await signInWithUsername({ username: loginValue, password });

    setLoading(false);
    if (result.success) {
      toast.success("Signed in successfully.");
      console.log("Global user object:", getCurrentUser());
      navigate("/home");
      return;
    }

    setFormMessage({
      type: "error",
      text: result.message || "Sign in failed. Check your username, email, and password.",
    });
  };

  const handleForgotPassword = async () => {
    const loginValue = (form.getFieldValue("loginValue") || "").trim();
    setFormMessage(null);

    if (!loginValue) {
      setFormMessage({
        type: "warning",
        text: "Enter your email address first, then choose Forgot password.",
      });
      return;
    }

    if (!loginValue.includes("@")) {
      setFormMessage({
        type: "warning",
        text: "Password reset needs the email address on your account, not your username.",
      });
      return;
    }

    setResetLoading(true);
    const result = await sendPasswordReset(loginValue);
    setResetLoading(false);

    if (result.success) {
      setFormMessage({
        type: "success",
        text: "Password reset email sent. Check your inbox.",
      });
      return;
    }

    setFormMessage({
      type: "error",
      text: result.message || "Failed to send password reset email.",
    });
  };

  return (
    <main className={pageClassName}>
      <ToastContainer position="top-center" autoClose={3000} />
      <section className={panelClassName} aria-labelledby="signin-title">
        <img src={logoSrc} alt="4Ms Health Questionnaire logo" className="signin-logo" />
        <Title id="signin-title" level={1} style={{ margin: 0, textAlign: "center", fontSize: 32 }}>
          Returning User: Sign In
        </Title>
        <Text
          style={{
            display: "block",
            margin: "12px auto 28px",
            textAlign: "center",
            fontSize: 17,
            lineHeight: 1.55,
            maxWidth: 390,
          }}
        >
          Sign in to continue a saved questionnaire, review your answers, or update your profile.
        </Text>

        {formMessage && (
          <Alert
            showIcon
            type={formMessage.type}
            message={formMessage.text}
            style={{ marginBottom: 20, fontSize: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          validateTrigger={["onBlur", "onChange"]}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Email or Username"
            name="loginValue"
            rules={[{ required: true, message: "Enter your email or username." }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined aria-hidden="true" />}
              autoComplete="username email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter your password." }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined aria-hidden="true" />}
              autoComplete="current-password"
            />
          </Form.Item>

          <Button
            className="signin-submit"
            htmlType="submit"
            block
            loading={loading}
            size="large"
          >
            Sign In
          </Button>
        </Form>

        <div className="signin-links">
          <Text style={{ fontSize: 16 }}>New to the 4Ms questionnaire?</Text>
          <Link to="/signup">I'm New: Start Here</Link>
          <Button
            className="signin-link-button"
            type="default"
            loading={resetLoading}
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
      </section>
    </main>
  );
}
