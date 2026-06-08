import { SystemDetail, Milestone, ClientProof } from "./types";

export const SYSTEMS_DATA: SystemDetail[] = [
  {
    id: "sys_voice_platform",
    sysId: "SYS-01",
    status: "PRODUCTION",
    badge: "Real-time Voice AI",
    name: "Apex Voice Platform",
    subtitle: "Phone in, AI voice out, sub-second. Multi-tenant real-time speech-to-speech for Indian SMBs — answers inbound calls in Hindi, books appointments, and runs automated outbound campaigns.",
    stats: [
      { value: "15,000+", label: "Calls / day live" },
      { value: "<200ms", label: "First audio · cache hit" },
      { value: "~1s", label: "E2E voice turn" }
    ],
    problems: [
      {
        title: "The Problem",
        text: "Tier-2 Indian SMBs and local healthcare clinics can't staff phones in Hindi 24/7. Standard Western voice-AI platform costs do not match their operating margins, causing clinics to miss after-hours support requests and appointments."
      },
      {
        title: "What it does",
        text: "Directly answers inbound clinic calls in fluent Hindi, records symptoms, synchronizes calendar bookings, and handles parallel SMS/WhatsApp confirmations — ensuring zero missed inbound patients."
      }
    ],
    decisions: [
      {
        key: "No LangChain",
        val: "Bypassed heavy abstractions to write deterministic Python handlers. This slashed initial packet overhead and guarantees predictable sub-latency response times during peak call loads."
      },
      {
        key: "Model Selection",
        val: "Selected ultra-fast localized inference models over heavy OpenAI completion APIs. This reduced inference latency by approximately 10x, yielding sub-second turnaround times."
      },
      {
        key: "mulaw sidecar cache",
        val: "Saves pre-rendered audio wave chunks formatted as raw mulaw bytes matching deterministic greetings. Enables instant first-audio stream responses (<200ms) on cache hits."
      }
    ],
    failures: [
      {
        condition: "Inference provider outlier degradation",
        handling: "6 isolated circuit breakers (CLOSED/OPEN/HALF-OPEN) monitor each provider layer. Instant fallback routes streams within 50ms if timeouts spike."
      },
      {
        condition: "API Rate limits (429)",
        handling: "Configured an Additive Increase Multiplicative Decrease (AIMD) flow throttle on localized queries to prevent call drops during spike traffic."
      }
    ],
    incidents: [
      {
        title: "Onboarding activation race condition",
        fix: "State gap between cloud resource setup and user profile authorization. Resolved by writing atomic transition transactions."
      },
      {
        title: "Messaging bridge 422 cascade",
        fix: "Tier limitations were not treated as system states. Implemented isolated error classifications."
      }
    ],
    evidence: [
      {
        label: "Clinical Scale",
        desc: "Proves system capacity with 15k live outreach calls processed in a single morning."
      },
      {
        label: "Test Coverage",
        desc: "31 distinct stress, soak, and chaotic simulation test suites with zero thread blockages."
      }
    ],
    codeSnippets: [
      {
        title: "Streaming Sentence Boundary Detection",
        code: `buf = ""
async for tok in model_stream(prompt):
    buf += tok
    # Hindi + Latin sentence ends
    if buf and buf[-1] in "।?!.":
        await tts.dispatch(buf, turn=turn_token)
        buf = ""`
      },
      {
        title: "Custom Circuit Breaker Handler",
        code: `async def call(self, fn):
    if self.state == "OPEN" and now() - self.opened < self.recover:
        raise BreakerOpen()
    try:
        r = await fn()
        self.fails = 0
        self.state = "CLOSED"
        return r
    except Exception:
        self.fails += 1
        if self.fails >= self.threshold:
            self.state = "OPEN"
            self.opened = now()
        raise`
      }
    ],
    nodes: [
      { id: "v_n1", name: "Inbound Call", meta: "WebSocket Media", desc: "Caller dials Plivo number. Plivo connects WebSocket stream to AKS gateway." },
      { id: "v_n2", name: "Voice VAD", meta: "5-Signal Filter", desc: "Analyzes audio signals, stripping hospital background HVAC and chatter." },
      { id: "v_n3", name: "Speech Recognition", meta: "Quantized Whisper", desc: "Directly transcribes streaming audio chunks from Hindi voice patterns to text." },
      { id: "v_n4", name: "Language Reasoning", meta: "Local LLaMA", desc: "Formulates intent, accesses clinic context, and determines appropriate appointment response." },
      { id: "v_n5", name: "Voice Synthesis", meta: "Kokoro TTS", desc: "Synthesizes final text chunks back into high-fidelity streaming audio waves instantly." }
    ],
    arrows: [
      { from: "v_n1", to: "v_n2" },
      { from: "v_n2", to: "v_n3" },
      { from: "v_n3", to: "v_n4" },
      { from: "v_n4", to: "v_n5" }
    ]
  },
  {
    id: "sys_campaign_engine",
    sysId: "SYS-02",
    status: "PRODUCTION",
    badge: "Outbound at Scale",
    name: "APEX Campaign Engine",
    subtitle: "Upload a contact list. The system dials thousands of prospects simultaneously, triggers automatic progressive retries on failed connections, and sends parallel multi-channel WhatsApp followups.",
    stats: [
      { value: "40+", label: "CI/CD deploys" },
      { value: "₹4.5", label: "Average Call Cost" },
      { value: "100%", label: "Manual Free Outreach" }
    ],
    problems: [
      {
        title: "The Problem",
        text: "Managing manual medical outreach camps requires coordinating multiple service agencies, spreadsheet data logs, and up to 7 receptionist shifts. Outreach is slow, expensive, and fails to reach busy contacts on the first dial."
      }
    ],
    decisions: [
      {
        key: "Priority ZSET Struct",
        val: "Selected Redis Sorted Sets (ZSET) instead of standard lists to enable high-priority broadcasts to immediately jump the standard dial queue."
      },
      {
        key: "WhatsApp Parallelism",
        val: "Dispatches WhatsApp messages right alongside outbound ringing states to reinforce outreach conversion rates by 2.2x."
      }
    ],
    failures: [
      {
        condition: "Prospect line busy / unanswered",
        handling: "Re-queues records instantly back into priority sets with custom exponential backoff. Contacts are never silently dropped."
      }
    ],
    evidence: [
      {
        label: "Resource Displacement",
        desc: "Consolidated five distinct operational vendor services down into a single automated dashboard."
      }
    ],
    codeSnippets: [
      {
        title: "Exponential Backoff Re-Queuer",
        code: `if outcome.failed and job.retries < MAX_RETRIES:
    delay = min(BASE * 2 ** job.retries, CAP)
    job.retries += 1
    # score = priority * 1e9 + (now + delay)
    await queue.requeue(job, after=delay)
else:
    await queue.dead_letter(job, reason=outcome.error)`
      }
    ],
    nodes: [
      { id: "c_n1", name: "CSV Intake", meta: "Validation & Dedup", desc: "Staff uploads numbers. Validation formats and checks records for duplicates." },
      { id: "c_n2", name: "ZSET Queue", meta: "Redis Priority Struct", desc: "Prioritizes high-value lists, setting execution stamps dynamically." },
      { id: "c_n3", name: "Reaper Thread", meta: "Pacing Controller", desc: "Maintains optimal dispatch rate, preventing API rate limits." },
      { id: "c_n4", name: "Outbound Dialler", meta: "Plivo REST API", desc: "Dials and connects live calls securely to AI voice servers." },
      { id: "c_n5", name: "Parallel Message", meta: "WhatsApp Channel", desc: "Dispatches parallel messaging follow-up to reinforce conversions." }
    ],
    arrows: [
      { from: "c_n1", to: "c_n2" },
      { from: "c_n2", to: "c_n3" },
      { from: "c_n3", to: "c_n4" },
      { from: "c_n4", to: "c_n5" }
    ]
  },
  {
    id: "sys_shortz_infra",
    sysId: "SYS-03",
    status: "SELF-HEALING",
    badge: "GPU Pipeline",
    name: "Apex Shortz Infra",
    subtitle: "A self-healing automated AI media pipeline optimized for 4GB consumer GPUs. Runs with 100% continuous unattended uptime, auto-recovering on crashes with zero API billing costs.",
    stats: [
      { value: "4-GB", label: "Consumer VRAM usage" },
      { value: "0", label: "Monthly API expenditure" },
      { value: "24/7", label: "Unattended operations" }
    ],
    problems: [
      {
        title: "The Problem",
        text: "Cloud media synthesis (TTS, video editing, alignments) is expensive and highly metered. Standard background scripts are fragile; a single resource leakage or CUDA crash hangs the rendering loop entirely, requiring manual reboots."
      }
    ],
    decisions: [
      {
        key: "BLMOVE strictly lease",
        val: "Ensures jobs are processed with exactly-once guarantees. If a CUDA worker crashes, the lease expires and the job is safety-returned to processing."
      },
      {
        key: "Model Resident Mode",
        val: "Keeps AI weights pinned in memory, saving up to 50 seconds of initialization lag per rendering job."
      }
    ],
    failures: [
      {
        condition: "CUDA out-of-memory",
        handling: "Calls torch.cuda.empty_cache() between jobs and isolates execution boundaries under independent subprocesses."
      }
    ],
    evidence: [
      {
        label: "Stable Operations",
        desc: "Maintains months of continuous, headless video editing cycles with zero memory creep."
      }
    ],
    codeSnippets: [
      {
        title: "Subprocess Supervisor Loop",
        code: `while running:
    code = worker.poll()
    if code is not None: # Worker died
        crashes += 1
        delay = min(BASE * 2 ** crashes, CAP)
        log_event("worker_crash", crashes=crashes)
        if crashes > MAX_CRASHES:
            break
        time.sleep(delay)
        worker = spawn()`
      }
    ],
    nodes: [
      { id: "s_n1", name: "Reliable Queue", meta: "Redis BLMOVE Contract", desc: "Leases incoming jobs. Survives server reboots without loss." },
      { id: "s_n2", name: "Supervisor", meta: "Self-Healing Monitor", desc: "Monitors execution threads, auto-restarting workers on CUDA crashes." },
      { id: "s_n3", name: "Synthesis Engine", meta: "Resident kokoro", desc: "Synthesizes script voice lines locally on float16 precision." },
      { id: "s_n4", name: "Audio Aligner", meta: "Whisper Timings", desc: "Aligns words to timestamps down to milliseconds for subtitles." },
      { id: "s_n5", name: "FFmpeg Assembly", meta: "CUDA Acceleration", desc: "Stitches frame segments, audio overlays, and graphics into final MP4 format." }
    ],
    arrows: [
      { from: "s_n1", to: "s_n2" },
      { from: "s_n2", to: "s_n3" },
      { from: "s_n3", to: "s_n4" },
      { from: "s_n4", to: "s_n5" }
    ]
  },
  {
    id: "sys_hms_offline",
    sysId: "SYS-04",
    status: "OFFLINE-FIRST",
    badge: "Systems Architecture",
    name: "APEX HMS Offline Suite",
    subtitle: "An offline-first hospital management solution built to withstand clinical power outages. Scribes clinical files to local write-ahead logs, syncing with secondary arrays on reconnect.",
    stats: [
      { value: "500-Beds", label: "Enterprise Capacity" },
      { value: "WAL-backed", label: "Crash-safe writes" },
      { value: "IndexedDB", label: "Fully Local Cache" }
    ],
    problems: [
      {
        title: "The Problem",
        text: "Rural medical arrays experience frequent power and internet disruptions. Normal enterprise databases fail when central servers disconnect mid-consultation, locking medical charts and stalling patient flow."
      }
    ],
    decisions: [
      {
        key: "WAL Architecture",
        val: "Saves clinical records locally with a state of PENDING, moving to COMMITTED to ensure data survives tablet battery drops."
      },
      {
        key: "SKIP LOCKED Queue",
        val: "Leverages standard SQL queries to handle priority clinical jobs natively, avoiding heavy microservice architectures."
      }
    ],
    failures: [
      {
        condition: "Intermittent client drops",
        handling: "Caches clinical mutations inside local IndexedDB scopes, performing automatic background synchronizations when online."
      }
    ],
    evidence: [
      {
        label: "Resilience Certs",
        desc: "Durable writes withstand hard battery drops and browser crashes without record loss."
      }
    ],
    codeSnippets: [
      {
        title: "Durable Write-Ahead Query",
        code: `-- Intention logged and secured before record commits
INSERT INTO wal(id, state, payload) VALUES (?, 'COMMITTED', ?);

-- Replay COMMITTED-but-unapplied mutations on server reboot
SELECT * FROM clinical_jobs 
  WHERE status = 'PENDING' 
  FOR UPDATE SKIP LOCKED 
  LIMIT 10;`
      }
    ],
    nodes: [
      { id: "h_n1", name: "Patient Scribe", meta: "Optimistic Mutation", desc: "Doctor writes prescription. Client updates UI immediately." },
      { id: "h_n2", name: "Write-Ahead Log", meta: "WAL Payload Serialization", desc: "Saves record intention locally before network dispatch." },
      { id: "h_n3", name: "Local Cache", meta: "IndexedDB Storage", desc: "Ensures prescription is persistent on-device." },
      { id: "h_n4", name: "Heartbeat Probe", meta: "TCP Connection Sync", desc: "Heals channel, verifying central database availability." },
      { id: "h_n5", name: "Idempotent Commit", meta: "UUIDv7 RBAC Registry", desc: "Syncs record with central cluster, checking user credentials." }
    ],
    arrows: [
      { from: "h_n1", to: "h_n2" },
      { from: "h_n2", to: "h_n3" },
      { from: "h_n3", to: "h_n4" },
      { from: "h_n4", to: "h_n5" }
    ]
  },
  {
    id: "sys_conversational_ai",
    sysId: "SYS-05",
    status: "OFFLINE-FIRST",
    badge: "Local AI No Cloud",
    name: "Apex Conversational AI",
    subtitle: "A fully local Hindi voice agent execution pipeline with complete data privacy. Speech recognition, local neural LLM, vector index memories, and voice synthesis run on on-device GPU.",
    stats: [
      { value: "0", label: "Cloud egress bytes" },
      { value: "100%", label: "Patient Data Privacy" },
      { value: "हिंदी", label: "Native Hindi Agent" }
    ],
    problems: [
      {
        title: "The Problem",
        text: "Clinical diagnostic rooms require strict privacy guidelines. Transmitting patient symptom discussions to external APIs raises compliance blocks under traditional security review protocols."
      }
    ],
    decisions: [
      {
        key: "Sovereign Inference",
        val: "Constructed pipeline strictly on-device. Absolute assurance that zero speech or transcript data exits the hospital server network."
      },
      {
        key: "5-Signal Audio Gateway",
        val: "Calibrates noise levels directly in hospital workspaces, identifying nurse calls, background beeps, and filtering echo."
      }
    ],
    failures: [
      {
        condition: "Memory lookup missing",
        handling: "Reverts to in-memory cosine indices if core Redis vectors degrade, ensuring uninterrupted discussions."
      }
    ],
    evidence: [
      {
        label: "Secure Framework",
        desc: "Certified complete compliance with local healthcare data protection schemas."
      }
    ],
    codeSnippets: [
      {
        title: "Private Conversation Turn Execution",
        code: `# Runs entirely on secure hospital hardware
text  = whisper.transcribe(mic_pcm) # STT
ctx   = redisvl.search(text, k=4)   # Vector memory recall
reply = llama(text, memory=ctx)     # Reasoning
speak(kokoro.tts(reply))            # Synthesis (No external API called)`
      }
    ],
    nodes: [
      { id: "a_n1", name: "Audio Intake", meta: "5-Signal Energy VAD", desc: "Detects human speaking pattern, filtering nurse alarms." },
      { id: "a_n2", name: "Local Transcriptor", meta: "Quantized Whisper", desc: "Decodes 16kHz audio stream directly to Hindi script formats." },
      { id: "a_n3", name: "Vector Index", meta: "Local Cosine Recall", desc: "Matches symptoms with history. No external cloud lookups." },
      { id: "a_n4", name: "Medical LLM", meta: "Quantized LLaMA", desc: "Analyzes charts and answers symptoms privately on server hardware." },
      { id: "a_n5", name: "Local Voice", meta: "kokoro Synthesis", desc: "Streams synthetic audio output back smoothly beneath 200ms." }
    ],
    arrows: [
      { from: "a_n1", to: "a_n2" },
      { from: "a_n2", to: "a_n3" },
      { from: "a_n3", to: "a_n4" },
      { from: "a_n4", to: "a_n5" }
    ]
  },
  {
    id: "sys_workflow_engine",
    sysId: "SYS-06",
    status: "PRODUCTION",
    badge: "Workflow Automation",
    name: "APEX Workflow Engine",
    subtitle: "Advanced drag-and-drop workflow designer mapping visual triggers to customized outreach rules. Link actions to multi-step logic paths, Twilio fallbacks, and CRM webhooks.",
    stats: [
      { value: "5-Layers", label: "Failbacks per service" },
      { value: "Visual", label: "n8n-style interface" },
      { value: "Instant", label: "Webhook Integration" }
    ],
    problems: [
      {
        title: "The Problem",
        text: "Hardcoding outreach paths makes customization slow. If a clinic wants busy calls to nudge via WhatsApp but answered calls to update an external Salesforce hub, adapting code paths delays launches."
      }
    ],
    decisions: [
      {
        key: "Visual Workspaces",
        val: "Empowers healthcare administrators to manage follow-up rules independently with clear visual logical flows."
      },
      {
        key: "Automated SLAs",
        val: "Configures five secondary fallbacks for API layer drop-offs, ensuring notifications run uninterrupted."
      }
    ],
    failures: [
      {
        condition: "Third-party CRM API downtime",
        handling: "Buffers log payloads and schedules automated hourly retry hooks with clear notification indicators."
      }
    ],
    evidence: [
      {
        label: "Visual Flexibility",
        desc: "Enables multi-step condition logic tracking on drag-and-drop boards without a single code rewrite."
      }
    ],
    codeSnippets: [],
    nodes: [
      { id: "w_n1", name: "CRM Event", meta: "Trigger Webhook", desc: "Clinic schedules appointment. Fires outbound workflow." },
      { id: "w_n2", name: "Logical Split", meta: "Status Condition", desc: "Branching: Route active numbers to Voice dialler, busy to WhatsApp." },
      { id: "w_n3", name: "AI Call Sync", meta: "Apex Voice AI Layer", desc: "Connected AI assistant interviews user for verification." },
      { id: "w_n4", name: "Twilio Fallback", meta: "Call routing rescue", desc: "Alternate provider path catches Plivo pipeline drop-offs." },
      { id: "w_n5", name: "CRM Sync", meta: "Completed webhook", desc: "Appointment status parsed and updated in CRM registry." }
    ],
    arrows: [
      { from: "w_n1", to: "w_n2" },
      { from: "w_n2", to: "w_n3" },
      { from: "w_n3", to: "w_n4" },
      { from: "w_n4", to: "w_n5" }
    ],
    customInteractive: true
  }
];

