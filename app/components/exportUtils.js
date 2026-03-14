// exportUtils.js — Plain JS, no JSX, no template literals
// Builds complete print-ready HTML for the AI Audit Engine export

const COLS = ["#00FFD1","#FF6B35","#FFD700","#7B61FF","#00B4D8","#F72585"];

export function buildExportHTML(report, currency) {
  var sym = currency.symbol;
  var rate = currency.rate;
  var code = currency.code;

  function fc(n) {
    if (!n && n !== 0) return sym + "0";
    var v = n * rate;
    if (v >= 1000000000) return sym + (v/1000000000).toFixed(1) + "B";
    if (v >= 1000000) return sym + (v/1000000).toFixed(1) + "M";
    if (v >= 1000) return sym + (v/1000).toFixed(0) + "K";
    return sym + Math.round(v).toLocaleString();
  }

  var sevColors = {"1":"#4ade80","2":"#a3e635","3":"#facc15","4":"#fb923c","5":"#f87171"};
  var phaseColors = ["#00FFD1","#FF6B35","#FFD700","#7B61FF"];

  var css = '' +
    '@import url(\'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap\');' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{font-family:\'IBM Plex Mono\',monospace;background:#080C14;color:#E8EDF5;padding:0;font-size:12px;line-height:1.6}' +
    'h2{font-family:\'Syne\',sans-serif;font-size:14px;font-weight:700;color:#00FFD1;margin:24px 0 8px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid rgba(0,255,209,0.2);padding-bottom:6px}' +
    '.page{padding:36px 44px}' +
    '.cover{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:60px 60px;background:linear-gradient(135deg,rgba(0,255,209,0.06),rgba(123,97,255,0.08));border-bottom:1px solid rgba(0,255,209,0.2);page-break-after:always}' +
    '.hdr{background:linear-gradient(135deg,rgba(0,255,209,0.08),rgba(123,97,255,0.08));border:1px solid rgba(0,255,209,0.2);border-radius:10px;padding:20px 24px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px}' +
    '.kpi-label{font-size:9px;letter-spacing:2px;color:rgba(232,237,245,0.4);text-transform:uppercase;margin-bottom:3px}' +
    '.kpi-val{font-family:\'Syne\',sans-serif;font-size:22px;font-weight:800;color:#00FFD1}' +
    '.card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:14px;margin-bottom:10px}' +
    '.cteal{border-color:rgba(0,255,209,0.2)!important;background:rgba(0,255,209,0.04)!important}' +
    '.camber{border-color:rgba(251,191,36,0.25)!important;background:rgba(251,191,36,0.04)!important}' +
    '.sl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#00FFD1;font-weight:600;margin-bottom:6px}' +
    '.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.g4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px}' +
    '.pain{border-radius:8px;padding:12px;margin-bottom:8px;border-left-width:5px;border-left-style:solid}' +
    '.dot{width:11px;height:11px;border-radius:2px;display:inline-block;margin-right:2px}' +
    '.agent{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:12px;margin-bottom:8px}' +
    '.tag{display:inline-block;font-size:9px;padding:2px 6px;border-radius:10px;margin:2px;border:1px solid rgba(123,97,255,0.3);background:rgba(123,97,255,0.12);color:#a78bfa}' +
    '.bh{background:#ef4444;color:#fff;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bm{background:#eab308;color:#000;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bl{background:#22c55e;color:#fff;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bcl{background:#059669;color:#fff;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bcm{background:#2563eb;color:#fff;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bch{background:#7c3aed;color:#fff;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.scen{border-radius:8px;padding:12px}' +
    '.smod{border:1px solid rgba(0,255,209,0.35);background:rgba(0,255,209,0.06)}' +
    '.soth{border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02)}' +
    '.row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05)}' +
    '.rv{font-weight:600;color:#00FFD1}' +
    '.rw{font-weight:600;color:#E8EDF5}' +
    '.phase{border-radius:8px;padding:12px;margin-bottom:8px;border-left-width:4px;border-left-style:solid;background:rgba(255,255,255,0.02)}' +
    '.hm{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:7px}' +
    '.hmc{border-radius:6px;padding:9px 7px;text-align:center}' +
    '.hms{font-family:\'Syne\',sans-serif;font-size:18px;font-weight:800;color:#00FFD1}' +
    '.mr{padding:9px 11px;background:rgba(255,255,255,0.03);border-radius:6px;border-left-width:2px;border-left-style:solid;margin-bottom:6px}' +
    '.ftr{margin-top:28px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);font-size:10px;color:rgba(232,237,245,0.3);text-align:center}' +
    '.leg{display:flex;flex-wrap:wrap;gap:5px 12px;justify-content:center;margin-top:7px}' +
    '.legitem{display:flex;align-items:center;gap:5px;font-size:10px;color:#E8EDF5}' +
    '.legswatch{width:10px;height:10px;border-radius:2px;flex-shrink:0}' +
    '.disclaimer{background:rgba(251,191,36,0.07);border:1px solid rgba(251,191,36,0.3);border-radius:8px;padding:12px 14px;margin-bottom:16px;font-size:11px;color:rgba(232,237,245,0.7);line-height:1.6}' +
    '@media print{.cover{page-break-after:always}.no-print{display:none}}';

  // ── PAIN POINTS ──
  var painHtml = "";
  (report.pain_points || []).forEach(function(p) {
    var sev = parseInt(p.severity, 10) || 1;
    var col = sevColors[String(sev)] || "#888";
    var bgMap = {"1":"rgba(74,222,128,0.06)","2":"rgba(163,230,53,0.06)","3":"rgba(250,204,21,0.06)","4":"rgba(251,146,60,0.07)","5":"rgba(248,113,113,0.08)"};
    var bg = bgMap[String(sev)] || "rgba(255,255,255,0.03)";
    var dots = "";
    for (var n=1; n<=5; n++) {
      var fill = n <= sev;
      dots += '<span class="dot" style="background:' + (fill?col:"rgba(255,255,255,0.08)") + ';border:1px solid ' + (fill?col:"rgba(255,255,255,0.25)") + ';' + (fill?"box-shadow:0 0 5px "+col+";":"") + '"></span>';
    }
    painHtml += '<div class="pain" style="background:' + bg + ';border-left-color:' + col + ';border-top:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06)">';
    painHtml += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:7px;flex-wrap:wrap;gap:5px">';
    painHtml += '<div><div style="font-size:9px;color:rgba(232,237,245,0.4);letter-spacing:1px;text-transform:uppercase;margin-bottom:2px">' + p.category + '</div>';
    painHtml += '<div style="font-weight:600;font-size:12px;color:' + col + '">' + p.title + '</div></div>';
    painHtml += '<div style="display:flex;gap:5px;align-items:center"><span style="font-size:9px;color:rgba(232,237,245,0.4)">SEV</span>' + dots + '</div></div>';
    painHtml += '<div style="color:rgba(232,237,245,0.72);margin-bottom:7px;font-size:11px">' + p.description + '</div>';
    painHtml += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:5px">';
    painHtml += '<div style="font-size:10px;color:rgba(232,237,245,0.4);font-style:italic">' + p.evidence + '</div>';
    painHtml += '<div style="background:rgba(248,113,113,0.12);border:1px solid rgba(248,113,113,0.3);border-radius:4px;padding:2px 9px;font-size:10px;color:#fca5a5">Cost: <strong>' + fc(p.cost_of_inaction_annual) + '</strong></div>';
    painHtml += '</div></div>';
  });

  // ── AI AGENTS ──
  var agentHtml = "";
  (report.ai_agents || []).forEach(function(a, i) {
    var col = COLS[i % COLS.length];
    var pb = a.priority==="High"?"bh":a.priority==="Medium"?"bm":"bl";
    var cb = a.complexity==="Low"?"bcl":a.complexity==="Medium"?"bcm":"bch";
    var tags = [].concat(a.integrations||[]).concat(a.no_code_tools||[]).map(function(t){return '<span class="tag">'+t+'</span>';}).join("");
    agentHtml += '<div class="agent">';
    agentHtml += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:5px">';
    agentHtml += '<div style="display:flex;gap:9px;align-items:center">';
    agentHtml += '<div style="width:26px;height:26px;background:' + col + ';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px">&#129302;</div>';
    agentHtml += '<div><div style="font-weight:600;font-size:12px">' + a.agent_name + '</div><div style="font-size:9px;color:rgba(232,237,245,0.4)">~' + a.timeline_weeks + ' wks</div></div></div>';
    agentHtml += '<div><span class="' + pb + '">' + a.priority + '</span> <span class="' + cb + '">' + a.complexity + '</span></div></div>';
    agentHtml += '<div class="g2" style="margin-bottom:7px"><div><div style="font-size:9px;color:rgba(232,237,245,0.4);margin-bottom:2px">PROBLEM</div><div style="font-size:10px;color:rgba(232,237,245,0.7)">' + a.problem_solved + '</div></div>';
    agentHtml += '<div><div style="font-size:9px;color:rgba(232,237,245,0.4);margin-bottom:2px">SOLUTION</div><div style="font-size:10px;color:rgba(232,237,245,0.7)">' + a.solution + '</div></div></div>';
    agentHtml += '<div>' + tags + '</div></div>';
  });

  // ── SCENARIOS ──
  var scenHtml = "";
  ["conservative","moderate","aggressive"].forEach(function(sk, si) {
    var d = report.roi_modeling && report.roi_modeling.scenarios && report.roi_modeling.scenarios[sk];
    if (!d) return;
    var isRec = si === 1;
    scenHtml += '<div class="scen ' + (isRec?"smod":"soth") + '">';
    scenHtml += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px">';
    scenHtml += '<span style="font-size:9px;letter-spacing:2px;color:' + (isRec?"#00FFD1":"rgba(232,237,245,0.4)") + ';text-transform:uppercase;font-weight:600">' + sk + '</span>';
    if (isRec) scenHtml += '<span style="font-size:8px;background:rgba(0,255,209,0.15);color:#00FFD1;padding:2px 7px;border-radius:10px">RECOMMENDED</span>';
    scenHtml += '</div>';
    [["Hours/Mo",d.hours_saved_monthly+"h"],["Labor/Mo",fc(d.labor_savings_monthly)],["Revenue/Mo",fc(d.revenue_increase_monthly)],["Annual",fc(d.annual_benefit)],["Break Even",d.break_even_months+" mo"],["ROI",d.roi_percent+"%"]].forEach(function(r) {
      scenHtml += '<div class="row"><span style="color:rgba(232,237,245,0.5)">' + r[0] + '</span><span class="' + (isRec?"rv":"rw") + '">' + r[1] + '</span></div>';
    });
    scenHtml += '</div>';
  });

  // ── ROADMAP ──
  var roadHtml = "";
  (report.roadmap || []).forEach(function(phase, i) {
    var col = phaseColors[i] || "#00FFD1";
    roadHtml += '<div class="phase" style="border-left-color:' + col + '">';
    roadHtml += '<div style="display:flex;gap:9px;align-items:center;margin-bottom:10px">';
    roadHtml += '<div style="width:22px;height:22px;background:' + col + ';border-radius:5px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#080C14;font-size:11px">' + (i+1) + '</div>';
    roadHtml += '<div style="font-weight:600;font-size:12px">' + phase.phase + '</div></div>';
    roadHtml += '<div class="g4">';
    [["Goals",phase.goals],["Actions",phase.actions],["Tools",phase.tools],["Metrics",phase.success_metrics]].forEach(function(pair) {
      roadHtml += '<div><div style="font-size:9px;color:rgba(232,237,245,0.4);text-transform:uppercase;margin-bottom:4px">' + pair[0] + '</div>';
      (pair[1]||[]).forEach(function(item) {
        roadHtml += '<div style="font-size:9px;color:rgba(232,237,245,0.7);padding-left:5px;border-left:2px solid rgba(255,255,255,0.1);margin-bottom:3px;line-height:1.5">' + item + '</div>';
      });
      roadHtml += '</div>';
    });
    roadHtml += '</div></div>';
  });

  // ── HEATMAP ──
  var hmHtml = "";
  ((report.chart_data && report.chart_data.opportunity_heatmap) || []).forEach(function(item) {
    var score = item.priority_score || Math.round((item.impact*0.6+item.feasibility*0.4)*10);
    var intensity = Math.min(score/100, 1);
    hmHtml += '<div class="hmc" style="background:rgba(0,255,209,' + (0.05+intensity*0.3) + ');border:1px solid rgba(0,255,209,' + (0.1+intensity*0.45) + ')">';
    hmHtml += '<div style="font-size:9px;color:rgba(232,237,245,0.6);margin-bottom:3px">' + item.area + '</div>';
    hmHtml += '<div class="hms">' + score + '</div>';
    hmHtml += '<div style="font-size:8px;color:rgba(232,237,245,0.4);margin-top:2px">I:' + item.impact + ' E:' + item.feasibility + '</div></div>';
  });

  // ── PIE LEGEND ──
  var pieLeg = "";
  ((report.chart_data && report.chart_data.inefficiency_breakdown) || []).forEach(function(item, i) {
    pieLeg += '<div class="legitem"><div class="legswatch" style="background:' + COLS[i%COLS.length] + '"></div>' + item.name + ' <strong style="color:' + COLS[i%COLS.length] + '">' + item.value + '%</strong></div>';
  });

  // ── ASSUMPTIONS ──
  var assumpHtml = "";
  Object.entries((report.roi_modeling && report.roi_modeling.assumptions) || {}).forEach(function(entry) {
    var k = entry[0]; var v = entry[1];
    var label = k.replace(/_/g," ").toUpperCase();
    var val = (k.includes("wage")||k.includes("value")) ? fc(v) : (k.includes("rate") ? v+"%" : v);
    assumpHtml += '<div style="background:rgba(255,255,255,0.03);border-radius:6px;padding:7px 10px"><div style="font-size:9px;color:rgba(232,237,245,0.4);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px">' + label + '</div><div style="font-weight:600;font-size:12px">' + val + '</div></div>';
  });

  // ── METHODOLOGY ──
  var methHtml = "";
  [
    ["ROI Calculation Basis", report.data_methodology && report.data_methodology.roi_basis, "#00FFD1"],
    ["Wage Rate Source", report.data_methodology && report.data_methodology.wage_source, "#FF6B35"],
    ["Lead Volume Estimation", report.data_methodology && report.data_methodology.lead_data_source, "#FFD700"],
    ["Conversion Rate Benchmark", report.data_methodology && report.data_methodology.conversion_benchmark, "#7B61FF"],
    ["Time Savings Methodology", report.data_methodology && report.data_methodology.time_savings_method, "#00B4D8"]
  ].forEach(function(item) {
    methHtml += '<div class="mr" style="border-left-color:' + item[2] + '"><div style="font-size:10px;font-weight:600;color:' + item[2] + ';margin-bottom:2px">' + item[0] + '</div><div style="font-size:10px;color:rgba(232,237,245,0.7)">' + (item[1] || "Based on industry-standard AI automation benchmarks.") + '</div></div>';
  });

  // ── CHART DATA ──
  var projData = JSON.stringify((report.roi_modeling && report.roi_modeling.monthly_projection) || []);
  var timeData = JSON.stringify((report.chart_data && report.chart_data.time_saved_by_category) || []);
  var pieData  = JSON.stringify((report.chart_data && report.chart_data.inefficiency_breakdown) || []);
  var agentData= JSON.stringify((report.chart_data && report.chart_data.cost_reduction_by_agent) || []);
  var colorsJson = JSON.stringify(COLS);
  var symJson = JSON.stringify(sym);  // pass currency symbol to canvas script

  // ── CANVAS SCRIPT (uses dynamic currency symbol) ──
  var canvasScript =
    'var COLS=' + colorsJson + ';' +
    'var SYM=' + symJson + ';' +
    'function fmt(v){return v>=1e9?SYM+(v/1e9).toFixed(1)+"B":v>=1e6?SYM+(v/1e6).toFixed(1)+"M":v>=1e3?SYM+(v/1e3).toFixed(0)+"K":SYM+Math.round(v);}' +
    'function drawROI(){' +
      'var data=' + projData + ';' +
      'var c=document.getElementById("roiChart");if(!c||!data.length)return;' +
      'var ctx=c.getContext("2d"),W=c.width,H=c.height,pl=72,pr=20,pt=16,pb=40;' +
      'ctx.fillStyle="#0D1220";ctx.fillRect(0,0,W,H);' +
      'var maxV=Math.max.apply(null,data.map(function(d){return Math.max(d.with_ai,d.without_ai);}));' +
      'var minV=Math.min.apply(null,data.map(function(d){return Math.min(d.with_ai,d.without_ai);}));' +
      'var range=maxV-minV||1;' +
      'var xStep=(W-pl-pr)/(data.length-1);' +
      'function xp(i){return pl+i*xStep;}' +
      'function yp(v){return H-pb-(v-minV)/range*(H-pt-pb);}' +
      'ctx.strokeStyle="rgba(255,255,255,0.05)";ctx.lineWidth=1;' +
      'for(var i=0;i<=4;i++){var y=pt+i*(H-pt-pb)/4;ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(W-pr,y);ctx.stroke();}' +
      'ctx.fillStyle="rgba(232,237,245,0.4)";ctx.font="10px monospace";ctx.textAlign="right";' +
      'for(var i=0;i<=4;i++){var v=maxV-i*(range/4);var y=pt+i*(H-pt-pb)/4;ctx.fillText(fmt(v),pl-5,y+3);}' +
      'ctx.textAlign="center";ctx.fillStyle="rgba(232,237,245,0.4)";' +
      'data.forEach(function(d,i){if(i%2===0)ctx.fillText(d.month,xp(i),H-8);});' +
      'ctx.beginPath();ctx.strokeStyle="rgba(248,113,113,0.7)";ctx.lineWidth=2;ctx.setLineDash([5,5]);' +
      'data.forEach(function(d,i){i===0?ctx.moveTo(xp(i),yp(d.without_ai)):ctx.lineTo(xp(i),yp(d.without_ai));});' +
      'ctx.stroke();ctx.setLineDash([]);' +
      'ctx.beginPath();ctx.strokeStyle="#00FFD1";ctx.lineWidth=2.5;' +
      'data.forEach(function(d,i){i===0?ctx.moveTo(xp(i),yp(d.with_ai)):ctx.lineTo(xp(i),yp(d.with_ai));});' +
      'ctx.stroke();' +
      'ctx.fillStyle="#00FFD1";ctx.fillRect(W-160,10,18,3);' +
      'ctx.fillStyle="rgba(232,237,245,0.7)";ctx.font="10px monospace";ctx.textAlign="left";ctx.fillText("With AI",W-137,14);' +
      'ctx.strokeStyle="rgba(248,113,113,0.7)";ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(W-80,11);ctx.lineTo(W-62,11);ctx.stroke();ctx.setLineDash([]);' +
      'ctx.fillText("Without AI",W-57,14);}' +
    'function drawTime(){' +
      'var data=' + timeData + ';' +
      'var c=document.getElementById("timeChart");if(!c||!data.length)return;' +
      'var ctx=c.getContext("2d"),W=c.width,H=c.height,pl=120,pr=20,pt=8,pb=12;' +
      'ctx.fillStyle="#0D1220";ctx.fillRect(0,0,W,H);' +
      'var maxV=Math.max.apply(null,data.map(function(d){return d.hours_monthly;}))||1;' +
      'var bH=Math.min(20,(H-pt-pb)/data.length-5);' +
      'data.forEach(function(d,i){' +
        'var y=pt+i*((H-pt-pb)/data.length)+3;' +
        'var bW=(d.hours_monthly/maxV)*(W-pl-pr);' +
        'ctx.fillStyle="#00FFD1";ctx.fillRect(pl,y,bW,bH);' +
        'ctx.fillStyle="rgba(232,237,245,0.6)";ctx.font="9px monospace";ctx.textAlign="right";' +
        'ctx.fillText(d.category.slice(0,16),pl-4,y+bH/2+3);' +
        'ctx.fillStyle="rgba(232,237,245,0.5)";ctx.textAlign="left";' +
        'ctx.fillText(d.hours_monthly+"h",pl+bW+4,y+bH/2+3);' +
      '});}' +
    'function drawPie(){' +
      'var data=' + pieData + ';' +
      'var c=document.getElementById("pieChart");if(!c||!data.length)return;' +
      'var ctx=c.getContext("2d"),W=c.width,H=c.height,cx=W/2,cy=H/2,r=70,ir=28;' +
      'ctx.fillStyle="#0D1220";ctx.fillRect(0,0,W,H);' +
      'var total=data.reduce(function(s,d){return s+d.value;},0);' +
      'var start=-Math.PI/2;' +
      'data.forEach(function(d,i){' +
        'var angle=(d.value/total)*2*Math.PI;' +
        'ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+angle);ctx.closePath();' +
        'ctx.fillStyle=COLS[i%COLS.length];ctx.fill();' +
        'if(d.value>=8){' +
          'var midA=start+angle/2;var lx=cx+Math.cos(midA)*(r+14);var ly=cy+Math.sin(midA)*(r+14);' +
          'ctx.fillStyle="rgba(232,237,245,0.8)";ctx.font="9px monospace";ctx.textAlign="center";ctx.textBaseline="middle";' +
          'ctx.fillText(d.value+"%",lx,ly);' +
        '}' +
        'start+=angle;' +
      '});' +
      'ctx.beginPath();ctx.arc(cx,cy,ir,0,2*Math.PI);ctx.fillStyle="#0D1220";ctx.fill();}' +
    'function drawAgent(){' +
      'var data=' + agentData + ';' +
      'var c=document.getElementById("agentChart");if(!c||!data.length)return;' +
      'var ctx=c.getContext("2d"),W=c.width,H=c.height,pl=55,pr=10,pt=10,pb=55;' +
      'ctx.fillStyle="#0D1220";ctx.fillRect(0,0,W,H);' +
      'var maxV=Math.max.apply(null,data.map(function(d){return d.monthly_savings;}))||1;' +
      'var bW=(W-pl-pr)/data.length-10;' +
      'ctx.strokeStyle="rgba(255,255,255,0.05)";ctx.lineWidth=1;' +
      'for(var i=0;i<=4;i++){var y=pt+i*(H-pt-pb)/4;ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(W-pr,y);ctx.stroke();}' +
      'ctx.fillStyle="rgba(232,237,245,0.4)";ctx.font="9px monospace";ctx.textAlign="right";' +
      'for(var i=0;i<=4;i++){var v=maxV*(1-i/4);var y=pt+i*(H-pt-pb)/4;ctx.fillText(fmt(v),pl-4,y+3);}' +
      'data.forEach(function(d,i){' +
        'var x=pl+i*(bW+10);' +
        'var barH=(d.monthly_savings/maxV)*(H-pt-pb);' +
        'var y=H-pb-barH;' +
        'ctx.fillStyle=COLS[i%COLS.length];ctx.fillRect(x,y,bW,barH);' +
        'ctx.fillStyle=COLS[i%COLS.length];ctx.font="9px monospace";ctx.textAlign="center";' +
        'var words=d.agent.split(" ");var line="";var lines=[];' +
        'words.forEach(function(w){if((line+" "+w).length>12&&line){lines.push(line);line=w;}else{line=line?line+" "+w:w;}});' +
        'if(line)lines.push(line);' +
        'lines.forEach(function(l,j){ctx.fillText(l,x+bW/2,H-pb+11+j*11);});' +
      '});}' +
    'drawROI();drawTime();drawPie();drawAgent();';

  var lt = "<";
  var now = new Date();
  var dateStr = now.toLocaleDateString("en-US", {year:"numeric",month:"long",day:"numeric"});

  // ── COVER PAGE HTML ──
  var coverHtml =
    '<div class="cover">' +
    '<div style="margin-bottom:40px">' +
    '<div style="width:40px;height:40px;background:linear-gradient(135deg,#00FFD1,#7B61FF);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:20px">&#9889;</div>' +
    '<div style="font-size:10px;letter-spacing:3px;color:#00FFD1;text-transform:uppercase;margin-bottom:12px">AI Automation Audit Report</div>' +
    '<div style="font-family:\'Syne\',sans-serif;font-size:48px;font-weight:800;line-height:1.1;margin-bottom:12px">' + report.company_name + '</div>' +
    '<div style="font-size:15px;color:rgba(232,237,245,0.5);margin-bottom:32px">' + report.industry + '</div>' +
    '<div style="display:flex;gap:40px;flex-wrap:wrap">' +
    '<div><div style="font-size:9px;letter-spacing:2px;color:rgba(232,237,245,0.4);text-transform:uppercase;margin-bottom:4px">Annual Savings (est.)</div><div style="font-family:\'Syne\',sans-serif;font-size:38px;font-weight:800;color:#00FFD1">' + fc(report.executive_summary && report.executive_summary.total_annual_savings) + '</div></div>' +
    '<div><div style="font-size:9px;letter-spacing:2px;color:rgba(232,237,245,0.4);text-transform:uppercase;margin-bottom:4px">12-Month ROI (est.)</div><div style="font-family:\'Syne\',sans-serif;font-size:38px;font-weight:800;color:#00FFD1">' + (report.executive_summary && report.executive_summary.roi_12_month) + '%</div></div>' +
    '<div><div style="font-size:9px;letter-spacing:2px;color:rgba(232,237,245,0.4);text-transform:uppercase;margin-bottom:4px">Pain Points Found</div><div style="font-family:\'Syne\',sans-serif;font-size:38px;font-weight:800;color:#FF6B35">' + ((report.pain_points && report.pain_points.length) || 0) + '</div></div>' +
    '<div><div style="font-size:9px;letter-spacing:2px;color:rgba(232,237,245,0.4);text-transform:uppercase;margin-bottom:4px">AI Agents Prescribed</div><div style="font-family:\'Syne\',sans-serif;font-size:38px;font-weight:800;color:#7B61FF">' + ((report.ai_agents && report.ai_agents.length) || 0) + '</div></div>' +
    '</div></div>' +
    '<div style="margin-top:auto;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
    '<div style="font-size:11px;color:rgba(232,237,245,0.4)">Powered by <strong style="color:#00FFD1">Claude AI (Anthropic)</strong> · AI Audit Engine</div>' +
    '<div style="font-size:11px;color:rgba(232,237,245,0.4)">Generated: ' + dateStr + ' · Currency: ' + code + '</div>' +
    '</div>' +
    '<div class="disclaimer" style="margin-top:16px">&#9888; <strong style="color:#fbbf24">AI-generated estimates only.</strong> All projections are based on industry benchmarks and publicly available data. Validate against actual business data before making investment or operational decisions.</div>' +
    '</div>';

  return "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'/><meta name='viewport' content='width=device-width,initial-scale=1'/><title>" + report.company_name + " — AI Audit Report</title>"
    + lt + "style>" + css + lt + "/style></head><body>"
    + coverHtml
    + "<div class='page'>"
    + "<h2>Executive Summary</h2>"
    + "<div class='card cteal' style='margin-bottom:8px'><div class='sl'>Headline Finding</div><div style='font-size:13px;font-weight:600'>" + (report.executive_summary && report.executive_summary.headline) + "</div></div>"
    + "<div class='card'><div class='sl'>Overview</div><div style='color:rgba(232,237,245,0.8)'>" + (report.executive_summary && report.executive_summary.overview) + "</div></div>"
    + "<h2>Pain Points</h2>" + painHtml
    + "<h2>AI Agents</h2>" + agentHtml
    + "<h2>ROI Model</h2>"
    + "<div class='card' style='margin-bottom:10px'><div class='sl'>Model Assumptions</div><div class='g3'>" + assumpHtml + "</div></div>"
    + "<div class='g3'>" + scenHtml + "</div>"
    + "<h2>12-Month Projection</h2>"
    + "<div class='card'>" + lt + "canvas id='roiChart' width='860' height='200'>" + lt + "/canvas></div>"
    + "<h2>Charts</h2>"
    + "<div class='g2' style='margin-bottom:10px'>"
    + "<div class='card'><div class='sl'>Time Saved by Category (hrs/mo)</div>" + lt + "canvas id='timeChart' width='400' height='190'>" + lt + "/canvas></div>"
    + "<div class='card'><div class='sl'>Operational Inefficiency</div>" + lt + "canvas id='pieChart' width='400' height='170'>" + lt + "/canvas><div class='leg'>" + pieLeg + "</div></div>"
    + "</div>"
    + "<div class='card' style='margin-bottom:10px'><div class='sl'>Monthly Cost Reduction by Agent (" + code + ")</div>" + lt + "canvas id='agentChart' width='860' height='190'>" + lt + "/canvas></div>"
    + "<div class='card'><div class='sl'>AI Opportunity Heatmap</div><div class='hm'>" + hmHtml + "</div></div>"
    + "<h2>90-Day Roadmap</h2>" + roadHtml
    + "<h2>Data Methodology</h2>"
    + "<div class='card camber' style='margin-bottom:10px'><div style='display:flex;gap:10px'><span style='font-size:15px'>&#9888;</span><div><div style='font-weight:600;margin-bottom:3px'>Disclaimer</div><div style='color:rgba(232,237,245,0.75);font-size:11px'>" + ((report.data_methodology && report.data_methodology.disclaimer) || "All projections are AI-generated estimates. Validate against actual data before decisions.") + "</div></div></div></div>"
    + methHtml
    + "<div class='ftr'>AI Automation Audit Report · " + report.company_name + " · Generated " + dateStr + " · Currency: " + code + " · Powered by Claude AI (Anthropic)</div>"
    + "</div>"
    + lt + "script>" + canvasScript + lt + "/script>"
    + "</body></html>";
}
