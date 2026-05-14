import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../css/booking.css";
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined,
  FaCalendarAlt, FaUser, FaEnvelope, FaMobileAlt,
  FaCheckCircle, FaArrowRight, FaShieldAlt,
  FaReceipt, FaClock, FaStar, FaChevronLeft
} from "react-icons/fa";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

/* ─── DURATION OPTIONS ─── */
const DURATION_OPTIONS = [1, 2, 3, 6, 11, 12, 24];

/* ─── VALIDATION ─── */
const bookingSchema = Yup.object({
  name: Yup.string()
    .min(3, "Minimum 3 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Enter valid email")
    .required("Email is required"),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile")
    .required("Mobile is required"),
  visitDate: Yup.string()
    .required("Visit date is required"),
  moveInDate: Yup.string()
    .required("Move-in date is required"),
  duration: Yup.number()
    .min(1, "Select duration")
    .required("Duration is required"),
  specialRequests: Yup.string(),
  terms: Yup.boolean()
    .oneOf([true], "Please accept terms & conditions"),
});

export default function Booking() {
  const { id }       = useParams();
  const location     = useLocation();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [property,   setProperty]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [step,       setStep]       = useState(1);
  const [bookingId,  setBookingId]  = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Get property id from URL params or query string
  const propertyId = id || new URLSearchParams(location.search).get("propertyId");

  /* ── fetch property ── */
  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
    // Pre-fill user details
    if (user) {
      formik.setValues(prev => ({
        ...prev,
        name:   user.username || "",
        email:  user.email    || "",
        mobile: user.mobile   || "",
      }));
    }
  }, [propertyId, user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/properties/${propertyId}`);
      setProperty(res.data.property);
    } catch (err) {
      console.error("Property fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── formik ── */
  const formik = useFormik({
    initialValues: {
      name:            user?.username || "",
      email:           user?.email    || "",
      mobile:          user?.mobile   || "",
      visitDate:       "",
      moveInDate:      "",
      duration:        6,
      specialRequests: "",
      terms:           false,
    },
    validationSchema: bookingSchema,
    onSubmit: () => setStep(2),
  });

  /* ── confirm booking ── */
  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      const res = await API.post("/bookings", {
        propertyId:      propertyId,
        name:            formik.values.name,
        email:           formik.values.email,
        mobile:          formik.values.mobile,
        visitDate:       formik.values.visitDate,
        moveInDate:      formik.values.moveInDate,
        duration:        formik.values.duration,
        specialRequests: formik.values.specialRequests,
      });
      setBookingId(res.data.booking.bookingId);
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed! Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const months       = Number(formik.values.duration) || 1;
  const monthlyRent  = property?.price || 0;
  const deposit      = property?.deposit || 0;
  const totalRent    = monthlyRent * months;
  const firstPayment = monthlyRent + deposit;

  const fieldCls = (name) => {
    const t = formik.touched[name];
    const e = formik.errors[name];
    return t && e ? "bk-field error" : t && !e ? "bk-field valid" : "bk-field";
  };

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"var(--black)", color:"var(--muted)" }}>
        Loading property details...
      </div>
    );
  }

  if (!property && !loading) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:"var(--black)", color:"var(--white)", gap:"16px" }}>
        <h2>Property not found</h2>
        <a href="/listings" style={{ color:"var(--accent)" }}>Back to Listings</a>
      </div>
    );
  }

  return (
    <div className="bk-root">

      {/* ── TOP BAR ── */}
      <div className="bk-topbar">
        <a href="/listings" className="bk-back">
          <FaChevronLeft /> Back to Listings
        </a>
        <div className="bk-topbar-title">
          <FaCalendarAlt /> Book Property
        </div>
        {/* STEP INDICATOR */}
        <div className="bk-steps">
          {["Details","Summary","Done"].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`bk-step ${step > i ? "done" : ""} ${step === i+1 ? "active" : ""}`}>
                <div className="bk-step-dot">
                  {step > i+1 ? <FaCheckCircle /> : i+1}
                </div>
                <span>{s}</span>
              </div>
              {i < 2 && <div className={`bk-step-line ${step > i+1 ? "done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bk-body">

        {/* ── LEFT: PROPERTY INFO + MAP ── */}
        <div className="bk-left">

          {/* PROPERTY CARD */}
          <div className="bk-prop-card">
            <div className="bk-prop-img-wrap">
              <img
                src={property?.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"}
                alt={property?.title}
              />
              <span className="bk-prop-type">{property?.type}</span>
            </div>
            <div className="bk-prop-info">
              <h2>{property?.title}</h2>
              <p className="bk-prop-loc">
                <FaMapMarkerAlt /> {property?.fullAddress || property?.location + ", Coimbatore"}
              </p>
              <div className="bk-prop-meta">
                {property?.beds && <span><FaBed /> {property.beds} Beds</span>}
                <span><FaBath /> {property?.baths} Baths</span>
                <span><FaRulerCombined /> {property?.area} sqft</span>
                {property?.availableFrom && (
                  <span><FaCalendarAlt /> From {new Date(property.availableFrom).toLocaleDateString()}</span>
                )}
              </div>

              {/* OWNER */}
              <div className="bk-owner-row">
                <img
                  src={property?.owner?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"}
                  alt={property?.owner?.username}
                />
                <div>
                  <p className="bk-owner-name">{property?.owner?.username}</p>
                  <p className="bk-owner-verified"><FaCheckCircle /> Verified Owner</p>
                </div>
                <div className="bk-rating">
                  <FaStar /> 4.5
                </div>
              </div>
            </div>
          </div>

          {/* PRICE SUMMARY */}
          <div className="bk-price-card">
            <h3><FaReceipt /> Payment Summary</h3>
            <div className="bk-price-rows">
              <div className="bk-price-row">
                <span>Monthly Rent</span>
                <strong>₹{monthlyRent.toLocaleString()}/mo</strong>
              </div>
              <div className="bk-price-row">
                <span>Duration</span>
                <strong>{months} Month{months > 1 ? "s" : ""}</strong>
              </div>
              <div className="bk-price-row">
                <span>Total Rent ({months} mo)</span>
                <strong>₹{totalRent.toLocaleString()}</strong>
              </div>
              <div className="bk-price-row">
                <span>Security Deposit</span>
                <strong>₹{deposit.toLocaleString()}</strong>
              </div>
              <div className="bk-price-divider" />
              <div className="bk-price-row bk-price-total">
                <span>First Payment</span>
                <strong className="bk-total-amt">₹{firstPayment.toLocaleString()}</strong>
              </div>
              <p className="bk-price-note">
                * First month rent + Security deposit payable at move-in
              </p>
            </div>
          </div>

          {/* MAP */}
          <div className="bk-map-section">
            <h3><FaMapMarkerAlt /> Property Location</h3>
            <p className="bk-map-addr">
              {property?.fullAddress || property?.location + ", Coimbatore"}
            </p>
            <div className="bk-map-wrap">
              <iframe
                title="Property Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent((property?.location || "Coimbatore") + ", Coimbatore")}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border:0, borderRadius:"14px" }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>

        </div>

        {/* ── RIGHT: FORM / SUMMARY / SUCCESS ── */}
        <div className="bk-right">

          {/* ══ STEP 1: FORM ══ */}
          {step === 1 && (
            <form className="bk-form" onSubmit={formik.handleSubmit} noValidate>

              <div className="bk-form-header">
                <h2>Booking Details</h2>
                <p>Fill in your details to book this property</p>
              </div>

              <div className="bk-section-title">Personal Information</div>

              {/* NAME */}
              <div className={fieldCls("name")}>
                <label><FaUser /> Full Name</label>
                <div className="bk-input-wrap">
                  <input
                    name="name" type="text"
                    placeholder="Aravind Kumar"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && !formik.errors.name &&
                    <FaCheckCircle className="bk-valid-icon" />}
                </div>
                {formik.touched.name && formik.errors.name &&
                  <p className="bk-error">{formik.errors.name}</p>}
              </div>

              {/* EMAIL + MOBILE */}
              <div className="bk-row">
                <div className={fieldCls("email")}>
                  <label><FaEnvelope /> Email</label>
                  <div className="bk-input-wrap">
                    <input
                      name="email" type="email"
                      placeholder="you@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && !formik.errors.email &&
                      <FaCheckCircle className="bk-valid-icon" />}
                  </div>
                  {formik.touched.email && formik.errors.email &&
                    <p className="bk-error">{formik.errors.email}</p>}
                </div>

                <div className={fieldCls("mobile")}>
                  <label><FaMobileAlt /> Mobile</label>
                  <div className="bk-input-wrap">
                    <span className="bk-prefix">+91</span>
                    <input
                      name="mobile" type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{ paddingLeft:"10px" }}
                    />
                    {formik.touched.mobile && !formik.errors.mobile &&
                      <FaCheckCircle className="bk-valid-icon" />}
                  </div>
                  {formik.touched.mobile && formik.errors.mobile &&
                    <p className="bk-error">{formik.errors.mobile}</p>}
                </div>
              </div>

              {/* DATES */}
              <div className="bk-section-title">Schedule</div>
              <div className="bk-row">
                <div className={fieldCls("visitDate")}>
                  <label><FaCalendarAlt /> Visit Date</label>
                  <div className="bk-input-wrap">
                    <input
                      name="visitDate" type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={formik.values.visitDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.visitDate && formik.errors.visitDate &&
                    <p className="bk-error">{formik.errors.visitDate}</p>}
                </div>

                <div className={fieldCls("moveInDate")}>
                  <label><FaCalendarAlt /> Move-in Date</label>
                  <div className="bk-input-wrap">
                    <input
                      name="moveInDate" type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={formik.values.moveInDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.moveInDate && formik.errors.moveInDate &&
                    <p className="bk-error">{formik.errors.moveInDate}</p>}
                </div>
              </div>

              {/* DURATION */}
              <div className="bk-section-title">Rental Duration</div>
              <div className="bk-duration-grid">
                {DURATION_OPTIONS.map(d => (
                  <button
                    key={d} type="button"
                    className={`bk-duration-btn ${formik.values.duration === d ? "active" : ""}`}
                    onClick={() => formik.setFieldValue("duration", d)}
                  >
                    {d} {d === 1 ? "Month" : "Months"}
                    {d === 11 && <span className="bk-popular">Popular</span>}
                    {d === 12 && <span className="bk-popular">1 Year</span>}
                  </button>
                ))}
              </div>

              {/* LIVE TOTAL */}
              <div className="bk-live-total">
                <div className="bk-lt-row">
                  <span>Monthly Rent</span>
                  <strong>₹{monthlyRent.toLocaleString()}</strong>
                </div>
                <div className="bk-lt-row">
                  <span>× {months} months</span>
                  <strong>₹{totalRent.toLocaleString()}</strong>
                </div>
                <div className="bk-lt-row">
                  <span>Security Deposit</span>
                  <strong>₹{deposit.toLocaleString()}</strong>
                </div>
                <div className="bk-lt-divider" />
                <div className="bk-lt-row bk-lt-total">
                  <span>First Payment Due</span>
                  <strong>₹{firstPayment.toLocaleString()}</strong>
                </div>
              </div>

              {/* SPECIAL REQUESTS */}
              <div className="bk-section-title">Special Requests (Optional)</div>
              <div className="bk-field">
                <div className="bk-input-wrap">
                  <textarea
                    name="specialRequests"
                    rows={3}
                    placeholder="Any special requirements..."
                    value={formik.values.specialRequests}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              {/* TERMS */}
              <label className="bk-terms-label">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formik.values.terms}
                  onChange={formik.handleChange}
                />
                <span className="bk-checkbox" />
                <span>
                  I agree to the <a href="#">Terms & Conditions</a> and{" "}
                  <a href="#">Rental Agreement</a> of RentSpace.
                </span>
              </label>
              {formik.touched.terms && formik.errors.terms &&
                <p className="bk-error">{formik.errors.terms}</p>}

              <button type="submit" className="bk-submit-btn">
                Review Booking <FaArrowRight />
              </button>

              <div className="bk-safety">
                <FaShieldAlt /> Your details are safe & secure with RentSpace
              </div>

            </form>
          )}

          {/* ══ STEP 2: SUMMARY ══ */}
          {step === 2 && (
            <div className="bk-summary">
              <div className="bk-form-header">
                <h2>Booking Summary</h2>
                <p>Please review before confirming</p>
              </div>

              <div className="bk-summary-card">
                <div className="bk-summary-section">
                  <p className="bk-summary-label">Property</p>
                  <h4>{property?.title}</h4>
                  <p className="bk-summary-sub">
                    <FaMapMarkerAlt /> {property?.location}, Coimbatore
                  </p>
                </div>

                <div className="bk-summary-divider" />

                <div className="bk-summary-grid">
                  {[
                    ["Tenant Name",   formik.values.name],
                    ["Email",         formik.values.email],
                    ["Mobile",        "+91 " + formik.values.mobile],
                    ["Visit Date",    formik.values.visitDate],
                    ["Move-in Date",  formik.values.moveInDate],
                    ["Duration",      `${formik.values.duration} Months`],
                  ].map(([k,v]) => (
                    <div key={k} className="bk-summary-item">
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>

                <div className="bk-summary-divider" />

                <div className="bk-summary-payment">
                  <div className="bk-sp-row">
                    <span>Monthly Rent</span>
                    <strong>₹{monthlyRent.toLocaleString()}/mo</strong>
                  </div>
                  <div className="bk-sp-row">
                    <span>Total Rent ({months} mo)</span>
                    <strong>₹{totalRent.toLocaleString()}</strong>
                  </div>
                  <div className="bk-sp-row">
                    <span>Security Deposit</span>
                    <strong>₹{deposit.toLocaleString()}</strong>
                  </div>
                  <div className="bk-sp-divider" />
                  <div className="bk-sp-row bk-sp-total">
                    <span>First Payment Due</span>
                    <strong>₹{firstPayment.toLocaleString()}</strong>
                  </div>
                </div>

                {formik.values.specialRequests && (
                  <>
                    <div className="bk-summary-divider" />
                    <div className="bk-summary-section">
                      <p className="bk-summary-label">Special Requests</p>
                      <p className="bk-summary-sub">{formik.values.specialRequests}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="bk-summary-actions">
                <button className="bk-back-btn" onClick={() => setStep(1)}>
                  <FaArrowRight style={{ transform:"rotate(180deg)" }} /> Edit Details
                </button>
                <button
                  className="bk-confirm-btn"
                  onClick={handleConfirm}
                  disabled={submitting}
                >
                  <FaCheckCircle />
                  {submitting ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>

              <div className="bk-safety">
                <FaShieldAlt /> Booking confirmed within 2 hours by owner
              </div>
            </div>
          )}

          {/* ══ STEP 3: SUCCESS ══ */}
          {step === 3 && (
            <div className="bk-success">
              <div className="bk-success-icon">
                <FaCheckCircle />
              </div>
              <h2>Booking Confirmed! 🎉</h2>
              <p>Your booking request has been sent to the owner.</p>

              <div className="bk-success-id">
                <span>Booking ID</span>
                <strong>{bookingId}</strong>
              </div>

              <div className="bk-success-details">
                <div className="bk-sd-row">
                  <FaUser /> {formik.values.name}
                </div>
                <div className="bk-sd-row">
                  <FaCalendarAlt /> Visit: {formik.values.visitDate}
                </div>
                <div className="bk-sd-row">
                  <FaClock /> Move-in: {formik.values.moveInDate}
                </div>
                <div className="bk-sd-row">
                  <FaReceipt /> First Payment: ₹{firstPayment.toLocaleString()}
                </div>
              </div>

              <div className="bk-success-note">
                <FaShieldAlt />
                Owner will confirm within 2 hours. Check your email & SMS for updates.
              </div>

              <div className="bk-success-actions">
                <a href="/userdashboard" className="bk-dashboard-btn">
                  View My Bookings <FaArrowRight />
                </a>
                <a href="/listings" className="bk-browse-btn">
                  Browse More
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}