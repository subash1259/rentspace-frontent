import React, { useState } from "react";
import "../css/Compare.css";
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined,
  FaCheckCircle, FaTimesCircle, FaArrowRight,
  FaPlus, FaTimes, FaBalanceScale, FaHome,
  FaDoorOpen, FaBuilding, FaConciergeBell,
  FaBriefcase, FaCalendarAlt, FaCommentDots,
  FaPhoneAlt, FaExternalLinkAlt, FaChevronLeft
} from "react-icons/fa";

/* ─── ALL PROPERTIES ─── */
const ALL_PROPERTIES = [
  {
    id:1, type:"House", title:"2BHK Independent House", location:"Peelamedu",
    price:15000, deposit:45000, beds:2, baths:1, area:950,
    floor:"Ground", furnished:"Unfurnished", facing:"East",
    parking:"Open", availableFrom:"Apr 1, 2026",
    ownerName:"Dhanuj", ownerPhone:"+91 93605 43006",
    amenities:["Parking","Garden","Water","Security"],
    image:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80"
  },
  {
    id:4, type:"PG", title:"Men's PG Room", location:"Gandhipuram",
    price:7000, deposit:14000, beds:1, baths:1, area:200,
    floor:"2nd", furnished:"Fully Furnished", facing:"West",
    parking:"None", availableFrom:"Mar 15, 2026",
    ownerName:"Dinesh", ownerPhone:"+91 93606 86485",
    amenities:["WiFi","Meals","Laundry","CCTV"],
    image:"https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80"
  },
  {
    id:9, type:"Apartment", title:"3BHK Luxury Apartment", location:"Saravanampatti",
    price:20000, deposit:60000, beds:3, baths:2, area:1350,
    floor:"4th", furnished:"Semi-Furnished", facing:"East",
    parking:"Covered", availableFrom:"Apr 1, 2026",
    ownerName:"Vishal", ownerPhone:"+91 97878 66717",
    amenities:["WiFi","Gym","Lift","Parking","AC","Security","Power Backup","CCTV"],
    image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"
  },
  {
    id:10, type:"Apartment", title:"1BHK Apartment", location:"Peelamedu",
    price:10000, deposit:30000, beds:1, baths:1, area:620,
    floor:"2nd", furnished:"Semi-Furnished", facing:"North",
    parking:"Open", availableFrom:"Mar 20, 2026",
    ownerName:"Venkatesh", ownerPhone:"+91 80723 94393",
    amenities:["WiFi","Security","Lift","Water"],
    image:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80"
  },
  {
    id:11, type:"Apartment", title:"2BHK Modern Apartment", location:"Gandhipuram",
    price:14000, deposit:42000, beds:2, baths:2, area:980,
    floor:"3rd", furnished:"Semi-Furnished", facing:"West",
    parking:"Covered", availableFrom:"Apr 10, 2026",
    ownerName:"Selva", ownerPhone:"+91 93457 60278",
    amenities:["Parking","Lift","AC","Security"],
    image:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"
  },
  {
    id:13, type:"Office", title:"Premium Office Space", location:"RS Puram",
    price:25000, deposit:75000, beds:null, baths:2, area:800,
    floor:"1st", furnished:"Fully Furnished", facing:"South",
    parking:"Covered", availableFrom:"Immediate",
    ownerName:"Madhubalan", ownerPhone:"+91 73389 00298",
    amenities:["AC","Parking","WiFi","Power Backup","Reception","CCTV"],
    image:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
  },
];

const ALL_AMENITIES = [
  "WiFi","AC","Parking","Gym","Lift","Security",
  "Meals","Laundry","CCTV","Power Backup","Garden","Water","Reception",
];

const TYPE_ICONS = {
  House:<FaHome/>, PG:<FaDoorOpen/>,
  Hostel:<FaConciergeBell/>, Apartment:<FaBuilding/>, Office:<FaBriefcase/>
};

const COMPARE_ROWS = [
  { label:"Monthly Rent",     key:"price",         format: v => v ? `₹${v.toLocaleString()}/mo` : "—" },
  { label:"Security Deposit", key:"deposit",        format: v => v ? `₹${v.toLocaleString()}` : "—" },
  { label:"Property Type",    key:"type",           format: v => v || "—" },
  { label:"Location",         key:"location",       format: v => v || "—" },
  { label:"Bedrooms",         key:"beds",           format: v => v != null ? `${v} Bed${v>1?"s":""}` : "N/A" },
  { label:"Bathrooms",        key:"baths",          format: v => v ? `${v} Bath${v>1?"s":""}` : "—" },
  { label:"Area",             key:"area",           format: v => v ? `${v} sq.ft` : "—" },
  { label:"Floor",            key:"floor",          format: v => v || "—" },
  { label:"Furnished",        key:"furnished",      format: v => v || "—" },
  { label:"Facing",           key:"facing",         format: v => v || "—" },
  { label:"Parking",          key:"parking",        format: v => v || "—" },
  { label:"Available From",   key:"availableFrom",  format: v => v || "—" },
  { label:"Owner",            key:"ownerName",      format: v => v || "—" },
];

