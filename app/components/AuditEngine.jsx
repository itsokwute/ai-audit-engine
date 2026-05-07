"use client";

import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#00FFD1", "#FF6B35", "#FFD700", "#7B61FF", "#00B4D8", "#F72585"];

const DEMO_INPUTS = {
  website: "https://shopify.com",
  linkedin: "linkedin.com/company/shopify",
  instagram: "instagram.com/shopify",
  facebook: "facebook.com/shopify",
  notes: "E-commerce SaaS platform, ~10,000 staff, B2B and B2C, global operations"
};

export default function AuditEngine() {
  const [stage, setStage] = useState("input");
  const [inputs, setInputs] = useState({ website: "", linkedin: "", instagram: "", facebook: "", notes: "" });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Initializing...");
  const [activeTab, setActiveTab] = useState("executive_summary");
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const progressRef = useRef(null);

  const [currency, setCurrency] = useState({ code: "USD", symbol: "$", rate: 1 });

  const CURRENCIES = [
    { code: "USD", symbol: "$", rate: 1, label: "USD — US Dollar" },
    { code: "NGN", symbol: "\u20a6", rate: 1620, label: "NGN — Nigerian Naira" },
    { code: "GBP", symbol: "\u00a3", rate: 0.79, label: "GBP — British Pound" },
    { code: "EUR", symbol: "\u20ac", rate: 0.92, label: "EUR — Euro" },
    { code: "CAD", symbol: "C$", rate: 1.36, label: "CAD — Canadian Dollar" },
    { code: "AUD", symbol: "A$", rate: 1.53, label: "AUD — Australian Dollar" },
    { code: "ZAR", symbol: "R", rate: 18.6, label: "ZAR — South African Rand" },
    { code: "GHS", symbol: "\u20b5", rate: 15.4, label: "GHS — Ghanaian Cedi" },
    { code: "KES", symbol: "KSh", rate: 129, label: "KES — Kenyan Shilling" },
    { code: "INR", symbol: "\u20b9", rate: 83, label: "INR — Indian Rupee" },
    { code: "AED", symbol: "AED", rate: 3.67, label: "AED — UAE Dirham" },
    { code: "BRL", symbol: "R$", rate: 4.97, label: "BRL — Brazilian Real" },
    { code: "MXN", symbol: "MX$", rate: 17.1, label: "MXN — Mexican Peso" },
    { code: "SGD", symbol: "S$", rate: 1.34, label: "SGD — Singapore Dollar" },
    { code: "JPY", symbol: "\u00a5", rate: 149, label: "JPY — Japanese Yen" },
  ];

  const progressSteps = [
    "Scanning digital footprint...",
    "Diagnosing business model...",
    "Identifying pain points...",
    "Mapping AI agent prescriptions...",
    "Running ROI calculations...",
    "Building 90-day roadmap...",
    "Generating visual data...",
    "Compiling executive report..."
  ];

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get("report");
      if (shared) {
        try {
          const decoded = JSON.parse(atob(shared));
          if (decoded && decoded.executive_summary && decoded.pain_points && decoded.pain_points.length > 0) {
            setReport(decoded);
            setStage("report");
            return;
          }
        } catch(e) {}
      }
      const saved = localStorage.getItem("audit_report");
      const savedInputs = localStorage.getItem("audit_inputs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.executive_summary && parsed.pain_points && parsed.pain_points.length > 0) {
          setReport(parsed);
          setStage("report");
        } else {
          localStorage.removeItem("audit_report");
        }
      }
      if (savedInputs) setInputs(JSON.parse(savedInputs));
    } catch (e) { localStorage.removeItem("audit_report"); }
  }, []);

  function validateInputs() {
    const website = inputs.website.trim();
    if (website && !website.startsWith("http")) {
      setError("Website URL must start with http:// or https://");
      return false;
    }
    return true;
  }

  function loadDemo() {
    setInputs(DEMO_INPUTS);
    setError(null);
  }

  async function runAudit() {
    const hasInput = Object.values(inputs).some(v => v.trim().length > 0);
    if (!hasInput) { setError("Please provide at least one input to analyze."); return; }
    if (!validateInputs()) return;
    setError(null);
    setStage("analyzing");
    setProgress(0);
    setDismissedBanner(false);

    let step = 0;
    progressRef.current = setInterval(() => {
      step++;
      setProgress(Math.min(step * 12, 90));
      setProgressLabel(progressSteps[Math.min(step - 1, progressSteps.length - 1)]);
    }, 900);

    try {
      const { runAuditAPI } = await import("../components/auditApi");
      const parsed = await runAuditAPI(inputs);
      clearInterval(progressRef.current);
      setProgress(100);
      setProgressLabel("Report complete!");
      try {
        localStorage.setItem("audit_report", JSON.stringify(parsed));
        localStorage.setItem("audit_inputs", JSON.stringify(inputs));
      } catch(e) {}
      setReport(parsed);
      setTimeout(() => setStage("report"), 600);
    } catch (e) {
      clearInterval(progressRef.current);
      setError("Analysis failed: " + e.message);
      setStage("input");
    }
  }

  function clearReport() {
    setStage("input");
    setReport(null);
    setActiveTab("executive_summary");
    setDismissedBanner(false);
    try {
      localStorage.removeItem("audit_report");
      localStorage.removeItem("audit_inputs");
    } catch(e) {}
    if (typeof window !== "undefined" && window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  function exportReport() {
    if (!report || exportLoading) return;
    setExportLoading(true);
    import("../components/exportUtils").then(function(mod) {
      const html = mod.buildExportHTML(report, currency);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      setTimeout(function() {
        if (win) { win.focus(); win.print(); }
        setExportLoading(false);
      }, 1400);
    }).catch(function() { setExportLoading(false); });
  }

  function shareReport() {
    if (!report) return;
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(report))));
      const url = window.location.origin + window.location.pathname + "?report=" + encoded;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          setShareToast(true);
          setTimeout(function() { setShareToast(false); }, 3000);
        });
      }
    } catch(e) {}
  }

  function formatCurrency(n) {
    if (!n && n !== 0) return currency.symbol + "0";
    const v = n * currency.rate;
    if (v >= 1000000000) return currency.symbol + (v/1000000000).toFixed(1) + "B";
    if (v >= 1000000) return currency.symbol + (v/1000000).toFixed(1) + "M";
    if (v >= 1000) return currency.symbol + (v/1000).toFixed(0) + "K";
    return currency.symbol + Math.round(v).toLocaleString();
  }

  const sevColor = s => {
    const n = parseInt(s, 10);
    return ["","#4ade80","#a3e635","#facc15","#fb923c","#f87171"][n] || "#888";
  };

  const priStyle = p => {
    const map = { High: {background:"#ef4444",color:"#fff"}, Medium: {background:"#eab308",color:"#000"}, Low: {background:"#22c55e",color:"#fff"} };
    return map[p] || {background:"#555",color:"#fff"};
  };
  const cmpStyle = c => {
    const map = { Low: {background:"#059669",color:"#fff"}, Medium: {background:"#2563eb",color:"#fff"}, High: {background:"#7c3aed",color:"#fff"} };
    return map[c] || {background:"#555",color:"#fff"};
  };

  const TABS = [
    ["executive_summary", "Summary"],
    ["company_overview", "Company"],
    ["pain_points", "Pain Points"],
    ["ai_agents", "AI Agents"],
    ["roi_modeling", "ROI Model"],
    ["roadmap", "Roadmap"],
    ["chart_data", "Charts"],
    ["methodology", "Methodology"]
  ];

  const TAB_ICONS = {
    executive_summary: "📋",
    company_overview: "🏢",
    pain_points: "⚠",
    ai_agents: "🤖",
    roi_modeling: "📈",
    roadmap: "🗺",
    chart_data: "📊",
    methodology: "🔬"
  };

  return (
    <div style={{fontFamily:"'IBM Plex Mono','Courier New',monospace",background:"#F8FAFB",minHeight:"100vh",color:"#1A2236"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0D1220}::-webkit-scrollbar-thumb{background:#00FFD1;border-radius:2px}
        .tab-btn{transition:all 0.2s;border-bottom:2px solid transparent;white-space:nowrap}
        .tab-btn:hover{background:rgba(0,255,209,0.08)!important}
        .tab-btn.active{border-bottom:2px solid #00FFD1!important;color:#00FFD1!important}
        .ifield{background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;padding:10px 14px;color:#1A2236;font-family:inherit;font-size:13px;width:100%;outline:none;transition:border-color 0.2s,box-shadow 0.2s}
        .ifield:focus{border-color:#0D7377;box-shadow:0 0 0 3px rgba(13,115,119,0.12)}
        .ifield::placeholder{color:#B4B2A9}
        .gbtn{background:#0D7377;color:#FFFFFF;font-weight:600;border:none;border-radius:8px;padding:14px 32px;font-family:inherit;font-size:14px;cursor:pointer;letter-spacing:0.01em;transition:all 0.2s}
        .gbtn:hover{background:#085041;transform:translateY(-1px);box-shadow:0 4px 16px rgba(13,115,119,0.25)}
        .gbtn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        .dbtn{background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;color:#5F5E5A;padding:14px 24px;font-family:inherit;font-size:13px;cursor:pointer;transition:all 0.2s;font-weight:500}
        .dbtn:hover{border-color:#0D7377;color:#0D7377;background:#EAF3DE}
        .gsbtn{background:transparent;border:1px solid rgba(0,255,209,0.3);border-radius:6px;color:#00FFD1;padding:6px 14px;font-family:inherit;font-size:11px;cursor:pointer;letter-spacing:1px;transition:all 0.2s}
        .gsbtn:hover{background:rgba(0,255,209,0.08)}
        .gsbtn:disabled{opacity:0.5;cursor:not-allowed}
        .card{background:#FFFFFF;border:0.5px solid #E2E8F0;border-radius:12px;padding:20px}
        .cteal{border-color:#9FE1CB!important;background:#F8FAFB!important}
        .camber{border-color:#FAC775!important;background:#FAEEDA!important}
        .slabel{font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#0D7377;font-weight:600;margin-bottom:8px}
        .bnum{font-size:32px;font-weight:700;color:#0D7377;line-height:1}
        .scard{border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;background:rgba(255,255,255,0.025)}
        .est-badge{font-size:9px;background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.3);color:#fbbf24;padding:2px 6px;border-radius:4px;letter-spacing:1px;vertical-align:middle;margin-left:6px;font-weight:600;font-family:'IBM Plex Mono',monospace}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .pdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;animation:pulse 1.5s infinite;display:inline-block}
        .toast{position:fixed;bottom:24px;right:24px;background:#00FFD1;color:#080C14;padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;letter-spacing:1px;z-index:9999;animation:slideUp 0.3s ease;box-shadow:0 4px 24px rgba(0,255,209,0.4)}
        .tab-content{animation:fadeIn 0.25s ease}
        @media(max-width:640px){.rmgrid{grid-template-columns:1fr 1fr!important}.cgrid{grid-template-columns:1fr!important}.sgrid{grid-template-columns:1fr!important}}
      `}</style>

      {/* SHARE TOAST */}
      {shareToast && <div className="toast">✓ SHAREABLE LINK COPIED TO CLIPBOARD</div>}

      {/* STICKY HEADER */}
      <div style={{borderBottom:"1px solid rgba(0,255,209,0.12)",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"rgba(248,250,251,0.97)",backdropFilter:"blur(12px)",zIndex:100,gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{width:32,height:32,background:"linear-gradient(135deg,#00FFD1,#7B61FF)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,letterSpacing:1}}>AI AUDIT ENGINE</div>
            <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",letterSpacing:2}}>AUTOMATION INTELLIGENCE PLATFORM</div>
          </div>
        </div>
        {stage==="report" && (
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <select value={currency.code}
              onChange={e => { const c = CURRENCIES.find(x => x.code === e.target.value); if(c) setCurrency(c); }}
              style={{background:"rgba(0,255,209,0.06)",border:"1px solid rgba(0,255,209,0.25)",borderRadius:6,color:"#00FFD1",padding:"5px 10px",fontFamily:"inherit",fontSize:11,cursor:"pointer",outline:"none"}}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code} style={{background:"#0D1220",color:"#E8EDF5"}}>{c.label}</option>)}
            </select>
            <button className="gsbtn" onClick={shareReport} title="Copy shareable link to clipboard">🔗 Share</button>
            <button className="gsbtn" onClick={exportReport} disabled={exportLoading}>
              {exportLoading ? "⏳ Generating..." : "⬇ Export PDF"}
            </button>
            <button className="gsbtn" onClick={clearReport}>← New Audit</button>
          </div>
        )}
      </div>

      {/* ─── INPUT STAGE ─── */}
      {stage==="input" && (
        <div style={{maxWidth:720,margin:"0 auto",padding:"60px 24px"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#EAF3DE",border:"1px solid #C0DD97",borderRadius:99,padding:"4px 14px",marginBottom:20}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#639922",display:"inline-block"}}></span>
              <span style={{fontSize:12,color:"#3B6D11",fontWeight:500}}>Free to try · No signup required</span>
            </div>
            <div style={{fontSize:38,fontWeight:700,lineHeight:1.15,margin:"0 0 12px",letterSpacing:"-0.02em",color:"#1A2236"}}>
              Get a $10,000 AI audit<br/>
              <span style={{color:"#0D7377"}}>in under 60 seconds</span>
            </div>
            <div style={{color:"#5F5E5A",fontSize:15,lineHeight:1.7,maxWidth:460,margin:"0 auto 12px"}}>
              Submit any company's digital presence. Receive ROI modeling, agent prescriptions, and a 90-day deployment roadmap.
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap",marginTop:16}}>
              {[["285%","avg ROI reported"],["<60s","to generate"],["$10K+","consulting value"]].map(([v,l]) => (
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:700,color:"#0D7377"}}>{v}</div>
                  <div style={{fontSize:11,color:"#888780",marginTop:1}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{position:"relative",overflow:"hidden",marginBottom:16}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#00FFD1,#7B61FF,#FF6B35)"}}/>
            <div style={{marginBottom:20}}>
              <div className="slabel">
                Company Website
                <span style={{color:"rgba(232,237,245,0.35)",fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:10,marginLeft:8}}>— most important field</span>
              </div>
              <input className="ifield" placeholder="https://yourcompany.com"
                value={inputs.website}
                onChange={e => setInputs(p => ({...p, website: e.target.value}))}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div>
                <div className="slabel">LinkedIn URL <span style={{color:"rgba(232,237,245,0.3)",fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:10}}>optional</span></div>
                <input className="ifield" placeholder="linkedin.com/company/name"
                  value={inputs.linkedin}
                  onChange={e => setInputs(p => ({...p, linkedin: e.target.value}))}/>
              </div>
              <div>
                <div className="slabel">Instagram <span style={{color:"rgba(232,237,245,0.3)",fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:10}}>optional</span></div>
                <input className="ifield" placeholder="instagram.com/yourhandle"
                  value={inputs.instagram}
                  onChange={e => setInputs(p => ({...p, instagram: e.target.value}))}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
              <div>
                <div className="slabel">Facebook <span style={{color:"rgba(232,237,245,0.3)",fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:10}}>optional</span></div>
                <input className="ifield" placeholder="facebook.com/yourpage"
                  value={inputs.facebook}
                  onChange={e => setInputs(p => ({...p, facebook: e.target.value}))}/>
              </div>
              <div>
                <div className="slabel">Business Context <span style={{color:"rgba(232,237,245,0.3)",fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:10}}>optional</span></div>
                <input className="ifield" placeholder="e.g. SaaS, 20 staff, B2B, Lagos..."
                  value={inputs.notes}
                  onChange={e => setInputs(p => ({...p, notes: e.target.value}))}/>
              </div>
            </div>
            {error && (
              <div style={{color:"#f87171",fontSize:13,marginBottom:16,padding:"10px 14px",background:"rgba(248,113,113,0.08)",borderRadius:6,border:"1px solid rgba(248,113,113,0.2)"}}>
                &#9888; {error}
              </div>
            )}
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="gbtn" onClick={runAudit}>&#9889; Generate Full Audit Report</button>
              <button className="dbtn" onClick={loadDemo}>&#9654; Try Demo (Shopify)</button>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
            {[
              ["Pain Points","Auto-diagnosed with severity scoring & annual cost of inaction"],
              ["ROI Model","3-scenario financial projection with 12-month divergence chart"],
              ["90-Day Plan","Phase-by-phase roadmap with tools, goals & success metrics"]
            ].map(([t,d]) => (
              <div key={t} className="card" style={{textAlign:"center",padding:16}}>
                <div style={{fontSize:12,fontWeight:600,color:"#00FFD1",marginBottom:4}}>{t}</div>
                <div style={{fontSize:11,color:"rgba(232,237,245,0.4)",lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>

          <div style={{padding:"12px 16px",background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
            <span style={{fontSize:10,color:"rgba(232,237,245,0.3)",letterSpacing:1}}>POWERED BY</span>
            <span style={{fontSize:11,color:"rgba(232,237,245,0.5)",fontWeight:600}}>Claude AI (Anthropic)</span>
            <span style={{fontSize:10,color:"rgba(232,237,245,0.15)"}}>|</span>
            <span style={{fontSize:10,color:"rgba(232,237,245,0.3)"}}>AI-generated estimates · always validate before acting</span>
          </div>
        </div>
      )}

      {/* ─── ANALYZING STAGE ─── */}
      {stage==="analyzing" && (
        <div style={{maxWidth:560,margin:"0 auto",padding:"80px 24px"}}>
          <div className="card" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:16,fontWeight:600,color:"#1A2236",marginBottom:4}}>
              Analyzing {inputs.website || "company"}...
            </div>
            <div style={{fontSize:12,color:"#888780",marginBottom:24}}>
              This takes 20–60 seconds. Claude is researching your company in real time.
            </div>
            {[
              {label:"Scanning digital footprint",detail:"Reading website, social profiles..."},
              {label:"Diagnosing business model",detail:"Identifying revenue streams & segments..."},
              {label:"Identifying pain points",detail:"Mapping operational inefficiencies..."},
              {label:"Prescribing AI agents",detail:"Matching agents to each pain point..."},
              {label:"Modeling ROI scenarios",detail:"Running conservative, moderate, aggressive..."},
              {label:"Building 90-day roadmap",detail:"Phasing the deployment plan..."},
              {label:"Generating visual data",detail:"Structuring charts & heatmap..."},
              {label:"Compiling executive report",detail:"Finalising your audit..."}
            ].map((step,i) => {
              const done = i < progress/12;
              const active = Math.floor(progress/12) === i;
              return (
                <div key={i} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:done||active?500:400,color:done?"#27500A":active?"#185FA5":"#B4B2A9"}}>
                      {done?"✓ ":active?"⟳ ":""}{step.label}
                    </span>
                    <span style={{fontSize:11,color:done?"#639922":active?"#378ADD":"#D3D1C7"}}>
                      {done?"Done":active?step.detail:"Queued"}
                    </span>
                  </div>
                  <div style={{height:3,background:"#F1EFE8",borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:done?"100%":active?"55%":"0%",background:done?"#639922":"#378ADD",borderRadius:99,transition:"width 0.6s ease"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── REPORT STAGE ─── */}
      {stage==="report" && report && (
        <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 24px 60px"}}>

          {/* DISMISSIBLE DISCLAIMER BANNER */}
          {!dismissedBanner && (
            <div style={{marginBottom:16,padding:"10px 16px",background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,animation:"fadeIn 0.4s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:14,flexShrink:0}}>&#9888;</span>
                <span style={{fontSize:11,color:"rgba(232,237,245,0.65)",lineHeight:1.5}}>
                  <strong style={{color:"#fbbf24"}}>AI-generated estimates</strong> — projections are based on industry benchmarks and publicly available data. Validate against actual business data before making investment decisions.
                </span>
              </div>
              <button
                onClick={() => setDismissedBanner(true)}
                style={{background:"none",border:"none",color:"rgba(232,237,245,0.3)",cursor:"pointer",fontSize:18,padding:"0 4px",flexShrink:0,lineHeight:1}}>
                &#215;
              </button>
            </div>
          )}

          {/* REPORT HEADER CARD */}
          <div className="card cteal" style={{marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{fontSize:10,letterSpacing:2,color:"#00FFD1",marginBottom:4}}>
                AI AUTOMATION AUDIT REPORT
                <span style={{color:"rgba(232,237,245,0.35)",marginLeft:8}}>· Powered by Claude AI (Anthropic)</span>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800}}>{report.company_name}</div>
              <div style={{fontSize:13,color:"rgba(232,237,245,0.5)",marginTop:2}}>{report.industry}</div>
            </div>
            <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
              {[
                ["Annual Savings", formatCurrency(report.executive_summary && report.executive_summary.total_annual_savings)],
                ["12-Mo ROI", (report.executive_summary && report.executive_summary.roi_12_month) + "%"]
              ].map(([l,v]) => (
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",letterSpacing:1,marginBottom:2}}>{l}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"#00FFD1",lineHeight:1}}>
                    {v}
                    <span className="est-badge">est.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STICKY TAB BAR */}
          <div style={{
            position:"sticky", top:61, zIndex:90,
            background:"rgba(8,12,20,0.97)", backdropFilter:"blur(12px)",
            borderBottom:"1px solid rgba(255,255,255,0.08)",
            marginLeft:-24, marginRight:-24, paddingLeft:24, paddingRight:24,
            marginBottom:24
          }}>
            <div style={{display:"flex",overflowX:"auto",gap:0}}>
              {TABS.map(([key,label]) => (
                <button
                  key={key}
                  className={"tab-btn" + (activeTab===key ? " active" : "")}
                  onClick={() => setActiveTab(key)}
                  style={{
                    background:"transparent", border:"none",
                    color: activeTab===key ? "#00FFD1" : "rgba(232,237,245,0.5)",
                    padding:"11px 14px", fontFamily:"inherit", fontSize:11,
                    cursor:"pointer", whiteSpace:"nowrap", letterSpacing:0.5
                  }}>
                  {TAB_ICONS[key]} {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── TAB: SUMMARY ── */}
          {activeTab==="executive_summary" && (
            <div className="tab-content">
              <div className="card cteal" style={{marginBottom:14}}>
                <div className="slabel">Headline Finding</div>
                <div style={{fontSize:17,fontWeight:600,lineHeight:1.5}}>{report.executive_summary && report.executive_summary.headline}</div>
              </div>
              <div className="card" style={{marginBottom:14}}>
                <div className="slabel">Executive Overview</div>
                <div style={{fontSize:13,lineHeight:1.8,color:"rgba(232,237,245,0.8)"}}>{report.executive_summary && report.executive_summary.overview}</div>
              </div>
              <div className="card" style={{marginBottom:14}}>
                <div className="slabel">Top 3 Opportunities</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:4}}>
                  {report.executive_summary && report.executive_summary.top_3_opportunities && report.executive_summary.top_3_opportunities.map((o,i) => (
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{minWidth:24,height:24,background:"linear-gradient(135deg,"+COLORS[i]+","+(COLORS[i+1]||COLORS[0])+")",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#080C14",flexShrink:0}}>{i+1}</div>
                      <div style={{fontSize:13,lineHeight:1.6,color:"rgba(232,237,245,0.85)"}}>{o}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
                {[
                  ["Pain Points", report.pain_points && report.pain_points.length || 0, "identified"],
                  ["AI Agents", report.ai_agents && report.ai_agents.length || 0, "prescribed"],
                  ["Annual Savings", formatCurrency(report.executive_summary && report.executive_summary.total_annual_savings), "projected (est.)"],
                  ["ROI", (report.executive_summary && report.executive_summary.roi_12_month) + "%", "12 months (est.)"]
                ].map(([l,v,s]) => (
                  <div key={l} className="card" style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",letterSpacing:1,marginBottom:6}}>{l}</div>
                    <div className="bnum" style={{fontSize:28}}>{v}</div>
                    <div style={{fontSize:10,color:"rgba(232,237,245,0.35)",marginTop:4}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: COMPANY ── */}
          {activeTab==="company_overview" && report.company_overview && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="card">
                <div className="slabel">Business Model</div>
                <div style={{fontSize:13,lineHeight:1.7,color:"rgba(232,237,245,0.8)"}}>{report.company_overview.business_model}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div className="card">
                  <div className="slabel">Revenue Streams</div>
                  {report.company_overview.revenue_streams && report.company_overview.revenue_streams.map((r,i) => (
                    <div key={i} style={{fontSize:12,color:"rgba(232,237,245,0.75)",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>&#8594; {r}</div>
                  ))}
                </div>
                <div className="card">
                  <div className="slabel">Acquisition Channels</div>
                  {report.company_overview.acquisition_channels && report.company_overview.acquisition_channels.map((r,i) => (
                    <div key={i} style={{fontSize:12,color:"rgba(232,237,245,0.75)",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>&#8594; {r}</div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="slabel">Target Customers</div>
                <div style={{fontSize:13,color:"rgba(232,237,245,0.8)"}}>{report.company_overview.target_customers}</div>
              </div>
              <div className="card cteal">
                <div className="slabel">Key Observations</div>
                <div style={{fontSize:13,lineHeight:1.7,color:"rgba(232,237,245,0.85)"}}>{report.company_overview.key_observations}</div>
              </div>
            </div>
          )}

          {/* ── TAB: PAIN POINTS ── */}
          {activeTab==="pain_points" && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:12}}>
              {report.pain_points && report.pain_points.map((p,i) => {
                const sev = parseInt(p.severity, 10) || 1;
                const sc = sevColor(sev);
                const bgTints = ["","rgba(74,222,128,0.06)","rgba(163,230,53,0.06)","rgba(250,204,21,0.06)","rgba(251,146,60,0.07)","rgba(248,113,113,0.08)"];
                const bg = bgTints[sev] || "rgba(255,255,255,0.03)";
                return (
                  <div key={i} style={{
                    background:bg,
                    borderTop:"1px solid rgba(255,255,255,0.06)",
                    borderRight:"1px solid rgba(255,255,255,0.06)",
                    borderBottom:"1px solid rgba(255,255,255,0.06)",
                    borderLeft:"5px solid "+sc,
                    borderRadius:10, padding:20
                  }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                      <div>
                        <div style={{fontSize:10,color:"rgba(232,237,245,0.45)",letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>{p.category}</div>
                        <div style={{fontWeight:600,fontSize:15,color:sc}}>{p.title}</div>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",letterSpacing:1}}>SEVERITY</div>
                        <div style={{display:"flex",gap:4}}>
                          {[1,2,3,4,5].map(n => (
                            <div key={n} style={{
                              width:14, height:14, borderRadius:3,
                              background: n<=sev ? sc : "rgba(255,255,255,0.06)",
                              boxShadow: n<=sev ? "0 0 8px "+sc : "none",
                              border: "1px solid " + (n<=sev ? sc : "rgba(255,255,255,0.25)")
                            }}/>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:"rgba(232,237,245,0.75)",lineHeight:1.7,marginBottom:10}}>{p.description}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                      <div style={{fontSize:11,color:"rgba(232,237,245,0.4)",fontStyle:"italic",maxWidth:"65%"}}>{p.evidence}</div>
                      <div style={{background:"rgba(248,113,113,0.12)",border:"1px solid rgba(248,113,113,0.35)",borderRadius:4,padding:"4px 12px",fontSize:12,color:"#fca5a5",flexShrink:0}}>
                        Annual Cost: <strong>{formatCurrency(p.cost_of_inaction_annual)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TAB: AI AGENTS ── */}
          {activeTab==="ai_agents" && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:14}}>
              {report.ai_agents && report.ai_agents.map((a,i) => (
                <div key={i} className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{width:36,height:36,background:"linear-gradient(135deg,"+COLORS[i%COLORS.length]+","+(COLORS[(i+2)%COLORS.length])+")",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>&#129302;</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:15}}>{a.agent_name}</div>
                        <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",marginTop:2}}>~{a.timeline_weeks} week deployment</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,padding:"3px 9px",borderRadius:4,fontWeight:600,...priStyle(a.priority)}}>{a.priority} Priority</span>
                      <span style={{fontSize:10,padding:"3px 9px",borderRadius:4,fontWeight:600,...cmpStyle(a.complexity)}}>{a.complexity} Complexity</span>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
                    <div>
                      <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",letterSpacing:1,marginBottom:4}}>PROBLEM</div>
                      <div style={{fontSize:12,color:"rgba(232,237,245,0.7)",lineHeight:1.5}}>{a.problem_solved}</div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",letterSpacing:1,marginBottom:4}}>SOLUTION</div>
                      <div style={{fontSize:12,color:"rgba(232,237,245,0.7)",lineHeight:1.5}}>{a.solution}</div>
                    </div>
                  </div>
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[...(a.integrations||[]),...(a.no_code_tools||[])].map((t,j) => (
                      <span key={j} style={{fontSize:10,padding:"3px 9px",background:"rgba(123,97,255,0.15)",border:"1px solid rgba(123,97,255,0.25)",borderRadius:20,color:"#a78bfa"}}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB: ROI MODEL ── */}
          {activeTab==="roi_modeling" && report.roi_modeling && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:20}}>
              <div className="card">
                <div className="slabel">Model Assumptions</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginTop:8}}>
                  {Object.entries(report.roi_modeling.assumptions||{}).map(([k,v]) => (
                    <div key={k} style={{background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"10px 12px"}}>
                      <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>{k.replace(/_/g," ")}</div>
                      <div style={{fontWeight:600,fontSize:14}}>
                        {k.includes("wage")||k.includes("value") ? formatCurrency(v) : k.includes("rate") ? v+"%" : v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sgrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
                {Object.entries(report.roi_modeling.scenarios||{}).map(([sc,d],si) => (
                  <div key={sc} className="scard" style={{borderColor:si===1?"rgba(0,255,209,0.3)":"rgba(255,255,255,0.08)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:10,letterSpacing:2,color:si===1?"#00FFD1":"rgba(232,237,245,0.4)",textTransform:"uppercase",fontWeight:600}}>{sc}</div>
                      {si===1 && <div style={{fontSize:9,background:"rgba(0,255,209,0.15)",color:"#00FFD1",padding:"2px 8px",borderRadius:10}}>RECOMMENDED</div>}
                    </div>
                    {[
                      ["Hours Saved/Mo", d.hours_saved_monthly+"h"],
                      ["Labor Savings/Mo", formatCurrency(d.labor_savings_monthly)],
                      ["Revenue Boost/Mo", formatCurrency(d.revenue_increase_monthly)],
                      ["Annual Benefit", formatCurrency(d.annual_benefit)],
                      ["Break Even", d.break_even_months+" mo"],
                      ["ROI", d.roi_percent+"%"]
                    ].map(([l,v]) => (
                      <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                        <span style={{fontSize:11,color:"rgba(232,237,245,0.5)"}}>{l}</span>
                        <span style={{fontSize:12,fontWeight:600,color:si===1?"#00FFD1":"#E8EDF5"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {report.roi_modeling.monthly_projection && report.roi_modeling.monthly_projection.length > 0 && (
                <div className="card">
                  <div className="slabel">12-Month Revenue Projection: With AI vs Without AI</div>
                  <div style={{fontSize:11,color:"rgba(232,237,245,0.4)",marginBottom:8}}>
                    Moderate scenario. Without AI = flat organic growth baseline. With AI = compounding automation returns.
                  </div>
                  <div style={{display:"flex",gap:20,marginBottom:12,flexWrap:"wrap"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:24,height:3,background:"#00FFD1",borderRadius:2}}/>
                      <span style={{fontSize:11,color:"rgba(232,237,245,0.6)"}}>With AI</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:24,height:2,background:"rgba(248,113,113,0.7)",borderRadius:2,borderTop:"1px dashed rgba(248,113,113,0.7)"}}/>
                      <span style={{fontSize:11,color:"rgba(232,237,245,0.6)"}}>Without AI (organic baseline)</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={report.roi_modeling.monthly_projection} margin={{top:10,right:20,left:10,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                      <XAxis dataKey="month" tick={{fontSize:10,fill:"rgba(232,237,245,0.4)"}}/>
                      <YAxis tick={{fontSize:10,fill:"rgba(232,237,245,0.4)"}} tickFormatter={v=>formatCurrency(v)} width={65}/>
                      <Tooltip
                        formatter={v => formatCurrency(v)}
                        contentStyle={{background:"#0D1220",border:"1px solid rgba(0,255,209,0.2)",borderRadius:6,fontFamily:"inherit",fontSize:12}}/>
                      <Line type="monotone" dataKey="without_ai" stroke="#f87171" strokeWidth={2} dot={false} name="Without AI" strokeDasharray="5 5"/>
                      <Line type="monotone" dataKey="with_ai" stroke="#00FFD1" strokeWidth={2.5} dot={false} name="With AI"/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: ROADMAP ── */}
          {activeTab==="roadmap" && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:16}}>
              {report.roadmap && report.roadmap.map((phase,i) => (
                <div key={i} className="card" style={{borderLeft:"3px solid "+COLORS[i%COLORS.length]}}>
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
                    <div style={{width:32,height:32,background:COLORS[i%COLORS.length],borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#080C14",fontSize:14,flexShrink:0}}>{i+1}</div>
                    <div style={{fontWeight:600,fontSize:15}}>{phase.phase}</div>
                  </div>
                  <div className="rmgrid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
                    {[["Goals",phase.goals],["Actions",phase.actions],["Tools",phase.tools],["Success Metrics",phase.success_metrics]].map(([label,items]) => (
                      <div key={label}>
                        <div style={{fontSize:10,color:"rgba(232,237,245,0.4)",letterSpacing:1,marginBottom:8,textTransform:"uppercase"}}>{label}</div>
                        {items && items.map((item,j) => (
                          <div key={j} style={{fontSize:11,color:"rgba(232,237,245,0.7)",lineHeight:1.5,marginBottom:6,paddingLeft:8,borderLeft:"2px solid rgba(255,255,255,0.1)"}}>{item}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB: CHARTS ── */}
          {activeTab==="chart_data" && report.chart_data && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:24}}>
              <div className="cgrid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                {report.chart_data.time_saved_by_category && report.chart_data.time_saved_by_category.length > 0 && (
                  <div className="card">
                    <div className="slabel">Time Saved by Category (hrs/month)</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={report.chart_data.time_saved_by_category} layout="vertical" margin={{left:10,right:30}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                        <XAxis type="number" tick={{fontSize:10,fill:"rgba(232,237,245,0.4)"}}/>
                        <YAxis type="category" dataKey="category" tick={{fontSize:9,fill:"rgba(232,237,245,0.5)"}} width={110}/>
                        <Tooltip
                          contentStyle={{background:"#0D1220",border:"1px solid rgba(0,255,209,0.2)",fontSize:12,fontFamily:"inherit"}}
                          formatter={v => [v+" hrs/mo","Time Saved"]}/>
                        <Bar dataKey="hours_monthly" fill="#00FFD1" radius={[0,3,3,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {report.chart_data.inefficiency_breakdown && report.chart_data.inefficiency_breakdown.length > 0 && (
                  <div className="card">
                    <div className="slabel">Operational Inefficiency Breakdown</div>
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie
                          data={report.chart_data.inefficiency_breakdown}
                          dataKey="value" nameKey="name"
                          cx="50%" cy="50%"
                          outerRadius={80} innerRadius={35}
                          labelLine={false}
                          label={(props) => {
                            const {cx, cy, midAngle, outerRadius, value} = props;
                            if(value < 8) return null;
                            const RADIAN = Math.PI / 180;
                            const radius = outerRadius + 18;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            return (
                              <text x={x} y={y} fill="rgba(232,237,245,0.7)" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={9}>{value}%</text>
                            );
                          }}>
                          {report.chart_data.inefficiency_breakdown.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                        </Pie>
                        <Tooltip
                          contentStyle={{background:"#0D1220",border:"1px solid rgba(0,255,209,0.2)",fontSize:11,fontFamily:"inherit",color:"#E8EDF5"}}
                          formatter={(v,n) => [v+"%",n]}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"6px 14px",justifyContent:"center",marginTop:4}}>
                      {report.chart_data.inefficiency_breakdown.map((item,i) => (
                        <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                          <div style={{width:10,height:10,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                          <span style={{fontSize:11,color:"#E8EDF5"}}>{item.name} <span style={{color:COLORS[i%COLORS.length],fontWeight:600}}>({item.value}%)</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {report.chart_data.cost_reduction_by_agent && report.chart_data.cost_reduction_by_agent.length > 0 && (
                <div className="card">
                  <div className="slabel">Monthly Cost Reduction by AI Agent ({currency.code})</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={report.chart_data.cost_reduction_by_agent} margin={{top:10,right:10,left:10,bottom:60}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                      <XAxis dataKey="agent" interval={0} tick={(props) => {
                        const {x,y,payload,index} = props;
                        const color = COLORS[index%COLORS.length];
                        const words = (payload.value||"").split(" ");
                        const lines = []; let line = "";
                        words.forEach(w => {
                          if((line+" "+w).length > 14 && line) { lines.push(line); line = w; }
                          else { line = (line ? line+" " : "") + w; }
                        });
                        if(line) lines.push(line);
                        return (
                          <g transform={"translate("+x+","+y+")"}>
                            {lines.map((l,i) => <text key={i} x={0} y={0} dy={14+i*13} textAnchor="middle" fill={color} fontSize={9} fontFamily="inherit">{l}</text>)}
                          </g>
                        );
                      }}/>
                      <YAxis tick={{fontSize:10,fill:"rgba(232,237,245,0.5)"}} tickFormatter={v=>formatCurrency(v)}/>
                      <Tooltip
                        formatter={v => formatCurrency(v)}
                        contentStyle={{background:"#0D1220",border:"1px solid rgba(0,255,209,0.2)",fontSize:12,fontFamily:"inherit",color:"#E8EDF5"}}
                        itemStyle={{color:"#00FFD1"}} labelStyle={{color:"#E8EDF5"}}/>
                      <Bar dataKey="monthly_savings" radius={[3,3,0,0]}>
                        {report.chart_data.cost_reduction_by_agent.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {report.chart_data.opportunity_heatmap && report.chart_data.opportunity_heatmap.length > 0 && (
                <div className="card">
                  <div className="slabel">AI Opportunity Heatmap — Priority Score (0–100)</div>
                  <div style={{fontSize:11,color:"rgba(232,237,245,0.4)",marginBottom:12}}>
                    Score = (Impact × 0.6) + (Feasibility × 0.4) × 10. Higher = deploy first.
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
                    {report.chart_data.opportunity_heatmap.map((item,i) => {
                      const score = item.priority_score || Math.round((item.impact*0.6+item.feasibility*0.4)*10);
                      const intensity = Math.min(score/100, 1);
                      return (
                        <div key={i} style={{
                          background:"rgba(0,255,209,"+(0.05+intensity*0.3)+")",
                          border:"1px solid rgba(0,255,209,"+(0.1+intensity*0.45)+")",
                          borderRadius:6, padding:"12px 10px", textAlign:"center"
                        }}>
                          <div style={{fontSize:10,color:"rgba(232,237,245,0.6)",marginBottom:6}}>{item.area}</div>
                          <div style={{fontSize:22,fontWeight:800,color:"#00FFD1",fontFamily:"'Syne',sans-serif"}}>{score}</div>
                          <div style={{fontSize:9,color:"rgba(232,237,245,0.4)",marginTop:4}}>Impact {item.impact}/10 · Ease {item.feasibility}/10</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: METHODOLOGY ── */}
          {activeTab==="methodology" && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:16}}>
              <div className="card camber">
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:18,flexShrink:0}}>&#9888;</span>
                  <div>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:6}}>Important Disclaimer</div>
                    <div style={{fontSize:12,lineHeight:1.7,color:"rgba(232,237,245,0.75)"}}>
                      {(report.data_methodology && report.data_methodology.disclaimer) || "All projections are AI-generated estimates based on industry benchmarks and publicly available data. They should be treated as indicative only and validated against actual business data before making investment decisions."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="slabel">Data Sources & Calculation Methods</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
                  {[
                    ["ROI Calculation Basis", report.data_methodology && report.data_methodology.roi_basis, "#00FFD1"],
                    ["Wage Rate Source", report.data_methodology && report.data_methodology.wage_source, "#FF6B35"],
                    ["Lead Volume Estimation", report.data_methodology && report.data_methodology.lead_data_source, "#FFD700"],
                    ["Conversion Rate Benchmark", report.data_methodology && report.data_methodology.conversion_benchmark, "#7B61FF"],
                    ["Time Savings Methodology", report.data_methodology && report.data_methodology.time_savings_method, "#00B4D8"]
                  ].map(([label,value,color]) => (
                    <div key={label} style={{padding:"12px 14px",background:"rgba(255,255,255,0.03)",borderRadius:6,borderLeft:"2px solid "+color}}>
                      <div style={{fontSize:11,fontWeight:600,color:color,marginBottom:4}}>{label}</div>
                      <div style={{fontSize:12,color:"rgba(232,237,245,0.7)",lineHeight:1.6}}>{value || "Based on industry-standard AI automation benchmarks."}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="slabel">Scoring & Calculation Formulas</div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
                  {[
                    ["Pain Point Severity (1–5)","Rated by operational impact frequency × financial exposure. Severity 5 = immediate revenue risk or critical failure point."],
                    ["Cost of Inaction","(Staff hours on task/week × 52 × hourly wage) + estimated missed revenue. Annual figure."],
                    ["ROI Scenarios","Conservative = 25th percentile outcomes. Moderate = median industry benchmark. Aggressive = 75th percentile for high-execution teams."],
                    ["Break-Even Timeline","Implementation cost divided by total monthly benefit (labor savings + revenue increase). Excludes ongoing maintenance."],
                    ["Opportunity Heatmap","Priority Score = (Impact x 0.6 + Feasibility x 0.4) x 10. Impact = revenue/time value (0-10). Feasibility = ease of no-code deployment (0-10)."],
                    ["AI Model","Analysis by Claude (claude-sonnet-4-20250514) by Anthropic. Data sourced from publicly available digital assets only."]
                  ].map(([t,d]) => (
                    <div key={t} style={{padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:6}}>
                      <div style={{fontSize:11,fontWeight:600,color:"rgba(232,237,245,0.8)",marginBottom:3}}>{t}</div>
                      <div style={{fontSize:11,color:"rgba(232,237,245,0.5)",lineHeight:1.6}}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{borderColor:"rgba(123,97,255,0.2)",background:"rgba(123,97,255,0.04)"}}>
                <div className="slabel">Recommended Validation Steps Before Acting</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
                  {[
                    "1. Verify staff hourly wage against actual payroll data",
                    "2. Audit real weekly hours on manual tasks via time-tracking for 2 weeks",
                    "3. Pull actual lead volume and conversion rates from your CRM or analytics",
                    "4. Get implementation quotes from 2–3 no-code automation agencies",
                    "5. Run a 30-day pilot on the highest-priority AI agent before full rollout"
                  ].map((s,i) => (
                    <div key={i} style={{fontSize:12,color:"rgba(232,237,245,0.7)",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{s}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}