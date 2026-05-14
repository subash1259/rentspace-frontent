import React, { useState, useEffect } from "react";
import "../css/Ownerdashboard.css";
import {
  FaHome, FaPlus, FaEdit, FaTrash, FaBell,
  FaCommentDots, FaCalendarAlt, FaCheckCircle,
  FaTimesCircle, FaClock, FaMapMarkerAlt,
  FaBed, FaBath, FaRulerCombined, FaCamera,
  FaSignOutAlt, FaChevronRight, FaEye,
  FaChartBar, FaArrowRight, FaTimes,
  FaCloudUploadAlt, FaUserTie, FaPaperPlane
} from "react-icons/fa";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ─── STATUS CONFIG ─── */
const STATUS_CFG = {
  pending:   { icon:<FaClock />,       label:"Pending",   cls:"pending"   },
  confirmed: { icon:<FaCheckCircle />, label:"Confirmed", cls:"confirmed" },
  rejected:  { icon:<FaTimesCircle />, label:"Rejected",  cls:"rejected"  },
};

const TABS = [
  { key:"overview",  label:"Overview",     icon:<FaChartBar />   },
  { key:"listings",  label:"Listings",     icon:<FaHome />       },
  { key:"add",       label:"Add Property", icon:<FaPlus />       },
  { key:"bookings",  label:"Requests",     icon:<FaCalendarAlt />},
  { key:"messages",  label:"Messages",     icon:<FaCommentDots />},
];

