// Generates the machine-readable files agents use to discover AIM:
//   data/profile.json, data/openapi.json      read-only public profile API
//   .well-known/api-catalog                   RFC 9727 linkset pointing at that API
//   .well-known/agent-skills/index.json       Agent Skills discovery index (digest of SKILL.md)
//   .well-known/ai-catalog.json               ARD manifest listing all of the above
// Run from _src/: `node agent_files.js` (part of `npm run build`). Edit SKILL.md by hand;
// its digest is recomputed here, so the index never goes stale.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const S = 'https://aimsystem.in';
const out = (rel, data) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
};

const profile = {
  name: 'AIM — AI Infrastructure & Machines', legalName: 'AI Infrastructure & Machines',
  alternateNames: ['AIM', 'AIM System', 'AIM Systems', 'AIM Studio'],
  tagline: 'Your Engineering Team, On Demand',
  summary: 'Technology engineering agency. From one senior engineer to a complete product team, AIM designs, builds, deploys and operates production-grade software, AI systems, automation and cloud infrastructure.',
  registration: 'Udyam-registered MSME (India)', location: 'Madhya Pradesh, India', markets: ['India', 'United Kingdom', 'Europe'],
  websites: [S + '/', 'https://aimstudio.co.in/'],
  contact: { name: 'Ankit Panicker', role: 'Client Partner & Technical Lead', email: 'ankit@aimsystem.in', page: S + '/contact' },
  services: [
    { name: 'Product Engineering', scope: ['SaaS', 'web applications', 'APIs', 'backend systems', 'internal platforms', 'enterprise applications', 'product modernization'] },
    { name: 'AI Engineering', scope: ['LLM applications', 'AI agents', 'RAG', 'AI automation', 'voice AI', 'STT/TTS', 'AI orchestration', 'model integrations'] },
    { name: 'Platform Engineering', scope: ['cloud', 'Kubernetes', 'infrastructure-as-code', 'CI/CD', 'observability', 'distributed systems', 'reliability engineering'] },
    { name: 'Automation & Integrations', scope: ['API and CRM integrations', 'WhatsApp', 'telephony', 'workflow automation', 'business process automation', 'data pipelines'] },
  ],
  engagementModels: [
    { name: 'Hire an Engineer', detail: 'Backend, frontend, full-stack, AI, cloud, DevOps or platform engineer.' },
    { name: 'Hire a Specialist', detail: 'AI architecture, voice AI, cloud infrastructure, distributed systems, API architecture, automation, DevOps, system modernization.' },
    { name: 'Engineering Pod', detail: 'Cross-functional team, e.g. technical lead, backend, frontend, AI/platform engineer, QA.' },
    { name: 'Complete Product Team', detail: 'Product strategy, UX/UI, architecture, frontend, backend, AI, infrastructure, DevOps, QA, deployment, operations.' },
  ],
  pricing: 'Dedicated engineers and pods are custom engagements; product development is a scoped proposal; AI and infrastructure work is priced from the architecture.',
  positioning: 'One team owns it, architecture to on-call: architecture, backend, frontend, AI, cloud, CI/CD and monitoring, with no handoffs between vendors and no orphaned code. AIM runs production platforms itself.',
  differentiators: [
    'Single point of ownership: one team covers architecture, build, deploy and operate.',
    'Runs what it builds: APEX Connect, a multi-tenant voice and WhatsApp platform, is in production for hospitals and colleges.',
    'Every build ships with monitoring, CI/CD and a runbook; observability and documentation are never an upsell.',
    'Named stack: Python/FastAPI, Node/TypeScript, React/Next.js, PostgreSQL, Redis, Docker, Kubernetes, Terraform on AWS, Azure or GCP.',
    'No account managers: clients talk directly to the engineers writing the code.',
  ],
  process: [
    { step: 'Discover', deliverable: 'Scope brief: goals, users, constraints and success measures.' },
    { step: 'Architect', deliverable: 'Architecture document and infrastructure plan.' },
    { step: 'Assemble', deliverable: 'Named team, roles and a delivery plan.' },
    { step: 'Build', deliverable: 'Working increments in the client repository, with tests and CI.' },
    { step: 'Deploy', deliverable: 'Production release, monitoring dashboards and a runbook.' },
    { step: 'Operate', deliverable: 'On-call cover, regular reports and a prioritised improvement backlog.' },
  ],
  ukEu: {
    page: S + '/uk-eu',
    summary: 'Engineering contractors for UK and European companies: one B2B contract with AIM, working hours overlapping UK/CET business hours (IST is 4.5–5.5 hours ahead of the UK), work in the client cloud and chosen UK or EU region under the client data-processing terms, client owns all code.',
  },
  clientOwnership: 'Client cloud, client API accounts, client-controlled credentials, documented deployment, source ownership, transferable infrastructure.',
  platforms: [
    { name: 'APEX Connect', url: 'https://aimstudio.co.in/app', summary: 'AI-powered customer engagement infrastructure: multi-tenant voice, messaging and AI workflows. Usage-based pricing.' },
    { name: 'AIM Remote AI', url: 'https://aimstudio.co.in/remoteai', summary: 'AI operating layer connecting phone, desktop and voice to your machine (Windows, Android, Chrome).' },
    { name: 'Healthcare Operations Platform', status: 'in development', summary: 'Hospital workflows, patient operations and clinical administration.' },
  ],
  work: [
    { title: 'AI-Powered Patient Communication', industry: 'Healthcare', client: 'Apple Hospital', status: 'production', outcome: '15K+ calls processed, 6.8K+ answered, ~45% connected/answered.' },
    { title: 'Multi-Tenant Institutional Communication', industry: 'Education', client: 'BIMTS College', status: 'production', outcome: 'Dedicated tenant for voice outreach and WhatsApp automation.' },
    { title: 'Digital Experience Engineering', industry: 'Hospitality', client: 'Café Ciel at The OWO, London', status: 'delivered', outcome: 'Delivered on schedule on a compressed timeline.' },
  ],
  pages: Object.fromEntries(['services', 'hire', 'uk-eu', 'products', 'work', 'engineering', 'about', 'contact', 'privacy'].map(p => [p, `${S}/${p}`])),
};
out('data/profile.json', profile);

