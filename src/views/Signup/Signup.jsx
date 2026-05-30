// src/pages/Signup.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input, Steps, Typography } from "antd";
import {
  CalendarOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEmotionCss } from "@ant-design/use-emotion-css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logoSrc from "../../assets/logo.svg";
import { signUpWithEmail } from "../../services/authService";

const { Text, Title } = Typography;

const steps = [
  {
    key: "name",
    title: "Name",
    fields: ["firstName", "lastName"],
  },
  {
    key: "contact",
    title: "Contact",
    fields: ["email", "phone"],
  },
  {
    key: "account",
    title: "Account",
    fields: ["username", "password", "confirmPassword"],
  },
  {
    key: "profile",
    title: "Profile",
    fields: ["age", "caregiverEmail"],
  },
  {
    key: "review",
    title: "Review",
    fields: [],
  },
];

const reviewLabels = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
  username: "Username",
  age: "Age",
  caregiverEmail: "Caregiver Email",
};

const allValidationFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "username",
  "password",
  "confirmPassword",
  "age",
  "caregiverEmail",
];

export default function Signup() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

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
    maxWidth: 760,
    background: "#ffffff",
    border: "1px solid #d7dee6",
    borderRadius: 8,
    boxShadow: "0 16px 42px rgba(18, 38, 63, 0.16)",
    padding: "36px 32px",
    ".signup-logo": {
      display: "block",
      width: 132,
      height: "auto",
      margin: "0 auto 20px",
    },
    ".ant-steps": {
      margin: "28px 0",
    },
    ".ant-steps-item-title": {
      fontSize: 16,
      fontWeight: 700,
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
    ".ant-form-item-explain-error": {
      fontSize: 15,
      marginTop: 4,
    },
    ".signup-step-copy": {
      marginBottom: 20,
      color: "#364653",
      fontSize: 17,
      lineHeight: 1.55,
    },
    ".signup-actions": {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "space-between",
      marginTop: 24,
    },
    ".ant-btn": {
      minHeight: 48,
      borderRadius: 8,
      fontSize: 16,
      fontWeight: 700,
      paddingInline: 20,
    },
    ".signup-primary": {
      background: "#003366",
      borderColor: "#003366",
      color: "#ffffff",
    },
    ".signup-primary:hover": {
      background: "#052746 !important",
      borderColor: "#052746 !important",
      color: "#ffffff !important",
    },
    ".signup-secondary": {
      borderColor: "#003366",
      color: "#003366",
    },
    ".signup-review": {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 12,
      marginTop: 16,
    },
    ".signup-review-item": {
      border: "1px solid #d7dee6",
      borderRadius: 8,
      padding: 14,
      background: "#f8fafc",
    },
    ".signup-review-item dt": {
      margin: "0 0 6px",
      color: "#364653",
      fontSize: 15,
      fontWeight: 700,
    },
    ".signup-review-item dd": {
      margin: 0,
      color: "#1f2a33",
      fontSize: 16,
      overflowWrap: "anywhere",
    },
    ".signup-footer-link": {
      marginTop: 22,
      textAlign: "center",
      fontSize: 16,
    },
    "@media (max-width: 640px)": {
      padding: "28px 18px",
      ".signup-review": {
        gridTemplateColumns: "1fr",
      },
      ".signup-actions": {
        flexDirection: "column-reverse",
      },
      ".signup-actions .ant-btn": {
        width: "100%",
      },
    },
  }));

  const stepItems = useMemo(
    () => steps.map((step) => ({ key: step.key, title: step.title })),
    []
  );

  const currentStepKey = steps[currentStep].key;
  const currentFields = steps[currentStep].fields;
  const formValues = Form.useWatch([], form) || {};

  const validateCurrentStep = async () => {
    setFormMessage(null);
    await form.validateFields(currentFields);
  };

  const goNext = async () => {
    try {
      await validateCurrentStep();
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    } catch {
      setFormMessage({
        type: "error",
        text: "Please fix the highlighted fields before continuing.",
      });
    }
  };

  const handleSubmit = async () => {
    setFormMessage(null);

    try {
      await form.validateFields(allValidationFields);
    } catch {
      setFormMessage({
        type: "error",
        text: "Please fix the highlighted fields before creating your account.",
      });
      return;
    }

    const values = form.getFieldsValue(allValidationFields);
    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      username: values.username.trim(),
      age: values.age.trim(),
      caregiverEmail: (values.caregiverEmail || "").trim(),
      password: values.password,
    };

    setLoading(true);
    const result = await signUpWithEmail(payload);
    setLoading(false);

    if (result.success) {
      toast.success("Account created successfully. Please sign in.");
      navigate("/signin");
      return;
    }

    setFormMessage({
      type: "error",
      text: result.message || "Sign up failed. Please review your information and try again.",
    });
  };

  const renderStepFields = () => {
    if (currentStepKey === "name") {
      return (
        <>
          <p className="signup-step-copy">Tell us who the questionnaire is for.</p>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "First name is required." }]}
          >
            <Input size="large" prefix={<UserOutlined aria-hidden="true" />} autoComplete="given-name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Last name is required." }]}
          >
            <Input size="large" prefix={<UserOutlined aria-hidden="true" />} autoComplete="family-name" />
          </Form.Item>
        </>
      );
    }

    if (currentStepKey === "contact") {
      return (
        <>
          <p className="signup-step-copy">Add contact information for account access and follow-up.</p>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Email is required." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input size="large" prefix={<MailOutlined aria-hidden="true" />} autoComplete="email" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Phone number is required." },
              {
                pattern: /^\d{10}$/,
                message: "Please enter a valid 10-digit phone number with numbers only.",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<MobileOutlined aria-hidden="true" />}
              inputMode="numeric"
              autoComplete="tel-national"
            />
          </Form.Item>
        </>
      );
    }

    if (currentStepKey === "account") {
      return (
        <>
          <p className="signup-step-copy">Choose the username and password you will use to sign in later.</p>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required." }]}
          >
            <Input size="large" prefix={<UserOutlined aria-hidden="true" />} autoComplete="username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required." },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined aria-hidden="true" />}
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
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
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined aria-hidden="true" />}
              autoComplete="new-password"
            />
          </Form.Item>
        </>
      );
    }

    if (currentStepKey === "profile") {
      return (
        <>
          <p className="signup-step-copy">
            Add the older adult's age and an optional Caregiver email if someone helps manage care.
          </p>
          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: "Age is required." },
              {
                pattern: /^[1-9]\d?$|^1[01]\d$|^120$/,
                message: "Please enter a valid age from 1 to 120.",
              },
            ]}
          >
            <Input size="large" prefix={<CalendarOutlined aria-hidden="true" />} inputMode="numeric" />
          </Form.Item>
          <Form.Item
            label="Caregiver Email (Optional)"
            name="caregiverEmail"
            rules={[{ type: "email", message: "Please enter a valid email." }]}
          >
            <Input size="large" prefix={<MailOutlined aria-hidden="true" />} autoComplete="email" />
          </Form.Item>
        </>
      );
    }

    return (
      <>
        <p className="signup-step-copy">Review your details before creating your account.</p>
        <dl className="signup-review">
          {Object.entries(reviewLabels).map(([field, label]) => (
            <div className="signup-review-item" key={field}>
              <dt>{label}</dt>
              <dd>{formValues[field] || (field === "caregiverEmail" ? "Not provided" : "-")}</dd>
            </div>
          ))}
        </dl>
      </>
    );
  };

  return (
    <main className={pageClassName}>
      <ToastContainer position="top-center" autoClose={3000} />
      <section className={panelClassName} aria-labelledby="signup-title">
        <img src={logoSrc} alt="4Ms Health Questionnaire logo" className="signup-logo" />
        <Title id="signup-title" level={1} style={{ margin: 0, textAlign: "center", fontSize: 32 }}>
          I'm New: Start Here
        </Title>
        <Text
          style={{
            display: "block",
            margin: "12px auto 0",
            textAlign: "center",
            fontSize: 17,
            lineHeight: 1.55,
            maxWidth: 470,
          }}
        >
          Create an account in a few short steps so your 4Ms questionnaire can be saved.
        </Text>

        <Steps current={currentStep} items={stepItems} responsive />

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
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            username: "",
            age: "",
            caregiverEmail: "",
          }}
        >
          {renderStepFields()}

          <div className="signup-actions">
            <Button
              className="signup-secondary"
              onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
              disabled={currentStep === 0 || loading}
            >
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button className="signup-primary" type="primary" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button
                className="signup-primary"
                type="primary"
                loading={loading}
                onClick={handleSubmit}
              >
                Create Account
              </Button>
            )}
          </div>
        </Form>

        <div className="signup-footer-link">
          Already have an account? <Link to="/signin">Returning User: Sign In</Link>
        </div>
      </section>
    </main>
  );
}
