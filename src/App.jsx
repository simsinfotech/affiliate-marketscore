import { useState, useEffect, useRef } from "react";
import "./App.css";

// Scroll reveal hook — animates every time element enters/exits viewport
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible");
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

// type: "up" | "left" | "right" | "scale" | "fade"
// delay: stagger index (adds reveal-stagger-N class)
function Reveal({ children, className = "", type = "up", delay = 0 }) {
  const ref = useReveal(0.1);
  const baseClass =
    type === "left" ? "reveal-left" :
    type === "right" ? "reveal-right" :
    type === "scale" ? "reveal-scale" :
    type === "fade" ? "reveal-fade" :
    "reveal";
  const stagger = delay > 0 ? ` reveal-stagger-${delay}` : "";
  return (
    <div ref={ref} className={`${baseClass}${stagger} ${className}`}>
      {children}
    </div>
  );
}

// ===== DATA =====
const segments = [
  {
    id: "ib",
    label: "Existing IBs",
    icon: "/contactless.png",
    isImage: true,
    hook: "Already earning rebates?",
    subhead: "Earn more. Lose fewer clients.",
    problem:
      "You're sending clients to brokers with a referral link and hoping they keep trading. No app. No engagement. No retention. When they stop trading, your income stops.",
    solution:
      "MarketScore gives your clients a reason to trade every day. Signals, AI analysis, community, gamification \u2014 all under your branding. Your IB code is embedded. Every lot they trade, you earn. But now they trade MORE because the app gives them reasons to.",
    numbers: [
      { label: "Avg increase in client trading volume", value: "3x" },
      { label: "Client retention (vs raw IB link)", value: "85%" },
      { label: "Your rebate per lot (Elite tier)", value: "$10" },
    ],
  },
  {
    id: "signal",
    label: "Signal Providers",
    icon: "/analytical-skill.png",
    isImage: true,
    hook: "Still posting signals on Telegram?",
    subhead: "Your signals deserve better than screenshots.",
    problem:
      "You post signals. Users screenshot them. They share with friends who never paid you. After month 1, they leave. You earned \u20B9999 and they traded \u20B910 lakhs in volume. The broker made more from YOUR signal than you did.",
    solution:
      "MarketScore gives you a branded channel inside a real app. Your signals, your community, your AI assistant. Screenshots are blocked. Users can't leave without losing their streak, badges, and rank. And every trade they place earns you $5\u201310 per lot. Passive. Recurring. Forever.",
    numbers: [
      { label: "Per lot income (vs \u20B90 on Telegram)", value: "$5-10" },
      { label: "Screenshot protection", value: "100%" },
      { label: "User lock-in rate", value: "92%" },
    ],
  },
  {
    id: "creator",
    label: "YT/IG Creators",
    icon: "/youtube.png",
    isImage: true,
    hook: "Big audience, small monetization?",
    subhead: "Turn followers into recurring revenue.",
    problem:
      "You have 50K followers watching your analysis. You monetize through ads, sponsorships, and maybe a paid group. But 90% of your audience trades based on your content and you earn nothing from those trades. Your content is the product. The broker is the one getting paid.",
    solution:
      "MarketScore turns your audience into Alpha Provider income. Share your link, followers join your channel, they get your signals + AI tools for free, they connect a broker, and every trade they place earns you per lot. At 500 active users trading 1 lot/day, that\u2019s $2,500\u20135,000/day.",
    numbers: [
      { label: "Follower to user conversion", value: "8-15%" },
      { label: "Revenue per 1K active users/month", value: "$300K+" },
      { label: "Content you need to create extra", value: "Zero" },
    ],
  },
  {
    id: "educator",
    label: "Trading Educators",
    icon: "/graduate.png",
    isImage: true,
    hook: "Selling courses? That\u2019s one-time revenue.",
    subhead: "Your students trade forever. Earn forever.",
    problem:
      "You sell a course for \u20B95,000\u201350,000. Student pays once. They learn to trade. They trade for years. You earned once. The broker earns every single day from the student YOU trained. Your course taught them, the broker profits from them.",
    solution:
      "MarketScore adds a recurring income layer to your education business. After your course, students join your Alpha Provider channel. They get ongoing signals, AI analysis, community support. Every trade they place for the rest of their trading career earns you per lot. Your course becomes the acquisition channel. MarketScore becomes the lifetime revenue.",
    numbers: [
      { label: "Student lifetime value increase", value: "50x" },
      { label: "Monthly passive income per 100 students", value: "$20K+" },
      { label: "Additional work required", value: "Minimal" },
    ],
  },
];