const EMPTY_FORM = {
  title:"", type:"Apartment", location:"", price:"",
  deposit:"", beds:"", baths:"", area:"",
  floor:"", furnished:"Semi-Furnished", facing:"East",
  parking:"Open", availableFrom:"", description:"",
};

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [activeTab,      setActiveTab]      = useState("overview");
  const [listings,       setListings]       = useState([]);
  const [requests,       setRequests]       = useState([]);
  const [messages,       setMessages]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [form,           setForm]           = useState(EMPTY_FORM);
  const [editId,         setEditId]         = useState(null);
  const [deleteConfirm,  setDeleteConfirm]  = useState(null);
  const [formSuccess,    setFormSuccess]    = useState(false);
  const [activeMsg,      setActiveMsg]      = useState(null);
  const [replyText,      setReplyText]      = useState("");

  /* ── logout ── */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ── fetch all data ── */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propRes, bookRes, msgRes] = await Promise.all([
        API.get("/properties/owner/me"),
        API.get("/bookings/owner"),
        API.get("/messages/inbox"),
      ]);
      setListings(propRes.data.properties  || []);
      setRequests(bookRes.data.bookings    || []);
      setMessages(msgRes.data.messages     || []);
    } catch (err) {
      console.error("Owner dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── form change ── */
  const handleForm = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  /* ── submit add/edit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price:   Number(form.price),
        deposit: Number(form.deposit),
        beds:    form.beds ? Number(form.beds) : null,
        baths:   Number(form.baths),
        area:    Number(form.area),
      };

      if (editId) {
        const res = await API.put(`/properties/${editId}`, payload);
        setListings(prev => prev.map(l => l._id === editId ? res.data.property : l));
        setEditId(null);
      } else {
        const res = await API.post("/properties", payload);
        setListings(prev => [...prev, res.data.property]);
      }

      setForm(EMPTY_FORM);
      setFormSuccess(true);
      setTimeout(() => { setFormSuccess(false); setActiveTab("listings"); }, 1800);

    } catch (err) {
      alert(err.response?.data?.message || "Failed to save property!");
    }
  };

  /* ── edit click ── */
  const handleEdit = (listing) => {
    setForm({
      title:         listing.title,
      type:          listing.type,
      location:      listing.location,
      price:         listing.price,
      deposit:       listing.deposit || "",
      beds:          listing.beds || "",
      baths:         listing.baths,
      area:          listing.area,
      floor:         listing.floor || "",
      furnished:     listing.furnished || "Semi-Furnished",
      facing:        listing.facing || "East",
      parking:       listing.parking || "Open",
      availableFrom: listing.availableFrom ? listing.availableFrom.split("T")[0] : "",
      description:   listing.description || "",
    });
    setEditId(listing._id);
    setActiveTab("add");
  };

  /* ── delete ── */
  const handleDelete = async (id) => {
    try {
      await API.delete(`/properties/${id}`);
      setListings(prev => prev.filter(l => l._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete property!");
    }
  };

  /* ── toggle status ── */
  const toggleStatus = async (listing) => {
    try {
      const newStatus = listing.status === "active" ? "inactive" : "active";
      const res = await API.put(`/properties/${listing._id}`, { status: newStatus });
      setListings(prev => prev.map(l => l._id === listing._id ? res.data.property : l));
    } catch (err) {
      alert("Failed to update status!");
    }
  };

  /* ── booking action ── */
  const handleRequest = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      alert("Failed to update booking!");
    }
  };

  /* ── send reply ── */
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    // TODO: real reply API connect pannuvom
    setReplyText("");
  };

  /* ── stats ── */
  const totalViews    = listings.reduce((s, l) => s + (l.views || 0), 0);
  const activeCount   = listings.filter(l => l.status === "active").length;
  const pendingCount  = requests.filter(r => r.status === "pending").length;
  const unreadCount   = messages.filter(m => !m.isRead).length;

  return (
    <div className="od-root">

      {/* ── NAVBAR ── */}
      <nav className="od-nav">
        <a href="/" className="od-logo">RentSpace</a>
        <div className="od-nav-right">
          <span className="od-owner-badge"><FaUserTie /> Owner</span>
          <button className="od-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="od-body">

        {/* ── SIDEBAR ── */}
        <aside className="od-sidebar">
          <div className="od-profile-summary">
            <div className="od-avatar-wrap">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"}
                alt={user?.username}
              />
              <button className="od-avatar-edit"><FaCamera /></button>
            </div>
            <h3>{user?.username}</h3>
            <p className="od-role">Property Owner</p>
            <div className="od-verified"><FaCheckCircle /> Verified Owner</div>
          </div>

          <div className="od-sidebar-stats">
            <div className="od-ss"><strong>{listings.length}</strong><span>Listings</span></div>
            <div className="od-ss"><strong>{totalViews}</strong><span>Views</span></div>
            <div className="od-ss"><strong>{pendingCount}</strong><span>Pending</span></div>
          </div>

          <nav className="od-sidebar-nav">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`od-nav-item ${activeTab === t.key ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(t.key);
                  if (t.key !== "add") { setEditId(null); setForm(EMPTY_FORM); }
                }}
              >
                <span className="od-nav-icon">{t.icon}</span>
                {t.label}
                {t.key === "bookings" && pendingCount > 0 && (
                  <span className="od-badge-dot">{pendingCount}</span>
                )}
                {t.key === "messages" && unreadCount > 0 && (
                  <span className="od-badge-dot">{unreadCount}</span>
                )}
                <FaChevronRight className="od-nav-arrow" />
              </button>
            ))}
          </nav>

          <button className="od-sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </aside>

        {/* ── MAIN ── */}
        <main className="od-main">

          {/* ══ OVERVIEW ══ */}
          {activeTab === "overview" && (
            <div className="od-tab-content">
              <div className="od-tab-header">
                <h2>Welcome, <em>{user?.username?.split(" ")[0]}</em> 👋</h2>
                <p>Manage your properties and bookings</p>
              </div>

              <div className="od-stat-cards">
                {[
                  { icon:<FaHome />,        label:"Total Listings",  val:listings.length, color:"accent"  },
                  { icon:<FaCheckCircle />, label:"Active Listings", val:activeCount,      color:"green"   },
                  { icon:<FaEye />,         label:"Total Views",     val:totalViews,       color:"accent2" },
                  { icon:<FaCalendarAlt />, label:"Pending",         val:pendingCount,     color:"yellow"  },
                ].map(s => (
                  <div key={s.label} className={`od-stat-card od-stat-${s.color}`}>
                    <div className="od-stat-icon">{s.icon}</div>
                    <div><strong>{s.val}</strong><span>{s.label}</span></div>
                  </div>
                ))}
              </div>

              {/* QUICK ACTIONS */}
              <div className="od-quick-actions">
                <button className="od-qa-btn od-qa-primary" onClick={() => setActiveTab("add")}>
                  <FaPlus /> Add New Property
                </button>
                <button className="od-qa-btn" onClick={() => setActiveTab("listings")}>
                  <FaHome /> View My Listings
                </button>
                <button className="od-qa-btn" onClick={() => setActiveTab("bookings")}>
                  <FaCalendarAlt /> Booking Requests
                  {pendingCount > 0 && <span className="od-qa-badge">{pendingCount}</span>}
                </button>
                <button className="od-qa-btn" onClick={() => setActiveTab("messages")}>
                  <FaCommentDots /> Messages
                  {unreadCount > 0 && <span className="od-qa-badge">{unreadCount}</span>}
                </button>
              </div>

              {/* RECENT LISTINGS */}
              <div className="od-section">
                <div className="od-section-header">
                  <h3>My Listings</h3>
                  <button className="od-see-all" onClick={() => setActiveTab("listings")}>
                    See All <FaArrowRight />
                  </button>
                </div>
                <div className="od-mini-listings">
                  {listings.slice(0,2).map(l => (
                    <div key={l._id} className="od-mini-listing">
                      <img
                        src={l.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&q=80"}
                        alt={l.title}
                      />
                      <div className="od-ml-info">
                        <h4>{l.title}</h4>
                        <p><FaMapMarkerAlt /> {l.location}</p>
                      </div>
                      <div className={`od-listing-status ${l.status}`}>{l.status}</div>
                      <p className="od-ml-price">₹{l.price?.toLocaleString()}/mo</p>
                    </div>
                  ))}
                  {listings.length === 0 && (
                    <p style={{ color:"var(--muted)", fontSize:".85rem" }}>No listings yet!</p>
                  )}
                </div>
              </div>

              {/* RECENT REQUESTS */}
              <div className="od-section">
                <div className="od-section-header">
                  <h3>Recent Booking Requests</h3>
                  <button className="od-see-all" onClick={() => setActiveTab("bookings")}>
                    See All <FaArrowRight />
                  </button>
                </div>
                <div className="od-mini-requests">
                  {requests.slice(0,2).map(r => {
                    const st = STATUS_CFG[r.status] || STATUS_CFG.pending;
                    return (
                      <div key={r._id} className="od-mini-request">
                        <img
                          src={r.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&q=80"}
                          alt={r.user?.username}
                        />
                        <div className="od-mr-info">
                          <h4>{r.user?.username || r.name}</h4>
                          <p>{r.property?.title}</p>
                        </div>
                        <div className={`od-status-badge ${st.cls}`}>{st.icon} {st.label}</div>
                      </div>
                    );
                  })}
                  {requests.length === 0 && (
                    <p style={{ color:"var(--muted)", fontSize:".85rem" }}>No requests yet!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ LISTINGS ══ */}
          {activeTab === "listings" && (
            <div className="od-tab-content">
              <div className="od-tab-header">
                <h2>My Listings</h2>
                <button className="od-add-btn" onClick={() => { setForm(EMPTY_FORM); setEditId(null); setActiveTab("add"); }}>
                  <FaPlus /> Add New
                </button>
              </div>

              {listings.length === 0 ? (
                <div className="od-empty">
                  <FaHome />
                  <h3>No listings yet</h3>
                  <p>Add your first property!</p>
                  <button className="od-empty-btn" onClick={() => setActiveTab("add")}>
                    <FaPlus /> Add Property
                  </button>
                </div>
              ) : (
                <div className="od-listings-grid">
                  {listings.map(l => (
                    <div key={l._id} className={`od-listing-card ${l.status === "inactive" ? "od-inactive" : ""}`}>
                      <div className="od-listing-img-wrap">
                        <img
                          src={l.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"}
                          alt={l.title}
                        />
                        <span className={`od-listing-status-tag ${l.status}`}>
                          {l.status === "active" ? "● Active" : "● Inactive"}
                        </span>
                      </div>
                      <div className="od-listing-info">
                        <div className="od-listing-top">
                          <div>
                            <h4>{l.title}</h4>
                            <p><FaMapMarkerAlt /> {l.location}</p>
                          </div>
                          <p className="od-listing-price">₹{l.price?.toLocaleString()}<span>/mo</span></p>
                        </div>
                        <div className="od-listing-meta">
                          {l.beds && <span><FaBed /> {l.beds} Beds</span>}
                          <span><FaBath /> {l.baths} Baths</span>
                          <span><FaRulerCombined /> {l.area} sqft</span>
                        </div>
                        <div className="od-listing-stats">
                          <span><FaEye /> {l.views || 0} views</span>
                        </div>
                        <div className="od-listing-actions">
                          <button className="od-edit-btn" onClick={() => handleEdit(l)}>
                            <FaEdit /> Edit
                          </button>
                          <button
                            className={`od-toggle-btn ${l.status === "active" ? "deactivate" : "activate"}`}
                            onClick={() => toggleStatus(l)}
                          >
                            {l.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <button className="od-delete-btn" onClick={() => setDeleteConfirm(l._id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {/* DELETE CONFIRM */}
                      {deleteConfirm === l._id && (
                        <div className="od-delete-confirm">
                          <p>Delete this listing?</p>
                          <div className="od-dc-actions">
                            <button className="od-dc-yes" onClick={() => handleDelete(l._id)}>Yes, Delete</button>
                            <button className="od-dc-no" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ ADD / EDIT ══ */}
          {activeTab === "add" && (
            <div className="od-tab-content">
              <div className="od-tab-header">
                <h2>{editId ? "Edit Property" : "Add New Property"}</h2>
                <p>{editId ? "Update your property details" : "Fill details to list your property"}</p>
              </div>

              {formSuccess && (
                <div className="od-success-banner">
                  <FaCheckCircle /> Property {editId ? "updated" : "added"} successfully!
                </div>
              )}

              <form className="od-property-form" onSubmit={handleSubmit}>
                <div className="od-img-upload">
                  <FaCloudUploadAlt />
                  <p>Click to upload property photos</p>
                  <span>JPG, PNG — Max 5MB each</span>
                </div>

                <div className="od-form-row">
                  <div className="od-form-field od-full">
                    <label>Property Title *</label>
                    <input name="title" placeholder="e.g. 2BHK Apartment in Peelamedu" value={form.title} onChange={handleForm} required />
                  </div>
                </div>

                <div className="od-form-row">
                  <div className="od-form-field">
                    <label>Property Type *</label>
                    <select name="type" value={form.type} onChange={handleForm}>
                      {["House","PG","Hostel","Apartment","Office"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="od-form-field">
                    <label>Location *</label>
                    <select name="location" value={form.location} onChange={handleForm} required>
                      <option value="">Select Location</option>
                      {["Peelamedu","Gandhipuram","RS Puram","Saravanampatti","Singanallur","Hopes College","Tidel Park","Avinashi Road","Ukkadam","Vadavalli"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="od-form-row">
                  <div className="od-form-field">
                    <label>Monthly Rent (₹) *</label>
                    <input name="price" type="number" placeholder="15000" value={form.price} onChange={handleForm} required />
                  </div>
                  <div className="od-form-field">
                    <label>Security Deposit (₹)</label>
                    <input name="deposit" type="number" placeholder="45000" value={form.deposit} onChange={handleForm} />
                  </div>
                </div>

                <div className="od-form-row">
                  <div className="od-form-field">
                    <label>Bedrooms</label>
                    <input name="beds" type="number" placeholder="2" min="0" value={form.beds} onChange={handleForm} />
                  </div>
                  <div className="od-form-field">
                    <label>Bathrooms *</label>
                    <input name="baths" type="number" placeholder="1" min="1" value={form.baths} onChange={handleForm} required />
                  </div>
                  <div className="od-form-field">
                    <label>Area (sq.ft) *</label>
                    <input name="area" type="number" placeholder="950" value={form.area} onChange={handleForm} required />
                  </div>
                </div>

                <div className="od-form-row">
                  <div className="od-form-field">
                    <label>Floor</label>
                    <input name="floor" placeholder="e.g. 2nd Floor" value={form.floor} onChange={handleForm} />
                  </div>
                  <div className="od-form-field">
                    <label>Furnished Status</label>
                    <select name="furnished" value={form.furnished} onChange={handleForm}>
                      {["Fully Furnished","Semi-Furnished","Unfurnished"].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div className="od-form-row">
                  <div className="od-form-field">
                    <label>Facing</label>
                    <select name="facing" value={form.facing} onChange={handleForm}>
                      {["East","West","North","South"].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="od-form-field">
                    <label>Parking</label>
                    <select name="parking" value={form.parking} onChange={handleForm}>
                      {["Covered","Open","None"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="od-form-field">
                    <label>Available From</label>
                    <input name="availableFrom" type="date" value={form.availableFrom} onChange={handleForm} />
                  </div>
                </div>

                <div className="od-form-field od-full">
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe your property..."
                    value={form.description}
                    onChange={handleForm}
                  />
                </div>

                <div className="od-form-actions">
                  <button type="submit" className="od-submit-btn">
                    {editId ? <><FaEdit /> Update Property</> : <><FaPlus /> List Property</>}
                  </button>
                  <button type="button" className="od-cancel-btn" onClick={() => { setForm(EMPTY_FORM); setEditId(null); setActiveTab("listings"); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══ BOOKING REQUESTS ══ */}
          {activeTab === "bookings" && (
            <div className="od-tab-content">
              <div className="od-tab-header">
                <h2>Booking Requests</h2>
                <p>{pendingCount} pending requests</p>
              </div>

              {requests.length === 0 ? (
                <div className="od-empty">
                  <FaCalendarAlt />
                  <h3>No booking requests yet</h3>
                </div>
              ) : (
                <div className="od-requests-list">
                  {requests.map(r => {
                    const st = STATUS_CFG[r.status] || STATUS_CFG.pending;
                    return (
                      <div key={r._id} className={`od-request-card od-req-${r.status}`}>
                        <div className="od-request-top">
                          <div className="od-request-user">
                            <img
                              src={r.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&q=80"}
                              alt={r.user?.username}
                            />
                            <div>
                              <h4>{r.user?.username || r.name}</h4>
                              <p>{r.mobile}</p>
                            </div>
                          </div>
                          <div className={`od-status-badge ${st.cls}`}>{st.icon} {st.label}</div>
                        </div>
                        <div className="od-request-details">
                          <div className="od-rd-item">
                            <span>Property</span>
                            <strong>{r.property?.title}</strong>
                          </div>
                          <div className="od-rd-item">
                            <span>Visit Date</span>
                            <strong>{new Date(r.visitDate).toLocaleDateString()}</strong>
                          </div>
                          <div className="od-rd-item">
                            <span>Move-in Date</span>
                            <strong>{new Date(r.moveInDate).toLocaleDateString()}</strong>
                          </div>
                          <div className="od-rd-item">
                            <span>Duration</span>
                            <strong>{r.duration} Months</strong>
                          </div>
                          <div className="od-rd-item">
                            <span>First Payment</span>
                            <strong>₹{r.firstPayment?.toLocaleString()}</strong>
                          </div>
                          {r.specialRequests && (
                            <div className="od-rd-item od-rd-full">
                              <span>Special Requests</span>
                              <strong>"{r.specialRequests}"</strong>
                            </div>
                          )}
                        </div>
                        {r.status === "pending" && (
                          <div className="od-request-actions">
                            <button className="od-accept-btn" onClick={() => handleRequest(r._id, "confirmed")}>
                              <FaCheckCircle /> Accept
                            </button>
                            <button className="od-reject-btn" onClick={() => handleRequest(r._id, "rejected")}>
                              <FaTimesCircle /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ MESSAGES ══ */}
          {activeTab === "messages" && (
            <div className="od-tab-content">
              <div className="od-tab-header">
                <h2>Messages</h2>
                <p>Messages from potential tenants</p>
              </div>

              {messages.length === 0 ? (
                <div className="od-empty">
                  <FaCommentDots />
                  <h3>No messages yet</h3>
                </div>
              ) : (
                <div className="od-messages-layout">
                  {/* CONV LIST */}
                  <div className="od-conv-list">
                    {messages.map(m => (
                      <div
                        key={m._id}
                        className={`od-conv-item ${activeMsg?._id === m._id ? "active" : ""}`}
                        onClick={() => setActiveMsg(m)}
                      >
                        <div className="od-conv-avatar-wrap">
                          <img
                            src={m.sender?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&q=80"}
                            alt={m.sender?.username}
                          />
                          {!m.isRead && <span className="od-unread-dot">1</span>}
                        </div>
                        <div className="od-conv-info">
                          <div className="od-conv-top">
                            <h4>{m.sender?.username || m.name}</h4>
                            <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p>{m.property?.title}</p>
                          <p className="od-conv-last">{m.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CHAT WINDOW */}
                  {activeMsg ? (
                    <div className="od-chat-window">
                      <div className="od-chat-header">
                        <img
                          src={activeMsg.sender?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&q=80"}
                          alt={activeMsg.sender?.username}
                        />
                        <div>
                          <h4>{activeMsg.sender?.username || activeMsg.name}</h4>
                          <p>{activeMsg.property?.title}</p>
                        </div>
                      </div>

                      <div className="od-chat-messages">
                        {/* User message */}
                        <div className="od-chat-bubble od-bubble-user">
                          <p>{activeMsg.message}</p>
                          <span>{new Date(activeMsg.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</span>
                        </div>
                      </div>

                      <form className="od-chat-input" onSubmit={handleReply}>
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        />
                        <button type="submit"><FaPaperPlane /></button>
                      </form>
                    </div>
                  ) : (
                    <div className="od-chat-window" style={{ display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)" }}>
                      <p>Select a message to view</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}