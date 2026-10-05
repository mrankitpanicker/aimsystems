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
  tagline: 'Production systems. From architecture to operations.',
  summary: 'AIM is a production systems engineering company. We take technically difficult products from architecture to production, and stay accountable after launch. Software · AI · Cloud · Automation · Reliability. Delivered by one senior engineer, a specialist or a complete team, depending on the system.',
  registration: 'Udyam-registered MSME (India)', location: 'Madhya Pradesh, India', markets: ['India', 'United Kingdom', 'Europe'],
  websites: [S + '/', 'https://aimstudio.co.in/'],
  contact: { name: 'Ankit Panicker', role: 'Client Partner & Technical Lead', email: 'ankit@aimsystem.in', page: S + '/contact' },
  services: [
    { name: 'Systems Architecture', summary: 'Every engagement starts with the architecture: boundaries, data, failure paths and how it will be operated.', scope: ['architecture review', 'system design', 'technical planning'] },
    { name: 'Product Systems', summary: 'New products and platforms, from data model to deployment.', scope: ['SaaS', 'web applications', 'APIs', 'backend systems', 'internal platforms', 'enterprise applications', 'product modernization'] },
    { name: 'Production AI', summary: 'AI that runs inside real workflows, with validation, fallbacks and monitoring.', scope: ['voice AI', 'LLM applications', 'RAG', 'AI agents', 'STT/TTS', 'AI orchestration', 'model integrations'] },
    { name: 'Cloud & Reliability', summary: 'Infrastructure, CI/CD, observability and the failure handling that keeps systems up.', scope: ['cloud', 'Kubernetes', 'infrastructure-as-code', 'CI/CD', 'observability', 'distributed systems', 'reliability engineering'] },
    { name: 'Automation & Integrations', summary: 'APIs, CRMs, telephony, WhatsApp and data pipelines connected end to end.', scope: ['API and CRM integrations', 'WhatsApp', 'telephony', 'workflow automation', 'business process automation', 'data pipelines'] },
  ],
  engagements: [
    { name: 'Build', promise: 'A new product or platform: architecture → engineering → production.', firstDeliverable: 'Architecture document and delivery plan.' },
    { name: 'Fix', promise: 'Rescue an existing system: architecture review → reliability → performance → modernization.', firstDeliverable: 'Risk map and a stabilisation plan.' },
    { name: 'Integrate', promise: 'Connect complex systems: AI, APIs, telephony, WhatsApp, CRMs, workflows, infrastructure.', firstDeliverable: 'Integration design and a working path end to end.' },
    { name: 'Operate', promise: 'Take ownership of production: observability, reliability, optimisation, ongoing engineering.', firstDeliverable: 'Monitoring, alerting and a runbook.' },
  ],
  architectureReview: { summary: 'Bring your current architecture, bottleneck or production problem. AIM identifies the highest-risk parts and recommends the shortest path forward.', url: S + '/contact?intent=architecture-review' },
  engagementModels: [
    { name: 'One Senior Engineer', detail: 'Focused work owned by one senior engineer: backend, frontend, full-stack, AI, cloud, DevOps or platform.' },
    { name: 'Specialist', detail: 'AI architecture, voice AI, cloud infrastructure, distributed systems, API architecture, automation, DevOps, system modernization.' },
    { name: 'Engineering Pod', detail: 'Cross-functional team, e.g. technical lead, backend, frontend, AI/platform engineer, QA.' },
    { name: 'Complete Team', detail: 'Product strategy, UX/UI, architecture, frontend, backend, AI, infrastructure, DevOps, QA, deployment, operations.' },
  ],
  team: 'Senior-led: a small senior team, with specialists added for larger engagements.',
  pricing: 'Dedicated engineers and pods are custom engagements; product development is a scoped proposal; AI and infrastructure work is priced from the architecture.',
  positioning: 'Production systems engineering: one technical owner across the entire system, from architecture to production and after launch. AIM runs its own production platform, APEX Connect.',
  differentiators: [
    'We run what we build: APEX Connect, a multi-tenant voice and WhatsApp platform, runs in production for a hospital and a college.',
    'No layers between client and engineering: clients brief the person designing the system and review the architecture with the person building it.',
    'One technical owner and no vendor handoffs.',
    'Monitoring, CI/CD and a runbook in every build.',
    'Named, maintainable stack: Python/FastAPI, Node/TypeScript, React/Next.js, PostgreSQL, Redis, Docker, Kubernetes, Terraform on AWS, Azure or GCP.',
  ],
  process: [
    { step: 'Understand', deliverable: 'Scope brief: goals, users, constraints and success measures.' },
    { step: 'Architect', deliverable: 'Architecture document and infrastructure plan.' },
    { step: 'Assemble', deliverable: 'Named team, roles and a delivery plan.' },
    { step: 'Build', deliverable: 'Working increments in the client repository, with tests and CI.' },
    { step: 'Deploy', deliverable: 'Production release, monitoring dashboards and a runbook.' },
    { step: 'Operate', deliverable: 'On-call cover, regular reports and a prioritised improvement backlog.' },
  ],
  international: {
    page: S + '/international',
    summary: 'Engineering contractors for UK, US and European companies: one B2B contract with AIM; full working-day overlap with the UK and Europe and a daily morning overlap with the US East Coast (IST is 4.5–5.5 h ahead of the UK, 3.5–4.5 h of central Europe, 9.5–10.5 h of US Eastern); work in the client cloud and chosen UK, US or EU region under the client data-processing terms; client owns all code.',
  },
  clientOwnership: 'Client cloud, client API accounts, client-controlled credentials, documented deployment, source ownership, transferable infrastructure.',
  platforms: [
    { name: 'APEX Connect', url: 'https://aimstudio.co.in/app', summary: 'AI-powered customer engagement infrastructure: multi-tenant voice, messaging and AI workflows. Usage-based pricing.' },
    { name: 'AIM Remote AI', url: 'https://aimstudio.co.in/remoteai', summary: 'AI operating layer connecting phone, desktop and voice to your machine (Windows, Android, Chrome).' },
    { name: 'Healthcare Operations Platform', status: 'in development', summary: 'Hospital workflows, patient operations and clinical administration.' },
  ],
  work: [
    { title: 'Patient outreach on APEX Connect', industry: 'Healthcare', client: 'Apple Hospital', status: 'production', url: S + '/work#healthcare',
      architecture: 'Patient list → Validation → Campaign queue → Voice workers → Retry engine → WhatsApp follow-up → Outcome reporting',
      aimOwned: 'Architecture, backend workers, telephony and WhatsApp integration, retry scheduling, tenant isolation, deployment and production operation.',
      outcome: '15K+ production calls processed, 6.8K+ answered, ~45% connected/answered.' },
    { title: 'Dedicated tenant for institutional communication', industry: 'Education', client: 'BIMTS College', status: 'production', url: S + '/work#education',
      outcome: 'Dedicated, isolated tenant on the same multi-tenant platform: campaign automation, independent configuration, billing separation, outreach tracking.' },
    { title: 'Digital experience, UK delivery', industry: 'Hospitality', client: 'Café Ciel at The OWO, London', status: 'delivered', url: S + '/work#hospitality',
      outcome: 'Delivered on schedule on a compressed timeline.' },
  ],
  pages: Object.fromEntries(['services', 'hire', 'international', 'products', 'work', 'engineering', 'about', 'contact', 'privacy'].map(p => [p, `${S}/${p}`])),
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
    description: 'Answer questions about AIM (aimsystem.in), a production systems engineering company: services, engagements, platforms, case studies, and how to discuss a technical problem or request an architecture review.',
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
  host: { displayName: 'AIM — AI Infrastructure & Machines', name: 'AIM — AI Infrastructure & Machines', url: S + '/', contact: 'ankit@aimsystem.in' },
  entries: [
    { identifier: urn('server:aim-mcp'), displayName: 'AIM MCP server', type: 'application/mcp-server-card+json', url: S + '/.well-known/mcp/server-card.json',
      description: 'Read-only MCP server (Streamable HTTP, no auth) at ' + MCP_URL + '.',
      capabilities: MCP_TOOLS,
      representativeQueries: ['what case studies does AIM have in healthcare', 'list AIM engineering services', 'how do I request an architecture review from AIM'] },

    { identifier: urn('skill:aim-company'), displayName: 'AIM company skill', type: 'text/markdown; profile="urn:air:agent-skills"', url: S + '/' + skill,
      description: 'Agent skill for answering questions about AIM and helping a user discuss a technical problem or request an architecture review.',
      representativeQueries: ['who is AIM aimsystem.in', 'how do I contact AIM about a project', 'how does AIM price engagements'] },

  ],
});
console.log('agent files: profile, openapi, api-catalog, agent-skills (sha256:' + digest.slice(0, 12) + '…), ai-catalog');