export default function Compare() {
  const [selected, setSelected]         = useState([
    ALL_PROPERTIES[0], ALL_PROPERTIES[2], ALL_PROPERTIES[4],
  ]);
  const [showPicker, setShowPicker]     = useState(null);
  const [highlightBest, setHighlightBest] = useState(false);
  const [shownPhone, setShownPhone]     = useState({});

  const pickProperty = (slotIdx, prop) => {
    const already = selected.findIndex(s => s && s.id === prop.id);
    if (already !== -1 && already !== slotIdx) return;
    const next = [...selected];
    next[slotIdx] = prop;
    setSelected(next);
    setShowPicker(null);
  };

  const removeSlot = (idx) => {
    const next = [...selected];
    next[idx] = null;
    setSelected(next);
  };

  const togglePhone = (id) => {
    setShownPhone(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getBest = (key) => {
    const vals = selected.map(p => p ? p[key] : null).filter(v => v != null && typeof v === "number");
    if (!vals.length) return null;
    if (key === "price" || key === "deposit") return Math.min(...vals);
    if (key === "area" || key === "beds" || key === "baths") return Math.max(...vals);
    return null;
  };

  const isBest = (key, val) => {
    const best = getBest(key);
    return best !== null && val === best;
  };

  const activePropIds = selected.filter(Boolean).map(p => p.id);

  return (
    <div className="cp-root">

      {/* ── TOP BAR (no navbar) ── */}
      <div className="cp-topbar">
        <a href="/listings" className="cp-back-link">
          <FaChevronLeft /> Back to Listings
        </a>
        <div className="cp-topbar-center">
          <FaBalanceScale />
          <h1>Compare Properties</h1>
        </div>
        <label className="cp-diff-toggle">
          <input
            type="checkbox"
            checked={highlightBest}
            onChange={e => setHighlightBest(e.target.checked)}
          />
          <span className="cp-toggle-track">
            <span className="cp-toggle-thumb" />
          </span>
          Highlight Best
        </label>
      </div>

      {/* ── COMPARE TABLE ── */}
      <div className="cp-page">
        <div className="cp-table-wrap">
          <table className="cp-table">

            {/* PROPERTY HEADER CARDS */}
            <thead>
              <tr>
                <th className="cp-row-label-head">Details</th>

                {[0,1,2].map(idx => (
                  <th key={idx} className="cp-prop-head">
                    {selected[idx] ? (
                      <div className="cp-prop-card">

                        {/* PROPERTY IMAGE */}
                        <div className="cp-prop-img-wrap">
                          <img src={selected[idx].image} alt={selected[idx].title} />
                          <button className="cp-remove-btn" onClick={() => removeSlot(idx)}>
                            <FaTimes />
                          </button>
                          <span className="cp-prop-type-tag">
                            {TYPE_ICONS[selected[idx].type]} {selected[idx].type}
                          </span>
                        </div>

                        {/* TITLE + LOCATION */}
                        <div className="cp-prop-head-info">
                          <h3>{selected[idx].title}</h3>
                          <p className="cp-prop-loc">
                            <FaMapMarkerAlt /> {selected[idx].location}, CBE
                          </p>

                          {/* RENT + DEPOSIT */}
                          <div className="cp-prop-price-block">
                            <div>
                              <span className="cp-price-label">Monthly Rent</span>
                              <p className="cp-prop-price">
                                ₹{selected[idx].price.toLocaleString()}<span>/mo</span>
                              </p>
                            </div>
                            <div>
                              <span className="cp-price-label">Deposit</span>
                              <p className="cp-prop-deposit">
                                ₹{selected[idx].deposit.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* QUICK META */}
                          <div className="cp-prop-quick-meta">
                            {selected[idx].beds && <span><FaBed /> {selected[idx].beds} Beds</span>}
                            <span><FaBath /> {selected[idx].baths} Baths</span>
                            <span><FaRulerCombined /> {selected[idx].area} sqft</span>
                          </div>

                          {/* ── ACTION BUTTONS ── */}
                          <div className="cp-prop-actions">
                            {/* Book */}
                            <a href="/booking" className="cp-action-book">
                              <FaCalendarAlt /> Book Now
                            </a>
                            {/* Chat */}
                            <a href="/chat" className="cp-action-chat">
                              <FaCommentDots /> Chat
                            </a>
                            {/* Contact / Phone */}
                            <button
                              className="cp-action-contact"
                              onClick={() => togglePhone(selected[idx].id)}
                            >
                              <FaPhoneAlt />
                              {shownPhone[selected[idx].id]
                                ? selected[idx].ownerPhone
                                : "Contact"}
                            </button>
                            {/* View */}
                            <a href={`/property/${selected[idx].id}`} className="cp-action-view">
                              <FaExternalLinkAlt /> View
                            </a>
                          </div>

                          {/* Change Property */}
                          <button
                            className="cp-change-btn"
                            onClick={() => setShowPicker(showPicker === idx ? null : idx)}
                          >
                            Change Property
                          </button>
                        </div>

                        {/* PICKER DROPDOWN */}
                        {showPicker === idx && (
                          <div className="cp-picker">
                            <p className="cp-picker-label">Select a property</p>
                            {ALL_PROPERTIES.map(p => (
                              <div
                                key={p.id}
                                className={`cp-picker-item
                                  ${activePropIds.includes(p.id) && selected[idx]?.id !== p.id ? "disabled" : ""}
                                  ${selected[idx]?.id === p.id ? "active" : ""}
                                `}
                                onClick={() => {
                                  if (activePropIds.includes(p.id) && selected[idx]?.id !== p.id) return;
                                  pickProperty(idx, p);
                                }}
                              >
                                <img src={p.image} alt={p.title} />
                                <div>
                                  <strong>{p.title}</strong>
                                  <p>{p.location} · ₹{p.price.toLocaleString()}/mo</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* EMPTY SLOT */
                      <div className="cp-empty-slot" onClick={() => setShowPicker(showPicker === idx ? null : idx)}>
                        <div className="cp-add-icon"><FaPlus /></div>
                        <p>Add Property</p>
                        <span>Click to select</span>

                        {showPicker === idx && (
                          <div className="cp-picker" onClick={e => e.stopPropagation()}>
                            <p className="cp-picker-label">Select a property</p>
                            {ALL_PROPERTIES.map(p => (
                              <div
                                key={p.id}
                                className={`cp-picker-item ${activePropIds.includes(p.id) ? "disabled" : ""}`}
                                onClick={() => {
                                  if (activePropIds.includes(p.id)) return;
                                  pickProperty(idx, p);
                                }}
                              >
                                <img src={p.image} alt={p.title} />
                                <div>
                                  <strong>{p.title}</strong>
                                  <p>{p.location} · ₹{p.price.toLocaleString()}/mo</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* DETAIL ROWS */}
              {COMPARE_ROWS.map((row, ri) => (
                <tr key={row.key} className={ri % 2 === 0 ? "cp-row-even" : ""}>
                  <td className="cp-row-label">{row.label}</td>
                  {[0,1,2].map(idx => {
                    const prop = selected[idx];
                    const val  = prop ? prop[row.key] : null;
                    const best = highlightBest && prop && isBest(row.key, val);
                    return (
                      <td
                        key={idx}
                        className={`cp-row-val ${!prop ? "cp-empty-cell" : ""} ${best ? "cp-best" : ""}`}
                      >
                        {prop ? (
                          <span>
                            {best && <span className="cp-best-badge">Best</span>}
                            {row.format(val)}
                          </span>
                        ) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* AMENITIES ROW */}
              <tr className="cp-amenities-row">
                <td className="cp-row-label cp-amenity-label-col">Amenities</td>
                {[0,1,2].map(idx => {
                  const prop = selected[idx];
                  return (
                    <td key={idx} className={`cp-row-val cp-amenity-cell ${!prop ? "cp-empty-cell" : ""}`}>
                      {prop ? (
                        <div className="cp-amenity-list">
                          {ALL_AMENITIES.map(a => {
                            const has = prop.amenities.includes(a);
                            return (
                              <div key={a} className={`cp-amenity-row ${has ? "has" : "no"}`}>
                                {has
                                  ? <FaCheckCircle className="cp-check" />
                                  : <FaTimesCircle className="cp-cross" />
                                }
                                <span>{a}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : "—"}
                    </td>
                  );
                })}
              </tr>

              {/* BOTTOM ACTION ROW */}
              <tr className="cp-action-row">
                <td className="cp-row-label">Quick Actions</td>
                {[0,1,2].map(idx => (
                  <td key={idx} className="cp-row-val cp-action-cell">
                    {selected[idx] ? (
                      <div className="cp-bottom-actions">
                        <a href="/booking" className="cp-action-book">
                          <FaCalendarAlt /> Book Now
                        </a>
                        <a href="/chat" className="cp-action-chat">
                          <FaCommentDots /> Chat Owner
                        </a>
                        <button
                          className="cp-action-contact"
                          onClick={() => togglePhone(selected[idx].id)}
                        >
                          <FaPhoneAlt />
                          {shownPhone[selected[idx].id]
                            ? selected[idx].ownerPhone
                            : "Show Contact"}
                        </button>
                        <a href={`/property/${selected[idx].id}`} className="cp-action-view">
                          <FaExternalLinkAlt /> View Detail
                        </a>
                      </div>
                    ) : "—"}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}