out('data/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'AIM public profile API', version: '1.0.0',
    description: 'Read-only, unauthenticated JSON describing AIM — AI Infrastructure & Machines: services, engagement models, platforms, selected work and contact.',
    contact: { name: 'Ankit Panicker', email: 'ankit@aimsystem.in', url: S + '/contact' },
  },
  servers: [{ url: S }],
  paths: {
    '/data/profile.json': {
      get: {
        operationId: 'getProfile',
        summary: 'Company profile, services, engagement models, platforms and selected work',
        responses: {
          200: {
            description: 'Profile document',
            content: { 'application/json': { schema: {
              type: 'object', required: ['name', 'summary', 'services', 'contact'],
              properties: Object.fromEntries(Object.keys(profile).map(k => [k, { type: Array.isArray(profile[k]) ? 'array' : typeof profile[k] }])),
            } } },
          },
        },
      },
    },
  },
});

out('.well-known/api-catalog', {
  linkset: [{
    anchor: S + '/data/profile.json',
    'service-desc': [{ href: S + '/data/openapi.json', type: 'application/openapi+json' }],
    'service-doc': [{ href: S + '/llms-full.txt', type: 'text/plain' }],
    describedby: [{ href: S + '/llms.txt', type: 'text/plain' }],
  }],
});

const skill = '.well-known/agent-skills/aim-company/SKILL.md';
const digest = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, skill))).digest('hex');
out('.well-known/agent-skills/index.json', {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills: [{
    name: 'aim-company', type: 'skill-md',
    description: 'Answer questions about AIM (aimsystem.in), a technology engineering agency: services, engagement models, platforms, case studies, and how to hire engineers or discuss a project.',
    url: '/' + skill, digest: 'sha256:' + digest,
  }],
});

// MCP Server Card for the read-only Worker in mcp-worker/ (routed at /api/mcp).
const MCP_URL = S + '/api/mcp';
const MCP_TOOLS = ['get_company_profile', 'list_services', 'list_engagement_models', 'list_platforms', 'get_case_studies', 'get_contact'];
out('.well-known/mcp/server-card.json', {
  version: '1.0',
  protocolVersion: '2025-06-18',
  serverInfo: { name: 'aim-mcp', title: 'AIM — AI Infrastructure & Machines', version: '1.0.0' },
  description: 'Read-only public information about AIM: services, engagement models, platforms, case studies and contact.',
  documentationUrl: S + '/llms-full.txt',
  transport: { type: 'streamable-http', endpoint: '/api/mcp' },
  transports: [{ type: 'streamable-http', url: MCP_URL }],
  remotes: [{ type: 'streamable-http', url: MCP_URL }],
  capabilities: { tools: { listChanged: false } },
  authentication: { required: false },
  tools: MCP_TOOLS,
});

const urn = n => `urn:air:aimsystem.in:${n}`;
out('.well-known/ai-catalog.json', {
  specVersion: '1.0',
  host: { name: 'AIM — AI Infrastructure & Machines', url: S + '/', contact: 'ankit@aimsystem.in' },
  entries: [
    { identifier: urn('server:aim-mcp'), displayName: 'AIM MCP server', type: 'application/mcp-server-card+json', url: S + '/.well-known/mcp/server-card.json',
      description: 'Read-only MCP server (Streamable HTTP, no auth) at ' + MCP_URL + '.',
      capabilities: MCP_TOOLS,
      representativeQueries: ['what case studies does AIM have in healthcare', 'list AIM engineering services', 'how do I hire a dedicated engineer from AIM'] },
    { identifier: urn('api:profile'), displayName: 'AIM public profile API', type: 'application/openapi+json', url: S + '/data/openapi.json',
      description: 'Read-only JSON profile of AIM: services, engagement models, platforms, selected work and contact.',
      capabilities: ['getProfile'],
      representativeQueries: ['what services does AIM offer', 'how can I hire engineers from AIM', 'what has AIM built for healthcare clients'] },
    { identifier: urn('skill:aim-company'), displayName: 'AIM company skill', type: 'text/markdown', url: S + '/' + skill,
      description: 'Agent skill for answering questions about AIM and helping a user hire engineers or start a project.',
      representativeQueries: ['who is AIM aimsystem.in', 'how do I contact AIM about a project', 'how does AIM price engagements'] },
    { identifier: urn('docs:llms'), displayName: 'AIM LLM-readable profile', type: 'text/plain', url: S + '/llms-full.txt',
      description: 'Plain-text profile of AIM for language models.',
      representativeQueries: ['summarise AIM AI Infrastructure & Machines', 'what platforms does AIM operate'] },
  ],
});
console.log('agent files: profile, openapi, api-catalog, agent-skills (sha256:' + digest.slice(0, 12) + '…), ai-catalog');
