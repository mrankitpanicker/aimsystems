import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, ShieldCheck, Cpu, Code2, AlertTriangle, Layers, Zap } from "lucide-react";
import { SystemDetail, FlowNode } from "../types";
import SystemDiagram from "./SystemDiagram";

interface SystemCardProps {
  system: SystemDetail;
  key?: string;
}

export default function SystemCard({ system }: SystemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"built" | "arch" | "rel" | "ev" | "code">("built");
  const [activeSimIndex, setActiveSimIndex] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<FlowNode | null>(null);

  // Simulation Logs Generator depending on the system ID
  const getSimLogs = (nodeName: string, index: number) => {
    switch (system.sysId) {
      case "SYS-01":
        const voiceLogs = [
          `[Gateway] WebSocket connection initiated. Session SID: CL_9984...`,
          `[Whisper-Inference] Direct audio stream decoded. Recognized sentence: "नमस्ते, मुझे डॉक्टर वर्मा के साथ कल शाम 4 बजे अपॉइंटमेंट बुक करना है।"`,
          `[LanguageModel] Semantic context initialized. Matching clinic calendar. Response selected: Confirm appointment slot.`,
          `[Kokoro-TTS] Phrase boundary detected. Sentence segmented. Synthesizing audio chunk 1: "निश्चित रूप से, आपका अपॉइंटमेंट..."`,
          `[TenantStore] Context cached. Concurrent slot semaphore reserved. DB committed in 12ms.`,
          `[BreakerHealth] CLOSED. Keep-Alive latency checked: 145ms. Circuit stable.`,
        ];
        return voiceLogs[index] || `Processing ${nodeName}...`;
      case "SYS-02":
        const campLogs = [
          `[CSVReader] Uploaded "camp_june_list.csv". Validated 15,000 subscriber contacts, 4 duplicates pruned.`,
          `[Redis-Queue] 14,996 records pushed to prioritized ZSET. Queue size: 14,996.`,
          `[Reaper] AIMD pace-control initialized. Active workers: 40. Target calls: 50/sec.`,
          `[Dialler-Gateway] CallSid CA_e21... spawned. WhatsApp parallel message queued.`,
          `[Backoff] Number status BUSY. Retrying with exponential delay: min_backoff = 120s.`,
          `[OutcomeAnalyser] Audio signal analyzer resolved CallSid CA_e21 as SUCCESS. Conversion logged.`,
        ];
        return campLogs[index] || `Processing ${nodeName}...`;
      case "SYS-03":
        const shortzLogs = [
          `[Redis-Reliable] BLMOVE triggered safely. Job contract #SH_889 migrated from "pending" to "active_lease".`,
          `[Heartbeat] Supervisor thread checked child process PID: 1845. Status: OK (0.8% CPU, 45MB RAM).`,
          `[Tokeniser] Markdown formatted. Segmenting video assets into 5 distinct timeline blocks.`,
          `[In-Process-TTS] Neural Voice synthesis complete. Audio payload written (mulaw 16kHz, float16 model).`,
          `[WhisperAlign] Token alignments matching voice pitch. Injecting exact timing JSON coordinates into pipeline.`,
          `[FFmpeg-CUDA] Invoking GPU script. H.264 rendering on GPU: 1080x1920@60fps. Zero cloud API fees incurred.`,
        ];
        return shortzLogs[index] || `Processing ${nodeName}...`;
      case "SYS-04":
        const hmsLogs = [
          `[PWA-Mutation] Offline client action: Prescribed "Paracetamol 500mg" to Patient #PT_1049. UI optimistic commit.`,
          `[WAL-Intent] WAL state updated: [ID: 9982, Status: COMMITTED, Payload: ClinicalRX]. Write-Ahead completed.`,
          `[LocalDB] SQLite / IndexedDB mirror synced. Database state: PERSISTENT. Uptime 100%.`,
          `[NetworkProbe] TCP handshake succeeded. Connection with Primary server re-established.`,
          `[TenantGuard] JWT verified. UUIDv7 verification: Mutation ID #9982 is unique. Idempotency cleared.`,
          `[DBCommit] Central PostgreSQL cluster updated. 1 row affected. Mutation marked as APPLIED in local WAL.`,
        ];
        return hmsLogs[index] || `Processing ${nodeName}...`;
      case "SYS-05":
        const ashaLogs = [
          `[VoiceVAD] Silence window closed. Microphone 16kHz audio captured. SNR: 22dB, energy ratio: 0.85 (Human voice verified).`,
          `[Whisper-Quant] Speech-to-text compiled locally. Phrase: "क्या मुझे आज की छुट्टी के लिए अनुमति मिल सकती है?"`,
          `[LlamaCPUAsha] LLaMA-3B local context loaded. Quantized float16. Response generated.`,
          `[VectorIndex] Recall semantic matched (index k=4). Domain: Institution regulations. Context attached.`,
          `[NeuralSpeech] TTS compiled locally under 200ms. Audio buffer stream routed to headphone jack (24kHz standard PCM).`,
          `[Echoguard] Noise profile recalibrated. Background ambient noise filter: -14dB. Guard ACTIVE.`,
        ];
        return ashaLogs[index] || `Processing ${nodeName}...`;
      case "SYS-06":
        const workflowLogs = [
          `[TriggerEngine] Missed call webhook received. Event triggered for CallSid CA_w818.`,
          `[RouterGroup] Conditional split: Call answer status was "No-Answer". Branching left to WhatsApp Follow-up.`,
          `[AIModelCall] Generating personalized campaign context via AI. Completion returned under 400ms.`,
          `[FallbackObserver] Main node PLIVO failed. Retrying through fallback layer 1: Twilio. Routing successful.`,
          `[WhatsApp-Webhook] Delivery status sent. Notification delivered successfully under 2s.`,
          `[AggregateLog] Workflow transaction successfully completed. Session cleared from memory.`,
        ];
        return workflowLogs[index] || `Processing ${nodeName}...`;
      default:
        return `[Service] Processing stage: ${nodeName}`;
    }
  };

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveSimIndex(0);
    setSimulationLogs([`[Simulator] Starting signal sweep for: ${system.name}...`]);

    const stepDuration = 800; // time per node
    
    system.nodes.forEach((node, i) => {
      setTimeout(() => {
        setActiveSimIndex(i);
        setSimulationLogs((prev) => [...prev, getSimLogs(node.name, i)]);
        if (i === system.nodes.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
          }, stepDuration);
        }
      }, (i + 1) * stepDuration);
    });
  };

  const currentHoveredNodeData = hoveredNode || (activeSimIndex !== null ? system.nodes[activeSimIndex] : null);

  return (
    <div
      className={`border rounded-2xl bg-brand-surface/20 backdrop-blur-md mb-8 overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-brand-accent/40 shadow-[0_40px_90px_-50px_rgba(143,208,255,0.4)]"
          : "border-brand-mate hover:border-brand-mute/40"
      }`}
    >
      {/* CARD HEAD - ALWAYS VISIBLE */}
      <div
        className="p-8 cursor-pointer select-none flex flex-col justify-between relative min-h-[220px]"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-14 text-xs font-mono tracking-widest text-brand-mute mb-4">
          <span className="text-brand-accent font-semibold">{system.sysId}</span>
          <span className="bg-brand-accent/10 text-brand-accent px-2.5 py-1 rounded-full text-[10px] font-sans border border-brand-accent/20">
            {system.status}
          </span>
          <span className="hidden md:inline">{system.badge}</span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-semibold text-2xl md:text-3xl tracking-tight text-white mb-2">
              {system.name}
            </h3>
            <p className="text-brand-dim text-sm md:text-base max-w-2xl font-light">
              {system.subtitle}
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="flex items-center gap-2 font-mono text-[11px] text-brand-dim border border-brand-mute/30 rounded-full px-4 py-2 bg-brand-accent/5 hover:text-brand-accent hover:border-brand-accent hover:bg-brand-accent/10 transition-all duration-200"
          >
            <span>{isOpen ? "Collapse" : "Details"}</span>
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              className="text-sm font-semibold inline-block"
            >
              ›
            </motion.span>
          </button>
        </div>
      </div>

      {/* CORE LIVE SIGNAL FLOW VISUALIZER SHELF (PARTIAL IN CLOSED, FULL IN OPEN) */}
      <div className="p-8 border-t border-brand-mute/10 bg-black/10 overflow-x-auto relative">
        <SystemDiagram sysId={system.sysId} />

        <div className="mt-6 min-w-[640px] flex items-center justify-between gap-4 px-2 py-4">
          {system.nodes.map((node, index) => {
            const isActive = index === activeSimIndex;
            const isSelected = currentHoveredNodeData?.id === node.id;
            const isGpu = node.isGpu;

            return (
              <div key={node.id} className="flex items-center flex-1 relative">
                <div
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setActiveSimIndex(index)}
                  className={`relative flex-1 text-center border rounded-xl py-3.5 px-3 bg-gradient-to-b from-brand-surface-light/30 to-brand-navy-light/40 shadow-sm cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "border-brand-accent bg-brand-accent/10 shadow-[0_0_24px_-4px_rgba(143,208,255,0.4)] scale-102"
                      : isSelected
                      ? "border-brand-mist/60 bg-brand-accent/5"
                      : isGpu
                      ? "border-indigo-500/30"
                      : "border-brand-mute/10 hover:border-brand-mist/40"
                  }`}
                >
                  {/* Step Code Counter Badge */}
                  <span className="absolute -top-2 left-3 font-mono font-bold text-[9px] bg-brand-mist text-brand-navy px-1.5 py-0.5 rounded-full shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Node Title */}
                  <div className="font-display text-sm font-medium text-white mb-1 tracking-tight">
                    {node.name}
                  </div>
                  
                  {/* Node Status/Engine Type */}
                  <div className={`font-mono text-[9px] tracking-wider uppercase ${
                    isActive ? "text-brand-accent" : node.metaHighlight ? "text-brand-mist" : "text-brand-mute"
                  }`}>
                    {node.meta}
                  </div>
                </div>

                {/* Arrow connecting nodes */}
                {index < system.nodes.length - 1 && (
                  <div className="w-12 h-0.5 relative mx-1">
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-brand-mute/20 via-brand-mute/30 to-brand-mute/20 rounded-full" />
                    {isActive && (
                      <motion.div
                        className="absolute top-[-2px] left-0 w-2.5 h-2.5 rounded-full bg-brand-accent filter shadow-[0_0_8px_#8fd0ff]"
                        animate={{ x: [0, 48] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Simulator Dashboard Panel */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch justify-between gap-5 border border-brand-mute/10 rounded-xl p-5 bg-black/20">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRunSimulation();
                }}
                disabled={isSimulating}
                className="flex items-center gap-2 font-display font-medium text-xs bg-brand-accent/10 border border-brand-accent/30 hover:bg-brand-accent/20 text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-4 py-2 transition-all duration-200"
              >
                {isSimulating ? (
                  <>
                    <Zap className="w-3.5 h-3.5 animate-bounce text-brand-accent" />
                    <span className="font-mono text-[11px]">Sweeping Flow...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />
                    <span className="font-mono text-[11px]">Run physical signal</span>
                  </>
                )}
              </button>

              {simulationLogs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSimulationLogs([]);
                    setActiveSimIndex(null);
                  }}
                  className="p-2 border border-brand-mute/20 rounded-lg text-brand-mute hover:text-white transition-colors duration-200"
                  title="Reset stream state"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-brand-mute">
              Click any stage node to inspect raw properties
            </div>
          </div>

          <div className="flex-1 min-h-[50px] flex items-center bg-black/40 border border-brand-mute/10 rounded-lg p-3.5">
            {currentHoveredNodeData ? (
              <div className="w-full">
                <div className="flex items-center gap-3 font-display font-semibold text-sm text-white mb-1.5">
                  <span className="text-brand-accent">{currentHoveredNodeData.name}</span>
                  <span className="bg-brand-accent/5 border border-brand-accent/20 rounded px-2 py-0.5 text-[9px] font-mono font-medium text-brand-mist uppercase">
                    {currentHoveredNodeData.meta}
                  </span>
                </div>
                <div className="text-xs text-brand-dim leading-relaxed font-light">
                  {currentHoveredNodeData.desc}
                </div>
              </div>
            ) : (
              <div className="text-xs text-brand-mute italic font-light font-mono">
                No active node. Hover a block or click "Run physical signal" to execute the pipeline trace.
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Logging Readout Display Drawer */}
        {simulationLogs.length > 0 && (
          <div className="mt-4 border border-brand-accent/20 rounded-lg p-3 bg-brand-surface/10 font-mono text-[11px] leading-relaxed max-h-[140px] overflow-y-auto">
            {simulationLogs.map((log, index) => (
              <div
                key={index}
                className={`${
                  index === simulationLogs.length - 1
                    ? "text-brand-accent font-medium list-item list-inside animate-pulse"
                    : "text-brand-dim/80"
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-brand-mute/10 bg-black/5 divide-y md:divide-y-0 md:divide-x divide-brand-mute/10">
        {system.stats.map((stat, i) => (
          <div key={i} className="px-8 py-5.5 flex flex-col justify-center">
            <div className="font-display font-semibold text-lg md:text-2xl text-white tracking-tight">
              {stat.value}
            </div>
            <div className="font-mono text-[10px] tracking-wider text-brand-mute uppercase mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* EXPANDABLE PORTFOLIO TABS DETAILS BLOCK */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="overflow-hidden bg-brand-surface/10 border-t border-brand-mute/10"
          >
            {/* Extended tab navigation header */}
            <div className="flex flex-wrap border-b border-brand-mute/10 px-6 sm:px-8">
              {[
                { name: "built", label: "What I Built" },
                { name: "arch", label: "Architecture", icon: Layers },
                { name: "rel", label: "Reliability", icon: ShieldCheck },
                { name: "ev", label: "Evidence", icon: Cpu },
                { name: "code", label: "Code Signal", icon: Code2 },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name as any)}
                    className={`font-mono text-[11px] tracking-wider uppercase px-4 py-4 border-b-2 font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                      activeTab === tab.name
                        ? "text-brand-accent border-brand-accent bg-brand-accent/5 font-semibold"
                        : "text-brand-mute border-transparent hover:text-brand-dim"
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Configured Tab Panels */}
            <div className="p-8 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-sans"
                >
                  {/* Built Tab */}
                  {activeTab === "built" && (
                    <div className="space-y-6">
                      {system.problems.map((prob, index) => (
                        <div key={index} className="max-w-4xl">
                          <h4 className="font-mono text-[11px] uppercase tracking-widest text-brand-accent mb-2">
                            {prob.title}
                          </h4>
                          <p className="text-brand-dim md:text-base leading-relaxed font-light text-sm">
                            {prob.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Architecture Tab */}
                  {activeTab === "arch" && (
                    <div className="space-y-8 max-w-4xl">
                      <div>
                        <h4 className="font-mono text-[11px] uppercase tracking-widest text-brand-accent mb-4">
                          Key Decisions & System Trade-Offs
                        </h4>
                        <div className="border border-brand-mute/10 bg-black/20 rounded-xl divide-y divide-brand-mute/10">
                          {system.decisions.map((dec, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5">
                              <span className="font-mono text-[12px] font-medium text-brand-mist uppercase">
                                {dec.key}
                              </span>
                              <p className="md:col-span-3 text-sm text-brand-dim leading-relaxed font-light">
                                {dec.val}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reliability Tab */}
                  {activeTab === "rel" && (
                    <div className="space-y-6 max-w-4xl">
                      <div>
                        <h4 className="font-mono text-[11px] uppercase tracking-widest text-brand-accent mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-brand-accent" />
                          <span>Failures & Fault Tolerances</span>
                        </h4>
                        <div className="space-y-3">
                          {system.failures.map((fail, i) => (
                            <div
                              key={i}
                              className="border border-brand-mute/10 rounded-lg p-4 bg-black/10 text-sm leading-relaxed"
                            >
                              <strong className="text-white font-medium block mb-1">
                                🛑 {fail.condition}
                              </strong>
                              <span className="text-brand-dim font-light block">
                                {fail.handling}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {system.incidents && system.incidents.length > 0 && (
                        <div>
                          <h4 className="font-mono text-[11px] uppercase tracking-widest text-white mb-3">
                            Historic Incidents & Hardened Post-Mortems
                          </h4>
                          <div className="space-y-3 pl-4 border-l-2 border-brand-mute/30">
                            {system.incidents.map((inc, i) => (
                              <div key={i} className="text-sm">
                                <strong className="text-brand-dim font-semibold block">
                                  {inc.title}
                                </strong>
                                <span className="text-brand-accent block font-mono text-[11px] mt-0.5">
                                  ✓ Resolution: {inc.fix}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Evidence Tab */}
                  {activeTab === "ev" && (
                    <div className="space-y-6 max-w-4xl">
                      <h4 className="font-mono text-[11px] uppercase tracking-widest text-brand-accent mb-2">
                        Production Audit Metrics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {system.evidence.map((ev, i) => (
                          <div
                            key={i}
                            className="border border-brand-mute/10 bg-black/20 rounded-lg p-5 flex flex-col justify-between"
                          >
                            <span className="font-mono text-[11px] text-brand-mist uppercase mb-2">
                              {ev.label}
                            </span>
                            <p className="text-sm text-brand-dim leading-relaxed font-light">
                              {ev.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Code snippets tab */}
                  {activeTab === "code" && (
                    <div className="space-y-6 max-w-4xl">
                      {system.codeSnippets && system.codeSnippets.length > 0 ? (
                        system.codeSnippets.map((snippet, i) => (
                          <div key={i}>
                            <h4 className="font-mono text-[11px] uppercase tracking-widest text-brand-accent mb-2">
                              {snippet.title}
                            </h4>
                            <pre className="p-5 overflow-x-auto bg-black border border-brand-mute/10 rounded-xl text-[12px] font-mono leading-relaxed text-[#c9d6e2]">
                              <code>{snippet.code}</code>
                            </pre>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-brand-mute italic font-light font-mono">
                          Architecture specs are covered comprehensively inside the companion tabs. Full implementation references are shared inside dedicated walkthrough briefs.
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