const tiers = [
  {
    name: "BASIC",
    range: "0\u201399 users",
    color: "var(--text-sec)",
    rebate: "$7/lot",
    brokers: "1 broker",
    brand: "MarketScore branding",
    badge: "Small profile card",
  },
  {
    name: "PRO",
    range: "100\u2013399 users",
    color: "var(--blue)",
    rebate: "$10/lot",
    brokers: "3 broker options",
    brand: 'Custom branded badge',
    badge: "Featured channel",
    popular: true,
  },
  {
    name: "ELITE",
    range: "400+ users",
    color: "var(--gold)",
    rebate: "$12*/lot",
    rebateJsx: true,
    brokers: "Any broker",
    brand: "Full white-label",
    badge: "Your logo, your colors",
  },
];

const revenueStreams = [
  {
    icon: "/money.png",
    isImage: true,
    title: "IB Rebate Income",
    color: "var(--accent)",
    desc: "Earn $5\u201310 on every lot your followers trade. Every trade, every day. This is the primary income \u2014 passive, recurring, compounding.",
    example: "200 users \u00D7 1 lot/day \u00D7 $10 = $2,000/day",
  },
  {
    icon: "/android.png",
    isImage: true,
    title: "AI Credit Affiliate",
    color: "var(--blue)",
    desc: "Your followers use AI tools (trade analysis, signals, journal) and pay credits. You earn 20% of all credit revenue from your channel.",
    example: "200 users \u00D7 \u20B9400/mo credits \u00D7 20% = \u20B916,000/mo",
  },
  {
    icon: "/flash.png",
    isImage: true,
    title: "AI Signal Revenue",
    color: "var(--purple)",
    desc: "Optional: We build a custom AI that generates signals under your name. Followers pay credits to unlock. You earn per-lot AND credit affiliate.",
    example: "AI signals drive 30% more trades = 30% more rebates",
  },
  {
    icon: "/growth.png",
    isImage: true,
    title: "Growth Rewards",
    color: "var(--gold)",
    desc: "Hit tier milestones and your per-lot rebate increases automatically. Basic $7 \u2192 Pro $10 \u2192 Elite $12. Your income grows as your audience grows.",
    example: "Same 200 users: Basic=$1.4K/day \u2192 Elite=$2.4K/day",
  },
];

const features = [
  { icon: "/growth.png", isImage: true, title: "Signal Dashboard", desc: "Post signals with entry, TP, SL. Users see them instantly with push notifications." },
  { icon: "/android.png", isImage: true, title: "AI Signal Engine", desc: "Optional AI generates signals 24/7. You approve before they go live. Earn while you sleep." },
  { icon: "/chat.png", isImage: true, title: "Private Community", desc: "Your own community chat. Only your followers can see it. No cross-channel visibility." },
  { icon: "/earth.png", isImage: true, title: "Global Scorecard", desc: "17-instrument scoring system. Technical, fundamental, sentiment, COT \u2014 all in one view." },
  { icon: "/lock.png", isImage: true, title: "Screenshot Protection", desc: "OS-level protection. Users cannot screenshot signals. Your content stays inside the app." },
  { icon: "/trophy.png", isImage: true, title: "Gamification Engine", desc: "Streaks, badges, ranks, challenges. Users come back daily. 85%+ retention." },
  { icon: "/handshake.png", isImage: true, title: "Broker Integration", desc: "One-tap broker connection. P&L sync. Your IB code embedded automatically." },
  { icon: "/active.png", isImage: true, title: "Push Notifications", desc: "Morning scorecard, new signals, results, streak reminders. 8+ daily touchpoints." },
  { icon: "/analytical-skill.png", isImage: true, title: "Analytics Dashboard", desc: "See your users, trading volume, rebate income, credit revenue \u2014 all in real-time." },
];

