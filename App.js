import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ================= LANDING PAGE COMPONENT =================
const LandingPage = ({ onLogin }) => {
  return (
    <div className="landing-page">
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <nav className="landing-nav">
        <div className="brand">
          Cyber<span>Guard</span>
        </div>
        <div className="nav-actions">
          <a href="#contact" className="btn-nav contact">
            Contact Us
          </a>
          <button onClick={onLogin} className="btn-nav login">
            Login
          </button>
        </div>
      </nav>

      <header className="hero-section">
        <h1 className="hero-title">
          Next-Gen Domain
          <br />Monitoring System
        </h1>
        <p className="hero-subtitle">
          Track, analyze, and secure your web infrastructure in real-time.
          Real-time website and system monitoring, plus domain tracking.
        </p>
        <div className="cta-group">
          <button onClick={onLogin} className="btn-large btn-primary-large">
            Get Started
          </button>
        </div>
      </header>

      <section className="features-section">
        <div className="section-header">
          <h2>System Capabilities</h2>
          <p>Everything you need to manage your digital presence.</p>
        </div>
        <div className="cards-grid">
          <div className="feature-card">
            <div className="card-icon">📡</div>
            <h3>Real-time Tracking</h3>
            <p>
              Instant updates on domain status, DNS propagation, and uptime
              metrics.
            </p>
          </div>
          <div className="feature-card">
            <div className="card-icon">⚠️</div>
            <h3>Threat & Anomaly Detection</h3>
            <p>
              Identify potential security threats and system anomalies instantly
              to keep your infrastructure safe.
            </p>
          </div>
          <div className="feature-card">
            <div className="card-icon">📊</div>
            <h3>Detailed Analytics</h3>
            <p>
              Visual reports on latency, traffic spikes, and historical
              performance data.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2>Contact Our Developers</h2>
          <p>Get support from our expert engineering team.</p>
        </div>
        <div className="team-grid">
          <div className="team-card">
            <div className="avatar">HC</div>
            <div className="dev-name">Henon Chare</div>
            <div className="dev-role">Lead Developer</div>
            <a href="tel:+251982049520" className="phone-link">
              📞 +251 98 204 9520
            </a>
          </div>
          <div className="team-card">
            <div className="avatar">BT</div>
            <div className="dev-name">Biniyam Temesgen</div>
            <div className="dev-role">Backend Engineer</div>
            <a href="tel:+251985957185" className="phone-link">
              📞 +251 98 595 7185
            </a>
          </div>
          <div className="team-card">
            <div className="avatar">MK</div>
            <div className="dev-name">Mikiyas Kindie</div>
            <div className="dev-role">Frontend Specialist</div>
            <a href="tel:+251948010770" className="phone-link">
              📞 +251 94 801 0770
            </a>
          </div>
          <div className="team-card">
            <div className="avatar">AM</div>
            <div className="dev-name">Abinet Melkamu</div>
            <div className="dev-role">System Architect</div>
            <a href="tel:+251923248825" className="phone-link">
              📞 +251 92 324 8825
            </a>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        &copy; 2026 Domain Monitoring System. All rights reserved.
      </footer>
    </div>
  );
};

// ================= SPARKLINE COMPONENT =================
const Sparkline = ({ history, width = 200, height = 40 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    
    if (!history || history.length < 2) return;

    const minVal = Math.min(...history);
    const maxVal = Math.max(...history, minVal + 50);
    const range = maxVal - minVal;
    const stepX = w / (history.length - 1);

    const currentVal = history[history.length - 1];
    const isBad = currentVal > 500 || currentVal === 0;
    const lineColor = isBad ? "#ef4444" : "#2f81f7";

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isBad ? "rgba(239, 68, 68, 0.4)" : "rgba(47, 129, 247, 0.4)");
    gradient.addColorStop(1, isBad ? "rgba(239, 68, 68, 0)" : "rgba(47, 129, 247, 0)");

    ctx.beginPath();
    history.forEach((val, i) => {
      const x = i * stepX;
      const normalizedY = (val - minVal) / (range || 1); 
      const y = h - (normalizedY * h);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

  }, [history, width, height]);

  return (
    <div className="chart-container">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        style={{ width: "100%", height: "100%", display: "block" }} 
      />
    </div>
  );
};

