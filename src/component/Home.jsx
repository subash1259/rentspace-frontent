import React, { useState } from "react";
import "../css/home.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import {
  FaInstagram, FaWhatsapp, FaFacebook,
  FaMapMarkerAlt, FaArrowRight, FaStar,
  FaShieldAlt, FaBolt, FaHome,
  FaBed, FaBath, FaWifi, FaBuilding,
  FaDoorOpen, FaConciergeBell
} from "react-icons/fa";

/* ─── DATA ─── */

const TABS = ["All", "House", "PG", "Hostel", "Apartment", "Office"];

const allRentals = [
  {
    id: 1, type: "House",
    title: "2BHK Independent House", location: "Peelamedu",
    price: "₹15,000/mo", badge: "Popular",
    beds: 2, baths: 1, amenities: ["Parking", "Garden", "Water"],
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80"
  },
  {
    id: 2, type: "House",
    title: "3BHK Villa", location: "Saravanampatti",
    price: "₹22,000/mo", badge: "Spacious",
    beds: 3, baths: 2, amenities: ["Parking", "Garden", "AC"],
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80"
  },
  {
    id: 3, type: "PG",
    title: "Men's PG Room", location: "Gandhipuram",
    price: "₹7,000/mo", badge: "Budget Pick",
    beds: 1, baths: 1, amenities: ["WiFi", "Meals", "Laundry"],
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80"
  },
  {
    id: 4, type: "PG",
    title: "Women's PG with Meals", location: "RS Puram",
    price: "₹8,500/mo", badge: "Safe",
    beds: 1, baths: 1, amenities: ["WiFi", "Meals", "CCTV"],
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80"
  },
  {
    id: 5, type: "Hostel",
    title: "Boys Hostel — Shared Room", location: "Peelamedu",
    price: "₹4,500/mo", badge: "Affordable",
    beds: 1, baths: 1, amenities: ["WiFi", "Meals", "Security"],
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80"
  },
  {
    id: 6, type: "Hostel",
    title: "Girls Hostel — AC Room", location: "Gandhipuram",
    price: "₹6,000/mo", badge: "Popular",
    beds: 1, baths: 1, amenities: ["AC", "WiFi", "Meals", "CCTV"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"
  },
  {
    id: 7, type: "Apartment",
    title: "3BHK Luxury Apartment", location: "Saravanampatti",
    price: "₹20,000/mo", badge: "New",
    beds: 3, baths: 2, amenities: ["WiFi", "Gym", "Lift", "Parking"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"
  },
  {
    id: 8, type: "Apartment",
    title: "1BHK Apartment", location: "Peelamedu",
    price: "₹10,000/mo", badge: "Popular",
    beds: 1, baths: 1, amenities: ["WiFi", "Security", "Lift"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80"
  },
  {
    id: 9, type: "Apartment",
    title: "2BHK Apartment", location: "Gandhipuram",
    price: "₹14,000/mo", badge: "Trending",
    beds: 2, baths: 2, amenities: ["Parking", "Lift", "AC"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"
  },
  {
    id: 10, type: "Office",
    title: "Premium Office Space", location: "RS Puram",
    price: "₹25,000/mo", badge: "Premium",
    beds: null, baths: 2, amenities: ["AC", "Parking", "WiFi", "Power Backup"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
  },
  {
    id: 11, type: "Office",
    title: "Co-working Space", location: "Saravanampatti",
    price: "₹8,000/mo", badge: "Flexible",
    beds: null, baths: 1, amenities: ["WiFi", "AC", "Cafeteria"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80"
  },
];

const types = [
  {
    label: "House",
    icon: <FaHome />,
    count: "120+ listings",
    img: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=700&q=80"
  },
  {
    label: "PG",
    icon: <FaDoorOpen />,
    count: "80+ listings",
    img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=700&q=80"
  },
  {
    label: "Hostel",
    icon: <FaConciergeBell />,
    count: "60+ listings",
    img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80"
  },
  {
    label: "Apartment",
    icon: <FaBuilding />,
    count: "150+ listings",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80"
  },
  {
    label: "Office",
    icon: <FaBolt />,
    count: "40+ listings",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80"
  },
];

const locations = ["Peelamedu", "Gandhipuram", "RS Puram", "Saravanampatti"];

const highlights = [
  { icon: <FaBolt />,      title: "No Brokerage",     desc: "Connect directly with property owners. Zero middlemen, zero hidden charges." },
  { icon: <FaShieldAlt />, title: "Verified Listings", desc: "Every property is thoroughly verified for safety and accuracy before listing." },
  { icon: <FaHome />,      title: "Instant Booking",   desc: "Book your space in minutes with our streamlined, hassle-free process." },
];

/* ─── COMPONENT ─── */

export default function Home() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredRentals = activeTab === "All"
    ? allRentals
    : allRentals.filter(r => r.type === activeTab);

  return (
    <div>
      {/* NAVBAR */}
      <Navbar/>

      

      {/* HERO */}
      <section className="rs-hero">
        <div className="rs-hero-bg">
          <div className="rs-blob rs-blob-1" />
          <div className="rs-blob rs-blob-2" />
        </div>

        <div className="rs-hero-tag">
          <span /> Coimbatore's #1 Rental Platform
        </div>

        <h1 className="rs-hero-h1">
          Find Your <em>Perfect</em><br />Rental Space
        </h1>
        <p className="rs-hero-sub">
          Houses, Apartments, PGs, Hostels &amp; Offices Across Coimbatore — Zero Brokerage.
        </p>

        {/* HERO TABS */}
        <div className="rs-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`rs-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="rs-search-bar">
          <input placeholder="Search Coimbatore locations…" />
          <select>
            <option>Budget</option>
            <option>₹5,000 – ₹10,000</option>
            <option>₹10,000 – ₹20,000</option>
            <option>₹20,000+</option>
          </select>
          <select>
            <option>Type</option>
            {TABS.slice(1).map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="rs-search-btn">Search →</button>
        </div>
      </section>

      {/* STATS */}
      <section className="rs-stats">
        {[
          ["500+", "Active Properties"],
          ["300+", "Happy Tenants"],
          ["100+", "Verified Owners"],
        ].map(([n, l]) => (
          <div className="rs-stat" key={l}>
            <h2>{n}</h2>
            <p>{l}</p>
          </div>
        ))}
      </section>

      {/* POPULAR LOCATIONS */}
      <section className="rs-locations">
        <p className="rs-label">Browse by Area</p>
        <h2 className="rs-section-h2">Popular Locations</h2>
        <div className="rs-loc-grid">
          {locations.map(loc => (
            <div className="rs-loc-card" key={loc}>
              <span>{loc}</span>
              <FaArrowRight className="rs-loc-icon" />
            </div>
          ))}
        </div>
      </section>

      {/* PROPERTY TYPES — 5 cards */}
      <section className="rs-types">
        <p className="rs-label">Categories</p>
        <h2 className="rs-section-h2">Explore Property Types</h2>
        <div className="rs-type-grid">
          {types.map(t => (
            <div
              className="rs-type-card"
              key={t.label}
              onClick={() => setActiveTab(t.label)}
            >
              <img src={t.img} alt={t.label} />
              <div className="rs-type-label">
                <div>
                  <span className="rs-type-name">{t.label}</span>
                  <span className="rs-type-count">{t.count}</span>
                </div>
                <div className="rs-type-arr"><FaArrowRight /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED RENTALS */}
      <section className="rs-featured">
        <p className="rs-label">Handpicked</p>
        <h2 className="rs-section-h2">Featured Rentals</h2>

        {/* Filter pills */}
        <div className="rs-filter-pills">
          {TABS.map(t => (
            <button
              key={t}
              className={`rs-pill ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rs-scroll-row">
          {filteredRentals.map(item => (
            <div className="rs-scroll-card" key={item.id}>
              <div className="rs-card-badge">{item.badge}</div>
              <div className="rs-card-type-tag">{item.type}</div>
              <img src={item.image} alt={item.title} />
              <div className="rs-card-info">
                <h4>{item.title}</h4>
                <p className="rs-card-loc">
                  <FaMapMarkerAlt style={{ fontSize: ".75rem" }} /> {item.location}
                </p>

                {/* Beds / Baths */}
                <div className="rs-card-meta">
                  {item.beds !== null && (
                    <span><FaBed /> {item.beds} Bed{item.beds > 1 ? "s" : ""}</span>
                  )}
                  <span><FaBath /> {item.baths} Bath{item.baths > 1 ? "s" : ""}</span>
                </div>

                {/* Amenities */}
                <div className="rs-amenities">
                  {item.amenities.map(a => (
                    <span className="rs-amenity-tag" key={a}>{a}</span>
                  ))}
                </div>

                <p className="rs-card-price">{item.price}</p>
              </div>
            </div>
          ))}

          {filteredRentals.length === 0 && (
            <p className="rs-no-results">No listings found for this category.</p>
          )}
        </div>
      </section>

      {/* CITY BANNER */}
      <div className="rs-city">
        <div className="rs-city-dots" />
        <div className="rs-city-inner">
          <p className="rs-label">We Cover</p>
          <h2>Find Rentals Across<br />All of Coimbatore</h2>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <section className="rs-highlights">
        <p className="rs-label">Why Us</p>
        <h2 className="rs-section-h2">The RentSpace Advantage</h2>
        <div className="rs-hl-grid">
          {highlights.map(h => (
            <div className="rs-hl-card" key={h.title}>
              <div className="rs-hl-icon">{h.icon}</div>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="rs-testi">
        <p className="rs-label rs-center">Testimonials</p>
        <h2 className="rs-section-h2 rs-center">What Users Say</h2>
        <div className="rs-testi-card">
          <div className="rs-stars">
            {[...Array(5)].map((_, i) => <FaStar key={i} />)}
          </div>
          <p>"Best rental website in Coimbatore! Found my dream apartment in just two days without any brokerage. Highly recommend RentSpace."</p>
          <h4>— SUBASH R., Sitra</h4>
        </div>
      </section>

      {/* CTA */}
      <div className="rs-cta">
        <div className="rs-cta-left">
          <h2>Post Your Property<br />for FREE</h2>
          <p>Reach thousands of verified tenants instantly.</p>
        </div>
        <button className="rs-cta-btn">
          Post Property <FaArrowRight />
        </button>
      </div>

      {/* FOOTER */}
      <footer className="rs-footer">
        <div className="rs-footer-logo">RentSpace</div>
        <p className="rs-footer-copy">© 2026 RentSpace · Coimbatore</p>
        <div className="rs-socials">
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaWhatsapp /></a>
          <a href="#"><FaFacebook /></a>
        </div>
      </footer>

    </div>
  );
}