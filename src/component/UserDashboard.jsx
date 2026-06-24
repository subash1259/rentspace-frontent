import React, { useState, useEffect } from "react";
import "../css/userDashboard.css";
import {
  FaUser, FaHeart, FaCalendarAlt, FaCog,
  FaMapMarkerAlt, FaBed, FaBath, FaSignOutAlt,
  FaCheckCircle, FaClock, FaTimesCircle, FaEdit,
  FaCamera, FaEnvelope, FaMobileAlt,
  FaArrowRight, FaTrash, FaBell, FaShieldAlt,
  FaHome, FaChevronRight
} from "react-icons/fa";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ─── STATUS CONFIG ─── */
const STATUS_CONFIG = {
  confirmed: { icon:<FaCheckCircle />, label:"Confirmed", cls:"confirmed" },
  pending:   { icon:<FaClock />,       label:"Pending",   cls:"pending"   },
  cancelled: { icon:<FaTimesCircle />, label:"Cancelled", cls:"cancelled" },
  rejected:  { icon:<FaTimesCircle />, label:"Rejected",  cls:"cancelled" },
};

const TABS = [
  { key:"overview",  label:"Overview",  icon:<FaHome /> },
  { key:"saved",     label:"Saved",     icon:<FaHeart /> },
  { key:"bookings",  label:"Bookings",  icon:<FaCalendarAlt /> },
  { key:"settings",  label:"Settings",  icon:<FaCog /> },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [activeTab,     setActiveTab]     = useState("overview");
  const [editMode,      setEditMode]      = useState(false);
  const [bookings,      setBookings]      = useState([]);
  const [savedProps,    setSavedProps]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [notifications, setNotifications] = useState({
    email: true, sms: true, bookingUpdates: true, newListings: false,
  });
  const [profile, setProfile] = useState({
    name: "", email: "", mobile: "",
  });

  /* ── logout ── */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ── profile save ── */
  const handleProfileSave = async () => {
    try {
      await API.put("/auth/profile", {
        username: profile.name,
        email:    profile.email,
        mobile:   profile.mobile,
      });
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile!");
    }
  };

  /* ── remove from wishlist ── */
  const removeFromSaved = async (id) => {
    try {
      await API.delete(`/wishlist/${id}`);
      setSavedProps(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to remove!");
    }
  };

  /* ── cancel booking ── */
  const handleCancel = async (id) => {
    try {
      await API.put(`/bookings/cancel/${id}`);
      setBookings(prev => prev.map(b =>
        b._id === id ? { ...b, status: "cancelled" } : b
      ));
    } catch (err) {
      alert("Failed to cancel booking!");
    }
  };

  /* ── fetch data ── */
  useEffect(() => {
    if (user) {
      setProfile({
        name:   user.username || "",
        email:  user.email    || "",
        mobile: user.mobile   || "",
      });
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingRes, wishlistRes] = await Promise.all([
        API.get("/bookings/user"),
        API.get("/wishlist"),
      ]);
      setBookings(bookingRes.data.bookings   || []);
      setSavedProps(wishlistRes.data.wishlist || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ud-root">

      {/* ── NAVBAR ── */}
      <nav className="ud-nav">
        <a href="/" className="ud-logo">RentSpace</a>
        <div className="ud-nav-links">
          <a href="/">Home</a>
          <a href="/listings">Rentals</a>
          <button className="ud-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="ud-body">

        {/* ── SIDEBAR ── */}
        <aside className="ud-sidebar">
          <div className="ud-profile-summary">
            <div className="ud-avatar-wrap">
              <img
                src={user?.avatar || ""}
                alt={user?.username}
              />
              <button className="ud-avatar-edit"><FaCamera /></button>
            </div>
            <h3>{user?.username}</h3>
            <p className="ud-role">{user?.role}</p>
            <div className="ud-verified"><FaCheckCircle /> Verified Account</div>
            <p className="ud-joined">Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
          </div>

          <div className="ud-sidebar-stats">
            <div className="ud-sidebar-stat">
              <strong>{savedProps.length}</strong>
              <span>Saved</span>
            </div>
            <div className="ud-sidebar-stat">
              <strong>{bookings.length}</strong>
              <span>Bookings</span>
            </div>
            <div className="ud-sidebar-stat">
              <strong>{bookings.filter(b => b.status === "confirmed").length}</strong>
              <span>Confirmed</span>
            </div>
          </div>

          <nav className="ud-sidebar-nav">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`ud-nav-item ${activeTab === t.key ? "active" : ""}`}
                onClick={() => setActiveTab(t.key)}
              >
                <span className="ud-nav-icon">{t.icon}</span>
                {t.label}
                <FaChevronRight className="ud-nav-arrow" />
              </button>
            ))}
          </nav>

          <button className="ud-sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </aside>

        {/* ── MAIN ── */}
        <main className="ud-main">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="ud-tab-content">
              <div className="ud-tab-header">
                <h2>Welcome back, <em>{user?.username?.split(" ")[0]}</em> 👋</h2>
                <p>Here's a summary of your activity</p>
              </div>

              <div className="ud-stat-cards">
                {[
                  { icon:<FaHeart />,       label:"Saved Properties", val:savedProps.length,                                   color:"accent"  },
                  { icon:<FaCalendarAlt />, label:"Total Bookings",   val:bookings.length,                                    color:"accent2" },
                  { icon:<FaCheckCircle />, label:"Confirmed",        val:bookings.filter(b=>b.status==="confirmed").length,   color:"green"   },
                  { icon:<FaClock />,       label:"Pending",          val:bookings.filter(b=>b.status==="pending").length,     color:"yellow"  },
                ].map(s => (
                  <div key={s.label} className={`ud-stat-card ud-stat-${s.color}`}>
                    <div className="ud-stat-icon">{s.icon}</div>
                    <div>
                      <strong>{s.val}</strong>
                      <span>{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* RECENT BOOKINGS */}
              <div className="ud-section">
                <div className="ud-section-header">
                  <h3>Recent Bookings</h3>
                  <button className="ud-see-all" onClick={() => setActiveTab("bookings")}>
                    See All <FaArrowRight />
                  </button>
                </div>
                <div className="ud-recent-list">
                  {bookings.slice(0,2).map(b => {
                    const st = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={b._id} className="ud-recent-item">
                        <img
                          src={b.property?.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&q=80"}
                          alt={b.property?.title}
                        />
                        <div className="ud-recent-info">
                          <h4>{b.property?.title || "Property"}</h4>
                          <p><FaMapMarkerAlt /> {b.property?.location || ""}</p>
                        </div>
                        <div className={`ud-status-badge ${st.cls}`}>
                          {st.icon} {st.label}
                        </div>
                        <p className="ud-recent-price">
                          ₹{b.property?.price?.toLocaleString()}/mo
                        </p>
                      </div>
                    );
                  })}
                  {bookings.length === 0 && (
                    <p style={{ color:"var(--muted)", fontSize:".85rem" }}>No bookings yet!</p>
                  )}
                </div>
              </div>

              {/* SAVED QUICK VIEW */}
              <div className="ud-section">
                <div className="ud-section-header">
                  <h3>Saved Properties</h3>
                  <button className="ud-see-all" onClick={() => setActiveTab("saved")}>
                    See All <FaArrowRight />
                  </button>
                </div>
                <div className="ud-saved-mini-grid">
                  {savedProps.slice(0,3).map(p => (
                    <div key={p._id} className="ud-saved-mini-card">
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&q=80"}
                        alt={p.title}
                      />
                      <div className="ud-saved-mini-info">
                        <h4>{p.title}</h4>
                        <p><FaMapMarkerAlt /> {p.location}</p>
                        <span>₹{p.price?.toLocaleString()}/mo</span>
                      </div>
                    </div>
                  ))}
                  {savedProps.length === 0 && (
                    <p style={{ color:"var(--muted)", fontSize:".85rem" }}>No saved properties!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SAVED */}
          {activeTab === "saved" && (
            <div className="ud-tab-content">
              <div className="ud-tab-header">
                <h2>Saved Properties</h2>
                <p>{savedProps.length} properties saved</p>
              </div>

              {savedProps.length === 0 ? (
                <div className="ud-empty">
                  <FaHeart />
                  <h3>No saved properties</h3>
                  <p>Go to listings and save properties you like!</p>
                  <a href="/listings" className="ud-empty-btn">Browse Listings <FaArrowRight /></a>
                </div>
              ) : (
                <div className="ud-saved-grid">
                  {savedProps.map(p => (
                    <div key={p._id} className="ud-saved-card">
                      <div className="ud-saved-img-wrap">
                        <img
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"}
                          alt={p.title}
                        />
                        <span className="ud-saved-type">{p.type}</span>
                        <button
                          className="ud-remove-saved"
                          onClick={() => removeFromSaved(p._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="ud-saved-info">
                        <h4>{p.title}</h4>
                        <p className="ud-saved-loc"><FaMapMarkerAlt /> {p.location}, Coimbatore</p>
                        <div className="ud-saved-meta">
                          {p.beds && <span><FaBed /> {p.beds} Beds</span>}
                          <span><FaBath /> {p.baths} Baths</span>
                        </div>
                        <div className="ud-saved-footer">
                          <span className="ud-saved-price">
                            ₹{p.price?.toLocaleString()}<small>/mo</small>
                          </span>
                          <a href={`/property/${p._id}`} className="ud-view-btn">
                            View <FaArrowRight />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="ud-tab-content">
              <div className="ud-tab-header">
                <h2>My Bookings</h2>
                <p>{bookings.length} total bookings</p>
              </div>

              {bookings.length === 0 ? (
                <div className="ud-empty">
                  <FaCalendarAlt />
                  <h3>No bookings yet</h3>
                  <p>Book a property to see it here!</p>
                  <a href="/listings" className="ud-empty-btn">Browse Listings <FaArrowRight /></a>
                </div>
              ) : (
                <div className="ud-bookings-list">
                  {bookings.map(b => {
                    const st = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={b._id} className={`ud-booking-card ud-booking-${b.status}`}>
                        <img
                          src={b.property?.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"}
                          alt={b.property?.title}
                          className="ud-booking-img"
                        />
                        <div className="ud-booking-info">
                          <div className="ud-booking-top">
                            <div>
                              <h4>{b.property?.title || "Property"}</h4>
                              <p><FaMapMarkerAlt /> {b.property?.location}, Coimbatore</p>
                            </div>
                            <div className={`ud-status-badge ${st.cls}`}>
                              {st.icon} {st.label}
                            </div>
                          </div>
                          <div className="ud-booking-meta">
                            <div className="ud-booking-meta-item">
                              <span>Booking ID</span>
                              <strong>{b.bookingId}</strong>
                            </div>
                            <div className="ud-booking-meta-item">
                              <span>Booked On</span>
                              <strong>{new Date(b.createdAt).toLocaleDateString()}</strong>
                            </div>
                            <div className="ud-booking-meta-item">
                              <span>Visit Date</span>
                              <strong>{new Date(b.visitDate).toLocaleDateString()}</strong>
                            </div>
                            <div className="ud-booking-meta-item">
                              <span>Owner</span>
                              <strong>{b.owner?.username || "Owner"}</strong>
                            </div>
                            <div className="ud-booking-meta-item">
                              <span>Monthly Rent</span>
                              <strong className="ud-booking-price">
                                ₹{b.property?.price?.toLocaleString()}
                              </strong>
                            </div>
                            <div className="ud-booking-meta-item">
                              <span>Type</span>
                              <strong>{b.property?.type}</strong>
                            </div>
                          </div>
                          <div className="ud-booking-actions">
                            <a href={`/property/${b.property?._id}`} className="ud-bk-view-btn">
                              View Property <FaArrowRight />
                            </a>
                            {b.status === "pending" && (
                              <button
                                className="ud-bk-cancel-btn"
                                onClick={() => handleCancel(b._id)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="ud-tab-content">
              <div className="ud-tab-header">
                <h2>Account Settings</h2>
                <p>Manage your profile and preferences</p>
              </div>

              <div className="ud-settings-section">
                <div className="ud-settings-section-header">
                  <div>
                    <h3><FaUser /> Personal Information</h3>
                    <p>Update your profile details</p>
                  </div>
                  <button
                    className="ud-edit-btn"
                    onClick={() => editMode ? handleProfileSave() : setEditMode(true)}
                  >
                    {editMode ? <><FaCheckCircle /> Save</> : <><FaEdit /> Edit</>}
                  </button>
                </div>

                <div className="ud-profile-form">
                  <div className="ud-form-row">
                    <div className="ud-form-field">
                      <label><FaUser /> Username</label>
                      <input
                        type="text"
                        value={profile.name}
                        disabled={!editMode}
                        onChange={e => setProfile(p => ({...p, name: e.target.value}))}
                      />
                    </div>
                    <div className="ud-form-field">
                      <label><FaEnvelope /> Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled={!editMode}
                        onChange={e => setProfile(p => ({...p, email: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className="ud-form-row">
                    <div className="ud-form-field">
                      <label><FaMobileAlt /> Mobile Number</label>
                      <input
                        type="text"
                        value={profile.mobile}
                        disabled={!editMode}
                        onChange={e => setProfile(p => ({...p, mobile: e.target.value}))}
                      />
                    </div>
                    <div className="ud-form-field">
                      <label><FaShieldAlt /> Account Type</label>
                      <input type="text" value={user?.role || ""} disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className="ud-settings-section">
                <div className="ud-settings-section-header">
                  <div>
                    <h3><FaBell /> Notification Preferences</h3>
                    <p>Choose what notifications you receive</p>
                  </div>
                </div>
                <div className="ud-notif-list">
                  {[
                    { key:"email",          label:"Email Notifications",   desc:"Receive updates via email" },
                    { key:"sms",            label:"SMS Notifications",     desc:"Receive updates via SMS" },
                    { key:"bookingUpdates", label:"Booking Status Updates",desc:"Get notified on booking changes" },
                    { key:"newListings",    label:"New Listings Alert",    desc:"Get notified for new properties" },
                  ].map(n => (
                    <div key={n.key} className="ud-notif-item">
                      <div>
                        <strong>{n.label}</strong>
                        <p>{n.desc}</p>
                      </div>
                      <label className="ud-toggle">
                        <input
                          type="checkbox"
                          checked={notifications[n.key]}
                          onChange={e => setNotifications(prev => ({...prev, [n.key]: e.target.checked}))}
                        />
                        <span className="ud-toggle-track">
                          <span className="ud-toggle-thumb" />
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ud-settings-section ud-danger-zone">
                <h3>Danger Zone</h3>
                <div className="ud-danger-actions">
                  <div>
                    <strong>Delete Account</strong>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className="ud-delete-btn">Delete Account</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}