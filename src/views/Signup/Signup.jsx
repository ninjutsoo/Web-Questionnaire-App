// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useEmotionCss } from "@ant-design/use-emotion-css";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import {
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import logoSrc from "../../assets/logo.svg";

import { signUpWithEmail, signUpWithGoogle } from "../../services/authService";


export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    // NO password / confirmPassword here
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  }

  async function handleGoogleSignup() {
    setLoading(true);
    const result = await signUpWithGoogle();
    setLoading(false);
    if (result.success) {
      toast.success("Signed up with Google successfully!");
      navigate("/home");
    } else {
      toast.error(result.message);
    }
  }

  // This now uses the `values` object only—no more formData.password or confirmPassword
  async function handleSubmit(values) {
    const {
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
      confirmPassword,
    } = values;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      toast.warn("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const payload = { firstName, lastName, email, phone, username, password };
    setLoading(true);
    const result = await signUpWithEmail(payload);
    setLoading(false);

    if (result.success) {
      toast.success("Account created successfully! Please sign in.");
      navigate("/signin");
    } else {
      toast.error(result.message);
    }
  }

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
      <div style={{ flex: 1, padding: "32px 0" }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: "75vw" }}
          logo={
            <img
              alt="logo"
              src={logoSrc}
              style={{ width: "80%", maxWidth: "150px", height: "auto" }}
            />
          }
          title="Sign Up"
          initialValues={{ autoLogin: true }}
          submitter={{ searchConfig: { submitText: "Sign Up" } }}
          onFinish={handleSubmit}
        >
          {/* ===== First Name ===== */}
          <ProFormText
            fieldProps={{ size: "large", prefix: <UserOutlined /> }}
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            rules={[{ required: true, message: "First name is required." }]}
          />

          {/* ===== Last Name ===== */}
          <ProFormText
            fieldProps={{ size: "large", prefix: <UserOutlined /> }}
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            rules={[{ required: true, message: "Last name is required." }]}
          />

          {/* ===== Email ===== */}
          <ProFormText
            fieldProps={{ size: "large", prefix: <MailOutlined /> }}
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            rules={[
              { required: true, message: "Email is required." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          />

          {/* ===== Phone ===== */}
          <ProFormText
            fieldProps={{ size: "large", prefix: <MobileOutlined /> }}
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            rules={[
              { required: true, message: "Phone number is required." },
              {
                pattern: /^\d{10,15}$/,
                message: "Please enter a valid phone number (10–15 digits).",
              },
            ]}
          />

          {/* ===== Username ===== */}
          <ProFormText
            fieldProps={{ size: "large", prefix: <UserOutlined /> }}
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            rules={[{ required: true, message: "Username is required." }]}
          />

          {/* ===== Password (no value/onChange) ===== */}
          <ProFormText.Password
            name="password"
            fieldProps={{ size: "large", prefix: <LockOutlined /> }}
            placeholder="Password"
            rules={[
              { required: true, message: "Password is required." },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          />

          {/* ===== Confirm Password (no value/onChange) ===== */}
          <ProFormText.Password
            name="confirmPassword"
            fieldProps={{ size: "large", prefix: <LockOutlined /> }}
            placeholder="Confirm Password"
            rules={[
              { required: true, message: "Please confirm your password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match."));
                },
              }),
            ]}
          />

          <div style={{ marginTop: 8 }}>
            Already have an account? <Link to="/signin">Sign In</Link>
          </div>
        </LoginForm>

        {/* If you want a separate Google button, put it here */}
        {/* <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={handleGoogleSignup} disabled={loading}>
            <GoogleOutlined /> Sign up with Google
          </button>
        </div> */}
      </div>
    </div>
  );
}