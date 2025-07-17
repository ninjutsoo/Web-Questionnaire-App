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
  sendPasswordReset,
} from "../../services/authService";

export default function Signin() {
  const navigate = useNavigate();
  const [type, setType] = useState("account"); // “account” = username login, “email” = email login
  const [loading, setLoading] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");

  // style wrapper (optional, copied from your previous code)
  const containerClassName = useEmotionCss(() => ({
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    // overflow: "auto",
    backgroundImage:
      "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
    backgroundSize: "100% 100%",
  }));

  const handleForgotPassword = async () => {
    if (!loginValue) {
      toast.error("Please enter your email or username first.");
      return;
    }
    if (loginValue.includes("@")) {
      // It's an email
      const result = await sendPasswordReset(loginValue);
      if (result.success) {
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error(result.message || "Failed to send reset email.");
      }
    } else {
      // It's a username
      const email = window.prompt("Enter your email to receive a password reset link:");
      if (!email) return;
      const result = await sendPasswordReset(email);
      if (result.success) {
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error(result.message || "Failed to send reset email.");
      }
    }
  };

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
          onFinish={async () => {
            setLoading(true);
            let result;
            if (loginValue.includes("@")) {
              // email login
              result = await signInWithEmail({ email: loginValue, password });
            } else {
              // username login
              result = await signInWithUsername({ username: loginValue, password });
            }
            setLoading(false);
            if (result.success) {
              toast.success("Logged in successfully!");
              console.log("Global user object:", getCurrentUser());
              navigate("/home");
            } else {
              toast.error(result.message || "Login failed");
            }
          }}
        >
          <ProFormText
            name="loginValue"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined />, // covers both email and username
              value: loginValue,
              onChange: (e) => setLoginValue(e.target.value),
              autoComplete: "username email"
            }}
            placeholder="Email or Username"
            rules={[
              { required: true, message: "Email or Username is required." },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined />,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              autoComplete: "current-password"
            }}
            placeholder="Password"
            rules={[{ required: true, message: "Password is required." }]}
          />
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 14 }}>
            Don’t have an account?{' '}
            <a onClick={() => navigate("/signup")}>Sign Up</a>
            {' '}|{' '}
            <a onClick={handleForgotPassword}>Forgot password?</a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
}
