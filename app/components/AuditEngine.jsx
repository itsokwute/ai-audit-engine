"use client";

import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0D7377","#639922","#BA7517","#185FA5","#993556","#3B6D11"];

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
    return ["","#22c55e","#84cc16","#eab308","#f97316","#ef4444"][n] || "#888";
  };

  const priStyle = p => {
    const map = {
      High: { background:"#FCEBEB", color:"#A32D2D", border:"1px solid #F09595" },
      Medium: { background:"#FAEEDA", color:"#854F0B", border:"1px solid #EF9F27" },
      Low: { background:"#EAF3DE", color:"#27500A", border:"1px solid #97C459" }
    };
    return map[p] || { background:"#F1EFE8", color:"#5F5E5A", border:"1px solid #B4B2A9" };
  };

  const cmpStyle = c => {
    const map = {
      Low: { background:"#EAF3DE", color:"#27500A", border:"1px solid #97C459" },
      Medium: { background:"#E6F1FB", color:"#185FA5", border:"1px solid #85B7EB" },
      High: { background:"#EEEDFE", color:"#3C3489", border:"1px solid #AFA9EC" }
    };
    return map[c] || { background:"#F1EFE8", color:"#5F5E5A", border:"1px solid #B4B2A9" };
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

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif",background:"#F8FAFB",minHeight:"100vh",color:"#1A2236"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#F1EFE8}
        ::-webkit-scrollbar-thumb{background:#B4B2A9;border-radius:2px}
        .tab-btn{transition:all 0.15s;border-bottom:2px solid transparent;white-space:nowrap;font-family:inherit}
        .tab-btn:hover{background:#F1EFE8!important;color:#0D7377!important}
        .tab-btn.active{border-bottom:2px solid #0D7377!important;color:#0D7377!important;background:#EAF3DE!important;font-weight:600!important}
        .ifield{background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;padding:10px 14px;color:#1A2236;font-family:inherit;font-size:14px;width:100%;outline:none;transition:border-color 0.2s,box-shadow 0.2s}
        .ifield:focus{border-color:#0D7377;box-shadow:0 0 0 3px rgba(13,115,119,0.12)}
        .ifield::placeholder{color:#B4B2A9}
        .gbtn{background:#0D7377;color:#FFFFFF;font-weight:700;border:none;border-radius:8px;padding:14px 32px;font-family:inherit;font-size:15px;cursor:pointer;letter-spacing:0.01em;transition:all 0.2s}
        .gbtn:hover{background:#085041;transform:translateY(-1px);box-shadow:0 4px 16px rgba(13,115,119,0.3)}
        .gbtn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        .dbtn{background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;color:#5F5E5A;padding:14px 24px;font-family:inherit;font-size:14px;cursor:pointer;transition:all 0.2s;font-weight:500}
        .dbtn:hover{border-color:#0D7377;color:#0D7377;background:#EAF3DE}
        .gsbtn{background:#FFFFFF;border:1px solid #CBD5E1;border-radius:6px;color:#5F5E5A;padding:7px 16px;font-family:inherit;font-size:12px;cursor:pointer;transition:all 0.2s;font-weight:500}
        .gsbtn:hover{border-color:#0D7377;color:#0D7377;background:#EAF3DE}
        .gsbtn:disabled{opacity:0.5;cursor:not-allowed}
        .card{background:#FFFFFF;border:0.5px solid #E2E8F0;border-radius:12px;padding:20px}
        .cteal{border-color:#9FE1CB!important;background:#F0FAF8!important}
        .camber{border-color:#FAC775!important;background:#FAEEDA!important}
        .slabel{font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#0D7377;font-weight:700;margin-bottom:8px}
        .bnum{font-size:32px;font-weight:700;color:#0D7377;line-height:1}
        .scard{border:0.5px solid #E2E8F0;border-radius:10px;padding:16px;background:#F8FAFB}
        .est-badge{font-size:9px;background:#FAEEDA;border:1px solid #FAC775;color:#854F0B;padding:2px 6px;border-radius:4px;letter-spacing:0.04em;vertical-align:middle;margin-left:6px;font-weight:600}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .toast{position:fixed;bottom:90px;right:24px;background:#1A2236;color:#FFFFFF;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:9999;animation:slideUp 0.3s ease;box-shadow:0 4px 24px rgba(0,0,0,0.2)}
        .tab-content{animation:fadeIn 0.2s ease}
        @media(max-width:640px){.rmgrid{grid-template-columns:1fr 1fr!important}.cgrid{grid-template-columns:1fr!important}.sgrid{grid-template-columns:1fr!important}.stat-row{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.tab-btn{padding:9px 8px!important;font-size:10px!important}}
      `}</style>

      {/* SHARE TOAST */}
      {shareToast && <div className="toast">&#10003; Shareable link copied to clipboard</div>}

      {/* STICKY HEADER */}
      <div style={{
        borderBottom:"0.5px solid #E2E8F0",
        padding:"12px 24px",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        position:"sticky",
        top:0,
        background:"rgba(248,250,251,0.97)",
        backdropFilter:"blur(12px)",
        zIndex:100,
        gap:12
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:34,height:34,background:"#0D7377",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"white",fontWeight:800,fontSize:16}}>A</span>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:15,color:"#1A2236",letterSpacing:"-0.02em"}}>AuditAI</div>
            <div style={{fontSize:10,color:"#888780",letterSpacing:"0.03em",fontWeight:500}}>by Nova_Agentic</div>
          </div>
        </div>

        {stage==="report" && (
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <select value={currency.code}
              onChange={e => { const c = CURRENCIES.find(x => x.code === e.target.value); if(c) setCurrency(c); }}
              style={{background:"#F8FAFB",border:"1px solid #CBD5E1",borderRadius:8,color:"#1A2236",padding:"7px 12px",fontFamily:"inherit",fontSize:12,cursor:"pointer",outline:"none",fontWeight:500}}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
            <button onClick={shareReport} style={{background:"#F0FAF8",border:"1.5px solid #0D7377",borderRadius:8,color:"#0D7377",padding:"7px 14px",fontFamily:"inherit",fontSize:12,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:5,transition:"all 0.2s"}}>
              🔗 Share
            </button>
            <button onClick={exportReport} disabled={exportLoading} style={{background:exportLoading?"#F1EFE8":"#0D7377",border:"1.5px solid #0D7377",borderRadius:8,color:exportLoading?"#888780":"#FFFFFF",padding:"7px 14px",fontFamily:"inherit",fontSize:12,cursor:exportLoading?"not-allowed":"pointer",fontWeight:600,transition:"all 0.2s",opacity:exportLoading?0.7:1}}>
              {exportLoading ? "Generating..." : "↓ Export PDF"}
            </button>
            <button onClick={clearReport} style={{background:"#FFFFFF",border:"1.5px solid #CBD5E1",borderRadius:8,color:"#5F5E5A",padding:"7px 14px",fontFamily:"inherit",fontSize:12,cursor:"pointer",fontWeight:600,transition:"all 0.2s"}}>
              ← New Audit
            </button>
          </div>
        )}
      </div>

      {/* INPUT STAGE */}
      {stage==="input" && (
        <div style={{maxWidth:680,margin:"0 auto",padding:"56px 24px 80px"}}>

          {/* HERO */}
          <div style={{textAlign:"center",marginBottom:40}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#EAF3DE",border:"1px solid #C0DD97",borderRadius:99,padding:"5px 16px",marginBottom:22}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#639922",display:"inline-block"}}></span>
              <span style={{fontSize:12,color:"#3B6D11",fontWeight:600}}>Free to try · No signup required</span>
            </div>
            <h1 style={{fontSize:40,fontWeight:800,lineHeight:1.15,margin:"0 0 14px",letterSpacing:"-0.03em",color:"#1A2236"}}>
              Get a $10,000 AI audit<br/>
              <span style={{color:"#0D7377"}}>in under 60 seconds</span>
            </h1>
            <p style={{color:"#5F5E5A",fontSize:15,lineHeight:1.75,maxWidth:460,margin:"0 auto 16px",fontWeight:400}}>
              Submit any company's digital presence. Receive ROI modeling, agent prescriptions, and a 90-day deployment roadmap.
            </p>
            <div style={{display:"flex",justifyContent:"center",gap:28,flexWrap:"wrap",marginTop:20}}>
              {[["285%","avg ROI reported"],["<60s","to generate"],["$10K+","consulting value"]].map(([v,l]) => (
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:800,color:"#0D7377",letterSpacing:"-0.02em"}}>{v}</div>
                  <div style={{fontSize:11,color:"#888780",marginTop:2,fontWeight:500}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM CARD */}
          <div className="card" style={{position:"relative",overflow:"hidden",marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.04)"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg,#0D7377,#639922,#185FA5)"}}/>

            <div style={{marginBottom:18,marginTop:8}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:"#1A2236",marginBottom:6}}>
                Company Website
                <span style={{marginLeft:8,fontSize:11,color:"#0D7377",background:"#EAF3DE",padding:"1px 7px",borderRadius:4,fontWeight:600}}>Required</span>
              </label>
              <input className="ifield" placeholder="https://yourcompany.com"
                value={inputs.website}
                onChange={e => setInputs(p => ({...p, website: e.target.value}))}/>
              <div style={{fontSize:11,color:"#888780",marginTop:5,fontWeight:400}}>Most important field — the URL is used to research the company in real time</div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              {[
                ["linkedin","LinkedIn URL","linkedin.com/company/name"],
                ["instagram","Instagram","instagram.com/yourhandle"],
                ["facebook","Facebook","facebook.com/yourpage"],
                ["notes","Business Context","e.g. SaaS, 20 staff, B2B, Lagos..."]
              ].map(([key,label,ph]) => (
                <div key={key}>
                  <label style={{display:"block",fontSize:13,fontWeight:600,color:"#1A2236",marginBottom:6}}>
                    {label}
                    <span style={{marginLeft:6,fontSize:11,color:"#888780",fontWeight:400}}>optional</span>
                  </label>
                  <input className="ifield" placeholder={ph}
                    value={inputs[key]}
                    onChange={e => setInputs(p => ({...p, [key]: e.target.value}))}/>
                </div>
              ))}
            </div>

            {error && (
              <div style={{color:"#A32D2D",fontSize:13,marginBottom:16,padding:"10px 14px",background:"#FCEBEB",borderRadius:6,border:"0.5px solid #F09595",fontWeight:500}}>
                &#9888; {error}
              </div>
            )}

            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="gbtn" onClick={runAudit}>Generate my free audit report &#8594;</button>
              <button className="dbtn" onClick={loadDemo}>&#9654; Try Demo (Shopify)</button>
            </div>
          </div>

          {/* FEATURE PREVIEW CARDS */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
            {[
              ["Pain Points","Auto-diagnosed with severity scoring & annual cost of inaction"],
              ["ROI Model","3-scenario financial projection with 12-month divergence chart"],
              ["90-Day Plan","Phase-by-phase roadmap with tools, goals & success metrics"]
            ].map(([t,d]) => (
              <div key={t} style={{background:"#0D7377",borderRadius:10,padding:"18px 14px",textAlign:"center",boxShadow:"0 2px 8px rgba(13,115,119,0.15)"}}>
                <div style={{fontSize:13,fontWeight:700,color:"#FFFFFF",marginBottom:6}}>{t}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",lineHeight:1.6}}>{d}</div>
              </div>
            ))}
          </div>

          {/* POWERED BY */}
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <span style={{fontSize:11,color:"#B4B2A9"}}>Powered by </span>
            <span style={{fontSize:11,color:"#5F5E5A",fontWeight:700}}>Claude AI (Anthropic)</span>
            <span style={{fontSize:11,color:"#D3D1C7",margin:"0 8px"}}>·</span>
            <span style={{fontSize:11,color:"#B4B2A9"}}>AI estimates — validate before acting</span>
          </div>
        </div>
      )}

      {/* ANALYZING STAGE */}
      {stage==="analyzing" && (
        <div style={{maxWidth:560,margin:"0 auto",padding:"80px 24px"}}>
          <div className="card" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:17,fontWeight:700,color:"#1A2236",marginBottom:4}}>
              Analyzing {inputs.website || "company"}...
            </div>
            <div style={{fontSize:13,color:"#888780",marginBottom:24,fontWeight:400}}>
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
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <span style={{fontSize:13,fontWeight:done||active?600:400,color:done?"#27500A":active?"#185FA5":"#B4B2A9"}}>
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

      {/* REPORT STAGE */}
      {stage==="report" && report && (
        <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 24px 120px"}}>

          {/* DISCLAIMER BANNER */}
          {!dismissedBanner && (
            <div style={{marginBottom:14,padding:"10px 16px",background:"#FAEEDA",border:"0.5px solid #FAC775",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,animation:"fadeIn 0.3s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:14,flexShrink:0,color:"#BA7517"}}>&#9888;</span>
                <span style={{fontSize:12,color:"#633806",lineHeight:1.5}}>
                  <strong style={{fontWeight:700}}>AI-generated estimates</strong> — projections are based on industry benchmarks and publicly available data. Validate against actual business data before making investment decisions.
                </span>
              </div>
              <button onClick={() => setDismissedBanner(true)}
                style={{background:"none",border:"none",color:"#B4B2A9",cursor:"pointer",fontSize:20,padding:"0 4px",flexShrink:0,lineHeight:1}}>
                &#215;
              </button>
            </div>
          )}

          {/* REPORT HEADER */}
          <div className="card cteal" style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
              <div>
                <div style={{fontSize:11,letterSpacing:"0.06em",color:"#0D7377",marginBottom:4,textTransform:"uppercase",fontWeight:700}}>
                  AI Automation Audit Report
                  <span style={{color:"#B4B2A9",marginLeft:8,fontWeight:400,textTransform:"none",letterSpacing:0}}>· Claude AI (Anthropic)</span>
                </div>
                <div style={{fontSize:28,fontWeight:800,color:"#1A2236",letterSpacing:"-0.02em"}}>{report.company_name}</div>
                <div style={{fontSize:13,color:"#5F5E5A",marginTop:3,fontWeight:500}}>{report.industry}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8,minWidth:280}}>
                <div style={{background:"#0D7377",borderRadius:10,padding:"14px 20px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.75)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2,fontWeight:600}}>12-Month ROI</div>
                  <div style={{fontSize:34,fontWeight:800,color:"#FFFFFF",lineHeight:1}}>
                    {report.executive_summary && report.executive_summary.roi_12_month}%
                    <span className="est-badge">est.</span>
                  </div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:3}}>estimated return on AI investment</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[
                    ["Annual Savings", formatCurrency(report.executive_summary && report.executive_summary.total_annual_savings)],
                    ["Hours Saved/Mo", (report.executive_summary && report.executive_summary.hours_saved_monthly) ? report.executive_summary.hours_saved_monthly+" hrs" : "—"]
                  ].map(([l,v]) => (
                    <div key={l} style={{background:"#EAF3DE",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#3B6D11",marginBottom:2,fontWeight:600}}>{l}</div>
                      <div style={{fontSize:18,fontWeight:800,color:"#085041"}}>{v}<span className="est-badge">est.</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STICKY TAB BAR */}
          <div style={{
            position:"sticky",top:58,zIndex:90,
            background:"rgba(248,250,251,0.97)",backdropFilter:"blur(12px)",
            borderBottom:"0.5px solid #E2E8F0",
            marginLeft:-24,marginRight:-24,paddingLeft:24,paddingRight:24,
            marginBottom:20
          }}>
            <div style={{display:"flex",overflowX:"auto",gap:0,WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
              {TABS.map(([key,label]) => (
                <button
                  key={key}
                  className={"tab-btn"+(activeTab===key?" active":"")}
                  onClick={() => setActiveTab(key)}
                  style={{
                    background:"transparent",border:"none",
                    color:activeTab===key?"#0D7377":"#5F5E5A",
                    padding:"11px 16px",fontFamily:"inherit",fontSize:12,
                    cursor:"pointer",whiteSpace:"nowrap",
                    fontWeight:activeTab===key?700:500
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB: SUMMARY */}
          {activeTab==="executive_summary" && (
            <div className="tab-content">
              <div className="card" style={{marginBottom:12,borderLeft:"3px solid #0D7377",borderRadius:"0 12px 12px 0"}}>
                <div className="slabel">Headline Finding</div>
                <div style={{fontSize:17,fontWeight:600,lineHeight:1.5,color:"#1A2236"}}>{report.executive_summary && report.executive_summary.headline}</div>
              </div>
              <div className="card" style={{marginBottom:12}}>
                <div className="slabel">Executive Overview</div>
                <div style={{fontSize:13,lineHeight:1.8,color:"#5F5E5A"}}>{report.executive_summary && report.executive_summary.overview}</div>
              </div>
              <div className="card" style={{marginBottom:12}}>
                <div className="slabel">Top 3 Opportunities</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:4}}>
                  {report.executive_summary && report.executive_summary.top_3_opportunities && report.executive_summary.top_3_opportunities.map((o,i) => (
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{minWidth:26,height:26,background:"#0D7377",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#FFFFFF",flexShrink:0}}>{i+1}</div>
                      <div style={{fontSize:13,lineHeight:1.6,color:"#1A2236"}}>{o}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}} className="stat-row">
                {[
                  ["Pain Points", report.pain_points && report.pain_points.length || 0, "identified"],
                  ["AI Agents", report.ai_agents && report.ai_agents.length || 0, "prescribed"],
                  ["Annual Savings", formatCurrency(report.executive_summary && report.executive_summary.total_annual_savings), "projected (est.)"],
                  ["ROI", (report.executive_summary && report.executive_summary.roi_12_month)+"%", "12 months (est.)"]
                ].map(([l,v,s]) => (
                  <div key={l} className="card" style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#888780",letterSpacing:"0.05em",marginBottom:6,fontWeight:600,textTransform:"uppercase"}}>{l}</div>
                    <div className="bnum">{v}</div>
                    <div style={{fontSize:10,color:"#B4B2A9",marginTop:4}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: COMPANY */}
          {activeTab==="company_overview" && report.company_overview && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:12}}>
              <div className="card">
                <div className="slabel">Business Model</div>
                <div style={{fontSize:13,lineHeight:1.7,color:"#5F5E5A"}}>{report.company_overview.business_model}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div className="card">
                  <div className="slabel">Revenue Streams</div>
                  {report.company_overview.revenue_streams && report.company_overview.revenue_streams.map((r,i) => (
                    <div key={i} style={{fontSize:12,color:"#5F5E5A",padding:"5px 0",borderBottom:"0.5px solid #F1EFE8"}}>&#8594; {r}</div>
                  ))}
                </div>
                <div className="card">
                  <div className="slabel">Acquisition Channels</div>
                  {report.company_overview.acquisition_channels && report.company_overview.acquisition_channels.map((r,i) => (
                    <div key={i} style={{fontSize:12,color:"#5F5E5A",padding:"5px 0",borderBottom:"0.5px solid #F1EFE8"}}>&#8594; {r}</div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="slabel">Target Customers</div>
                <div style={{fontSize:13,color:"#5F5E5A"}}>{report.company_overview.target_customers}</div>
              </div>
              <div className="card cteal">
                <div className="slabel">Key Observations</div>
                <div style={{fontSize:13,lineHeight:1.7,color:"#1A2236"}}>{report.company_overview.key_observations}</div>
              </div>
            </div>
          )}

          {/* TAB: PAIN POINTS */}
          {activeTab==="pain_points" && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:10}}>
              {report.pain_points && report.pain_points.map((p,i) => {
                const sev = parseInt(p.severity,10) || 1;
                const sc = sevColor(sev);
                const bgMap = ["","#EAF3DE","#EAF3DE","#FAEEDA","#FAEEDA","#FCEBEB"];
                return (
                  <div key={i} style={{
                    background:bgMap[sev]||"#F8FAFB",borderRadius:10,padding:18,
                    borderLeft:"4px solid "+sc,
                    border:"0.5px solid #E2E8F0",
                    borderLeft:"4px solid "+sc
                  }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                      <div>
                        <div style={{fontSize:10,color:"#888780",letterSpacing:"0.06em",marginBottom:4,textTransform:"uppercase",fontWeight:600}}>{p.category}</div>
                        <div style={{fontWeight:700,fontSize:15,color:"#1A2236"}}>{p.title}</div>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{fontSize:10,color:"#888780",fontWeight:600}}>Severity</span>
                        <div style={{display:"flex",gap:3}}>
                          {[1,2,3,4,5].map(n => (
                            <div key={n} style={{width:13,height:13,borderRadius:2,background:n<=sev?sc:"#E2E8F0",border:"1px solid "+(n<=sev?sc:"#CBD5E1")}}/>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:"#5F5E5A",lineHeight:1.7,marginBottom:10}}>{p.description}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                      <div style={{fontSize:11,color:"#888780",fontStyle:"italic",maxWidth:"65%"}}>{p.evidence}</div>
                      <div style={{background:"#FCEBEB",border:"0.5px solid #F09595",borderRadius:6,padding:"4px 12px",fontSize:12,color:"#A32D2D",flexShrink:0,fontWeight:600}}>
                        Annual cost: <strong>{formatCurrency(p.cost_of_inaction_annual)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: AI AGENTS */}
          {activeTab==="ai_agents" && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:12}}>
              {report.ai_agents && report.ai_agents.map((a,i) => {
                const ps = priStyle(a.priority);
                const cs = cmpStyle(a.complexity);
                return (
                  <div key={i} className="card">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12}}>
                      <div style={{display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{width:38,height:38,background:"#EAF3DE",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>&#129302;</div>
                        <div>
                          <div style={{fontWeight:700,fontSize:15,color:"#1A2236"}}>{a.agent_name}</div>
                          <div style={{fontSize:11,color:"#888780",marginTop:2,fontWeight:500}}>~{a.timeline_weeks} week deployment</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,padding:"3px 10px",borderRadius:4,fontWeight:600,...ps}}>{a.priority} Priority</span>
                        <span style={{fontSize:11,padding:"3px 10px",borderRadius:4,fontWeight:600,...cs}}>{a.complexity} Complexity</span>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
                      <div>
                        <div style={{fontSize:10,color:"#888780",letterSpacing:"0.05em",marginBottom:4,textTransform:"uppercase",fontWeight:700}}>Problem</div>
                        <div style={{fontSize:12,color:"#5F5E5A",lineHeight:1.5}}>{a.problem_solved}</div>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:"#888780",letterSpacing:"0.05em",marginBottom:4,textTransform:"uppercase",fontWeight:700}}>Solution</div>
                        <div style={{fontSize:12,color:"#5F5E5A",lineHeight:1.5}}>{a.solution}</div>
                      </div>
                    </div>
                    <div style={{borderTop:"0.5px solid #F1EFE8",paddingTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
                      {[...(a.integrations||[]),...(a.no_code_tools||[])].map((t,j) => (
                        <span key={j} style={{fontSize:11,padding:"3px 10px",background:"#F1EFE8",borderRadius:4,color:"#5F5E5A",fontWeight:500}}>{t}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: ROI MODEL */}
          {activeTab==="roi_modeling" && report.roi_modeling && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:20}}>
              <div className="sgrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                {Object.entries(report.roi_modeling.scenarios||{}).map(([sc,d],si) => (
                  <div key={sc} className="scard" style={{border:si===1?"2px solid #0D7377":"0.5px solid #E2E8F0",position:"relative"}}>
                    {si===1 && <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"#0D7377",color:"white",fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:99}}>Most Likely</div>}
                    <div style={{fontWeight:700,fontSize:14,color:"#1A2236",marginBottom:14}}>{sc}</div>
                    {[
                      ["Hours Saved/Mo", d.hours_saved_monthly+"h"],
                      ["Labor Savings/Mo", formatCurrency(d.labor_savings_monthly)],
                      ["Revenue Boost/Mo", formatCurrency(d.revenue_increase_monthly)],
                      ["Annual Benefit", formatCurrency(d.annual_benefit)],
                      ["Break Even", d.break_even_months+" mo"],
                      ["ROI", d.roi_percent+"%"]
                    ].map(([l,v]) => (
                      <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"0.5px solid #F1EFE8"}}>
                        <span style={{fontSize:11,color:"#888780"}}>{l}</span>
                        <span style={{fontSize:12,fontWeight:700,color:si===1?"#0D7377":"#1A2236"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {report.roi_modeling.monthly_projection && report.roi_modeling.monthly_projection.length > 0 && (
                <div className="card">
                  <div className="slabel">12-Month Revenue Projection: With AI vs Without AI</div>
                  <div style={{fontSize:11,color:"#888780",marginBottom:12}}>Moderate scenario · Without AI = flat organic baseline</div>
                  <div style={{display:"flex",gap:20,marginBottom:12,flexWrap:"wrap"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:22,height:3,background:"#0D7377",borderRadius:2}}/>
                      <span style={{fontSize:11,color:"#5F5E5A"}}>With AI</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:22,height:0,borderTop:"2px dashed #F09595"}}/>
                      <span style={{fontSize:11,color:"#5F5E5A"}}>Without AI (organic)</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={270}>
                    <LineChart data={report.roi_modeling.monthly_projection} margin={{top:10,right:20,left:10,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8"/>
                      <XAxis dataKey="month" tick={{fontSize:10,fill:"#888780"}}/>
                      <YAxis tick={{fontSize:10,fill:"#888780"}} tickFormatter={v=>formatCurrency(v)} width={65}/>
                      <Tooltip formatter={v=>formatCurrency(v)} contentStyle={{background:"#FFFFFF",border:"0.5px solid #E2E8F0",borderRadius:8,fontFamily:"inherit",fontSize:12}}/>
                      <Line type="monotone" dataKey="without_ai" stroke="#F09595" strokeWidth={2} dot={false} name="Without AI" strokeDasharray="5 5"/>
                      <Line type="monotone" dataKey="with_ai" stroke="#0D7377" strokeWidth={2.5} dot={false} name="With AI"/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* TAB: ROADMAP */}
          {activeTab==="roadmap" && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:14}}>
              {report.roadmap && report.roadmap.map((phase,i) => (
                <div key={i} className="card" style={{borderLeft:"4px solid "+COLORS[i%COLORS.length]}}>
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
                    <div style={{width:32,height:32,background:COLORS[i%COLORS.length],borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#FFFFFF",fontSize:14,flexShrink:0}}>{i+1}</div>
                    <div style={{fontWeight:700,fontSize:15,color:"#1A2236"}}>{phase.phase}</div>
                  </div>
                  <div className="rmgrid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
                    {[["Goals",phase.goals],["Actions",phase.actions],["Tools",phase.tools],["Success Metrics",phase.success_metrics]].map(([label,items]) => (
                      <div key={label}>
                        <div style={{fontSize:10,color:"#888780",letterSpacing:"0.06em",marginBottom:8,textTransform:"uppercase",fontWeight:700}}>{label}</div>
                        {items && items.map((item,j) => (
                          <div key={j} style={{fontSize:11,color:"#5F5E5A",lineHeight:1.5,marginBottom:6,paddingLeft:8,borderLeft:"2px solid #E2E8F0"}}>{item}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: CHARTS */}
          {activeTab==="chart_data" && report.chart_data && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:20}}>
              <div className="cgrid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {report.chart_data.time_saved_by_category && report.chart_data.time_saved_by_category.length > 0 && (
                  <div className="card">
                    <div className="slabel">Time Saved by Category (hrs/month)</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={report.chart_data.time_saved_by_category} layout="vertical" margin={{left:10,right:30}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8"/>
                        <XAxis type="number" tick={{fontSize:10,fill:"#888780"}}/>
                        <YAxis type="category" dataKey="category" tick={{fontSize:9,fill:"#5F5E5A"}} width={110}/>
                        <Tooltip contentStyle={{background:"#FFFFFF",border:"0.5px solid #E2E8F0",fontSize:12,fontFamily:"inherit"}} formatter={v=>[v+" hrs/mo","Time Saved"]}/>
                        <Bar dataKey="hours_monthly" fill="#0D7377" radius={[0,3,3,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {report.chart_data.inefficiency_breakdown && report.chart_data.inefficiency_breakdown.length > 0 && (
                  <div className="card">
                    <div className="slabel">Operational Inefficiency Breakdown</div>
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie data={report.chart_data.inefficiency_breakdown} dataKey="value" nameKey="name"
                          cx="50%" cy="50%" outerRadius={80} innerRadius={35} labelLine={false}
                          label={(props) => {
                            const {cx,cy,midAngle,outerRadius,value} = props;
                            if(value < 8) return null;
                            const RADIAN = Math.PI/180;
                            const radius = outerRadius+18;
                            const x = cx+radius*Math.cos(-midAngle*RADIAN);
                            const y = cy+radius*Math.sin(-midAngle*RADIAN);
                            return <text x={x} y={y} fill="#5F5E5A" textAnchor={x>cx?"start":"end"} dominantBaseline="central" fontSize={9}>{value}%</text>;
                          }}>
                          {report.chart_data.inefficiency_breakdown.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:"#FFFFFF",border:"0.5px solid #E2E8F0",fontSize:11,fontFamily:"inherit"}} formatter={(v,n)=>[v+"%",n]}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"4px 12px",justifyContent:"center",marginTop:4}}>
                      {report.chart_data.inefficiency_breakdown.map((item,i) => (
                        <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                          <div style={{width:8,height:8,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                          <span style={{fontSize:11,color:"#5F5E5A"}}>{item.name} <span style={{color:COLORS[i%COLORS.length],fontWeight:700}}>({item.value}%)</span></span>
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8"/>
                      <XAxis dataKey="agent" interval={0} tick={(props) => {
                        const {x,y,payload,index} = props;
                        const color = COLORS[index%COLORS.length];
                        const words = (payload.value||"").split(" ");
                        const lines = []; let line = "";
                        words.forEach(w => {
                          if((line+" "+w).length>14 && line){lines.push(line);line=w;}
                          else{line=(line?line+" ":"")+w;}
                        });
                        if(line) lines.push(line);
                        return (
                          <g transform={"translate("+x+","+y+")"}>
                            {lines.map((l,i) => <text key={i} x={0} y={0} dy={14+i*13} textAnchor="middle" fill={color} fontSize={9} fontFamily="inherit">{l}</text>)}
                          </g>
                        );
                      }}/>
                      <YAxis tick={{fontSize:10,fill:"#888780"}} tickFormatter={v=>formatCurrency(v)}/>
                      <Tooltip formatter={v=>formatCurrency(v)} contentStyle={{background:"#FFFFFF",border:"0.5px solid #E2E8F0",fontSize:12,fontFamily:"inherit"}}/>
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
                  <div style={{fontSize:11,color:"#888780",marginBottom:12}}>Score = (Impact × 0.6) + (Feasibility × 0.4) × 10 · Higher = deploy first</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
                    {report.chart_data.opportunity_heatmap.map((item,i) => {
                      const score = item.priority_score || Math.round((item.impact*0.6+item.feasibility*0.4)*10);
                      const intensity = Math.min(score/100,1);
                      const bg = "rgba(13,115,119,"+(0.05+intensity*0.2)+")";
                      const bd = "rgba(13,115,119,"+(0.15+intensity*0.45)+")";
                      return (
                        <div key={i} style={{background:bg,border:"0.5px solid "+bd,borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                          <div style={{fontSize:10,color:"#5F5E5A",marginBottom:6,fontWeight:600}}>{item.area}</div>
                          <div style={{fontSize:22,fontWeight:800,color:"#0D7377"}}>{score}</div>
                          <div style={{fontSize:9,color:"#888780",marginTop:4}}>Impact {item.impact}/10 · Ease {item.feasibility}/10</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: METHODOLOGY */}
          {activeTab==="methodology" && (
            <div className="tab-content" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="card camber">
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:18,flexShrink:0,color:"#BA7517"}}>&#9888;</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:6,color:"#633806"}}>Important Disclaimer</div>
                    <div style={{fontSize:12,lineHeight:1.7,color:"#854F0B"}}>
                      {(report.data_methodology && report.data_methodology.disclaimer) || "All projections are AI-generated estimates based on industry benchmarks and publicly available data. They should be treated as indicative only and validated against actual business data before making investment decisions."}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="slabel">Data Sources & Calculation Methods</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
                  {[
                    ["ROI Calculation Basis", report.data_methodology && report.data_methodology.roi_basis, "#0D7377"],
                    ["Wage Rate Source", report.data_methodology && report.data_methodology.wage_source, "#639922"],
                    ["Lead Volume Estimation", report.data_methodology && report.data_methodology.lead_data_source, "#BA7517"],
                    ["Conversion Rate Benchmark", report.data_methodology && report.data_methodology.conversion_benchmark, "#185FA5"],
                    ["Time Savings Methodology", report.data_methodology && report.data_methodology.time_savings_method, "#993556"]
                  ].map(([label,value,color]) => (
                    <div key={label} style={{padding:"12px 14px",background:"#F8FAFB",borderRadius:8,borderLeft:"3px solid "+color}}>
                      <div style={{fontSize:11,fontWeight:700,color,marginBottom:4}}>{label}</div>
                      <div style={{fontSize:12,color:"#5F5E5A",lineHeight:1.6}}>{value || "Based on industry-standard AI automation benchmarks."}</div>
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
                    ["Break-Even Timeline","Implementation cost divided by total monthly benefit. Excludes ongoing maintenance."],
                    ["Opportunity Heatmap","Priority Score = (Impact × 0.6 + Feasibility × 0.4) × 10. Impact = revenue/time value (0-10). Feasibility = ease of deployment (0-10)."],
                    ["AI Model","Analysis by Claude (claude-sonnet-4-20250514) by Anthropic. Data sourced from publicly available digital assets only."]
                  ].map(([t,d]) => (
                    <div key={t} style={{padding:"10px 14px",background:"#F8FAFB",borderRadius:6}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#1A2236",marginBottom:3}}>{t}</div>
                      <div style={{fontSize:11,color:"#888780",lineHeight:1.6}}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{borderLeft:"3px solid #185FA5",background:"#E6F1FB",borderRadius:"0 12px 12px 0"}}>
                <div className="slabel" style={{color:"#185FA5"}}>Recommended Validation Steps Before Acting</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
                  {[
                    "1. Verify staff hourly wage against actual payroll data",
                    "2. Audit real weekly hours on manual tasks via time-tracking for 2 weeks",
                    "3. Pull actual lead volume and conversion rates from your CRM or analytics",
                    "4. Get implementation quotes from 2–3 no-code automation agencies",
                    "5. Run a 30-day pilot on the highest-priority AI agent before full rollout"
                  ].map((s,i) => (
                    <div key={i} style={{fontSize:12,color:"#185FA5",padding:"6px 0",borderBottom:"0.5px solid rgba(24,95,165,0.15)"}}>{s}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STICKY EXPORT BAR */}
          <div style={{
            position:"fixed",bottom:0,left:0,right:0,zIndex:200,
            background:"rgba(248,250,251,0.98)",backdropFilter:"blur(16px)",
            borderTop:"1px solid #E2E8F0",padding:"10px 24px",
            display:"flex",gap:8,justifyContent:"center",alignItems:"center",flexWrap:"wrap",
            boxShadow:"0 -4px 32px rgba(0,0,0,0.08)"
          }}>
            <button onClick={shareReport} style={{background:"#F0FAF8",border:"1.5px solid #0D7377",borderRadius:8,color:"#0D7377",padding:"8px 16px",fontFamily:"inherit",fontSize:12,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
              🔗 Share report
            </button>
            <button onClick={exportReport} disabled={exportLoading} style={{background:exportLoading?"#F1EFE8":"#0D7377",border:"1.5px solid #0D7377",borderRadius:8,color:exportLoading?"#888780":"#FFFFFF",padding:"8px 16px",fontFamily:"inherit",fontSize:12,cursor:exportLoading?"not-allowed":"pointer",fontWeight:600,transition:"all 0.2s",opacity:exportLoading?0.7:1}}>
              {exportLoading ? "Generating..." : "↓ Export PDF"}
            </button>
            <button onClick={() => {
              const a = document.createElement("a");
              a.href = "data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(report,null,2));
              a.download = (report.company_name||"audit")+"-report.json";
              a.click();
            }} style={{background:"#FFFFFF",border:"1.5px solid #CBD5E1",borderRadius:8,color:"#5F5E5A",padding:"8px 16px",fontFamily:"inherit",fontSize:12,cursor:"pointer",fontWeight:600,transition:"all 0.2s"}}>
              {"{ }"} Export JSON
            </button>
            <button onClick={clearReport} style={{background:"#FFFFFF",border:"1.5px solid #CBD5E1",borderRadius:8,color:"#5F5E5A",padding:"8px 16px",fontFamily:"inherit",fontSize:12,cursor:"pointer",fontWeight:600,transition:"all 0.2s"}}>
              ← New Audit
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
