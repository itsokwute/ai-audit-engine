// Plain JS - no JSX, no template literals
// Prompt strings built with concatenation to avoid Turbopack regex heuristic bugs

function buildSystemPrompt(domainHint) {
  var schema = '{' +
    '"company_name":"string",' +
    '"industry":"string",' +
    '"data_methodology":{' +
      '"roi_basis":"string",' +
      '"wage_source":"string",' +
      '"lead_data_source":"string",' +
      '"conversion_benchmark":"string",' +
      '"time_savings_method":"string",' +
      '"disclaimer":"string"' +
    '},' +
    '"executive_summary":{' +
      '"headline":"string",' +
      '"overview":"string",' +
      '"total_annual_savings":number,' +
      '"roi_12_month":number,' +
      '"top_3_opportunities":["string","string","string"]' +
    '},' +
    '"company_overview":{' +
      '"business_model":"string",' +
      '"revenue_streams":["string"],' +
      '"target_customers":"string",' +
      '"acquisition_channels":["string"],' +
      '"communication_channels":["string"],' +
      '"key_observations":"string"' +
    '},' +
    '"pain_points":[{' +
      '"category":"string",' +
      '"title":"string",' +
      '"description":"string",' +
      '"severity":number,' +
      '"cost_of_inaction_annual":number,' +
      '"evidence":"string"' +
    '}],' +
    '"ai_agents":[{' +
      '"agent_name":"string",' +
      '"problem_solved":"string",' +
      '"solution":"string",' +
      '"complexity":"Low or Medium or High",' +
      '"priority":"High or Medium or Low",' +
      '"integrations":["string"],' +
      '"timeline_weeks":number,' +
      '"no_code_tools":["string"]' +
    '}],' +
    '"roi_modeling":{' +
      '"assumptions":{' +
        '"avg_hourly_wage":number,' +
        '"current_monthly_leads":number,' +
        '"current_conversion_rate":number,' +
        '"avg_deal_value":number,' +
        '"staff_hours_on_manual_tasks_weekly":number' +
      '},' +
      '"scenarios":{' +
        '"conservative":{' +
          '"hours_saved_monthly":number,' +
          '"labor_savings_monthly":number,' +
          '"revenue_increase_monthly":number,' +
          '"total_monthly_benefit":number,' +
          '"annual_benefit":number,' +
          '"implementation_cost":number,' +
          '"break_even_months":number,' +
          '"roi_percent":number' +
        '},' +
        '"moderate":{' +
          '"hours_saved_monthly":number,' +
          '"labor_savings_monthly":number,' +
          '"revenue_increase_monthly":number,' +
          '"total_monthly_benefit":number,' +
          '"annual_benefit":number,' +
          '"implementation_cost":number,' +
          '"break_even_months":number,' +
          '"roi_percent":number' +
        '},' +
        '"aggressive":{' +
          '"hours_saved_monthly":number,' +
          '"labor_savings_monthly":number,' +
          '"revenue_increase_monthly":number,' +
          '"total_monthly_benefit":number,' +
          '"annual_benefit":number,' +
          '"implementation_cost":number,' +
          '"break_even_months":number,' +
          '"roi_percent":number' +
        '}' +
      '},' +
      '"monthly_projection":[' +
        '{"month":"Mo 1","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 2","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 3","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 4","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 5","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 6","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 7","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 8","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 9","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 10","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 11","without_ai":number,"with_ai":number},' +
        '{"month":"Mo 12","without_ai":number,"with_ai":number}' +
      ']' +
    '},' +
    '"roadmap":[{' +
      '"phase":"string",' +
      '"goals":["string"],' +
      '"actions":["string"],' +
      '"tools":["string"],' +
      '"success_metrics":["string"]' +
    '}],' +
    '"chart_data":{' +
      '"time_saved_by_category":[{"category":"string","hours_monthly":number}],' +
      '"cost_reduction_by_agent":[{"agent":"string","monthly_savings":number}],' +
      '"inefficiency_breakdown":[{"name":"string","value":number}],' +
      '"opportunity_heatmap":[{"area":"string","impact":number,"feasibility":number,"priority_score":number}]' +
    '}' +
  '}';

  return 'You are an expert AI Automation Architect, Business Systems Analyst, and ROI Modeling Strategist. You generate comprehensive AI Automation Audit Reports.\n\n' +
    'CRITICAL: Respond ONLY with a single valid JSON object. No markdown, no backticks, no preamble, no commentary. Start with { and end with }.\n\n' +
    'STRICT RULES - follow every one:\n' +
    '1. company_name: Use the REAL company name inferred from the domain or brand. Domain hint: "' + domainHint + '". NEVER output "Local Business Profile" or any generic placeholder.\n' +
    '2. All numbers must be industry-specific, realistic, and defensible.\n' +
    '3. severity must be an integer 1-5 (1=minor inconvenience, 5=critical business risk).\n' +
    '4. monthly_projection: exactly 12 entries.\n' +
    '   - with_ai: starts low in Mo 1 (just above implementation cost recovery), grows steadily each month, reaches meaningful cumulative savings by Mo 12.\n' +
    '   - without_ai: represents the FLAT ORGANIC BASELINE - current revenue/cost state with minimal natural growth (1-3% per year max). Values should be CLOSE TO ZERO or represent ongoing costs, NOT large positive numbers. The gap between with_ai and without_ai should WIDEN each month to show the automation advantage compounding.\n' +
    '   - IMPORTANT: Do NOT set without_ai to large dollar amounts. It should represent the status quo incremental cost or near-zero baseline benefit.\n' +
    '5. roadmap: must contain EXACTLY 3 phases:\n' +
    '   - Phase 1: "Foundation & Quick Wins" (Days 1-30) - deploy highest-priority agents\n' +
    '   - Phase 2: "Optimization & Integration" (Days 31-60) - refine, connect systems\n' +
    '   - Phase 3: "Scale & Advanced Automation" (Days 61-90) - advanced agents, analytics\n' +
    '6. pain_points: minimum 4 entries, each with a distinct category.\n' +
    '7. ai_agents: minimum 4 entries matching the pain points identified.\n' +
    '8. chart_data.inefficiency_breakdown: values must sum to 100.\n\n' +
    'JSON schema:\n' + schema;
}

