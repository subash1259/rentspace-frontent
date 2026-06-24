import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../css/register.css";
import {
  FaUser, FaEnvelope, FaMobileAlt, FaLock,
  FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle,
  FaRedo, FaHome, FaUserTie
} from "react-icons/fa";

import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ─── STEP 1 — DETAILS VALIDATION ─── */
const detailsSchema = Yup.object({
  username: Yup.string()
    .min(3, "Minimum 3 characters required")
    .max(30, "Maximum 30 characters allowed")
    .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore allowed")
    .required("Username is required"),

  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number")
    .required("Mobile number is required"),

  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/[0-9]/, "At least one number")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),

  role: Yup.string()
    .oneOf(["user", "owner"], "Please select a role")
    .required("Role is required"),
});

/* ─── STEP 2 — OTP VALIDATION ─── */
const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

/* ─── PASSWORD STRENGTH ─── */
const getStrength = (pwd) => {
  if (!pwd) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 6)         score++;
  if (pwd.length >= 10)        score++;
  if (/[A-Z]/.test(pwd))       score++;
  if (/[0-9]/.test(pwd))       score++;
  if (/[^a-zA-Z0-9]/.test(pwd))score++;
  if (score <= 2) return { level: score, label: "Weak",   color: "#ff6b6b" };
  if (score <= 3) return { level: score, label: "Fair",   color: "#f0a500" };
  if (score <= 4) return { level: score, label: "Good",   color: "#7df3b8" };
  return              { level: score, label: "Strong", color: "#c8f04d" };
};

