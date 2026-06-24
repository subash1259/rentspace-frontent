import React, { useState, useRef, useEffect } from "react";
import "../css/listings.css";
import {
  FaMapMarkerAlt, FaSearch, FaBed, FaBath,
  FaHeart, FaRegHeart, FaArrowRight, FaSlidersH,
  FaTimes, FaHome, FaDoorOpen, FaBuilding,
  FaConciergeBell, FaBriefcase, FaBalanceScale,
  FaSortAmountDown, FaChevronDown
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

/* ─── COIMBATORE LOCATIONS ─── */
const ALL_LOCATIONS = [
  "Peelamedu", "Gandhipuram", "RS Puram", "Saravanampatti",
  "Singanallur", "Hopes College", "Tidel Park", "Avinashi Road",
  "Ukkadam", "Kuniyamuthur", "Vadavalli", "Kovaipudur",
  "Ramanathapuram", "Sulur", "Podanur", "Thudiyalur",
  "Ganapathy", "Ondipudur", "Sowripalayam", "Pappanaickenpalayam",
  "Kavundampalayam", "Vilankurichi", "Kalapatti", "Saravanampatty",
  "Town Hall", "Cross Cut Road", "DB Road", "Race Course",
];



const TYPE_ICONS = {
  House: <FaHome />, PG: <FaDoorOpen />,
  Hostel: <FaConciergeBell />, Apartment: <FaBuilding />, Office: <FaBriefcase />,
};

const BUDGET_RANGES = [
  { label: "Any",           min: 0,     max: Infinity },
  { label: "Under ₹5,000",  min: 0,     max: 5000 },
  { label: "₹5k – ₹10k",   min: 5000,  max: 10000 },
  { label: "₹10k – ₹15k",  min: 10000, max: 15000 },
  { label: "₹15k – ₹25k",  min: 15000, max: 25000 },
  { label: "₹25k+",         min: 25000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Relevance",        key: "default" },
  { label: "Price: Low → High",key: "price_asc" },
  { label: "Price: High → Low",key: "price_desc" },
  { label: "Area: Large First", key: "area_desc" },
];

export default function Listings() {

  const navigate = useNavigate();

  // ── ALL STATES — TOP LA ──
  const { user }  = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const [locationInput, setLocationInput]       = useState("");
  const [suggestions, setSuggestions]           = useState([]);
  const [showSuggestions, setShowSuggestions]   = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [activeType, setActiveType]             = useState("All");
  const [activeBudget, setActiveBudget]         = useState(0);
  const [sortKey, setSortKey]                   = useState("default");
  const [showSort, setShowSort]                 = useState(false);
  const [wishlist, setWishlist]                 = useState([]);
  const [compareList, setCompareList]           = useState([]);
  const [showCompareBar, setShowCompareBar]     = useState(false);
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  const suggestRef = useRef(null);
  const sortRef    = useRef(null);
  const TYPES      = ["All", "House", "PG", "Hostel", "Apartment", "Office"];

  // ── FETCH PROPERTIES ──
  useEffect(() => {
    fetchProperties();
  }, [activeType, selectedLocation, activeBudget]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let url = "/properties?";
      if (activeType !== "All") url += `type=${activeType}&`;
      if (selectedLocation)     url += `location=${selectedLocation}&`;
      if (activeBudget !== 0) {
        const budget = BUDGET_RANGES[activeBudget];
        if (budget.min) url += `minPrice=${budget.min}&`;
        if (budget.max !== Infinity) url += `maxPrice=${budget.max}&`;
      }
      const res = await API.get(url);
      setProperties(res.data.properties);
    } catch (err) {
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  // ── LOCATION AUTOCOMPLETE ──
  useEffect(() => {
    if (locationInput.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    const filtered = ALL_LOCATIONS.filter(l =>
      l.toLowerCase().includes(locationInput.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  }, [locationInput]);

  // ── CLOSE DROPDOWNS ──
  useEffect(() => {
    const handler = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target))
        setShowSuggestions(false);
      if (sortRef.current && !sortRef.current.contains(e.target))
        setShowSort(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pickLocation = (loc) => {
    setLocationInput(loc);
    setSelectedLocation(loc);
    setShowSuggestions(false);
  };

  // ── WISHLIST ──
  const toggleWishlist = async (propertyId) => {
    if (!user) {
      alert("Please login to save properties!");
      return;
    }
    try {
      if (wishlist.includes(propertyId)) {
        await API.delete(`/wishlist/${propertyId}`);
        setWishlist(prev => prev.filter(id => id !== propertyId));
      } else {
        await API.post(`/wishlist/${propertyId}`);
        setWishlist(prev => [...prev, propertyId]);
      }
    } catch (err) {
      alert("Failed to update wishlist!");
    }
  };

  // ── COMPARE ──
  const toggleCompare = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev;
      const next = [...prev, id];
      setShowCompareBar(next.length >= 2);
      return next;
    });
  };

  // ── SORT ──
  const filtered = [...properties].sort((a, b) => {
    if (sortKey === "price_asc")  return a.price - b.price;
    if (sortKey === "price_desc") return b.price - a.price;
    if (sortKey === "area_desc")  return b.area - a.area;
    return 0;
  });

  

  return (
    <div className="ls-root">

      {/* ── NAVBAR ── */}
      <nav className="ls-nav">
        <a href="/" className="ls-logo">RentSpace</a>
        <div className="ls-nav-links">
          <a href="/">Home</a>
          <a href="/listings" className="active">Rentals</a>
          <a href="/login">Login</a>
          <a href="/register" className="ls-nav-register">Register</a>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="ls-header">
        <div className="ls-header-inner">
          <p className="ls-header-tag">Coimbatore Rentals</p>
          <h1 className="ls-header-h1">Find Your <em>Space</em></h1>
          <p className="ls-header-sub">{filtered.length} properties found</p>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="ls-search-section">
        <div className="ls-search-bar">

          {/* LOCATION INPUT WITH AUTOCOMPLETE */}
          <div className="ls-search-loc" ref={suggestRef}>
            <FaMapMarkerAlt className="ls-search-icon" />
            <input
              type="text"
              placeholder="Search location in Coimbatore…"
              value={locationInput}
              onChange={e => {
                setLocationInput(e.target.value);
                setSelectedLocation("");
              }}
              onFocus={() => locationInput && setShowSuggestions(true)}
            />
            {locationInput && (
              <button className="ls-clear-btn" onClick={() => {
                setLocationInput("");
                setSelectedLocation("");
                setSuggestions([]);
              }}>
                <FaTimes />
              </button>
            )}

            {/* SUGGESTIONS DROPDOWN */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="ls-suggestions">
                {suggestions.map(s => (
                  <div
                    key={s}
                    className="ls-suggestion-item"
                    onMouseDown={() => pickLocation(s)}
                  >
                    <FaMapMarkerAlt className="ls-sug-icon" />
                    <span>
                      {s.split(new RegExp(`(${locationInput})`, "i")).map((part, i) =>
                        part.toLowerCase() === locationInput.toLowerCase()
                          ? <mark key={i}>{part}</mark>
                          : part
                      )}
                    </span>
                    <span className="ls-sug-city">Coimbatore</span>
                  </div>
                ))}
              </div>
            )}

            {showSuggestions && locationInput && suggestions.length === 0 && (
              <div className="ls-suggestions">
                <div className="ls-sug-empty">No locations found</div>
              </div>
            )}
          </div>

          {/* TYPE SELECT */}
          <select
            className="ls-search-select"
            value={activeType}
            onChange={e => setActiveType(e.target.value)}
          >
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>

          {/* BUDGET SELECT */}
          <select
            className="ls-search-select"
            value={activeBudget}
            onChange={e => setActiveBudget(Number(e.target.value))}
          >
            {BUDGET_RANGES.map((b, i) => (
              <option key={b.label} value={i}>{b.label}</option>
            ))}
          </select>

          <button className="ls-search-btn">
            <FaSearch /> Search
          </button>
        </div>
      </div>

      <div className="ls-body">

        {/* ── SIDEBAR ── */}
        <aside className={`ls-sidebar ${showFilterMobile ? "open" : ""}`}>
          <div className="ls-sidebar-header">
            <h3>Filters</h3>
            <button className="ls-sidebar-close" onClick={() => setShowFilterMobile(false)}>
              <FaTimes />
            </button>
          </div>

          {/* PROPERTY TYPE */}
          <div className="ls-filter-group">
            <p className="ls-filter-label">Property Type</p>
            <div className="ls-filter-types">
              {TYPES.map(t => (
                <button
                  key={t}
                  className={`ls-type-btn ${activeType === t ? "active" : ""}`}
                  onClick={() => setActiveType(t)}
                >
                  {t !== "All" && TYPE_ICONS[t]}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* BUDGET */}
          <div className="ls-filter-group">
            <p className="ls-filter-label">Budget</p>
            <div className="ls-filter-budget">
              {BUDGET_RANGES.map((b, i) => (
                <button
                  key={b.label}
                  className={`ls-budget-btn ${activeBudget === i ? "active" : ""}`}
                  onClick={() => setActiveBudget(i)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* POPULAR LOCATIONS */}
          <div className="ls-filter-group">
            <p className="ls-filter-label">Popular Areas</p>
            <div className="ls-popular-locs">
              {["Peelamedu","Gandhipuram","RS Puram","Saravanampatti","Singanallur","Hopes College"].map(loc => (
                <button
                  key={loc}
                  className={`ls-loc-pill ${selectedLocation === loc ? "active" : ""}`}
                  onClick={() => {
                    setSelectedLocation(loc === selectedLocation ? "" : loc);
                    setLocationInput(loc === selectedLocation ? "" : loc);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* CLEAR FILTERS */}
          <button className="ls-clear-filters" onClick={() => {
            setActiveType("All");
            setActiveBudget(0);
            setSelectedLocation("");
            setLocationInput("");
          }}>
            Clear All Filters
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="ls-main">

          {/* TOOLBAR */}
          <div className="ls-toolbar">
            <p className="ls-results-count">
              <strong>{filtered.length}</strong> properties found
              {selectedLocation && <span> in <em>{selectedLocation}</em></span>}
            </p>

            <div className="ls-toolbar-right">
              {/* MOBILE FILTER BUTTON */}
              <button className="ls-mobile-filter-btn" onClick={() => setShowFilterMobile(true)}>
                <FaSlidersH /> Filters
              </button>

              {/* SORT DROPDOWN */}
              <div className="ls-sort-wrap" ref={sortRef}>
                <button className="ls-sort-btn" onClick={() => setShowSort(s => !s)}>
                  <FaSortAmountDown />
                  {SORT_OPTIONS.find(s => s.key === sortKey)?.label}
                  <FaChevronDown className={`ls-chevron ${showSort ? "open" : ""}`} />
                </button>
                {showSort && (
                  <div className="ls-sort-dropdown">
                    {SORT_OPTIONS.map(s => (
                      <button
                        key={s.key}
                        className={`ls-sort-option ${sortKey === s.key ? "active" : ""}`}
                        onClick={() => { setSortKey(s.key); setShowSort(false); }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {loading && (
  <div className="ls-loading">
    Loading properties...
  </div>
)}

{error && (
  <div className="ls-error">
    {error}
  </div>
)}

          {/* PROPERTY GRID */}
          {filtered.length === 0 ? (
            <div className="ls-empty">
              <p>🏠</p>
              <h3>No properties found</h3>
              <p>Try changing your filters or location</p>
            </div>
          ) : (
            <div className="ls-grid">
              {filtered.map(p => (
                <div className="ls-card" key={p._id}>
                 <div onClick={() => navigate(`/property/${p._id}`)} style={{cursor: "pointer"}}>
                  {/* IMAGE */}
                  <div className="ls-card-img-wrap">
                    <img src={p.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"} alt={p.title} />

                    <div className="ls-card-badge">{p.badge}</div>
                    <div className="ls-card-type">{TYPE_ICONS[p.type]} {p.type}</div>

                    {/* WISHLIST */}
                    <button
                      className={`ls-wishlist-btn ${wishlist.includes(p._id) ? "active" : ""}`}
                      onClick={() => toggleWishlist(p._id)}
                      title="Save to wishlist"
                    >
                      {wishlist.includes(p._id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>

                  {/* INFO */}
                  <div className="ls-card-info">
                    <h4 className="ls-card-title">{p.title}</h4>
                    <p className="ls-card-loc">
                      <FaMapMarkerAlt /> {p.location}, Coimbatore
                    </p>

                    {/* META */}
                    <div className="ls-card-meta">
                      {p.beds !== null && <span><FaBed /> {p.beds} Bed{p.beds > 1 ? "s" : ""}</span>}
                      <span><FaBath /> {p.baths} Bath{p.baths > 1 ? "s" : ""}</span>
                      <span>📐 {p.area} sq.ft</span>
                    </div>

                    {/* AMENITIES */}
                    <div className="ls-amenities">
                      {p.amenities.slice(0, 3).map(a => (
                        <span key={a} className="ls-amenity-tag">{a}</span>
                      ))}
                      {p.amenities.length > 3 && (
                        <span className="ls-amenity-more">+{p.amenities.length - 3}</span>
                      )}
                    </div>

                    {/* PRICE + ACTIONS */}
                    <div className="ls-card-footer">
                      <p className="ls-card-price">₹{p.price.toLocaleString()}<span>/mo</span></p>
                      <div className="ls-card-actions">
                        <button
                          className={`ls-compare-btn ${compareList.includes(p._id) ? "active" : ""}`}
                          onClick={() => toggleCompare(p._id)}
                          title="Compare"
                          disabled={!compareList.includes(p._id) && compareList.length >= 3}
                        >
                          <FaBalanceScale />
                        </button>
                        <div onClick={() => navigate(`/property/${p._id}`)} className="ls-view-btn">
                            View <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── COMPARE BAR ── */}
      {showCompareBar && (
        <div className="ls-compare-bar">
          <div className="ls-compare-bar-inner">
            <div className="ls-compare-items">
              {compareList.map(id => {
                const p = properties.find(x => x._id === id);
                return (
                  <div key={id} className="ls-compare-chip">
                  <img src={p.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"} alt={p.title} />
                    <span>{p.title}</span>
                    <button onClick={() => {
                      setCompareList(prev => {
                        const next = prev.filter(i => i !== id);
                        setShowCompareBar(next.length >= 2);
                        return next;
                      });
                    }}><FaTimes /></button>
                  </div>
                );
              })}
              {compareList.length < 3 && (
                <div className="ls-compare-chip empty">
                  + Add one more
                </div>
              )}
            </div>
            <a
              href={`/compare?ids=${compareList.join(",")}`}
              className="ls-compare-go-btn"
            >
              Compare Now <FaArrowRight />
            </a>
          </div>
        </div>
      )}

    </div>
  );
}