function buildUserPrompt(inputSummary) {
  return 'Analyze this company and generate the complete audit JSON:\n\n' +
    inputSummary + '\n\n' +
    'Use the real company name from the domain. ' +
    'Make monthly_projection show CLEAR VISUAL DIVERGENCE: with_ai curves upward strongly, without_ai stays nearly flat (it is just the organic baseline). ' +
    'Be specific, industry-accurate, and commercially credible.';
}

export async function runAuditAPI(inputs) {
  var inputSummary = Object.entries(inputs)
    .filter(function(pair) { return pair[1] && pair[1].trim(); })
    .map(function(pair) { return pair[0].toUpperCase() + ': ' + pair[1]; })
    .join('\n');

  var domainHint = '';
  if (inputs.website) {
    try {
      var url = new URL(inputs.website);
      domainHint = url.hostname.replace('www.', '').split('.')[0];
      domainHint = domainHint.charAt(0).toUpperCase() + domainHint.slice(1);
    } catch (e) {}
  }

  var systemPrompt = buildSystemPrompt(domainHint);
  var userPrompt = buildUserPrompt(inputSummary);

  var res = await fetch('/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!res.ok) {
    var e = await res.json().catch(function() { return {}; });
    throw new Error('API ' + res.status + ': ' + (e && e.error && e.error.message ? e.error.message : res.statusText));
  }

  var data = await res.json();
  var raw = (data.content || []).map(function(b) { return b.text || ''; }).join('');
  var match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON returned from API.');
  return JSON.parse(match[0]);
}