export default function Register() {
  const [step, setStep]             = useState(1);
  const [showPwd, setShowPwd]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown]   = useState(0);
  const timerRef                    = useRef(null);

  const startCountdown = () => {
    setCountdown(30);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  /* ── STEP 1 FORMIK ── */
  const detailsFormik = useFormik({
    initialValues: {
      username: "", email: "", mobile: "",
      password: "", confirmPassword: "", role: "",
    },
    validationSchema: detailsSchema,
    onSubmit: async (values) => {
  try {
    const res = await API.post("/auth/register", {
      username: values.username,
      email:    values.email,
      mobile:   values.mobile,
      password: values.password,
      role:     values.role,
    });

    login(res.data.user, res.data.token);
    navigate("/");

  } catch (error) {
    alert(error.response?.data?.message || "Register failed!");
  }
},
  });

  /* ── STEP 2 FORMIK ── */
  // const otpFormik = useFormik({
  //   initialValues: { otp: "" },
  //   validationSchema: otpSchema,
  //   onSubmit: (values) => {
  //     if (values.otp === "123456") {
  //       setStep(3);
  //     } else {
  //       otpFormik.setFieldError("otp", "Incorrect OTP. Use 123456 for demo");
  //     }
  //   },
  // });

  const strength = getStrength(detailsFormik.values.password);

  /* ── FIELD HELPER ── */
  const fieldState = (formik, name) => {
    const touched = formik.touched[name];
    const error   = formik.errors[name];
    return touched && error ? "error" : touched && !error ? "valid" : "";
  };
  const { login } = useAuth();
  const navigate  = useNavigate();

  return (
    <div className="rp-root">

      {/* LEFT PANEL */}
      <div className="rp-left">
        <div className="rp-blob rp-blob-1" />
        <div className="rp-blob rp-blob-2" />
        <div className="rp-left-content">

          <a href="/" className="rp-logo">RentSpace</a>

          <div className="rp-left-text">
            <p className="rp-left-tag">Join RentSpace</p>
            <h2 className="rp-left-h2">
              Find or List Your Space in Coimbatore.
            </h2>
            <p className="rp-left-sub">
              Create Your Account in Under 2 Minutes. Access 500+ verified
              Properties or Start Listing Yours Today.
            </p>
          </div>

          {/* ROLE PREVIEW CARDS */}
          <div className="rp-role-preview">
            <div className={`rp-role-card ${detailsFormik.values.role === "user" ? "active" : ""}`}>
              <FaHome />
              <div>
                <strong>I'm a Tenant</strong>
                <p>Search & Book Properties</p>
              </div>
            </div>
            <div className={`rp-role-card ${detailsFormik.values.role === "owner" ? "active" : ""}`}>
              <FaUserTie />
              <div>
                <strong>I'm an Owner</strong>
                <p>List & Manage Properties</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="rp-right">
        <div className="rp-card">

          {/* STEP INDICATOR */}
          <div className="rp-steps">
            {["Details", "OTP", "Done"].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`rp-step ${step > i + 1 ? "done" : ""} ${step === i + 1 ? "active" : ""}`}>
                  <div className="rp-step-dot">
                    {step > i + 1 ? <FaCheckCircle /> : i + 1}
                  </div>
                  <span>{s}</span>
                </div>
                {i < 2 && (
                  <div className={`rp-step-line ${step > i + 1 ? "done" : ""}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── STEP 1: DETAILS ── */}
          {step === 1 && (
            <form className="rp-form" onSubmit={detailsFormik.handleSubmit} noValidate>

              <div className="rp-form-header">
                <h2>Create Account</h2>
                <p>Already Have an Account? <a href="/login">Login Here</a></p>
              </div>

              {/* ROLE SELECT */}
              <div className="rp-role-select">
                <p className="rp-role-label">I am a</p>
                <div className="rp-role-btns">
                  {[
                    { val: "user",  icon: <FaHome />,    label: "Tenant" },
                    { val: "owner", icon: <FaUserTie />, label: "Owner"  },
                  ].map(r => (
                    <button
                      type="button"
                      key={r.val}
                      className={`rp-role-btn ${detailsFormik.values.role === r.val ? "active" : ""}`}
                      onClick={() => detailsFormik.setFieldValue("role", r.val)}
                    >
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>
                {detailsFormik.touched.role && detailsFormik.errors.role && (
                  <p className="rp-error">{detailsFormik.errors.role}</p>
                )}
              </div>

              {/* TWO COLUMN — username + email */}
              <div className="rp-row">

                {/* USERNAME */}
                <div className={`rp-field ${fieldState(detailsFormik, "username")}`}>
                  <label>Username</label>
                  <div className="rp-input-wrap">
                    <FaUser className="rp-icon" />
                    <input
                      name="username" type="text"
                      placeholder="Subash"
                      value={detailsFormik.values.username}
                      onChange={detailsFormik.handleChange}
                      onBlur={detailsFormik.handleBlur}
                    />
                    {detailsFormik.touched.username && !detailsFormik.errors.username &&
                      <FaCheckCircle className="rp-valid-icon" />}
                  </div>
                  {detailsFormik.touched.username && detailsFormik.errors.username &&
                    <p className="rp-error">{detailsFormik.errors.username}</p>}
                </div>

                {/* EMAIL */}
                <div className={`rp-field ${fieldState(detailsFormik, "email")}`}>
                  <label>Email Address</label>
                  <div className="rp-input-wrap">
                    <FaEnvelope className="rp-icon" />
                    <input
                      name="email" type="email"
                      placeholder="rt.subash@gmail.com"
                      value={detailsFormik.values.email}
                      onChange={detailsFormik.handleChange}
                      onBlur={detailsFormik.handleBlur}
                    />
                    {detailsFormik.touched.email && !detailsFormik.errors.email &&
                      <FaCheckCircle className="rp-valid-icon" />}
                  </div>
                  {detailsFormik.touched.email && detailsFormik.errors.email &&
                    <p className="rp-error">{detailsFormik.errors.email}</p>}
                </div>

              </div>

              {/* MOBILE */}
              <div className={`rp-field ${fieldState(detailsFormik, "mobile")}`}>
                <label>Mobile Number</label>
                <div className="rp-input-wrap">
                  <span className="rp-prefix">+91</span>
                  <input
                    name="mobile" type="tel"
                    placeholder="Enter Your Mobile Number"
                    maxLength={10}
                    value={detailsFormik.values.mobile}
                    onChange={detailsFormik.handleChange}
                    onBlur={detailsFormik.handleBlur}
                    style={{ paddingLeft: "12px" }}
                  />
                  {detailsFormik.touched.mobile && !detailsFormik.errors.mobile &&
                    <FaCheckCircle className="rp-valid-icon" />}
                </div>
                {detailsFormik.touched.mobile && detailsFormik.errors.mobile &&
                  <p className="rp-error">{detailsFormik.errors.mobile}</p>}
              </div>

              {/* TWO COLUMN — password + confirm */}
              <div className="rp-row">

                {/* PASSWORD */}
                <div className={`rp-field ${fieldState(detailsFormik, "password")}`}>
                  <label>Password</label>
                  <div className="rp-input-wrap">
                    <FaLock className="rp-icon" />
                    <input
                      name="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="Min 6 chars"
                      value={detailsFormik.values.password}
                      onChange={detailsFormik.handleChange}
                      onBlur={detailsFormik.handleBlur}
                    />
                    <button
                      type="button"
                      className="rp-eye"
                      onClick={() => setShowPwd(p => !p)}
                    >
                      {showPwd ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {/* Password Strength Bar */}
                  {detailsFormik.values.password && (
                    <div className="rp-strength">
                      <div className="rp-strength-bar">
                        {[1,2,3,4,5].map(i => (
                          <div
                            key={i}
                            className="rp-strength-seg"
                            style={{
                              background: i <= strength.level
                                ? strength.color
                                : "rgba(255,255,255,0.07)"
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                  {detailsFormik.touched.password && detailsFormik.errors.password &&
                    <p className="rp-error">{detailsFormik.errors.password}</p>}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className={`rp-field ${fieldState(detailsFormik, "confirmPassword")}`}>
                  <label>Confirm Password</label>
                  <div className="rp-input-wrap">
                    <FaLock className="rp-icon" />
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-Enter password"
                      value={detailsFormik.values.confirmPassword}
                      onChange={detailsFormik.handleChange}
                      onBlur={detailsFormik.handleBlur}
                    />
                    <button
                      type="button"
                      className="rp-eye"
                      onClick={() => setShowConfirm(p => !p)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {detailsFormik.touched.confirmPassword && !detailsFormik.errors.confirmPassword &&
                      <FaCheckCircle className="rp-valid-icon" style={{ right: "38px" }} />}
                  </div>
                  {detailsFormik.touched.confirmPassword && detailsFormik.errors.confirmPassword &&
                    <p className="rp-error">{detailsFormik.errors.confirmPassword}</p>}
                </div>

              </div>

              <button type="submit" className="rp-btn">
                Register <FaArrowRight />
              </button>

              <p className="rp-terms">
                By Registering, You Agree to RentSpace's <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
              </p>

            </form>
            )}
        </div>
      </div>
    </div>
  );
}