// ================= MAIN APP COMPONENT =================
function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [page, setPage] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    token: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Handle URL Token redirection
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/reset-password/")) {
      const tokenFromUrl = path.split("/")[2];
      if (tokenFromUrl) {
        setFormData(prev => ({ ...prev, token: tokenFromUrl }));
        setPage("reset");
        setShowLanding(false);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (page === "register" || page === "reset") {
      if (formData.password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
    }
    let url = "";
    let body = {};
    if (page === "login") {
      url = "http://localhost:8000/login";
      body = { username: formData.username, password: formData.password };
    } else if (page === "register") {
      url = "http://localhost:8000/register";
      body = { username: formData.username, email: formData.email, password: formData.password };
    } else if (page === "forgot") {
      url = "http://localhost:8000/forgot-password";
      body = { email: formData.email };
    } else if (page === "reset") {
      url = "http://localhost:8000/reset-password";
      body = { token: formData.token, new_password: formData.password, username: formData.username };
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        if (page === "login") {
          setUserLoggedIn(true);
          setSelectedCard(null);
        } else if (page === "register") {
          setTimeout(() => { setPage("login"); setMessage("Registration successful! Please login."); }, 1500);
        } else if (page === "reset") {
          setTimeout(() => { setPage("login"); setMessage("Password reset successful! Please login."); }, 2000);
        }
      } else {
        setMessage(data.detail || "Error occurred");
      }
    } catch (err) {
      setMessage("Server not reachable");
    }
  };

  // ================= HOME DASHBOARD =================
  const HomePage = () => {
    if (selectedCard === "monitoring") {
      return <MonitoringComponent onBack={() => setSelectedCard(null)} />;
    }
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>CyberGuard</h1>
          <button className="logout-btn" onClick={() => { setUserLoggedIn(false); setShowLanding(true); }}>Logout</button>
        </header>
        <section className="hero">
          <h2>Security Operations Center</h2>
          <p>Monitor • Detect • Protect • Respond</p>
        </section>
        <section className="cards">
          <div className="card" onClick={() => setSelectedCard("monitoring")}>
            <span className="icon">🌐</span>
            <h3>Website Monitoring</h3>
            <p>Track uptime, response time, and anomalies in real time.</p>
          </div>
          <div className="card">
            <span className="icon">🔍</span>
            <h3>Domain Tracking</h3>
            <p>Monitor domain status, DNS changes, and expiration risks.</p>
          </div>
          <div className="card">
            <span className="icon">🛡️</span>
            <h3>Threat Detection</h3>
            <p>Identify vulnerabilities and suspicious activities.</p>
          </div>
          <div className="card">
            <span className="icon">🚨</span>
            <h3>Alert Dashboard</h3>
            <p>Instant alerts for critical security events.</p>
          </div>
        </section>
      </div>
    );
  };

  // ================= UPTIMEROBOT-STYLE MONITORING COMPONENT =================
  const MonitoringComponent = ({ onBack }) => {
    const [url, setUrl] = useState("");
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [activeTab, setActiveTab] = useState("monitoring");
    
    // NEW: Search & Filter Functionality
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // all, up, down
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // NEW: Status Pages Functionality
    const [customPages, setCustomPages] = useState([]);

    const [data, setData] = useState({
      targets: [],
      current_latencies: {},
      baseline_avgs: {},
      status_messages: {},
      histories: {},
      timestamps: {},
    });

    // --- Polling Logic ---
    useEffect(() => {
      let interval;
      if (isMonitoring) {
        interval = setInterval(async () => {
          try {
            const response = await fetch("http://localhost:8000/status");
            const jsonData = await response.json();
            setData(jsonData);
          } catch (error) {
            console.error("Backend connection lost", error);
          }
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isMonitoring]);

    // --- Backend Interaction ---
    const handleStart = async () => {
      if (!url || !url.startsWith("http")) {
        alert("Please enter a valid URL starting with http/https");
        return;
      }
      const payload = { url: url.trim() };
      try {
        const response = await fetch("http://localhost:8000/start", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ detail: "No details" }));
          throw new Error(`Backend rejected request (${response.status}): ${errorBody.detail || "Validation error"}`);
        }
        await response.json();
        setIsMonitoring(true);
      } catch (err) {
        console.error(err);
        alert("Start failed:\n" + (err.message || "Unknown error"));
      }
    };

    const handleStop = async () => {
      try {
        const res = await fetch("http://localhost:8000/stop", { method: "POST" });
        if (!res.ok) throw new Error(res.statusText);
        setIsMonitoring(false);
      } catch (error) {
        console.error(error);
        alert("Failed to stop: " + error.message);
      }
    };

    // --- Helpers for Stats Panel ---
    const upCount = data.targets.filter(t => data.status_messages[t] === "Operational").length;
    const downCount = data.targets.length - upCount;
    const overallUptime = data.targets.length > 0 ? ((upCount / data.targets.length) * 100).toFixed(2) : 0;

    // --- Filter Logic ---
    const getFilteredTargets = () => {
      return data.targets.filter((target) => {
        // 1. Search Logic
        const matchesSearch = target.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. Filter Logic
        const status = data.status_messages[target] || "";
        const isDown = status.includes("CRITICAL") || status.includes("ERROR") || status.includes("TIMEOUT") || status.includes("REFUSED");
        
        let matchesFilter = true;
        if (filterStatus === "up") matchesFilter = !isDown;
        if (filterStatus === "down") matchesFilter = isDown;

        return matchesSearch && matchesFilter;
      });
    };

    // --- Render Content Based on Tab ---
    const renderContent = () => {
      if (activeTab === "monitoring") {
        const displayTargets = getFilteredTargets();
        return (
          <div className="up-monitors-list">
            {displayTargets.length === 0 ? (
              <div className="up-empty-state">
                <p>No monitors found matching your criteria.</p>
              </div>
            ) : (
              displayTargets.map((target) => {
                const latency = data.current_latencies[target] || 0;
                const status = data.status_messages[target] || "Idle";
                const isDown = status.includes("CRITICAL") || status.includes("ERROR") || status.includes("TIMEOUT") || status.includes("REFUSED");
                const history = data.histories[target] || [];

                return (
                  <div key={target} className={`up-monitor-row ${isDown ? "down" : "up"}`}>
                    <div className="up-status-icon">
                      <div className={`indicator ${isDown ? "red" : "green"}`}></div>
                    </div>
                    <div className="up-monitor-info">
                      <div className="up-url">{target.replace(/^https?:\/\//, '')}</div>
                      <div className="up-type">HTTP</div>
                    </div>
                    <div className="up-monitor-uptime">
                      <span className={isDown ? "text-red" : "text-green"}>
                        {isDown ? status : "Up"}
                      </span>
                      <span className="time-ago">Just now</span>
                    </div>
                    <div className="up-monitor-chart">
                      <Sparkline history={history} width={200} height={40} />
                    </div>
                    <div className="up-monitor-latency">
                      <span className={`badge ${latency > 500 ? "bad" : "good"}`}>
                        {latency.toFixed(0)} ms
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );
      } else if (activeTab === "incidents") {
        const incidents = data.targets.filter(t => {
          const s = data.status_messages[t] || "Idle";
          return s.includes("CRITICAL") || s.includes("ERROR") || s.includes("TIMEOUT") || s.includes("REFUSED");
        });

        return (
          <div className="up-monitors-list">
            {incidents.length === 0 ? (
              <div className="up-empty-state" style={{borderColor: "var(--status-green)"}}>
                <p>Great! No incidents detected.</p>
              </div>
            ) : (
              <>
                <div className="up-widget" style={{marginBottom: "20px", borderLeft: "4px solid var(--status-red)"}}>
                  <h4 style={{color: "white", marginBottom: "5px"}}>Active Incidents</h4>
                  <p style={{fontSize: "0.9rem", color: "var(--text-muted)"}}>
                    {incidents.length} monitor(s) are currently reporting issues.
                  </p>
                </div>
                {incidents.map((target) => {
                  const status = data.status_messages[target];
                  return (
                    <div key={target} className="up-monitor-row down">
                      <div className="up-status-icon">
                        <div className="indicator red"></div>
                      </div>
                      <div className="up-monitor-info">
                        <div className="up-url">{target}</div>
                        <div className="up-type" style={{color: "var(--status-red)"}}>{status}</div>
                      </div>
                      <div className="up-monitor-uptime">
                        <span className="time-ago">Ongoing</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        );
      } else if (activeTab === "status_pages") {
        return (
          <div className="up-monitors-list">
             <div className="up-widget" style={{marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div>
                <h4 style={{margin: 0, fontSize: "1.2rem"}}>Status pages.</h4>
                <p style={{margin: "5px 0 0", color: "var(--text-muted)"}}>Publicly accessible status pages for your monitors.</p>
              </div>
              <button 
                className="up-btn-blue" 
                style={{width: "auto", padding: "8px 16px"}}
                onClick={() => {
                  const name = prompt("Enter Status Page Name:", "My Custom Status");
                  if(name) {
                    setCustomPages([...customPages, { name, date: new Date().toLocaleDateString() }]);
                  }
                }}
              >
                + Create Status page
              </button>
            </div>

            {/* Default Page */}
            <div className="up-monitor-row">
              <div className="up-monitor-info">
                <div className="up-url">Status page</div>
                <div className="up-type">All monitors</div>
              </div>
              <div className="up-monitor-uptime">
                <span style={{color: "white"}}>Public</span>
                <span className="time-ago">Published</span>
              </div>
              <div style={{display: "flex", gap: "10px"}}>
                 <button className="up-btn-blue" style={{width: "auto", padding: "6px 12px", background: "var(--bg-panel-hover)", border: "1px solid var(--border-color)"}}>Edit</button>
                 <button className="up-btn-blue" style={{width: "auto", padding: "6px 12px", background: "var(--bg-panel-hover)", border: "1px solid var(--border-color)"}}>Delete</button>
              </div>
            </div>

            {/* Custom Pages List */}
            {customPages.map((page, idx) => (
              <div key={idx} className="up-monitor-row">
                <div className="up-monitor-info">
                  <div className="up-url">{page.name}</div>
                  <div className="up-type">Custom</div>
                </div>
                <div className="up-monitor-uptime">
                  <span style={{color: "white"}}>Draft</span>
                  <span className="time-ago">{page.date}</span>
                </div>
                <div style={{display: "flex", gap: "10px"}}>
                   <button className="up-btn-blue" style={{width: "auto", padding: "6px 12px", background: "var(--bg-panel-hover)", border: "1px solid var(--border-color)"}}>Edit</button>
                   <button className="up-btn-red" style={{width: "auto", padding: "6px 12px", background: "var(--bg-panel-hover)", border: "1px solid var(--border-color)"}}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        );
      } else if (activeTab === "settings") {
        return (
          <div className="up-monitors-list">
            <div className="up-widget">
              <h4>Account Settings</h4>
              <div style={{display: "grid", gap: "15px"}}>
                <div>
                  <label style={{display: "block", color: "var(--text-muted)", marginBottom: "5px", fontSize: "0.85rem"}}>API Key</label>
                  <input type="text" value="ur123456789" readOnly style={{width: "100%", padding: "10px", background: "var(--bg-dark)", border: "1px solid var(--border-color)", color: "white", borderRadius: "4px"}} />
                </div>
                <div>
                  <label style={{display: "block", color: "var(--text-muted)", marginBottom: "5px", fontSize: "0.85rem"}}>Timezone</label>
                  <select style={{width: "100%", padding: "10px", background: "var(--bg-dark)", border: "1px solid var(--border-color)", color: "white", borderRadius: "4px"}}>
                    <option>UTC</option>
                    <option>GMT+3 (Addis Ababa)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="up-widget">
              <h4>Notifications</h4>
              <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px"}}>
                 <input type="checkbox" defaultChecked />
                 <span>Email Alerts</span>
              </div>
            </div>
          </div>
        );
      }
    };

    return (
      <div className="up-dashboard">
        
        {/* 1. LEFT SIDEBAR */}
        <aside className="up-sidebar">
          <div className="up-sidebar-header">
            <h2>ServerPulse</h2>
            <div className={`up-status-badge ${isMonitoring ? "live" : "idle"}`}>
              {isMonitoring ? "● System Active" : "○ System Idle"}
            </div>
          </div>

          <nav className="up-nav">
            <div 
              className={`nav-item ${activeTab === "monitoring" ? "active" : ""}`}
              onClick={() => setActiveTab("monitoring")}
            >
              Monitoring
            </div>
            <div 
              className={`nav-item ${activeTab === "incidents" ? "active" : ""}`}
              onClick={() => setActiveTab("incidents")}
            >
              Incidents
            </div>
            <div 
              className={`nav-item ${activeTab === "status_pages" ? "active" : ""}`}
              onClick={() => setActiveTab("status_pages")}
            >
              Status Pages
            </div>
            <div 
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </div>
          </nav>

          <div className="up-add-monitor">
            <label>Add New Monitor</label>
            <div className="up-input-group">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isMonitoring}
                placeholder="https://example.com"
              />
              {!isMonitoring ? (
                <button className="up-btn-blue" onClick={handleStart}>+ New</button>
              ) : (
                <button className="up-btn-red" onClick={handleStop}>Stop All</button>
              )}
            </div>
          </div>
        </aside>

        {/* 2. MAIN CONTENT (SWITCHES BASED ON TAB) */}
        <main className="up-main">
          <header className="up-header">
            <h3 style={{textTransform: "capitalize"}}>{activeTab.replace("_", " ")} ({data.targets.length})</h3>
            <div className="up-actions">
              {activeTab === "monitoring" && (
                <>
                  <input 
                    type="text" 
                    placeholder="Search monitors..." 
                    className="up-search" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div style={{ position: "relative" }}>
                    <button 
                      className="up-filter-btn" 
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      {filterStatus === "all" ? "Filter" : filterStatus} ▼
                    </button>
                    {/* Filter Dropdown Menu */}
                                        {/* Filter Dropdown Menu */}
                    {showFilterDropdown && (
                      <div style={{
                        position: "absolute", 
                        top: "100%", 
                        right: 0, 
                        marginTop: "5px", 
                        background: "var(--bg-panel)", 
                        border: "1px solid var(--border-color)", 
                        borderRadius: "6px", 
                        width: "120px", // Increased width slightly
                        boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
                        zIndex: 9999, // <--- CHANGED: Set to 9999 to ensure it sits on top
                        color: "var(--text-main)"
                      }}>
                        <div onClick={() => { setFilterStatus("all"); setShowFilterDropdown(false); }} style={{padding: "8px 12px", cursor: "pointer", color: filterStatus === "all" ? "var(--accent-blue)" : "var(--text-main)", fontSize: "0.9rem"}}>All</div>
                        <div onClick={() => { setFilterStatus("up"); setShowFilterDropdown(false); }} style={{padding: "8px 12px", cursor: "pointer", color: filterStatus === "up" ? "var(--accent-blue)" : "var(--text-main)", fontSize: "0.9rem"}}>Up</div>
                        <div onClick={() => { setFilterStatus("down"); setShowFilterDropdown(false); }} style={{padding: "8px 12px", cursor: "pointer", color: filterStatus === "down" ? "var(--accent-blue)" : "var(--text-main)", fontSize: "0.9rem"}}>Down</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Content Switcher */}
          {renderContent()}
        </main>

        {/* 3. RIGHT SIDEBAR (STATS) - Only visible on Monitoring Tab */}
        {activeTab === "monitoring" && (
          <aside className="up-right-panel">
            <div className="up-widget current-status">
              <h4>Current status</h4>
              <div className="status-grid">
                <div className="status-item">
                  <span className="label">Down</span>
                  <span className="val red">{downCount}</span>
                </div>
                <div className="status-item">
                  <span className="label">Up</span>
                  <span className="val green">{upCount}</span>
                </div>
                <div className="status-item">
                  <span className="label">Paused</span>
                  <span className="val gray">{0}</span>
                </div>
              </div>
              <div className="monitor-limit">Using {data.targets.length} of 50 monitors</div>
            </div>

            <div className="up-widget last-hours">
              <h4>Last 24 hours</h4>
              <div className="stat-row">
                <span className="lbl">Overall uptime</span>
                <span className="val">{data.targets.length > 0 ? overallUptime : 0}%</span>
              </div>
              <div className="stat-row">
                <span className="lbl">Incidents</span>
                <span className="val">{downCount}</span>
              </div>
              <div className="stat-row">
                <span className="lbl">Without incid.</span>
                <span className="val">--</span>
              </div>
              <div className="stat-row">
                <span className="lbl">Affected mon.</span>
                <span className="val">{downCount}</span>
              </div>
            </div>
            
            <div className="up-footer-nav">
              <button onClick={onBack} className="back-btn">← Back to Dashboard</button>
            </div>
          </aside>
        )}

      </div>
    );
  };

  // ================= MAIN RENDER =================
  if (showLanding) return <LandingPage onLogin={() => setShowLanding(false)} />;
  if (userLoggedIn) return <HomePage />;

  return (
    <div className="app-auth">
      <div className="container">
        <h1>CyberGuard</h1>
        <div style={{ marginBottom: "20px", color: "#94a3b8", cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowLanding(true)}>
          &larr; Back to Home
        </div>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit} className="form">
          {(page === "register" || page === "login") && (
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          )}
          {(page === "register" || page === "forgot") && (
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          )}
          {(page === "login" || page === "register" || page === "reset") && (
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} name="password" placeholder={page === "reset" ? "New Password" : "Password"} value={formData.password} onChange={handleChange} required />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)} role="button" tabIndex="0">{showPassword ? "🔐" : "🔓"}</span>
            </div>
          )}
          {(page === "register" || page === "reset") && (
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)} role="button" tabIndex="0">{showPassword ? "🔐" : "🔓"}</span>
            </div>
          )}
          {page === "reset" && (
            <>
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
              <input type="text" name="token" placeholder="Reset Token (Check Email)" value={formData.token} onChange={handleChange} required />
            </>
          )}
          <button type="submit">{page === "login" && "Login"}{page === "register" && "Register"}{page === "forgot" && "Send Reset Email"}{page === "reset" && "Reset Password"}</button>
        </form>
        <div className="links">
          {page !== "login" && <p onClick={() => { setPage("login"); setMessage(""); setConfirmPassword(""); }}>Login</p>}
          {page !== "register" && <p onClick={() => { setPage("register"); setMessage(""); setConfirmPassword(""); }}>Register</p>}
          {page !== "forgot" && <p onClick={() => { setPage("forgot"); setMessage(""); setConfirmPassword(""); }}>Forgot Password</p>}
          {page !== "reset" && page === "forgot" && <p onClick={() => { setPage("reset"); setMessage(""); setConfirmPassword(""); }}>Reset Password</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
