import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Check, Star, HelpCircle, ArrowUpRight, ArrowDownRight, ArrowRight, Shield, Terminal, Lightbulb, UserCheck, Milestone, Sparkles, BookOpen } from "lucide-react";
import { SYSTEMS_DATA, MILESTONES_DATA, CLIENTS_PROOF } from "./data";
import SystemCard from "./components/SystemCard";
import MetricCounter from "./components/MetricCounter";
import AudioWave from "./components/AudioWave";
import WorkflowVisualiser from "./components/WorkflowVisualiser";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState("top");
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeLicenseTier, setActiveLicenseTier] = useState<"startup" | "mid" | "ent" | "telco">("startup");
  
  // Accordion faq state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Monitor scroll for progress and active sections
  useEffect(() => {
    const handleScroll = () => {
      // Progress calculation
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
      setScrollPercent(progress);

      // Back to top indicator
      setShowBackToTop(window.scrollY > 300);

      // Section tracking
      const sections = ["top", "offer", "proof", "about", "systems", "work", "limits", "faq", "contact"];
      const currentScroll = window.scrollY + 160;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + el.offsetHeight;
          if (currentScroll >= top && currentScroll <= bottom) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize theme from saved preference or OS preference.
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("aim-theme");
    const initialTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";

    setTheme(initialTheme);
  }, []);

  // Keep the DOM class and persisted preference in sync with state.
  useEffect(() => {
    const isLight = theme === "light";
    document.body.classList.toggle("light", isLight);
    window.localStorage.setItem("aim-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const handleScrollToTarget = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="font-sans min-h-screen bg-brand-navy text-brand-frost leading-normal selection:bg-brand-mist selection:text-brand-navy antialiased overflow-x-hidden relative">
      <div id="top"></div>
      
      {/* SCROLL BAR TRANSLUCENT PROGRESS INDICATOR */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-brand-ice via-brand-mist to-brand-accent z-50 transition-all duration-75 pointer-events-none"
        style={{ width: `${scrollPercent}%` }}
      />

      {/* FLOATING ACTION VERTICAL BULLETS NAVIGATION BAR */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {[
          { id: "top", label: "Home" },
          { id: "offer", label: "Engagement" },
          { id: "proof", label: "Proof" },
          { id: "about", label: "About Me" },
          { id: "systems", label: "Systems" },
          { id: "work", label: "Process" },
          { id: "limits", label: "Sovereignty" },
          { id: "faq", label: "FAQ" },
          { id: "contact", label: "Get in touch" }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollToTarget(item.id)}
            className="group relative flex items-center justify-end outline-none cursor-pointer"
            aria-label={`Scroll to ${item.label}`}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-4 font-mono text-[9px] tracking-wider uppercase text-brand-mist bg-brand-navy-light/95 border border-[#2E5B88]/20 px-2.5 py-1 rounded-md shadow-lg backdrop-blur-sm pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
            <span 
              className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                activeSection === item.id 
                  ? "bg-brand-accent border-brand-accent scale-125 shadow-[0_0_8px_rgba(143,208,255,0.8)]" 
                  : "bg-transparent border-brand-mute/40 group-hover:border-brand-accent"
              }`} 
            />
          </button>
        ))}
      </div>

      {/* FLOAT BACK TO TOP CORNER INDICATOR */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => handleScrollToTarget("top")}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full border border-[#2E5B88]/30 bg-brand-navy-light/90 text-brand-accent hover:border-brand-accent hover:text-white flex items-center justify-center font-display text-base transition-all duration-200 cursor-pointer shadow-xl backdrop-blur-md"
            aria-label="Back to top"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* SYSTEM HEADER BAR NAVIGATION PANEL */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-brand-mute/5 bg-brand-navy-light/75 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-display font-bold text-sm tracking-wide text-white">
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#16222e" stroke="#26384a" />
            <path d="M16 6 L25 25 L20.5 25 L16 15 L11.5 25 L7 25 Z" fill="none" stroke="#BFDDF6" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="16" cy="6.5" r="1.8" fill="#8FD0FF" />
            <circle cx="24.5" cy="24.5" r="1.8" fill="#8FD0FF" />
            <circle cx="7.5" cy="24.5" r="1.8" fill="#8FD0FF" />
          </svg>
          <div className="flex items-baseline gap-1.5 cursor-pointer" onClick={() => handleScrollToTarget("top")}>
            <span>AiM</span>
            <span className="font-light text-brand-mist/80 text-xs uppercase font-sans">Systems</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-brand-dim">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-[pulse-glow_2.4s_infinite]" />
            <span className="uppercase text-brand-frost leading-none">Booking contracts</span>
          </div>
          <span className="hidden sm:inline text-brand-mute/40">|</span>
          <span className="hidden sm:inline uppercase text-brand-dim leading-none">Outside IR35</span>
          <span className="hidden sm:inline text-brand-mute/40">|</span>
          <span className="hidden md:inline uppercase text-brand-dim leading-none">UK/EU REMOTE</span>
          
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg border border-brand-mute/20 bg-brand-accent/5 hover:border-brand-accent hover:text-brand-accent text-brand-frost inline-flex items-center justify-center cursor-pointer transition-all duration-200"
            aria-label="Toggle theme brightness"
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
        </div>
      </nav>

      {/* CORE HERO SECTION */}
      <header className="min-h-screen flex flex-col justify-center pt-24 pb-12 relative overflow-hidden bg-gradient-radial from-brand-surface-light/5 to-transparent">
        <AudioWave />
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 w-full relative z-10">
          <p className="font-mono text-xs text-brand-mist tracking-[0.24em] uppercase mb-4 flex items-center gap-2">
            <span>Consultancy Portfolio</span>
            <span className="text-brand-mute/50">&middot;</span>
            <span className="text-white">Ankit Panicker</span>
          </p>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-white leading-none max-w-4xl mb-6">
            Infrastructure that <br className="hidden md:block"/>
            <span className="aurora-text">thinks for you</span>.
          </h1>

          <p className="text-lg md:text-xl text-brand-dim leading-relaxed font-light max-w-2xl mb-4">
            <strong className="text-white font-medium">Fixed-price E2E B2B product delivery.</strong> Complete software architecture, optimized backend, visual frontend, automated cloud infrastructure provisioning, CI/CD pipelines, and active monitoring — built, verified, and shipped by a single hands-on system architect. No agency overhead.
          </p>

          <p className="font-mono text-[11px] md:text-xs text-brand-mute tracking-wide mb-8">
            £85,000 fixed price &bull; 3 milestones &bull; 100% demo-gated before production &bull; Weekly system reports
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a 
              href="mailto:mr.ankitpanicker@gmail.com?subject=AI%20platform%20engagement"
              className="bg-brand-frost hover:bg-brand-ice text-brand-navy font-display font-semibold px-7 py-3.5 rounded-lg text-xs md:text-sm shadow-[0_12px_30px_-16px_rgba(143,208,255,0.6)] cursor-pointer inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Initiate consultation</span>
              <span className="font-mono text-sm">&rarr;</span>
            </a>
            <a 
              href="https://aimstudio.co.in/app"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-brand-mute/30 hover:border-brand-accent bg-brand-accent/5 hover:text-brand-accent font-display text-white font-medium px-6 py-3.5 rounded-lg text-xs md:text-sm cursor-pointer inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-[live-pulse_1.6s_ease-out_infinite]" />
              <span>Explore live platform demonstration</span>
              <span className="font-mono text-sm">&nearr;</span>
            </a>
            <button 
              onClick={() => handleScrollToTarget("offer")}
              className="text-brand-ice hover:text-brand-accent font-mono text-xs underline underline-offset-4 cursor-pointer py-2 pl-2"
            >
              View target engagement milestones
            </button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-14 text-[9px] md:text-[10px] font-mono text-brand-mute uppercase tracking-[0.16em]">
            <span>System Architect</span>
            <span>&bull;</span>
            <span>E2E Delivery</span>
            <span>&bull;</span>
            <span>Reliable Infrastructure</span>
            <span>&bull;</span>
            <span>UK/EU Remote outside IR35</span>
            <span>&bull;</span>
            <span>Automated Observability</span>
          </div>
        </div>

        {/* HERO METRIC COUNT TICKER */}
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 w-full mt-16 md:mt-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-1 border-y border-brand-mute/10 bg-brand-navy-light/30">
            {[
              { value: 15000, comma: true, suffix: "+", label: "Active daily calls" },
              { value: 200, prefix: "<", suffix: "ms", label: "Initial voice buffer" },
              { value: 1, suffix: "s", label: "E2E voice turn" },
              { value: 40, suffix: "+", label: "Automated deploys" },
              { value: 85000, prefix: "£", comma: true, label: "Fixed pricing model" },
              { value: 31, label: "Verification test suites" }
            ].map((metric, index) => (
              <div key={index} className="p-6 flex flex-col justify-center">
                <div className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                  {typeof metric.value === "number" ? (
                    <MetricCounter 
                      value={metric.value} 
                      comma={metric.comma} 
                      prefix={metric.prefix} 
                      suffix={metric.suffix}
                    />
                  ) : (
                    <span>{metric.value}</span>
                  )}
                </div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-brand-mute mt-1.5 leading-tight">
                  {metric.label}
                </div>
                <div className="hidden flex items-end gap-3 flex-wrap">
                  <span className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-none">
                    <MetricCounter
                      value={85000}
                      start={180000}
                      duration={4200}
                      comma
                      prefix="£"
                    />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-mist bg-brand-accent/10 border border-brand-accent/15 px-2.5 py-1 rounded-full">
                    base scope
                  </span>
                </div>
                <p className="hidden text-[11px] text-brand-dim font-light leading-relaxed mt-3 max-w-[26rem]">
                  Starts in slow countdown from <span className="text-white font-medium">£180,000</span> and settles at
                  <span className="text-white font-medium"> £85,000</span> when scope stays tight.
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* RENDER SECTIONS */}
      <main className="relative z-10 max-w-[1180px] mx-auto px-6 md:px-8 space-y-16 py-12">

        {/* SECTION 1 : MILESTONES / ENGAGEMENT PLAN */}
        <section id="offer" className="pt-16 border-t border-brand-mute/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <p className="font-mono text-xs text-brand-mist tracking-widest uppercase mb-3 flex items-center gap-2">
                <span className="text-brand-mute">01 /</span>
                <span>The Milestones</span>
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                Gated engagements. <br className="hidden sm:block"/>
                <span className="text-brand-mist">Demo verified before production.</span>
              </h2>
              <p className="text-sm md:text-base text-brand-dim font-light mt-4 leading-relaxed max-w-xl">
                I do not sell hours. I sell outcomes. See a live working integration sandbox demonstrating the core voice reasoning path on staging within Month 1 — before committing core engineering.
              </p>
            </div>

            <div className="border border-brand-mute/15 bg-brand-surface-light/20 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent/55 to-transparent" />
                <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-brand-mute block mb-2">
                  Comprehensive Platform Cost
                </span>
                <span className="hidden text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
                  £85,000
                </span>
              </div>
              <div className="flex items-end gap-3 flex-wrap mt-4">
                <span className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-none">
                  <MetricCounter
                    value={85000}
                    start={180000}
                    duration={4200}
                    comma
                    prefix="£"
                  />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-mist bg-brand-accent/10 border border-brand-accent/15 px-2.5 py-1 rounded-full">
                  base scope
                </span>
              </div>
                <p className="hidden text-[11px] text-brand-dim font-light leading-relaxed mt-3 max-w-[26rem]">
                Starts in slow countdown from <span className="text-white font-medium">£180,000</span> and settles at
                <span className="text-white font-medium"> £85,000</span> when scope stays tight.
              </p>
              <p className="text-[11px] text-brand-dim font-light leading-relaxed mt-3 max-w-[26rem]">
                Starts in slow countdown from <span className="text-white font-medium">GBP 180,000</span> and settles at
                <span className="text-white font-medium"> GBP 85,000</span> when scope stays tight.
              </p>
              <div className="mt-8 pt-5 border-t border-brand-mute/10">
                <span className="text-[10px] font-mono text-brand-mist font-semibold uppercase tracking-[0.18em] block">
                  3-4 months depending on scope
                </span>
                <span className="text-[11px] text-brand-dim font-light leading-snug mt-1 block">
                  milestoned releases &bull; support runbooks &bull; SLA verification &bull; scope-gated delivery
                </span>
              </div>
            </div>
          </div>

          {/* Detailed tabular milestones representation */}
          <div className="border border-brand-mute/10 rounded-2xl overflow-hidden bg-brand-navy-light/10 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 bg-brand-surface/20 py-4.5 px-6 border-b border-brand-mute/10 text-[10px] font-mono tracking-widest uppercase text-brand-mute hidden md:grid">
              <span>Timeline phase</span>
              <span className="col-span-2">Task outcomes &amp; assets</span>
              <span className="text-right">Milestone payment</span>
            </div>

            <div className="divide-y divide-brand-mute/15">
              {MILESTONES_DATA.map((milestone) => (
                <div key={milestone.id} className="grid grid-cols-1 md:grid-cols-4 items-start py-6 px-6 md:px-8 gap-4 hover:bg-brand-accent/5 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-brand-mist bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/10">
                      {milestone.id.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs uppercase font-semibold text-white">
                      {milestone.when}
                    </span>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <h3 className="font-display font-semibold text-lg text-white leading-tight">
                      {milestone.title}
                    </h3>
                    <p className="text-xs md:text-sm text-brand-dim leading-relaxed font-light">
                      {milestone.desc}
                    </p>
                  </div>

                  <div className="md:text-right flex flex-col justify-center">
                    <span className="text-xl font-display font-bold text-white tracking-tight leading-tight">
                      {milestone.payment}
                    </span>
                    <span className="font-mono text-[9px] text-brand-mist/80 uppercase mt-1">
                      {milestone.percent}
                    </span>
                    {milestone.subPayment && (
                      <span className="font-mono text-[10px] text-brand-mute mt-1.5 leading-snug">
                        {milestone.subPayment}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="border border-brand-mute/10 rounded-xl p-6 bg-brand-surface/10">
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#BFDDF6] mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-accent" />
                <span>What is included</span>
              </h4>
              <ul className="text-xs md:text-sm text-brand-dim space-y-3.5 font-light">
                <li className="flex items-start gap-2.5">
                  <div className="p-0.5 rounded-full bg-green-500/10 text-green-400 mt-0.5">✓</div>
                  <span>Full-stack software delivery (front-end panels + optimized Python asynchronous orchestrators).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-0.5 rounded-full bg-green-500/10 text-green-400 mt-0.5">✓</div>
                  <span>Automated provisioning setup mapped to your own Amazon Web Services, GCP, or Microsoft Azure clusters.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-0.5 rounded-full bg-green-500/10 text-green-400 mt-0.5">✓</div>
                  <span>Automated Observability tracking models (Grafana dashboards, custom alerts triggers, logs centralization).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-0.5 rounded-full bg-green-500/10 text-green-400 mt-0.5">✓</div>
                  <span>Four weeks of continuous premium post-deployment assistance and performance diagnostics monitoring.</span>
                </li>
              </ul>
            </div>

            <div className="border border-brand-mute/10 rounded-xl p-6 bg-brand-surface/10 opacity-80">
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-brand-mute mb-4 flex items-center gap-2">
                <span className="text-red-400 font-bold">&times;</span>
                <span>Not included</span>
              </h4>
              <ul className="text-xs md:text-sm text-brand-mute space-y-3.5 font-light">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400/80 mt-0.5 font-bold">&bull;</span>
                  <span>External cloud hosting bills and direct cloud asset consumption costs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400/80 mt-0.5 font-bold">&bull;</span>
                  <span>Third-party API key consumption bills (model integrations, Plivo webhook execution, WhatsApp template triggers).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400/80 mt-0.5 font-bold">&bull;</span>
                  <span>Additional feature inclusions configured outside of the initial design roadmap specifications.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* LICENSING TIERS SUBSECTION */}
          <div className="border border-[#2E5B88]/20 bg-gradient-to-r from-brand-surface/30 to-[#8fd0ff]/5 rounded-2xl p-6 md:p-8 shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-brand-accent/5 border-b border-l border-brand-accent/20 rounded-bl-xl font-mono text-[9px] uppercase tracking-widest text-brand-mist hidden md:block">
              Institutional Licensing Available
            </div>
            
            <p className="font-mono text-xs text-brand-accent tracking-widest uppercase mb-2">
              APEX Sovereign Launch Setup
            </p>
            <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-2 leading-none">
              White-Label Software Platform
            </h3>
            <p className="text-xs md:text-sm text-brand-dim font-light leading-relaxed max-w-4xl mb-6">
              Establish a localized multi-tenant communication platform inside your own secure cloud registry in one week. Fully integrated with automated clinic dashboards, bulk speech outreach campaigns, custom WhatsApp workflow builders, rate scheduling gates, and real-time observer interfaces.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { id: "startup", title: "Startup licensing", price: "£100,000", limit: "Under 50 personnel" },
                { id: "mid", title: "Mid-Market array", price: "£120,000", limit: "50-200 employees" },
                { id: "ent", title: "Enterprise systems", price: "Custom quote", limit: "200+ employees" },
                { id: "telco", title: "Telecom resellers", price: "Custom quote", limit: "Resellers & BPOs" }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setActiveLicenseTier(tier.id as any)}
                  className={`p-4 border rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    activeLicenseTier === tier.id
                      ? "border-brand-accent bg-brand-accent/15 shadow-md scale-102"
                      : "border-brand-mute/15 bg-black/20 hover:border-[#8fd0ff]/30"
                  }`}
                >
                  <span className="font-mono text-[9px] text-brand-mist uppercase tracking-wide">
                    {tier.title}
                  </span>
                  <div className="mt-2.5">
                    <span className="font-display font-bold text-lg md:text-xl text-white block leading-none">
                      {tier.price}
                    </span>
                    <span className="text-[10px] text-brand-mute leading-none mt-1 block">
                      {tier.limit}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <p className="font-mono text-[10px] text-brand-mute text-center">
              Annual license support fees: <b>£20,000 / year</b> (covers security audit certifications, active SLA monitoring updates, and core diagnostic improvements).
            </p>
          </div>
        </section>

        {/* SECTION 2 : PAST VALUE PROOF / REFERENCES */}
        <section id="proof" className="pt-16 border-t border-brand-mute/10">
          <p className="font-mono text-xs text-brand-mist tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="text-brand-mute">02 /</span>
            <span>The Evidence</span>
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white mb-10 leading-tight">
            Production cases. <br className="hidden sm:block"/>
            <span className="text-brand-mist">Operational variables, not generic assertions.</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CLIENTS_PROOF.map((client) => (
              <div key={client.id} className="border border-brand-mute/10 rounded-2xl p-6.5 bg-brand-surface/20 hover:border-[#8fd0ff]/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] text-[#BFDDF6] uppercase tracking-widest block mb-2 font-medium">
                    {client.tag}
                  </span>
                  <div className="border-b border-brand-mute/5 pb-4 mb-4">
                    <h3 className="font-display font-bold text-xl text-white">
                      {client.name}
                    </h3>
                    <span className="text-[11px] font-mono text-brand-mute italic block mt-0.5">
                      {client.place}
                    </span>
                  </div>

                  {client.metrics && (
                    <div className="grid grid-cols-2 gap-2 border border-brand-mute/15 bg-black/30 rounded-xl p-3.5 mb-5 select-none">
                      {client.metrics.map((met, idx) => (
                        <div key={idx}>
                          <div className="text-base font-display font-bold text-white tracking-tight leading-none">
                            <MetricCounter value={met.count!} comma={met.comma} suffix={met.suffix} />
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-brand-mute mt-1.5 block leading-snug">
                            {met.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-brand-dim leading-relaxed font-light mb-4">
                    {client.description}
                  </p>

                  <div className="space-y-2 border-y border-brand-mute/10 py-3 mb-4 select-none">
                    {client.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-mono leading-relaxed">
                        <span className="text-brand-mute font-light">{detail.label}</span>
                        <span className={`font-semibold ${detail.isWin ? "text-brand-mist" : "text-white"}`}>
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {client.cite && (
                    <blockquote className="border-l-2 border-[#BFDDF6]/40 pl-3 py-1 font-sans italic text-xs leading-relaxed text-[#BFDDF6] mb-3">
                      &ldquo;{client.cite}&rdquo;
                      <span className="text-[10px] font-mono uppercase tracking-wider block text-brand-mute mt-1.5 not-italic">
                        &mdash; {client.citationAuthor}
                      </span>
                    </blockquote>
                  )}

                  {client.referenceText && (
                    <span className="font-mono text-[9px] text-brand-mute flex items-center gap-1.5 uppercase tracking-wide">
                      <BookOpen className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                      <span>{client.referenceText}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 : TECHNICAL PHILOSOPHY ABOUT ME */}
        <section id="about" className="pt-16 border-t border-brand-mute/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs text-brand-mist tracking-widest uppercase mb-3 flex items-center gap-2">
                <span className="text-brand-mute">03 /</span>
                <span>The Engineering Philosophy</span>
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                CTO and System Architect. <br className="hidden sm:block"/>
                <span className="text-brand-mist">Direct execution.</span>
              </h2>
              <p className="text-sm md:text-base text-brand-dim font-light leading-relaxed mt-6">
                I assist organizations in implementing reliable, local-first artificial intelligence solutions. My architecture is anchored around a central coordinate — <strong className="text-white">APEX Voice Engine</strong> — built on bare metal, reducing cloud API fees, and maintaining high uptime structures.
              </p>
              <p className="text-sm md:text-base text-brand-dim font-light leading-relaxed mt-4">
                I consolidate full cloud-engineered delivery (automated Terraform provisioning files, microservices, front-end layers, CI/CD automated gates, observability profiles) into one single codebase, bypassing institutional coordination gaps and agency markups.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-brand-mute/10 p-6 rounded-2xl bg-brand-surface/10">
                <div className="p-2 border border-brand-accent/25 bg-brand-accent/5 rounded-lg text-brand-accent w-fit mb-4">
                  <Terminal className="w-5 h-5" />
                </div>
                <h4 className="font-display font-semibold text-lg text-white mb-2">
                  Asynchronous Core Engine
                </h4>
                <p className="text-xs md:text-sm text-brand-dim font-light leading-relaxed">
                  Avoids bloated LangChain wrappers. All pipeline steps (Whisper transcription layers, LLaMA localized execution, and Kokoro speech synthesis) run on custom deterministic models — achieving sub-second E2E voice responses under load.
                </p>
              </div>

              <div className="border border-brand-mute/10 p-6 rounded-2xl bg-brand-surface/10">
                <div className="p-2 border border-brand-accent/25 bg-brand-accent/5 rounded-lg text-brand-accent w-fit mb-4">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h4 className="font-display font-semibold text-lg text-white mb-2">
                  Zero Cloud Egress Models
                </h4>
                <p className="text-xs md:text-sm text-brand-dim font-light leading-relaxed">
                  Prioritizes data security and privacy compliance. Patient charts and operational diagnoses are cached and calculated locally using quantized models and vector memory arrays in secure hardware environments — eliminating cloud dependency.
                </p>
              </div>

              <div className="border border-brand-mute/10 p-6 rounded-2xl bg-brand-surface/10">
                <div className="p-2 border border-brand-accent/25 bg-brand-accent/5 rounded-lg text-brand-accent w-fit mb-4">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="font-display font-semibold text-lg text-white mb-2">
                  Hands-On Accountability
                </h4>
                <p className="text-xs md:text-sm text-brand-dim font-light leading-relaxed">
                  One engineer, one contract, one point of contact. From Dockerization blueprints and Kubernetes horizontal pods routing to visual React UI controls and webhook bridges, I write, execute, and support the entire pipeline myself.
                </p>
              </div>

              <div className="border border-brand-mute/10 p-6 rounded-2xl bg-brand-surface/10">
                <div className="p-2 border border-brand-accent/25 bg-brand-accent/5 rounded-lg text-brand-accent w-fit mb-4">
                  <Milestone className="w-5 h-5" />
                </div>
                <h4 className="font-display font-semibold text-lg text-white mb-2">
                  Predictable Scope Limits
                </h4>
                <p className="text-xs md:text-sm text-brand-dim font-light leading-relaxed">
                  Explicit SLA agreements guide our collaboration. Once the Month 1 architecture demonstration is accepted, design goals are capped to guarantee delivery on scale and schedule.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 : CORE SYSTEMS LIST COMPONENT */}
        <section id="systems" className="pt-16 border-t border-brand-mute/10">
          <p className="font-mono text-xs text-brand-mist tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="text-brand-mute">04 /</span>
            <span>Production Architectures</span>
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white mb-10 leading-tight">
            The Systems Portfolio. <br className="hidden sm:block"/>
            <span className="text-brand-mist">Select a block to inspect logical properties.</span>
          </h2>

          <div className="space-y-4">
            {SYSTEMS_DATA.map((sys) => (
              <SystemCard key={sys.id} system={sys} />
            ))}
          </div>

          {/* STANDALONE INTERACTIVE WORKFLOW CANVAS */}
          <div className="pt-12">
            <WorkflowVisualiser />
          </div>
        </section>

        {/* SECTION 5 : PROCESS / HOW I WORK */}
        <section id="work" className="pt-16 border-t border-brand-mute/10">
          <p className="font-mono text-xs text-brand-mist tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="text-brand-mute">05 /</span>
            <span>The Process</span>
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white mb-10 leading-tight">
            How we cooperate. <br className="hidden sm:block"/>
            <span className="text-brand-mist">Zero guess-work. Clean diagnostics.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="border border-brand-mute/10 bg-brand-surface/20 rounded-2xl p-6.5 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-semibold text-xl text-white mb-4">
                  Accountability &amp; Reporting Specs
                </h3>
                <ul className="text-sm text-brand-dim space-y-4 font-light">
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-accent tracking-[.18em] font-mono text-[9px] mt-1 shrink-0 uppercase pointer-events-none">REP-Y</span>
                    <span><b>Structured progress summary sent every Friday</b>: Detailed breakdown of what was committed, performance benchmarks verified, next steps, and timeline risks. Can be read in two minutes.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-accent tracking-[.18em] font-mono text-[9px] mt-1 shrink-0 uppercase pointer-events-none">LOCK-S</span>
                    <span><b>Scope freeze</b>: Once Month 1 architecture demonstration is signed, development parameters are locked to prevent timing shifts or delivery delays.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-accent tracking-[.18em] font-mono text-[9px] mt-1 shrink-0 uppercase pointer-events-none">BON-US</span>
                    <span><b>Uptime and schedule bonuses</b>: Payments are directly tied to on-time delivery dates and post-launch health outcomes, aligning our goals.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border border-brand-mute/10 bg-brand-surface/20 rounded-2xl p-6.5">
              <h3 className="font-display font-semibold text-xl text-white mb-4">
                Strict Severity Definitions (Contract-Embedded)
              </h3>
              <p className="text-sm text-brand-dim leading-relaxed font-light mb-6">
                To prevent post-launch debates, we write precise operational severity scopes directly into the core agreement.
              </p>

              <div className="divide-y divide-brand-mute/10 border-y border-brand-mute/10">
                <div className="grid grid-cols-4 items-center py-3.5 text-xs">
                  <span className="font-mono text-red-400 font-bold tracking-widest">P0 - OUTAGE</span>
                  <span className="col-span-3 text-brand-dim font-light pl-4 leading-normal">System is down. Core voice streams are failing. Zero outreach calls or webhooks are transferring.</span>
                </div>
                <div className="grid grid-cols-4 items-center py-3.5 text-xs">
                  <span className="font-mono text-yellow-400 font-semibold tracking-widest">P1 - DATA RE-X</span>
                  <span className="col-span-3 text-brand-dim font-light pl-4 leading-normal">Data mutations lost or security models breached. Cross-tenant records exposed to third-party assets.</span>
                </div>
                <div className="grid grid-cols-4 items-center py-3.5 text-xs">
                  <span className="font-mono text-brand-mute tracking-widest">P2 - Standard</span>
                  <span className="col-span-3 text-brand-mute font-light pl-4 leading-normal">General dashboard improvements, alignment tweaks, or report exports. Evaluated during standard monthly iterations.</span>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2">
                <Shield className="w-5 h-5 text-brand-accent mt-0.5 shrink-0" />
                <p className="text-[11px] font-mono text-brand-mute uppercase leading-normal">
                  The on-time milestone contract is evaluated against P0/P1 metrics during the initial 14-day scaling checkpoint.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 : THE BOUNDARIES / LIMITS */}
        <section id="limits" className="pt-16 border-t border-brand-mute/10">
          <p className="font-mono text-xs text-brand-mist tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="text-brand-mute">06 /</span>
            <span>The Scope Limits</span>
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white mb-6 leading-tight">
            Absolute boundaries. <br className="hidden sm:block"/>
            <span className="text-brand-mist">What I am not.</span>
          </h2>

          <div className="border border-brand-mute/10 bg-brand-surface/10 rounded-2xl p-6.5 md:p-8 max-w-4xl">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-brand-frost font-light">
              <li className="flex items-start gap-3.5">
                <div className="font-mono text-red-400 font-bold text-xs mt-0.5 shrink-0">&times;</div>
                <div>
                  <strong className="text-white block font-medium">Not an ML researcher</strong>
                  <span className="text-xs text-brand-dim block mt-0.5 leading-relaxed">I do not design or train core weights. I consume, quantize, and embed open-source models (such as whisper checkpoints or llama structures) to build corporate automation.</span>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="font-mono text-red-400 font-bold text-xs mt-0.5 shrink-0">&times;</div>
                <div>
                  <strong className="text-white block font-medium">Not a manager or team lead</strong>
                  <span className="text-xs text-brand-dim block mt-0.5 leading-relaxed">My engagement relies on direct individual delivery. If you need someone to coordinate a team of remote junior developers, I am not the correct match.</span>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="font-mono text-red-400 font-bold text-xs mt-0.5 shrink-0">&times;</div>
                <div>
                  <strong className="text-white block font-medium">Not hyperscale architectures</strong>
                  <span className="text-xs text-brand-dim block mt-0.5 leading-relaxed">My systems are optimized for clinic branches, colleges, and startups. Ultra-low latency is prioritized over support for millions of simultaneous channels.</span>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="font-mono text-red-400 font-bold text-xs mt-0.5 shrink-0">&times;</div>
                <div>
                  <strong className="text-white block font-medium">Python &amp; TypeScript exclusive</strong>
                  <span className="text-xs text-brand-dim block mt-0.5 leading-relaxed">I write Python for high-performance localized AI processing and TypeScript / React for dashboard overlays. I bypass Rust, Java, or C++.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 7 : FAQ ACCORDION PANEL */}
        <section id="faq" className="pt-16 border-t border-brand-mute/10">
          <p className="font-mono text-xs text-brand-mist tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="text-brand-mute">07 /</span>
            <span>Frequently Asked Questions</span>
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white mb-10 leading-tight">
            Diagnostics cleared. <br className="hidden sm:block"/>
            <span className="text-brand-mist">Common operational inquiries.</span>
          </h2>

          <div className="space-y-3.5 max-w-4xl">
            {[
              {
                q: "What does E2E B2B product delivery mean?",
                a: "It means I handle the complete lifeycle of the system. I design the core PostgreSQL or SQLite database, write the asynchronous backend orchestrators, build the React dashboard overlays, provision the Terraform infrastructure setups, automate the CI/CD deployment channels, and configure the Grafana alert parameters. You get a fully deployed and supported product without managing multiple hands-offs."
              },
              {
                q: "How does the Month 1 demo verification process operate?",
                a: "Within Month 1, I build a mini-sandbox demonstrating the core voice reasoning path (VAD + transcribing + localized model output + synthesis waves) and host it live on your staging server. This proves the system's core capabilities and validates latency limits before full production engineering is committed, eliminating early execution risks."
              },
              {
                q: "What is an 'Outside IR35' contract?",
                a: "An Outside IR35 engagement represents a genuine business-to-business transaction. Because payments are gated to accepted milestone completions and I operate using my own specialized hardware, we bypass standard employment definitions, which simplifies tax compliance for UK and European organizations."
              },
              {
                q: "What regions do you support remotely?",
                a: "I work remotely from India (IST, UTC+5:30), offering full visual morning overlaps with UK and European operational teams. Weekly written updates and asynchronous commits make coordination efficient and independent of scheduled meetings."
              },
              {
                q: "Why choose localized inference over external APIs?",
                a: "First: Cost. Running open-source models on on-premise localized GPUs lowers marginal run costs to zero. Second: Latency. Quantized models run on regional servers bypass round-trip web delays, achieving turn times beneath 1s. Third: Security. Zero sensitive patient or academic records exit the local registry."
              }
            ].map((faq, idx) => {
              const isFaqOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="border border-[#2E5B88]/20 bg-brand-surface/15 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isFaqOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 select-none hover:bg-brand-accent/5 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="font-display font-semibold text-sm md:text-base text-white">
                      {faq.q}
                    </span>
                    <span className={`text-base font-bold text-brand-accent transition-transform duration-200 ${isFaqOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  <AnimatePresence>
                    {isFaqOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-xs md:text-sm text-brand-dim leading-relaxed font-light">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 8 : GET IN TOUCH CONTACT */}
        <section id="contact" className="pt-20 pb-16 text-center border-t border-brand-mute/10">
          <p className="font-mono text-xs text-brand-mist tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <span className="text-brand-mute">07 /</span>
            <span>Get in touch</span>
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white mb-6">
            Core diagnostic proofs. <br/>
            <span className="text-brand-mist font-light font-sans">Reach out if the stack fits.</span>
          </h2>

          <a 
            href="mailto:mr.ankitpanicker@gmail.com?subject=AI%20platform%20engagement"
            className="font-mono text-xl md:text-3xl text-brand-accent hover:text-white border-b-2 border-brand-accent/30 hover:border-white pb-1.5 transition-all duration-200 inline-block mb-10"
          >
            mr.ankitpanicker@gmail.com
          </a>

          <div className="flex flex-wrap justify-center border-t border-brand-mute/5 pt-8 gap-x-8 gap-y-4 text-[10px] md:text-xs font-mono text-brand-mute uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
              <span>India (IST / UTC+5:30)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
              <span>UK/EU overlap schedules</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
              <span>B2B Direct outside IR35</span>
            </span>
          </div>
        </section>

      </main>

      {/* FOOTER BAR */}
      <footer className="border-t border-brand-mute/10 bg-black/30 py-8 text-xs font-mono text-brand-mute mt-12">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>
            AiM SYSTEMS &bull; ANKIT PANICKER - B2B DIGITAL CONSULTANCY
          </span>
          <span className="text-[10px] tracking-wider">
            aimmarketing.in &bull; Active targets: UK &middot; EU &middot; US &middot; India
          </span>
        </div>
      </footer>
    </div>
  );
}