const faqs = [
  {
    q: "How much does it cost to become an Alpha Provider?",
    a: "Nothing. Zero upfront cost. Zero monthly fee. You earn from day one. MarketScore takes a share of the IB rebate \u2014 we only make money when you make money.",
  },
  {
    q: "I already have an IB deal. Can I keep it?",
    a: "At Elite tier (400+ users), you can connect any broker you want. At Basic and Pro, you use our pre-integrated brokers where we\u2019ve negotiated institutional-grade rebate rates that are likely higher than your current deal.",
  },
  {
    q: "What\u2019s the AI model service?",
    a: "Optional add-on. We build a custom AI that generates signals under your name. You approve each signal before it goes live. Your followers pay credits to unlock AI signals \u2014 you earn 20% affiliate on every credit spent. The AI works 24/7 so you earn while you sleep.",
  },
  {
    q: "Can users screenshot my signals?",
    a: "No. Screenshot protection is built in at the OS level. Your signals stay inside MarketScore. No more Telegram leaks.",
  },
  {
    q: "What if I already charge for signals?",
    a: "Your signals on MarketScore are free \u2014 that\u2019s what drives trading volume and rebate income. Most Alpha Providers earn 5\u201310x more from rebates than they ever did from subscriptions. You can keep your paid Telegram as a separate offering if you want.",
  },
  {
    q: "How do users connect a broker?",
    a: "One-tap broker connection inside the app. User creates an account (or links existing), deposits, and starts trading. Your IB code is embedded automatically. You don\u2019t lift a finger.",
  },
];

const steps = [
  { num: "1", title: "Apply for Free", desc: "Fill out a 2-minute application. No cost, no commitment." },
  { num: "2", title: "Get Your Channel", desc: "We set up your branded Alpha Provider channel within 48 hours." },
  { num: "3", title: "Share Your Link", desc: "Your followers join via your unique link. They get signals + AI tools." },
  { num: "4", title: "Earn Per Lot", desc: "Every trade they make, you earn $5\u201310 per lot. Passive. Recurring." },
];

const calcItems = [
  { label: "Daily Rebate", value: "$2,000", sub: "200 \u00D7 1 lot \u00D7 $10" },
  { label: "Monthly Rebate", value: "$40,000", sub: "\u00D7 20 trading days" },
  { label: "Credit Affiliate", value: "$1,200/mo", sub: "20% of AI credits" },
  { label: "Annual Income", value: "$494K", sub: "rebates + credits", highlight: true },
];

