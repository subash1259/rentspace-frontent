import React, { useState, useRef, useEffect } from "react";
import "../css/chat.css";
import {
  FaSearch, FaPaperPlane, FaMapMarkerAlt,
  FaCircle, FaArrowLeft, FaSmile, FaPaperclip,
  FaBed, FaBath, FaExternalLinkAlt, FaTimes,
  FaCheckDouble, FaCheck, FaCalendarAlt,
  FaRulerCombined, FaPhoneAlt
} from "react-icons/fa";

/* ─── MOCK CONVERSATIONS ─── */
const CONVERSATIONS = [
  {
    id: 1,
    userName: "Rajesh Kumar",
    userRole: "Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    online: true,
    lastMsg: "Yes, the apartment is available from April 1st!",
    time: "10:32 AM",
    unread: 2,
    property: {
      id: 9,
      title: "3BHK Luxury Apartment",
      location: "Saravanampatti",
      price: 20000,
      deposit: 60000,
      beds: 3,
      baths: 2,
      area: 1350,
      available: "Apr 1, 2026",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"
    },
    messages: [
      { id:1, from:"user",  text:"Hi! Is the 3BHK apartment still available?",              time:"10:20 AM", read:true  },
      { id:2, from:"owner", text:"Hello! Yes it is available. When would you like to visit?",time:"10:22 AM", read:true  },
      { id:3, from:"user",  text:"I'm thinking this weekend. Saturday afternoon?",           time:"10:25 AM", read:true  },
      { id:4, from:"owner", text:"Saturday works perfectly. Around 3 PM?",                   time:"10:28 AM", read:true  },
      { id:5, from:"user",  text:"That's great! What documents do I need to bring?",         time:"10:30 AM", read:true  },
      { id:6, from:"owner", text:"Yes, the apartment is available from April 1st!",          time:"10:32 AM", read:false },
    ]
  },
  {
    id: 2,
    userName: "Priya Raman",
    userRole: "Owner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    online: false,
    lastMsg: "The deposit is 2 months rent.",
    time: "Yesterday",
    unread: 0,
    property: {
      id: 4,
      title: "Women's PG with Meals",
      location: "RS Puram",
      price: 8500,
      deposit: 17000,
      beds: 1,
      baths: 1,
      area: 220,
      available: "Mar 20, 2026",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80"
    },
    messages: [
      { id:1, from:"user",  text:"Hello! Is the PG available?",           time:"Yesterday", read:true },
      { id:2, from:"owner", text:"Yes! We have 2 rooms available.",        time:"Yesterday", read:true },
      { id:3, from:"user",  text:"What is the security deposit?",          time:"Yesterday", read:true },
      { id:4, from:"owner", text:"The deposit is 2 months rent.",          time:"Yesterday", read:true },
    ]
  },
  {
    id: 3,
    userName: "Suresh Babu",
    userRole: "Owner",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&q=80",
    online: true,
    lastMsg: "Please come and visit anytime this week.",
    time: "Mar 19",
    unread: 1,
    property: {
      id: 1,
      title: "2BHK Independent House",
      location: "Peelamedu",
      price: 15000,
      deposit: 45000,
      beds: 2,
      baths: 1,
      area: 950,
      available: "Apr 10, 2026",
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80"
    },
    messages: [
      { id:1, from:"user",  text:"Hi, I saw your listing for the 2BHK house.",    time:"Mar 19", read:true  },
      { id:2, from:"owner", text:"Hello! Yes, what would you like to know?",       time:"Mar 19", read:true  },
      { id:3, from:"user",  text:"Is parking available?",                           time:"Mar 19", read:true  },
      { id:4, from:"owner", text:"Please come and visit anytime this week.",        time:"Mar 19", read:false },
    ]
  },
];

const EMOJIS = ["😊","👍","🙏","✅","🏠","💰","📅","🔑","❓","👋"];

