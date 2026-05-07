// exportUtils.js — Premium light theme export matching the redesigned UI

const COLS = ["#0D7377","#639922","#BA7517","#185FA5","#993556","#3B6D11"];

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

  var sevColors = {"1":"#22c55e","2":"#84cc16","3":"#eab308","4":"#f97316","5":"#ef4444"};
  var sevBg     = {"1":"#EAF3DE","2":"#EAF3DE","3":"#FAEEDA","4":"#FAEEDA","5":"#FCEBEB"};
  var phaseColors = COLS;

  var css =
    '@import url(\'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap\');' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{font-family:\'Plus Jakarta Sans\',sans-serif;background:#F8FAFB;color:#1A2236;padding:0;font-size:12px;line-height:1.6}' +
    'h2{font-family:\'Plus Jakarta Sans\',sans-serif;font-size:11px;font-weight:700;color:#0D7377;margin:28px 0 10px;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid #0D7377;padding-bottom:6px;display:inline-block}' +
    '.page{padding:36px 44px;background:#F8FAFB}' +
    '.cover{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:64px;background:linear-gradient(135deg,#F0FAF8,#EAF3DE);border-bottom:3px solid #0D7377;page-break-after:always}' +
    '.card{background:#FFFFFF;border:0.5px solid #E2E8F0;border-radius:10px;padding:14px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,0.04)}' +
    '.cteal{border-color:#9FE1CB!important;background:#F0FAF8!important}' +
    '.camber{border-color:#FAC775!important;background:#FAEEDA!important}' +
    '.sl{font-size:10px;letter-spacing:0.07em;text-transform:uppercase;color:#0D7377;font-weight:700;margin-bottom:6px}' +
    '.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.g4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px}' +
    '.pain{border-radius:10px;padding:14px;margin-bottom:10px;border-left-width:4px;border-left-style:solid;border-top:0.5px solid #E2E8F0;border-right:0.5px solid #E2E8F0;border-bottom:0.5px solid #E2E8F0}' +
    '.dot{width:12px;height:12px;border-radius:3px;display:inline-block;margin-right:3px}' +
    '.agent{background:#FFFFFF;border:0.5px solid #E2E8F0;border-radius:10px;padding:14px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,0.04)}' +
    '.tag{display:inline-block;font-size:9px;padding:2px 8px;border-radius:4px;margin:2px;background:#F1EFE8;color:#5F5E5A;font-weight:500}' +
    '.bh{background:#FCEBEB;color:#A32D2D;border:1px solid #F09595;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bm{background:#FAEEDA;color:#854F0B;border:1px solid #EF9F27;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bl{background:#EAF3DE;color:#27500A;border:1px solid #97C459;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bcl{background:#EAF3DE;color:#27500A;border:1px solid #97C459;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bcm{background:#E6F1FB;color:#185FA5;border:1px solid #85B7EB;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.bch{background:#EEEDFE;color:#3C3489;border:1px solid #AFA9EC;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;display:inline-block}' +
    '.scen{border-radius:10px;padding:14px}' +
    '.smod{border:2px solid #0D7377;background:#F0FAF8}' +
    '.soth{border:0.5px solid #E2E8F0;background:#FFFFFF}' +
    '.row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:0.5px solid #F1EFE8}' +
    '.rv{font-weight:700;color:#0D7377}' +
    '.rw{font-weight:600;color:#1A2236}' +
    '.phase{border-radius:10px;padding:14px;margin-bottom:10px;border-left-width:4px;border-left-style:solid;background:#FFFFFF;border-top:0.5px solid #E2E8F0;border-right:0.5px solid #E2E8F0;border-bottom:0.5px solid #E2E8F0}' +
    '.hm{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}' +
    '.hmc{border-radius:8px;padding:10px 8px;text-align:center}' +
    '.hms{font-size:20px;font-weight:800;color:#0D7377}' +
    '.mr{padding:10px 12px;background:#F8FAFB;border-radius:8px;border-left-width:3px;border-left-style:solid;margin-bottom:8px}' +
    '.ftr{margin-top:28px;padding-top:12px;border-top:0.5px solid #E2E8F0;font-size:10px;color:#888780;text-align:center}' +
    '.leg{display:flex;flex-wrap:wrap;gap:5px 12px;justify-content:center;margin-top:8px}' +
    '.legitem{display:flex;align-items:center;gap:5px;font-size:10px;color:#5F5E5A}' +
    '.legswatch{width:10px;height:10px;border-radius:2px;flex-shrink:0}' +
    '.disclaimer{background:#FAEEDA;border:1px solid #FAC775;border-radius:8px;padding:12px 14px;margin-bottom:16px;font-size:11px;color:#633806;line-height:1.6}' +
    '.kpi-hero{background:#0D7377;border-radius:12px;padding:20px 28px;text-align:center;color:#FFFFFF}' +
    '.kpi-hero-label{font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.75);margin-bottom:4px;font-weight:600}' +
    '.kpi-hero-val{font-size:40px;font-weight:800;color:#FFFFFF;line-height:1}' +
    '.kpi-sub{background:#EAF3DE;border-radius:8px;padding:12px;text-align:center}' +
    '.kpi-sub-label{font-size:9px;color:#3B6D11;font-weight:600;margin-bottom:3px}' +
    '.kpi-sub-val{font-size:18px;font-weight:800;color:#085041}' +
    '@media print{.cover{page-break-after:always}.no-print{display:none}body{background:#FFFFFF}}';

  // ── PAIN POINTS ──
  var painHtml = "";
  (report.pain_points || []).forEach(function(p) {
    var sev = parseInt(p.severity, 10) || 1;
    var col = sevColors[String(sev)] || "#888";
    var bg  = sevBg[String(sev)] || "#F8FAFB";
    var dots = "";
    for (var n=1; n<=5; n++) {
      dots += '<span class="dot" style="background:' + (n<=sev?col:"#E2E8F0") + ';border:1px solid ' + (n<=sev?col:"#CBD5E1") + '"></span>';
    }
    painHtml += '<div class="pain" style="background:' + bg + ';border-left-color:' + col + '">';
    painHtml += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:7px;flex-wrap:wrap;gap:5px">';
    painHtml += '<div><div style="font-size:9px;color:#888780;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:3px;font-weight:600">' + p.category + '</div>';
    painHtml += '<div style="font-weight:700;font-size:13px;color:#1A2236">' + p.title + '</div></div>';
    painHtml += '<div style="display:flex;gap:4px;align-items:center"><span style="font-size:9px;color:#888780;font-weight:600;margin-right:4px">Severity</span>' + dots + '</div></div>';
    painHtml += '<div style="color:#5F5E5A;margin-bottom:7px;font-size:11px;line-height:1.7">' + p.description + '</div>';
    painHtml += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:5px">';
    painHtml += '<div style="font-size:10px;color:#888780;font-style:italic">' + p.evidence + '</div>';
    painHtml += '<div style="background:#FCEBEB;border:0.5px solid #F09595;border-radius:6px;padding:3px 10px;font-size:10px;color:#A32D2D;font-weight:600">Annual cost: <strong>' + fc(p.cost_of_inaction_annual) + '</strong></div>';
    painHtml += '</div></div>';
  });

  // ── AI AGENTS ──
  var agentHtml = "";
  (report.ai_agents || []).forEach(function(a, i) {
    var priMap = {High:'<span class="bh">High Priority</span>',Medium:'<span class="bm">Medium Priority</span>',Low:'<span class="bl">Low Priority</span>'};
    var cmpMap = {Low:'<span class="bcl">Low Complexity</span>',Medium:'<span class="bcm">Medium Complexity</span>',High:'<span class="bch">High Complexity</span>'};
    var tags = (a.integrations||[]).concat(a.no_code_tools||[]).map(function(t){return '<span class="tag">'+t+'</span>';}).join("");
    var col = COLS[i % COLS.length];
    agentHtml += '<div class="agent">';
    agentHtml += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:6px">';
    agentHtml += '<div style="display:flex;gap:10px;align-items:center">';
    agentHtml += '<div style="width:36px;height:36px;background:#EAF3DE;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🤖</div>';
    agentHtml += '<div><div style="font-weight:700;font-size:13px;color:#1A2236">' + a.agent_name + '</div>';
    agentHtml += '<div style="font-size:10px;color:#888780;margin-top:1px;font-weight:500">~' + a.timeline_weeks + ' week deployment</div></div></div>';
    agentHtml += '<div>' + (priMap[a.priority]||'') + ' ' + (cmpMap[a.complexity]||'') + '</div></div>';
    agentHtml += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px">';
    agentHtml += '<div><div style="font-size:9px;color:#888780;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px">Problem</div><div style="font-size:11px;color:#5F5E5A;line-height:1.5">' + a.problem_solved + '</div></div>';
    agentHtml += '<div><div style="font-size:9px;color:#888780;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px">Solution</div><div style="font-size:11px;color:#5F5E5A;line-height:1.5">' + a.solution + '</div></div>';
    agentHtml += '</div>';
    if (tags) agentHtml += '<div style="border-top:0.5px solid #F1EFE8;padding-top:8px">' + tags + '</div>';
    agentHtml += '</div>';
  });

  // ── ROI ASSUMPTIONS ──
  var assumpHtml = "";
  Object.entries(report.roi_modeling && report.roi_modeling.assumptions || {}).forEach(function(e) {
    var k = e[0], v = e[1];
    var label = k.replace(/_/g," ");
    var val = k.includes("wage")||k.includes("value") ? fc(v) : k.includes("rate") ? v+"%" : v;
    assumpHtml += '<div style="background:#F8FAFB;border-radius:6px;padding:10px 12px;border:0.5px solid #E2E8F0">';
    assumpHtml += '<div style="font-size:9px;color:#888780;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px">' + label + '</div>';
    assumpHtml += '<div style="font-weight:700;font-size:14px;color:#0D7377">' + val + '</div></div>';
  });

  // ── ROI SCENARIOS ──
  var scenHtml = "";
  var scenEntries = Object.entries(report.roi_modeling && report.roi_modeling.scenarios || {});
  scenEntries.forEach(function(e, si) {
    var sc = e[0], d = e[1];
    var isMod = si === 1;
    scenHtml += '<div class="scen ' + (isMod?"smod":"soth") + '">';
    if (isMod) scenHtml += '<div style="text-align:center;margin-bottom:8px"><span style="background:#0D7377;color:#FFFFFF;font-size:9px;font-weight:700;padding:2px 10px;border-radius:99px">Most Likely</span></div>';
    scenHtml += '<div style="font-weight:700;font-size:13px;color:#1A2236;margin-bottom:12px">' + sc + '</div>';
    var rows = [
      ["Hours Saved/Mo", d.hours_saved_monthly+"h"],
      ["Labor Savings/Mo", fc(d.labor_savings_monthly)],
      ["Revenue Boost/Mo", fc(d.revenue_increase_monthly)],
      ["Annual Benefit", fc(d.annual_benefit)],
      ["Break Even", d.break_even_months+" mo"],
      ["ROI", d.roi_percent+"%"]
    ];
    rows.forEach(function(r){
      scenHtml += '<div class="row"><span style="font-size:11px;color:#888780">' + r[0] + '</span>';
      scenHtml += '<span class="' + (isMod?"rv":"rw") + '" style="font-size:12px">' + r[1] + '</span></div>';
    });
    scenHtml += '</div>';
  });

  // ── ROADMAP ──
  var roadHtml = "";
  (report.roadmap || []).forEach(function(phase, i) {
    var col = phaseColors[i % phaseColors.length];
    roadHtml += '<div class="phase" style="border-left-color:' + col + '">';
    roadHtml += '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px">';
    roadHtml += '<div style="width:30px;height:30px;background:' + col + ';border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#FFFFFF;font-size:14px;flex-shrink:0">' + (i+1) + '</div>';
    roadHtml += '<div style="font-weight:700;font-size:13px;color:#1A2236">' + phase.phase + '</div></div>';
    roadHtml += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px">';
    [["Goals",phase.goals],["Actions",phase.actions],["Tools",phase.tools],["Success Metrics",phase.success_metrics]].forEach(function(sec){
      roadHtml += '<div><div style="font-size:9px;color:#888780;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">' + sec[0] + '</div>';
      (sec[1]||[]).forEach(function(item){
        roadHtml += '<div style="font-size:10px;color:#5F5E5A;line-height:1.5;margin-bottom:5px;padding-left:8px;border-left:2px solid #E2E8F0">' + item + '</div>';
      });
      roadHtml += '</div>';
    });
    roadHtml += '</div></div>';
  });

  // ── METHODOLOGY ──
  var methHtml = "";
  [
    ["ROI Calculation Basis", report.data_methodology && report.data_methodology.roi_basis, "#0D7377"],
    ["Wage Rate Source", report.data_methodology && report.data_methodology.wage_source, "#639922"],
    ["Lead Volume Estimation", report.data_methodology && report.data_methodology.lead_data_source, "#BA7517"],
    ["Conversion Rate Benchmark", report.data_methodology && report.data_methodology.conversion_benchmark, "#185FA5"],
    ["Time Savings Methodology", report.data_methodology && report.data_methodology.time_savings_method, "#993556"]
  ].forEach(function(m){
    methHtml += '<div class="mr" style="border-left-color:' + m[2] + '">';
    methHtml += '<div style="font-size:10px;font-weight:700;color:' + m[2] + ';margin-bottom:3px">' + m[0] + '</div>';
    methHtml += '<div style="font-size:11px;color:#5F5E5A;line-height:1.6">' + (m[1]||"Based on industry-standard AI automation benchmarks.") + '</div>';
    methHtml += '</div>';
  });

  // ── HEATMAP ──
  var hmHtml = "";
  (report.chart_data && report.chart_data.opportunity_heatmap || []).forEach(function(item, i) {
    var score = item.priority_score || Math.round((item.impact*0.6+item.feasibility*0.4)*10);
    var intensity = Math.min(score/100, 1);
    var bg = "rgba(13,115,119," + (0.05+intensity*0.2) + ")";
    var bd = "rgba(13,115,119," + (0.15+intensity*0.45) + ")";
    hmHtml += '<div class="hmc" style="background:' + bg + ';border:0.5px solid ' + bd + '">';
    hmHtml += '<div style="font-size:9px;color:#5F5E5A;margin-bottom:5px;font-weight:600">' + item.area + '</div>';
    hmHtml += '<div class="hms">' + score + '</div>';
    hmHtml += '<div style="font-size:8px;color:#888780;margin-top:3px">Impact ' + item.impact + '/10 · Ease ' + item.feasibility + '/10</div>';
    hmHtml += '</div>';
  });

  // ── PIE LEGEND ──
  var pieLeg = "";
  (report.chart_data && report.chart_data.inefficiency_breakdown || []).forEach(function(item, i) {
    pieLeg += '<div class="legitem"><div class="legswatch" style="background:' + COLS[i%COLS.length] + '"></div>' + item.name + ' (' + item.value + '%)</div>';
  });

  // ── CANVAS CHART DATA ──
  var roiData   = JSON.stringify(report.roi_modeling && report.roi_modeling.monthly_projection || []);
  var timeData  = JSON.stringify(report.chart_data && report.chart_data.time_saved_by_category || []);
  var pieData   = JSON.stringify(report.chart_data && report.chart_data.inefficiency_breakdown || []);
  var agentData = JSON.stringify(report.chart_data && report.chart_data.cost_reduction_by_agent || []);

  var fmtFn = 'function fmt(n){var s="'+sym+'";var r=n*'+rate+';if(r>=1e9)return s+(r/1e9).toFixed(1)+"B";if(r>=1e6)return s+(r/1e6).toFixed(1)+"M";if(r>=1e3)return s+(r/1e3).toFixed(0)+"K";return s+Math.round(r);}';
  var COLS_JS = 'var COLS=["#0D7377","#639922","#BA7517","#185FA5","#993556","#3B6D11"];';

  var canvasScript = fmtFn + COLS_JS +
    'function drawROI(){' +
      'var data=' + roiData + ';' +
      'var c=document.getElementById("roiChart");if(!c||!data.length)return;' +
      'var ctx=c.getContext("2d"),W=c.width,H=c.height,pl=65,pr=20,pt=15,pb=30;' +
      'ctx.fillStyle="#FFFFFF";ctx.fillRect(0,0,W,H);' +
      'var withAI=data.map(function(d){return d.with_ai||0;});' +
      'var withoutAI=data.map(function(d){return d.without_ai||0;});' +
      'var maxV=Math.max.apply(null,withAI.concat(withoutAI))||1;' +
      'ctx.strokeStyle="#F1EFE8";ctx.lineWidth=1;' +
      'for(var i=0;i<=4;i++){var y=pt+i*(H-pt-pb)/4;ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(W-pr,y);ctx.stroke();}' +
      'ctx.fillStyle="#888780";ctx.font="10px Plus Jakarta Sans,sans-serif";ctx.textAlign="right";' +
      'for(var i=0;i<=4;i++){var v=maxV*(1-i/4);var y=pt+i*(H-pt-pb)/4;ctx.fillText(fmt(v),pl-6,y+3);}' +
      'function drawLine(arr,color,dash){' +
        'ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=2.5;' +
        'if(dash)ctx.setLineDash([6,4]);else ctx.setLineDash([]);' +
        'arr.forEach(function(v,i){var x=pl+i*(W-pl-pr)/(arr.length-1);var y=pt+(1-v/maxV)*(H-pt-pb);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});' +
        'ctx.stroke();ctx.setLineDash([]);' +
      '}' +
      'drawLine(withoutAI,"#F09595",true);' +
      'drawLine(withAI,"#0D7377",false);' +
      'ctx.fillStyle="#888780";ctx.font="10px Plus Jakarta Sans,sans-serif";ctx.textAlign="center";' +
      'data.forEach(function(d,i){var x=pl+i*(W-pl-pr)/(data.length-1);ctx.fillText(d.month,x,H-8);});' +
      'ctx.fillStyle="#0D7377";ctx.fillRect(pl,H-pb+2,20,3);ctx.fillStyle="#1A2236";ctx.textAlign="left";ctx.fillText("With AI",pl+24,H-pb+8);' +
      'ctx.strokeStyle="#F09595";ctx.lineWidth=2;ctx.setLineDash([5,3]);ctx.beginPath();ctx.moveTo(pl+90,H-pb+4);ctx.lineTo(pl+110,H-pb+4);ctx.stroke();ctx.setLineDash([]);' +
      'ctx.fillStyle="#1A2236";ctx.fillText("Without AI",pl+114,H-pb+8);' +
    '}' +
    'function drawTime(){' +
      'var data=' + timeData + ';' +
      'var c=document.getElementById("timeChart");if(!c||!data.length)return;' +
      'var ctx=c.getContext("2d"),W=c.width,H=c.height,pl=110,pr=30,pt=10,pb=10;' +
      'ctx.fillStyle="#FFFFFF";ctx.fillRect(0,0,W,H);' +
      'var maxV=Math.max.apply(null,data.map(function(d){return d.hours_monthly;}))||1;' +
      'var bH=(H-pt-pb)/data.length-6;' +
      'data.forEach(function(d,i){' +
        'var y=pt+i*(bH+6);' +
        'var bW=(d.hours_monthly/maxV)*(W-pl-pr);' +
        'ctx.fillStyle=COLS[i%COLS.length];ctx.beginPath();ctx.roundRect(pl,y,bW,bH,3);ctx.fill();' +
        'ctx.fillStyle="#5F5E5A";ctx.font="10px Plus Jakarta Sans,sans-serif";ctx.textAlign="right";' +
        'ctx.fillText(d.category,pl-6,y+bH/2+3);' +
        'ctx.fillStyle="#FFFFFF";ctx.textAlign="left";' +
        'if(bW>25)ctx.fillText(d.hours_monthly+"h",pl+bW-30,y+bH/2+3);' +
      '});' +
    '}' +
    'function drawPie(){' +
      'var data=' + pieData + ';' +
      'var c=document.getElementById("pieChart");if(!c||!data.length)return;' +
      'var ctx=c.getContext("2d"),W=c.width,H=c.height;' +
      'ctx.fillStyle="#FFFFFF";ctx.fillRect(0,0,W,H);' +
      'var cx=W/2,cy=H/2,r=Math.min(W,H)*0.38,ir=r*0.45;' +
      'var total=data.reduce(function(a,d){return a+d.value;},0)||1;' +
      'var start=-Math.PI/2;' +
      'data.forEach(function(d,i){' +
        'var angle=(d.value/total)*2*Math.PI;' +
        'ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+angle);ctx.closePath();' +
        'ctx.fillStyle=COLS[i%COLS.length];ctx.fill();' +
        'if(d.value>=8){' +
          'var midA=start+angle/2;var lx=cx+Math.cos(midA)*(r+16);var ly=cy+Math.sin(midA)*(r+16);' +
          'ctx.fillStyle="#1A2236";ctx.font="10px Plus Jakarta Sans,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";' +
          'ctx.fillText(d.value+"%",lx,ly);' +
        '}' +
        'start+=angle;' +
      '});' +
      'ctx.beginPath();ctx.arc(cx,cy,ir,0,2*Math.PI);ctx.fillStyle="#F8FAFB";ctx.fill();}' +
    'function drawAgent(){' +
      'var data=' + agentData + ';' +
      'var c=document.getElementById("agentChart");if(!c||!data.length)return;' +
      'var ctx=c.getContext("2d"),W=c.width,H=c.height,pl=55,pr=10,pt=10,pb=55;' +
      'ctx.fillStyle="#FFFFFF";ctx.fillRect(0,0,W,H);' +
      'var maxV=Math.max.apply(null,data.map(function(d){return d.monthly_savings;}))||1;' +
      'var bW=(W-pl-pr)/data.length-10;' +
      'ctx.strokeStyle="#F1EFE8";ctx.lineWidth=1;' +
      'for(var i=0;i<=4;i++){var y=pt+i*(H-pt-pb)/4;ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(W-pr,y);ctx.stroke();}' +
      'ctx.fillStyle="#888780";ctx.font="10px Plus Jakarta Sans,sans-serif";ctx.textAlign="right";' +
      'for(var i=0;i<=4;i++){var v=maxV*(1-i/4);var y=pt+i*(H-pt-pb)/4;ctx.fillText(fmt(v),pl-4,y+3);}' +
      'data.forEach(function(d,i){' +
        'var x=pl+i*(bW+10);' +
        'var barH=(d.monthly_savings/maxV)*(H-pt-pb);' +
        'var y=H-pb-barH;' +
        'ctx.fillStyle=COLS[i%COLS.length];ctx.beginPath();ctx.roundRect(x,y,bW,barH,3);ctx.fill();' +
        'ctx.fillStyle=COLS[i%COLS.length];ctx.font="9px Plus Jakarta Sans,sans-serif";ctx.textAlign="center";' +
        'var words=d.agent.split(" ");var line="";var lines=[];' +
        'words.forEach(function(w){if((line+" "+w).length>12&&line){lines.push(line);line=w;}else{line=line?line+" "+w:w;}});' +
        'if(line)lines.push(line);' +
        'lines.forEach(function(l,j){ctx.fillText(l,x+bW/2,H-pb+12+j*12);});' +
      '});}' +
    'drawROI();drawTime();drawPie();drawAgent();';

  var lt = "<";
  var now = new Date();
  var dateStr = now.toLocaleDateString("en-US", {year:"numeric",month:"long",day:"numeric"});

  // ── COVER PAGE ──
  var coverHtml =
    '<div class="cover">' +
    '<div style="margin-bottom:48px">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">' +
    '<div style="width:44px;height:44px;background:#0D7377;border-radius:10px;display:flex;align-items:center;justify-content:center">' +
    '<span style="color:#FFFFFF;font-weight:800;font-size:22px">A</span></div>' +
    '<div><div style="font-weight:800;font-size:16px;color:#1A2236;letter-spacing:-0.02em">AuditAI</div>' +
    '<div style="font-size:11px;color:#888780;font-weight:500">by Nova_Agentic</div></div></div>' +
    '<div style="font-size:11px;letter-spacing:0.08em;color:#0D7377;text-transform:uppercase;margin-bottom:14px;font-weight:700">AI Automation Audit Report</div>' +
    '<div style="font-size:48px;font-weight:800;line-height:1.1;margin-bottom:10px;color:#1A2236;letter-spacing:-0.03em">' + report.company_name + '</div>' +
    '<div style="font-size:16px;color:#5F5E5A;margin-bottom:36px;font-weight:500">' + report.industry + '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;max-width:700px">' +
    '<div class="kpi-hero" style="grid-column:span 2">' +
    '<div class="kpi-hero-label">12-Month ROI (est.)</div>' +
    '<div class="kpi-hero-val">' + (report.executive_summary && report.executive_summary.roi_12_month) + '%</div>' +
    '<div style="font-size:11px;color:rgba(255,255,255,0.65);margin-top:4px">estimated return on AI investment</div></div>' +
    '<div class="kpi-sub">' +
    '<div class="kpi-sub-label">Annual Savings (est.)</div>' +
    '<div class="kpi-sub-val">' + fc(report.executive_summary && report.executive_summary.total_annual_savings) + '</div></div>' +
    '<div class="kpi-sub">' +
    '<div class="kpi-sub-label">Pain Points Found</div>' +
    '<div class="kpi-sub-val" style="color:#BA7517">' + ((report.pain_points && report.pain_points.length) || 0) + '</div></div>' +
    '</div></div>' +
    '<div style="margin-top:auto;border-top:0.5px solid #E2E8F0;padding-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
    '<div style="font-size:11px;color:#888780">Powered by <strong style="color:#0D7377">Claude AI (Anthropic)</strong> · AuditAI by Nova_Agentic</div>' +
    '<div style="font-size:11px;color:#888780">Generated: ' + dateStr + ' · Currency: ' + code + '</div>' +
    '</div>' +
    '<div class="disclaimer" style="margin-top:16px">&#9888; <strong>AI-generated estimates only.</strong> All projections are based on industry benchmarks and publicly available data. Validate against actual business data before making investment or operational decisions.</div>' +
    '</div>';

  return "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'/><meta name='viewport' content='width=device-width,initial-scale=1'/><title>" + report.company_name + " — AI Audit Report</title>"
    + lt + "style>" + css + lt + "/style></head><body>"
    + coverHtml
    + "<div class='page'>"
    + "<h2>Executive Summary</h2>"
    + "<div class='card cteal' style='margin-bottom:10px;border-left:3px solid #0D7377'><div class='sl'>Headline Finding</div><div style='font-size:14px;font-weight:600;color:#1A2236;line-height:1.5'>" + (report.executive_summary && report.executive_summary.headline) + "</div></div>"
    + "<div class='card' style='margin-bottom:10px'><div class='sl'>Overview</div><div style='color:#5F5E5A;line-height:1.7;font-size:12px'>" + (report.executive_summary && report.executive_summary.overview) + "</div></div>"
    + "<div class='card'><div class='sl'>Top 3 Opportunities</div>"
    + (report.executive_summary && report.executive_summary.top_3_opportunities || []).map(function(o,i){
        return '<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px"><div style="min-width:22px;height:22px;background:#0D7377;border-radius:5px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#FFFFFF;font-size:11px;flex-shrink:0">'+(i+1)+'</div><div style="font-size:12px;color:#1A2236;line-height:1.6">'+o+'</div></div>';
      }).join("")
    + "</div>"
    + "<h2>Pain Points</h2>" + painHtml
    + "<h2>AI Agents</h2>" + agentHtml
    + "<h2>ROI Model</h2>"
    + (assumpHtml ? "<div class='card' style='margin-bottom:10px'><div class='sl'>Model Assumptions</div><div class='g3'>" + assumpHtml + "</div></div>" : "")
    + "<div class='g3'>" + scenHtml + "</div>"
    + "<h2>12-Month Revenue Projection</h2>"
    + "<div class='card'><div style='font-size:10px;color:#888780;margin-bottom:8px'>With AI (teal) vs Without AI — organic baseline (dashed)</div>" + lt + "canvas id='roiChart' width='860' height='220'>" + lt + "/canvas></div>"
    + "<h2>Charts</h2>"
    + "<div class='g2' style='margin-bottom:10px'>"
    + "<div class='card'><div class='sl'>Time Saved by Category (hrs/mo)</div>" + lt + "canvas id='timeChart' width='400' height='200'>" + lt + "/canvas></div>"
    + "<div class='card'><div class='sl'>Operational Inefficiency Breakdown</div>" + lt + "canvas id='pieChart' width='400' height='180'>" + lt + "/canvas><div class='leg'>" + pieLeg + "</div></div>"
    + "</div>"
    + "<div class='card' style='margin-bottom:10px'><div class='sl'>Monthly Cost Reduction by AI Agent (" + code + ")</div>" + lt + "canvas id='agentChart' width='860' height='200'>" + lt + "/canvas></div>"
    + (hmHtml ? "<div class='card'><div class='sl'>AI Opportunity Heatmap — Priority Score (0–100)</div><div style='font-size:10px;color:#888780;margin-bottom:10px'>Score = (Impact × 0.6) + (Feasibility × 0.4) × 10. Higher = deploy first.</div><div class='hm'>" + hmHtml + "</div></div>" : "")
    + "<h2>90-Day Roadmap</h2>" + roadHtml
    + "<h2>Data Methodology</h2>"
    + "<div class='card camber' style='margin-bottom:10px'><div style='display:flex;gap:10px'><span style='font-size:15px;color:#BA7517'>&#9888;</span><div><div style='font-weight:700;margin-bottom:3px;color:#633806'>Disclaimer</div><div style='color:#854F0B;font-size:11px;line-height:1.6'>" + ((report.data_methodology && report.data_methodology.disclaimer) || "All projections are AI-generated estimates. Validate against actual data before decisions.") + "</div></div></div></div>"
    + methHtml
    + "<div class='ftr'>AI Automation Audit Report · " + report.company_name + " · Generated " + dateStr + " · Currency: " + code + " · Powered by Claude AI (Anthropic) · AuditAI by Nova_Agentic</div>"
    + "</div>"
    + lt + "script>" + canvasScript + lt + "/script>"
    + "</body></html>";
}