export const MILESTONES_DATA: Milestone[] = [
  {
    id: "m01",
    title: "Architecture & Demo Prototype",
    when: "Month 1",
    desc: "Complete system blueprints, data structures, and architecture designed and signed off. A fully working end-to-end sandbox flow live on your own staging instance. See the system work before a single line of production code is written.",
    payment: "£29,750",
    percent: "35% on contract initiation"
  },
  {
    id: "m02",
    title: "Complete MVP Stack",
    when: "Month 2",
    desc: "Core B2B AI engines built, verified, and secured. Front-end panels designed with modular React blocks, CI/CD automated release configurations online, and comprehensive security testing completed. Secure staging UAT begins.",
    payment: "£25,500",
    percent: "30% on Month 1 demo sign-off"
  },
  {
    id: "m03",
    title: "Production Release & Support",
    when: "Month 3",
    desc: "Production launch inside your own cloud account. Enterprise monitoring dashboards live, complete operator runbooks documented, comprehensive team training, and 4 weeks of dedicated high-touch post-launch assistance.",
    payment: "£21,250",
    percent: "25% on MVP sign-off",
    subPayment: "+ £8,500 on final go-live (10%)"
  }
];

export const CLIENTS_PROOF: ClientProof[] = [
  {
    id: "proof_apple_hospital",
    tag: "01 — HEALTHCARE AI",
    name: "Apple Hospital",
    place: "Burhanpur, MP · Live production tenant",
    metrics: [
      { value: "15000", label: "Outbound dials / day", count: 15000, comma: true },
      { value: "6500", label: "Patient conversions", count: 6500, comma: true, suffix: "+" }
    ],
    description: "An automated healthcare campaign that schedules patients for outpatient health checks. Front-office staff upload a target list; the engine rings numbers, manages multi-signal retries, dispatches WhatsApp templates, and updates outcome lists.",
    details: [
      { label: "Operating cost to Clinic", value: "₹4.5 / dial all-inclusive" },
      { label: "Weekly operation cost", value: "₹30,600" },
      { label: "Manual staff replacement", value: "₹90,000 - ₹1,05,000 monthly" },
      { label: "Replaced Receptionists", value: "5 agencies & 6 receptionists" },
      { label: "Clinic Outcome capability", value: "Physically impossible manually", isWin: true }
    ],
    referenceText: "Signed verification reference on official clinic letterhead is available on request."
  },
  {
    id: "proof_bimts",
    tag: "02 — EDUCATION AI",
    name: "BIMTS College",
    place: "Burhanpur, MP · Live production tenant",
    description: "A secondary institutional pipeline running automated student communications, admissions follow-ups, and student support. Leverages complete multi-tenant boundaries, isolated databases, and separate billing triggers.",
    details: [
      { label: "Target base", value: "Prospective applicants" },
      { label: "Outcome integration", value: "Registration CRM API" },
      { label: "Isolated Database", value: "100%" }
    ],
    referenceText: "Official dean validation reference letter is available on request."
  },
  {
    id: "proof_cafe_ciel",
    tag: "03 — RAFFLES THE OWO, LONDON",
    name: "Café Ciel",
    place: "The OWO (Raffles), London · cafeciel.co.uk",
    description: "Built the production-grade, highly luxury digital checkout and reservations booking channel within record timelines for Raffles London.",
    details: [
      { label: "Timeline", value: "Highly compressed" },
      { label: "Execution ownership", value: "Full end-to-end design & launch" }
    ],
    cite: "Ankit independently delivered a production digital experience for Café Ciel at The OWO, London, within a highly compressed timeline. He handled implementation, revisions, deployment, and technical execution with strong ownership and responsiveness throughout. We would confidently recommend him for future technical engagements.",
    citationAuthor: "Vedika, Founder, Café Ciel"
  }
];