const AUTO_REPLIES = [
  "Sure, I'll check and get back to you!",
  "Thanks for your message. Let me confirm.",
  "That sounds good! When are you available?",
  "Of course! Feel free to visit anytime.",
  "I'll send you the details shortly.",
];

export default function Chat() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeConv, setActiveConv]       = useState(CONVERSATIONS[0]);
  const [messages, setMessages]           = useState(CONVERSATIONS[0].messages);
  const [inputText, setInputText]         = useState("");
  const [searchQuery, setSearchQuery]     = useState("");
  const [showEmoji, setShowEmoji]         = useState(false);
  const [mobileView, setMobileView]       = useState("list");

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  const selectConv = (conv) => {
    setActiveConv(conv);
    setMessages(conv.messages);
    setMobileView("chat");
    setConversations(prev =>
      prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c)
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: "user",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev =>
      prev.map(c => c.id === activeConv.id ? { ...c, lastMsg: inputText.trim(), time:"Now" } : c)
    );
    setInputText("");
    setShowEmoji(false);
    inputRef.current?.focus();

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: "owner",
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
        read: false,
      }]);
    }, 1500);
  };

  const pickEmoji = (e) => {
    setInputText(prev => prev + e);
    inputRef.current?.focus();
  };

  const filteredConvs = conversations.filter(c =>
    c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.property.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const p = activeConv?.property;

  return (
    <div className="ch-root">
      <div className="ch-body">

        {/* ── LEFT: CONVERSATION LIST ── */}
        <div className={`ch-sidebar ${mobileView === "chat" ? "ch-hide-mobile" : ""}`}>

          <div className="ch-sidebar-header">
            <div className="ch-sidebar-title">
              <a href="/" className="ch-logo">RentSpace</a>
              <h2>Chats</h2>
              {conversations.reduce((s,c)=>s+c.unread,0) > 0 && (
                <span className="ch-total-unread">
                  {conversations.reduce((s,c)=>s+c.unread,0)}
                </span>
              )}
            </div>
            <div className="ch-search-wrap">
              <FaSearch className="ch-search-icon" />
              <input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="ch-search-clear" onClick={() => setSearchQuery("")}>
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className="ch-conv-list">
            {filteredConvs.map(conv => (
              <div
                key={conv.id}
                className={`ch-conv-item ${activeConv?.id === conv.id ? "active" : ""}`}
                onClick={() => selectConv(conv)}
              >
                {/* PROPERTY THUMBNAIL */}
                <div className="ch-conv-prop-img">
                  <img src={conv.property.image} alt={conv.property.title} />
                </div>

                <div className="ch-conv-info">
                  <div className="ch-conv-top">
                    <div className="ch-conv-name-wrap">
                      <div className="ch-owner-avatar">
                        <img src={conv.avatar} alt={conv.userName} />
                        {conv.online && <span className="ch-online-dot" />}
                      </div>
                      <span className="ch-conv-name">{conv.userName}</span>
                    </div>
                    <span className="ch-conv-time">{conv.time}</span>
                  </div>
                  <p className="ch-conv-prop-title">{conv.property.title}</p>
                  <div className="ch-conv-price-row">
                    <span className="ch-conv-price">₹{conv.property.price.toLocaleString()}/mo</span>
                    {conv.unread > 0 && (
                      <span className="ch-unread-badge">{conv.unread}</span>
                    )}
                  </div>
                  <p className="ch-conv-last">{conv.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: CHAT AREA ── */}
        <div className={`ch-chat-area ${mobileView === "list" ? "ch-hide-mobile" : ""}`}>

          {activeConv ? (
            <>
              {/* ── PROPERTY INFO CARD (top) ── */}
              <div className="ch-prop-card">
                <button className="ch-back-btn" onClick={() => setMobileView("list")}>
                  <FaArrowLeft />
                </button>

                <div className="ch-prop-img-wrap">
                  <img src={p.image} alt={p.title} />
                </div>

                <div className="ch-prop-details">
                  <div className="ch-prop-top">
                    <div>
                      <h3 className="ch-prop-title">{p.title}</h3>
                      <p className="ch-prop-loc"><FaMapMarkerAlt /> {p.location}, Coimbatore</p>
                    </div>
                    <div className="ch-prop-price-wrap">
                      <p className="ch-prop-price">₹{p.price.toLocaleString()}<span>/mo</span></p>
                      <p className="ch-prop-deposit">Deposit: ₹{p.deposit.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="ch-prop-meta">
                    {p.beds && <span><FaBed /> {p.beds} Beds</span>}
                    <span><FaBath /> {p.baths} Baths</span>
                    <span><FaRulerCombined /> {p.area} sq.ft</span>
                    <span><FaCalendarAlt /> Available: {p.available}</span>
                  </div>

                  <div className="ch-prop-actions">
                    <a href={`/property/${p.id}`} className="ch-view-btn">
                      <FaExternalLinkAlt /> View Property
                    </a>
                    <a href="/booking" className="ch-book-btn">
                      <FaCalendarAlt /> Book Now
                    </a>
                    <a href={`tel:${activeConv.phone}`} className="ch-call-btn">
                      <FaPhoneAlt /> Call Owner
                    </a>
                  </div>
                </div>

                {/* OWNER INFO */}
                <div className="ch-owner-info">
                  <div className="ch-owner-avatar-lg">
                    <img src={activeConv.avatar} alt={activeConv.userName} />
                    {activeConv.online && <span className="ch-online-dot-lg" />}
                  </div>
                  <div>
                    <p className="ch-owner-name">{activeConv.userName}</p>
                    <p className={activeConv.online ? "ch-owner-online" : "ch-owner-offline"}>
                      <FaCircle /> {activeConv.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── CHAT MESSAGES ── */}
              <div className="ch-messages-wrap">
                <div className="ch-messages">
                  <div className="ch-date-sep"><span>Today</span></div>

                  {messages.map((msg, idx) => {
                    const isUser = msg.from === "user";
                    const showAvatar = !isUser &&
                      (idx === 0 || messages[idx-1].from !== "owner");
                    return (
                      <div
                        key={msg.id}
                        className={`ch-msg-row ${isUser ? "ch-msg-user" : "ch-msg-owner"}`}
                      >
                        {!isUser && (
                          <div className="ch-msg-avatar">
                            {showAvatar
                              ? <img src={activeConv.avatar} alt={activeConv.userName} />
                              : <div className="ch-avatar-spacer" />
                            }
                          </div>
                        )}
                        <div className={`ch-bubble ${isUser ? "ch-bubble-user" : "ch-bubble-owner"}`}>
                          <p>{msg.text}</p>
                          <div className="ch-bubble-meta">
                            <span>{msg.time}</span>
                            {isUser && (
                              msg.read
                                ? <FaCheckDouble className="ch-read-icon read" />
                                : <FaCheck className="ch-read-icon" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* ── EMOJI PICKER ── */}
              {showEmoji && (
                <div className="ch-emoji-picker">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => pickEmoji(e)}>{e}</button>
                  ))}
                </div>
              )}

              {/* ── INPUT BAR ── */}
              <form className="ch-input-bar" onSubmit={sendMessage}>
                <button
                  type="button"
                  className={`ch-input-action ${showEmoji ? "active" : ""}`}
                  onClick={() => setShowEmoji(s => !s)}
                >
                  <FaSmile />
                </button>
                <button type="button" className="ch-input-action">
                  <FaPaperclip />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Message ${activeConv.userName}...`}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
                <button
                  type="submit"
                  className={`ch-send-btn ${inputText.trim() ? "active" : ""}`}
                  disabled={!inputText.trim()}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </>
          ) : (
            <div className="ch-empty">
              <h3>Select a conversation</h3>
              <p>Choose a chat from the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}