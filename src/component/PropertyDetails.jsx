import React, { useState } from "react";
import "../css/propertyDetails.css";
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined,
  FaHeart, FaRegHeart, FaShareAlt, FaArrowLeft,
  FaCheckCircle, FaPhoneAlt, FaCommentDots,
  FaCalendarAlt, FaShieldAlt, FaWifi, FaCar,
  FaDumbbell, FaSnowflake, FaUtensils, FaVideo,
  FaBolt, FaArrowRight, FaChevronLeft, FaChevronRight,
  FaHome, FaStar, FaRegStar, FaCopy,
  FaTimes, FaPaperPlane   
} from "react-icons/fa";

/* ─── MOCK PROPERTY DATA ─── */
const PROPERTY = {
  id: 9,
  type: "Apartment",
  title: "3BHK Luxury Apartment",
  location: "Saravanampatti",
  fullAddress: "Saravanampatti, Coimbatore — 641035",
  price: 20000,
  deposit: 60000,
  beds: 3,
  baths: 2,
  area: 1350,
  floor: "4th Floor",
  totalFloors: 8,
  facing: "East",
  furnished: "Semi-Furnished",
  parking: "Covered",
  availableFrom: "April 1, 2026",
  badge: "New",
  rating: 4.5,
  reviews: 12,
  description: `This stunning 3BHK apartment in Saravanampatti offers the perfect blend of comfort and style. Located in a gated community with 24/7 security, the property features spacious rooms with ample natural lighting.

The apartment is situated close to major IT parks, schools, and hospitals, making it ideal for families and working professionals. The building comes with premium amenities including a gymnasium, rooftop garden, and covered parking.`,
  amenities: [
    { icon: <FaWifi />,       label: "High-Speed WiFi" },
    { icon: <FaDumbbell />,   label: "Gymnasium" },
    { icon: <FaCar />,        label: "Covered Parking" },
    { icon: <FaSnowflake />,  label: "AC in all rooms" },
    { icon: <FaShieldAlt />,  label: "24/7 Security" },
    { icon: <FaBolt />,       label: "Power Backup" },
    { icon: <FaUtensils />,   label: "Modular Kitchen" },
    { icon: <FaVideo />,      label: "CCTV Surveillance" },
  ],
  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=900&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80",
  ],
  owner: {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@rentspace.in",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    listedSince: "2023",
    totalListings: 5,
    responseTime: "Within 1 hour",
  },
  mapLat: 11.0509,
  mapLng: 76.9930,
};

