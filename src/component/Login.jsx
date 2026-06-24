import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../css/login.css";
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaCheckCircle, FaArrowRight, FaHome,
  FaShieldAlt, FaUserTie
} from "react-icons/fa";

import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ─── VALIDATION ─── */
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const [showPwd, setShowPwd]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [role, setRole]         = useState("user"); // user or owner

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
  try {
    const res = await API.post("/auth/login", {
      email:    values.email,
      password: values.password,

    });

    login(res.data.user, res.data.token);
    setSuccess(true);

    setTimeout(() => {
      if (res.data.user.role === "owner") {
        navigate("/ownerdashboard");
      } else {
        navigate("/userdashboard");
      }
    }, 1500);

  } catch (error) {
    alert(error.response?.data?.message || "Login failed!");
  }
},
  });

  const fieldCls = (name) => {
    const t = formik.touched[name];
    const e = formik.errors[name];
    return t && e ? "lp-field error" : t && !e ? "lp-field valid" : "lp-field";
  };
  const { login } = useAuth();
  const navigate  = useNavigate();

  return (
    <div className="lp-root">

      {/* ── LEFT PANEL ── */}
      <div className="lp-left">
        <div className="lp-left-blob lp-blob-1" />
        <div className="lp-left-blob lp-blob-2" />

        <div className="lp-left-content">
          <Link to="/" className="lp-back-logo">RentSpace</Link>

          <div className="lp-left-text">
            <p className="lp-left-tag">Welcome Back</p>
            <h2 className="lp-left-h2">
              Your Next Home is One Login Away.
            </h2>
            <p className="lp-left-sub">
              Access Verified Listings Across Coimbatore — Houses,
              Apartments, PGs, Hostels &amp; Offices.
            </p>
          </div>

          <div className="lp-trust-badges">
            <div className="lp-badge"><FaCheckCircle /> No Brokerage</div>
            <div className="lp-badge"><FaCheckCircle /> Verified Listings</div>
            <div className="lp-badge"><FaCheckCircle /> Instant Booking</div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-card">

          {!success ? (
            <>
              {/* FORM HEADER */}
              <div className="lp-form-header">
                <h2>Login</h2>
                <p>Don't Have an Account? <Link to="/register">Register Here</Link></p>
              </div>

              {/* ROLE SELECT */}
              <div className="lp-role-select">
                <p className="lp-role-label">Login as</p>
                <div className="lp-role-btns">
                  <button
                    type="button"
                    className={`lp-role-btn ${role === "user" ? "active" : ""}`}
                    onClick={() => setRole("user")}
                  >
                    <FaHome /> Tenant
                  </button>
                  <button
                    type="button"
                    className={`lp-role-btn ${role === "owner" ? "active" : ""}`}
                    onClick={() => setRole("owner")}
                  >
                    <FaUserTie /> Owner
                  </button>
                </div>
              </div>

              {/* FORM */}
              <form className="lp-form" onSubmit={formik.handleSubmit} noValidate>

                {/* EMAIL */}
                <div className={fieldCls("email")}>
                  <label htmlFor="email">Email Address</label>
                  <div className="lp-input-wrap">
                    <FaEnvelope className="lp-icon" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="rt.subash@gmail.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && !formik.errors.email && (
                      <FaCheckCircle className="lp-valid-icon" />
                    )}
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="lp-error">{formik.errors.email}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className={fieldCls("password")}>
                  <div className="lp-label-row">
                    <label htmlFor="password">Password</label>
                    <Link to="/forgot-password" className="lp-forgot">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="lp-input-wrap">
                    <FaLock className="lp-icon" />
                    <input
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <button
                      type="button"
                      className="lp-eye"
                      onClick={() => setShowPwd(p => !p)}
                    >
                      {showPwd ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="lp-error">{formik.errors.password}</p>
                  )}
                </div>

                {/* SUBMIT */}
                <button type="submit" className="lp-btn">
                  Login <FaArrowRight />
                </button>

                <p className="lp-terms">
                  By Logging in, You Agree to RentSpace's{" "}
                  <Link to="#">Terms</Link> &amp; <Link to="#">Privacy Policy</Link>.
                </p>

              </form>
            </>
          ) : (
            /* ── SUCCESS ── */
            <div className="lp-success">
              <div className="lp-success-icon">
                <FaCheckCircle />
              </div>
              <h2>Welcome Back! 🎉</h2>
              <p>
                You are logged in as a{" "}
                <strong>{role === "owner" ? "Property Owner" : "Tenant"}</strong>.
              </p>
              <Link
                to={role === "owner" ? "/owner-dashboard" : "/user-dashboard"}
                className="lp-btn lp-btn-link"
              >
                Go to Dashboard <FaArrowRight />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}