// ===== APP =====
export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Application form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    providerType: "",
    audienceSize: "",
    platform: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("idle"); // idle | loading | success | error
  const [formErrors, setFormErrors] = useState([]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Replace this URL with your deployed Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3M05AepWMPn8x24mlQa5uHyDh3Z_TC0vqkxfeq30xMHdzY-KXrBxZVqehxgZcaWzI4A/exec";

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("loading");
    setFormErrors([]);

    // Client-side validation
    const errors = [];
    if (!formData.fullName.trim()) errors.push("Full name is required");
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("Valid email is required");
    if (!formData.whatsapp.trim() || formData.whatsapp.trim().length < 6) errors.push("WhatsApp number is required");
    if (!formData.providerType) errors.push("Provider type is required");

    if (errors.length > 0) {
      setFormStatus("error");
      setFormErrors(errors);
      return;
    }

    try {
      // Use GET with URL params — most reliable with Google Apps Script (avoids redirect body-stripping)
      const params = new URLSearchParams();
      params.append("fullName", formData.fullName.trim());
      params.append("email", formData.email.trim());
      params.append("whatsapp", formData.whatsapp.trim());
      params.append("providerType", formData.providerType);
      params.append("audienceSize", formData.audienceSize);
      params.append("platform", formData.platform);
      params.append("message", formData.message);

      await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      setFormStatus("success");
      setFormData({
        fullName: "",
        email: "",
        whatsapp: "",
        providerType: "",
        audienceSize: "",
        platform: "",
        message: "",
      });
    } catch {
      setFormStatus("error");
      setFormErrors(["Unable to submit. Please try again later."]);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const active = segments[activeTab];

  return (
    <>
      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo" />

          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#segments" className="nav-link">Who It&rsquo;s For</a>
            <a href="#revenue" className="nav-link">Revenue</a>
            <a href="#tiers" className="nav-link">Tiers</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <a href="#apply" className="nav-cta">Become an Alpha Provider &rarr;</a>
          </div>

          <button
            className={`mobile-menu-btn ${menuOpen ? "active" : ""}`}
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer menu */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <button className="mobile-drawer-close" onClick={() => setMenuOpen(false)}>&times;</button>
        </div>
        <a href="#how-it-works" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>How It Works</a>
        <a href="#segments" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>Who It&rsquo;s For</a>
        <a href="#revenue" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>Revenue</a>
        <a href="#tiers" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>Tiers</a>
        <a href="#faq" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>FAQ</a>
        <a href="#apply" className="mobile-drawer-cta" onClick={() => setMenuOpen(false)}>Become an Alpha Provider &rarr;</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-grid" />

        <div className="fade-up hero-logo-wrap">
          <img src="/marketscore-logo.png" alt="MarketScore" className="hero-logo" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="fade-up hero-logo-mobile">
              <img src="/marketscore-logo.png" alt="MarketScore" className="hero-logo" />
            </div>

            <div className="fade-up">
              <span className="hero-badge">
                <span className="hero-badge-dot" />
                Now Accepting Alpha Providers
              </span>
            </div>

            <h1 className="hero-title fade-up-d2">
              Your audience trades.
              <br />
              <span className="hero-title-gradient">You should earn.</span>
            </h1>

            <p className="hero-sub fade-up-d3">
              MarketScore turns signal providers, IBs, creators, and educators into{" "}
              <strong>Alpha Providers</strong> &mdash; earning on every lot their
              followers trade. Passive. Recurring. Forever.
            </p>

            <div className="hero-btns fade-up-d4">
              <a href="#apply" className="btn-primary">
                Apply Now &mdash; It&rsquo;s Free
              </a>
              <a href="#how-it-works" className="btn-secondary">
                See How It Works &darr;
              </a>
            </div>

            <div className="hero-stats fade-up-d4">
              {[
                { value: <span>$15<sup>*</sup></span>, label: "Earn upto per lot" },
                { value: "4", label: "Revenue streams" },
                { value: "$0", label: "Upfront cost" },
                { value: "24/7", label: "AI signals" },
              ].map((s, i) => (
                <div key={i} className="hero-stat">
                  {s.icon && <div className="hero-stat-icon">{s.icon}</div>}
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="container">
          <Reveal type="fade">
            <div className="section-header">
              <span className="section-badge">How It Works</span>
              <h2 className="section-title">Four steps to recurring income</h2>
              <p className="section-subtitle">
                No technical skills. No upfront investment. We handle everything.
              </p>
            </div>
          </Reveal>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <Reveal key={i} delay={i + 1}>
                <div className="step-card">
                  <div className="step-num">{step.num}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="section" id="segments">
        <div className="container">
          <Reveal type="fade">
            <div className="section-header">
              <span className="section-badge">Who Is This For</span>
              <h2 className="section-title">Find your path to Alpha Provider</h2>
            </div>
          </Reveal>

          <Reveal type="scale">
            <div className="seg-tabs">
              {segments.map((seg, i) => (
                <button
                  key={seg.id}
                  className={`seg-tab ${activeTab === i ? "active" : ""}`}
                  onClick={() => setActiveTab(i)}
                >
                  <span className="seg-tab-icon">
                    {seg.isImage
                      ? <img src={seg.icon} alt={seg.label} className="seg-tab-icon-img" />
                      : seg.icon}
                  </span>
                  {seg.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="seg-content" key={active.id}>
            <div className="seg-header">
              <p className="seg-hook">{active.hook}</p>
              <h3 className="seg-subhead">{active.subhead}</h3>
            </div>

            <div className="seg-body">
              <div className="seg-problem">
                <div className="seg-label seg-label-problem">
                  <span style={{ fontSize: 12 }}>&times;</span>
                  THE PROBLEM
                </div>
                <p className="seg-text">{active.problem}</p>
              </div>

              <div className="seg-solution">
                <div className="seg-label seg-label-solution">
                  THE MARKETSCORE WAY
                </div>
                <p className="seg-text">{active.solution}</p>
              </div>
            </div>

            <div className="seg-numbers">
              {active.numbers.map((n, i) => (
                <div key={i} className="seg-number">
                  <div className="seg-number-value">{n.value}</div>
                  <div className="seg-number-label">{n.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVENUE STREAMS */}
      <section className="section" id="revenue">
        <div className="container">
          <Reveal type="fade">
            <div className="section-header">
              <span className="section-badge">Your Income</span>
              <h2 className="section-title">4 revenue streams. 1 platform.</h2>
              <p className="section-subtitle">
                Most Alpha Providers earn from just one source. MarketScore gives
                you four that compound each other.
              </p>
            </div>
          </Reveal>

          <div className="revenue-grid">
            {revenueStreams.map((stream, i) => (
              <Reveal key={i} type={i % 2 === 0 ? "left" : "right"} delay={i + 1}>
                <div className="revenue-card">
                  <div
                    className="revenue-card-glow"
                    style={{ background: `color-mix(in srgb, ${stream.color} 6%, transparent)` }}
                  />
                  <div className="revenue-icon">
                    {stream.isImage
                      ? <img src={stream.icon} alt={stream.title} className="revenue-icon-img" />
                      : stream.icon}
                  </div>
                  <h3 className="revenue-title">{stream.title}</h3>
                  <p className="revenue-desc">{stream.desc}</p>
                  <div
                    className="revenue-example"
                    style={{
                      background: `color-mix(in srgb, ${stream.color} 8%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${stream.color} 15%, transparent)`,
                      color: stream.color,
                    }}
                  >
                    {stream.example}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIER SYSTEM */}
      <section className="section" id="tiers">
        <div className="container">
          <Reveal type="fade">
            <div className="section-header">
              <span className="section-badge">Tier System</span>
              <h2 className="section-title">Grow your audience. Unlock more.</h2>
            </div>
          </Reveal>

          <div className="tier-grid">
            {tiers.map((tier, i) => (
              <Reveal key={i} type="scale" delay={i + 1}>
                <div
                  className={`tier-card ${tier.popular ? "popular" : ""}`}
                >
                  {tier.popular && (
                    <div className="tier-popular-badge">MOST POPULAR</div>
                  )}
                  <div className="tier-name" style={{ color: tier.color }}>
                    {tier.name}
                  </div>
                  <div className="tier-range">{tier.range}</div>
                  <div className="tier-price">
                    {tier.rebateJsx
                      ? <span>$12<sup style={{fontSize: '0.5em', verticalAlign: 'super'}}>*</sup>/lot</span>
                      : tier.rebate}
                  </div>
                  <div className="tier-price-label">
                    your rebate per lot traded
                  </div>
                  {[
                    { label: "Brokers", value: tier.brokers },
                    { label: "Branding", value: tier.brand },
                    { label: "Channel", value: tier.badge },
                  ].map((item, j) => (
                    <div key={j} className="tier-feature">
                      <span className="tier-feature-label">{item.label}</span>
                      <span className="tier-feature-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INCOME CALCULATOR */}
      <section className="section">
        <div className="container">
          <Reveal type="scale">
            <div className="calc-wrapper">
              <span className="section-badge">The Math</span>
              <h2
                className="section-title"
                style={{ marginTop: 20 }}
              >
                What 200 active followers is worth
              </h2>
              <p className="section-subtitle" style={{ marginTop: 12 }}>
                Conservative estimate: 200 users trading 1 standard lot per day
                at Pro tier ($10/lot)
              </p>

              <div className="calc-grid">
                {calcItems.map((item, i) => (
                  <div
                    key={i}
                    className={`calc-card ${item.highlight ? "highlight" : ""}`}
                  >
                    <div
                      className="calc-value"
                      style={{
                        color: item.highlight
                          ? "var(--accent)"
                          : "var(--text)",
                      }}
                    >
                      {item.value}
                    </div>
                    <div className="calc-label">{item.label}</div>
                    <div className="calc-sub">{item.sub}</div>
                  </div>
                ))}
              </div>

              <p className="calc-disclaimer">
                These are projections based on industry averages. Actual income
                depends on trading activity and lot sizes. MarketScore does not
                guarantee any specific income.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <Reveal type="fade">
            <div className="section-header">
              <span className="section-badge">Platform Features</span>
              <h2 className="section-title">
                Everything you need. Built in.
              </h2>
            </div>
          </Reveal>

          <div className="features-grid">
            {features.map((feature, i) => (
              <Reveal key={i} type="scale" delay={Math.min(i + 1, 9)}>
                <div className="feature-card">
                  <div className="feature-icon">
                    {feature.isImage
                      ? <img src={feature.icon} alt={feature.title} className="feature-icon-img" />
                      : feature.icon}
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container">
          <Reveal type="fade">
            <div className="section-header">
              <span className="section-badge">FAQ</span>
              <h2 className="section-title">Questions? Answered.</h2>
            </div>
          </Reveal>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <Reveal key={i} type="left" delay={Math.min(i + 1, 6)}>
                <div
                  className="faq-item"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="faq-question">
                    <span className="faq-q-text">{faq.q}</span>
                    <span
                      className={`faq-toggle ${openFaq === i ? "open" : ""}`}
                    >
                      +
                    </span>
                  </div>
                  {openFaq === i && (
                    <p className="faq-answer">{faq.a}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="section" id="apply">
        <div className="container">
          <Reveal type="scale">
            <div className="cta-section">
              <div className="cta-glow" />
              <div className="cta-inner">
                <h2 className="cta-title">
                  Ready to become an
                  <br />
                  <span className="cta-accent">Alpha Provider</span>?
                </h2>
                <p className="cta-sub">
                  No upfront cost. No commitment. Apply today and we&rsquo;ll
                  set up your channel within 48 hours.
                </p>

                <div className="cta-checks" style={{ marginTop: 28, marginBottom: 36 }}>
                  {[
                    "Free to join",
                    "Earn from day 1",
                    "Channel live in 48hrs",
                    "Full support",
                  ].map((item, i) => (
                    <span key={i} className="cta-check">
                      <span className="cta-check-icon">✓</span>
                      {item}
                    </span>
                  ))}
                </div>

                {formStatus === "success" ? (
                  <div className="form-success">
                    <div className="form-success-icon">✓</div>
                    <h3 className="form-success-title">Application Submitted!</h3>
                    <p className="form-success-text">
                      Thank you for applying. Our team will review your application and get back to you within 48 hours.
                    </p>
                    <button
                      className="btn-secondary"
                      style={{ marginTop: 20 }}
                      onClick={() => setFormStatus("idle")}
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <form className="apply-form" onSubmit={handleFormSubmit}>
                    {formErrors.length > 0 && (
                      <div className="form-errors">
                        {formErrors.map((err, i) => (
                          <p key={i} className="form-error">{err}</p>
                        ))}
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          placeholder="Your full name"
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="you@example.com"
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">WhatsApp Number *</label>
                        <input
                          type="tel"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleFormChange}
                          placeholder="+91 98765 43210"
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Provider Type *</label>
                        <select
                          name="providerType"
                          value={formData.providerType}
                          onChange={handleFormChange}
                          className="form-input form-select"
                          required
                        >
                          <option value="">Select your type</option>
                          <option value="Existing IB">Existing IB</option>
                          <option value="Signal Provider">Signal Provider</option>
                          <option value="YT/IG Creator">YT/IG Creator</option>
                          <option value="Trading Educator">Trading Educator</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Current Audience Size</label>
                        <select
                          name="audienceSize"
                          value={formData.audienceSize}
                          onChange={handleFormChange}
                          className="form-input form-select"
                        >
                          <option value="">Select range</option>
                          <option value="0-100">0 &ndash; 100</option>
                          <option value="100-500">100 &ndash; 500</option>
                          <option value="500-1000">500 &ndash; 1,000</option>
                          <option value="1000-5000">1,000 &ndash; 5,000</option>
                          <option value="5000-10000">5,000 &ndash; 10,000</option>
                          <option value="10000+">10,000+</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Primary Platform</label>
                        <select
                          name="platform"
                          value={formData.platform}
                          onChange={handleFormChange}
                          className="form-input form-select"
                        >
                          <option value="">Select platform</option>
                          <option value="Telegram">Telegram</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Instagram">Instagram</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Website">Website / Blog</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: 16 }}>
                      <label className="form-label">Tell us about yourself</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Briefly describe your trading experience, audience, and what you're looking to achieve as an Alpha Provider..."
                        className="form-input form-textarea"
                        rows={4}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary form-submit"
                      disabled={formStatus === "loading"}
                    >
                      {formStatus === "loading" ? "Submitting..." : "Submit Application \u2192"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <Reveal type="fade">
          <div className="container footer-inner">
            <div className="footer-logo">
              <img src="/marketscore-logo.png" alt="MarketScore" className="footer-logo-img" />
              <span className="footer-copy">MarketScore &copy; 2026</span>
            </div>
            <p className="footer-disclaimer">
              MarketScore is a technology platform. Signals are created by
              independent Alpha Providers and do not constitute investment advice.
              All trading involves risk. Past performance does not guarantee future
              results.
            </p>
          </div>
        </Reveal>
      </footer>
    </>
  );
}