/* ─── SIMILAR PROPERTIES ─── */
const SIMILAR = [
  { id:10, type:"Apartment", title:"1BHK Apartment",        location:"Peelamedu",     price:10000, beds:1, baths:1, image:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
  { id:11, type:"Apartment", title:"2BHK Modern Apartment", location:"Gandhipuram",   price:14000, beds:2, baths:2, image:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" },
  { id:12, type:"Apartment", title:"2BHK Gated Community",  location:"Tidel Park",    price:18000, beds:2, baths:2, image:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80" },
];

export default function PropertyDetail() {
  const [activeImg, setActiveImg]   = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [showPhone, setShowPhone]   = useState(false);
  const [copied, setCopied]         = useState(false);
  const [activeTab, setActiveTab]   = useState("overview");

  const [showMsgForm, setShowMsgForm] = useState(false);
  const [msgSent, setMsgSent]         = useState(false);
  const [msgForm, setMsgForm]         = useState({
    name: "", email: "", mobile: "", message: ""
  });

  const handleMsgChange = (e) => {
    setMsgForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMsgSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent:", msgForm);
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setShowMsgForm(false);
      setMsgForm({ name:"", email:"", mobile:"", message:"" });
    }, 2000);
  };

  const prevImg = () => setActiveImg(i => (i - 1 + PROPERTY.images.length) % PROPERTY.images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % PROPERTY.images.length);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating)
        ? <FaStar key={i} className="pd-star filled" />
        : <FaRegStar key={i} className="pd-star" />
    );
  };

  return (
    <div className="pd-root">

      {/* ── NAVBAR ── */}
      <nav className="pd-nav">
        <a href="/" className="pd-logo">RentSpace</a>
        <div className="pd-nav-links">
          <a href="/">Home</a>
          <a href="/listings">Rentals</a>
          <a href="/login">Login</a>
          <a href="/register" className="pd-nav-register">Register</a>
        </div>
      </nav>

      {/* ── BREADCRUMB ── */}
      <div className="pd-breadcrumb">
        <a href="/listings"><FaArrowLeft /> Back to Listings</a>
        <span>/</span>
        <span>{PROPERTY.type}</span>
        <span>/</span>
        <span>{PROPERTY.location}</span>
      </div>

      <div className="pd-container">

        {/* ── LEFT COLUMN ── */}
        <div className="pd-left">

          {/* IMAGE GALLERY */}
          <div className="pd-gallery">
            <div className="pd-main-img-wrap">
              <img
                src={PROPERTY.images[activeImg]}
                alt={PROPERTY.title}
                className="pd-main-img"
              />
              <div className="pd-img-overlay-top">
                <span className="pd-badge">{PROPERTY.badge}</span>
                <div className="pd-img-actions">
                  <button
                    className={`pd-wishlist ${wishlisted ? "active" : ""}`}
                    onClick={() => setWishlisted(w => !w)}
                  >
                    {wishlisted ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button className="pd-share" onClick={handleCopy}>
                    {copied ? <FaCheckCircle /> : <FaShareAlt />}
                  </button>
                </div>
              </div>
              <button className="pd-arrow pd-arrow-left"  onClick={prevImg}><FaChevronLeft /></button>
              <button className="pd-arrow pd-arrow-right" onClick={nextImg}><FaChevronRight /></button>
              <div className="pd-img-counter">{activeImg + 1} / {PROPERTY.images.length}</div>
            </div>

            {/* THUMBNAILS */}
            <div className="pd-thumbs">
              {PROPERTY.images.map((img, i) => (
                <div
                  key={i}
                  className={`pd-thumb ${activeImg === i ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`view-${i}`} />
                </div>
              ))}
            </div>
          </div>

          {/* TABS */}
          <div className="pd-tabs">
            {["overview", "amenities", "map"].map(t => (
              <button
                key={t}
                className={`pd-tab ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="pd-section">
              <h1 className="pd-title">{PROPERTY.title}</h1>
              <p className="pd-location">
                <FaMapMarkerAlt /> {PROPERTY.fullAddress}
              </p>

              {/* QUICK STATS */}
              <div className="pd-quick-stats">
                <div className="pd-stat-box">
                  <FaBed />
                  <strong>{PROPERTY.beds}</strong>
                  <span>Bedrooms</span>
                </div>
                <div className="pd-stat-box">
                  <FaBath />
                  <strong>{PROPERTY.baths}</strong>
                  <span>Bathrooms</span>
                </div>
                <div className="pd-stat-box">
                  <FaRulerCombined />
                  <strong>{PROPERTY.area}</strong>
                  <span>Sq. Ft</span>
                </div>
                <div className="pd-stat-box">
                  <FaHome />
                  <strong>{PROPERTY.floor}</strong>
                  <span>Floor</span>
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="pd-details-grid">
                {[
                  ["Property Type",  PROPERTY.type],
                  ["Furnished",      PROPERTY.furnished],
                  ["Facing",         PROPERTY.facing],
                  ["Parking",        PROPERTY.parking],
                  ["Total Floors",   PROPERTY.totalFloors],
                  ["Available From", PROPERTY.availableFrom],
                ].map(([k, v]) => (
                  <div key={k} className="pd-detail-item">
                    <span className="pd-detail-key">{k}</span>
                    <span className="pd-detail-val">{v}</span>
                  </div>
                ))}
              </div>

              {/* DESCRIPTION */}
              <div className="pd-desc">
                <h3>About this Property</h3>
                <p>{PROPERTY.description}</p>
              </div>

              {/* RATINGS */}
              <div className="pd-rating-row">
                <div className="pd-stars">{renderStars(PROPERTY.rating)}</div>
                <span className="pd-rating-num">{PROPERTY.rating}</span>
                <span className="pd-rating-count">({PROPERTY.reviews} reviews)</span>
              </div>
            </div>
          )}

          {/* ── AMENITIES TAB ── */}
          {activeTab === "amenities" && (
            <div className="pd-section">
              <h2 className="pd-section-h2">Amenities &amp; Features</h2>
              <div className="pd-amenities-grid">
                {PROPERTY.amenities.map((a, i) => (
                  <div key={i} className="pd-amenity-card">
                    <div className="pd-amenity-icon">{a.icon}</div>
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MAP TAB ── */}
          {activeTab === "map" && (
            <div className="pd-section">
              <h2 className="pd-section-h2">Location &amp; Nearby</h2>
              <p className="pd-map-address"><FaMapMarkerAlt /> {PROPERTY.fullAddress}</p>

              {/* Google Map Embed */}
              <div className="pd-map-wrap">
                <iframe
                  title="Property Location"
                  src={`https://maps.google.com/maps?q=${PROPERTY.mapLat},${PROPERTY.mapLng}&z=15&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "16px" }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>

              {/* NEARBY */}
              <div className="pd-nearby">
                <h3>Nearby Places</h3>
                <div className="pd-nearby-grid">
                  {[
                    { place: "Tidel Park IT Hub",     dist: "1.2 km" },
                    { place: "KG Hospital",            dist: "2.5 km" },
                    { place: "Brookefields Mall",      dist: "3.0 km" },
                    { place: "KMCT Engineering College",dist: "0.8 km" },
                    { place: "Saravanampatti Bus Stop", dist: "0.3 km" },
                    { place: "Reliance Fresh",          dist: "0.5 km" },
                  ].map(n => (
                    <div key={n.place} className="pd-nearby-item">
                      <FaMapMarkerAlt className="pd-nearby-icon" />
                      <span>{n.place}</span>
                      <span className="pd-nearby-dist">{n.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SIMILAR PROPERTIES */}
          <div className="pd-similar">
            <h2 className="pd-section-h2">Similar Properties</h2>
            <div className="pd-similar-grid">
              {SIMILAR.map(p => (
                <a href={`/property/${p.id}`} key={p.id} className="pd-sim-card">
                  <img src={p.image} alt={p.title} />
                  <div className="pd-sim-info">
                    <h4>{p.title}</h4>
                    <p><FaMapMarkerAlt /> {p.location}</p>
                    <div className="pd-sim-meta">
                      <span><FaBed /> {p.beds}</span>
                      <span><FaBath /> {p.baths}</span>
                    </div>
                    <p className="pd-sim-price">₹{p.price.toLocaleString()}<span>/mo</span></p>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT STICKY SIDEBAR ── */}
        <div className="pd-right">

          {/* PRICE CARD */}
          <div className="pd-price-card">
            <div className="pd-price-top">
              <div>
                <p className="pd-price-label">Monthly Rent</p>
                <p className="pd-price">₹{PROPERTY.price.toLocaleString()}<span>/mo</span></p>
              </div>
              <div className="pd-price-type">{PROPERTY.type}</div>
            </div>
            <div className="pd-deposit-row">
              <span>Security Deposit</span>
              <strong>₹{PROPERTY.deposit.toLocaleString()}</strong>
            </div>
            <div className="pd-available-row">
              <FaCalendarAlt />
              <span>Available from <strong>{PROPERTY.availableFrom}</strong></span>
            </div>
            

            {/* BOOK BUTTON */}
            <a href={`/booking/${PROPERTY.id}`} className="pd-book-btn">

              <FaCalendarAlt /> Book Now
            </a>

            {/* CONTACT OWNER */}
            <button
              className="pd-contact-btn"
              onClick={() => setShowPhone(s => !s)}
            >
              <FaPhoneAlt />
              {showPhone ? PROPERTY.owner.phone : "Show Owner Number"}
            </button>

            {/* MESSAGE OWNER BUTTON */}
<button
  className="pd-chat-btn"
  onClick={() => setShowMsgForm(true)}
>
  <FaCommentDots /> Message Owner
</button>

{/* MESSAGE MODAL */}
{showMsgForm && (
  <div className="pd-modal-overlay" onClick={() => setShowMsgForm(false)}>
    <div className="pd-modal" onClick={e => e.stopPropagation()}>

      <div className="pd-modal-header">
        <h3>Message Owner</h3>
        <button className="pd-modal-close" onClick={() => setShowMsgForm(false)}>
          <FaTimes />
        </button>
      </div>

      <div className="pd-modal-prop">
        <img src={PROPERTY.images[0]} alt={PROPERTY.title} />
        <div>
          <p>{PROPERTY.title}</p>
          <span>{PROPERTY.location}, Coimbatore</span>
        </div>
      </div>

      {!msgSent ? (
        <form className="pd-msg-form" onSubmit={handleMsgSubmit}>
          <div className="pd-msg-row">
            <div className="pd-msg-field">
              <label>Your Name *</label>
              <input
                name="name" type="text"
                placeholder="Subash"
                value={msgForm.name}
                onChange={handleMsgChange}
                required
              />
            </div>
            <div className="pd-msg-field">
              <label>Mobile *</label>
              <input
                name="mobile" type="tel"
                placeholder="9876543210"
                maxLength={10}
                value={msgForm.mobile}
                onChange={handleMsgChange}
                required
              />
            </div>
          </div>
          <div className="pd-msg-field">
            <label>Email</label>
            <input
              name="email" type="email"
              placeholder="you@example.com"
              value={msgForm.email}
              onChange={handleMsgChange}
            />
          </div>
          <div className="pd-msg-field">
            <label>Message *</label>
            <textarea
              name="message"
              rows={4}
              placeholder={`Hi! I'm interested in ${PROPERTY.title}. Is it still available?`}
              value={msgForm.message}
              onChange={handleMsgChange}
              required
            />
          </div>
          <button type="submit" className="pd-msg-send-btn">
            <FaPaperPlane /> Send Message
          </button>
        </form>
      ) : (
        <div className="pd-msg-success">
          <FaCheckCircle />
          <p>Message sent successfully!</p>
          <span>Owner will contact you soon.</span>
        </div>
      )}

    </div>
  </div>
)}
          </div>

          {/* OWNER CARD */}
          <div className="pd-owner-card">
            <div className="pd-owner-top">
              <img src={PROPERTY.owner.avatar} alt={PROPERTY.owner.name} />
              <div>
                <h4>{PROPERTY.owner.name}</h4>
                <p>Listed since {PROPERTY.owner.listedSince}</p>
              </div>
            </div>
            <div className="pd-owner-stats">
              <div>
                <strong>{PROPERTY.owner.totalListings}</strong>
                <span>Listings</span>
              </div>
              <div>
                <strong>{PROPERTY.owner.responseTime}</strong>
                <span>Response Time</span>
              </div>
            </div>
            <div className="pd-owner-verified">
              <FaCheckCircle /> Verified Owner
            </div>
          </div>

          {/* SAFETY TIPS */}
          <div className="pd-safety-card">
            <h4><FaShieldAlt /> Safety Tips</h4>
            <ul>
              <li>Visit the property before payment</li>
              <li>Never pay full amount in advance</li>
              <li>Verify owner identity documents</li>
              <li>Get a proper rental agreement</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}