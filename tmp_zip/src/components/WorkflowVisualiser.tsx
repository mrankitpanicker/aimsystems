import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, ArrowRight, Settings, Plus, RefreshCw, MessageSquare, Phone, Brain, Database, AlertCircle, Sparkles } from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "decision" | "action" | "fallback";
  label: string;
  desc: string;
  icon: any;
  status: "idle" | "running" | "success" | "skipped" | "error";
  details?: Record<string, string>;
}

export default function WorkflowVisualiser() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "w1",
      type: "trigger",
      label: "Inbound Call Missed",
      desc: "Plivo webhook triggers event with phone payload",
      icon: Phone,
      status: "idle",
      details: { "Event Source": "Plivo Webhook", "Payload Schema": "CallSid, CallStatus" }
    },
    {
      id: "w2",
      type: "decision",
      label: "Is Business Hours?",
      desc: "Branch condition: True (9am-6pm) vs False (After-hours)",
      icon: Settings,
      status: "idle",
      details: { "Time Range": "09:00 - 18:00 IST", "Timezone": "Asia/Kolkata" }
    },
    {
      id: "w3",
      type: "action",
      label: "Apex Voice AI Scribe",
      desc: "Answers call privately, books slot, summaries transcript",
      icon: Brain,
      status: "idle",
      details: { "Voice Model": "Quantized LLaMA", "Synthesis Model": "Kokoro TTS" }
    },
    {
      id: "w4",
      type: "action",
      label: "Send WhatsApp Temp",
      desc: "Sends out parallel SMS schedule for booking links",
      icon: MessageSquare,
      status: "idle",
      details: { "Template ID": "clinic_booking_invite", "Channel": "WhatsApp Business" }
    },
    {
      id: "w5",
      type: "action",
      label: "Sync Central CRM",
      desc: "Syncs medical prescription and slot with PostgreSQL array",
      icon: Database,
      status: "idle",
      details: { "Target Cluster": "Central clinical_db", "Latency SLA": "<50ms" }
    }
  ]);

  const [activeCondition, setActiveCondition] = useState<"day" | "night">("night");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [activeNodeDetails, setActiveNodeDetails] = useState<WorkflowNode | null>(nodes[0]);

  const runWorkflowTrace = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setCurrentStep(0);
    
    // Reset status
    setNodes((prev) => prev.map((n) => ({ ...n, status: "idle" })));

    const stepDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Step 1: Trigger
    setNodes((prev) => prev.map((n, i) => i === 0 ? { ...n, status: "running" } : n));
    await stepDelay(900);
    setNodes((prev) => prev.map((n, i) => i === 0 ? { ...n, status: "success" } : n));
    setCurrentStep(1);

    // Step 2: Decision
    setNodes((prev) => prev.map((n, i) => i === 1 ? { ...n, status: "running" } : n));
    await stepDelay(900);
    setNodes((prev) => prev.map((n, i) => i === 1 ? { ...n, status: "success" } : n));
    setCurrentStep(2);

    if (activeCondition === "day") {
      // Day path: Scribe -> Sync DB -> End
      setNodes((prev) => prev.map((n, i) => i === 2 ? { ...n, status: "running" } : i === 3 ? { ...n, status: "skipped" } : n));
      await stepDelay(1000);
      setNodes((prev) => prev.map((n, i) => i === 2 ? { ...n, status: "success" } : n));
      setCurrentStep(3);

      setNodes((prev) => prev.map((n, i) => i === 4 ? { ...n, status: "running" } : n));
      await stepDelay(900);
      setNodes((prev) => prev.map((n, i) => i === 4 ? { ...n, status: "success" } : n));
      
    } else {
      // Night path: Skip Scribe -> WhatsApp -> Sync DB -> End
      setNodes((prev) => prev.map((n, i) => i === 3 ? { ...n, status: "running" } : i === 2 ? { ...n, status: "skipped" } : n));
      await stepDelay(1000);
      setNodes((prev) => prev.map((n, i) => i === 3 ? { ...n, status: "success" } : n));
      setCurrentStep(4);

      setNodes((prev) => prev.map((n, i) => i === 4 ? { ...n, status: "running" } : n));
      await stepDelay(900);
      setNodes((prev) => prev.map((n, i) => i === 4 ? { ...n, status: "success" } : n));
    }

    setCurrentStep(5);
    setIsProcessing(false);
  };

  return (
    <div className="border border-brand-mute/10 bg-black/30 rounded-2xl p-6 md:p-8 font-sans max-w-5xl mx-auto my-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-brand-mute/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-brand-accent text-xs font-mono tracking-widest uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Workflow Sandbox</span>
          </div>
          <h4 className="text-xl font-display font-semibold text-white">
            Workspace Blueprint: Hospital Inbound Outreach Flow
          </h4>
          <p className="text-xs text-brand-dim mt-1 font-light">
            Toggle conditional rules, trigger high-fidelity pipeline sweeps, and watch logic split in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Conditional setting */}
          <div className="flex border border-brand-mute/20 rounded-lg p-0.5 bg-black/40">
            <button
              onClick={() => !isProcessing && setActiveCondition("day")}
              disabled={isProcessing}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors duration-200 cursor-pointer ${
                activeCondition === "day"
                  ? "bg-brand-accent/15 text-white border border-brand-accent/30 font-semibold"
                  : "text-brand-mute hover:text-brand-dim"
              }`}
            >
              Day Time
            </button>
            <button
              onClick={() => !isProcessing && setActiveCondition("night")}
              disabled={isProcessing}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors duration-200 cursor-pointer ${
                activeCondition === "night"
                  ? "bg-brand-accent/15 text-white border border-brand-accent/30 font-semibold"
                  : "text-brand-mute hover:text-brand-dim"
              }`}
            >
              After Hours
            </button>
          </div>

          <button
            onClick={runWorkflowTrace}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-brand-accent/15 hover:bg-brand-accent/30 border border-brand-accent/40 text-brand-accent disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
          >
            {isProcessing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
            )}
            <span>{isProcessing ? "Tracing Pipeline..." : "Execute Test"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* WORKFLOW PIPELINE FLOW TRACK */}
        <div className="lg:col-span-2 space-y-6 relative">
          
          {/* Node 1: Trigger */}
          <WorkflowBlock
            node={nodes[0]}
            isActive={currentStep === 0}
            onClick={() => setActiveNodeDetails(nodes[0])}
          />

          <FlowLink isProcessing={isProcessing} isPassed={currentStep !== null && currentStep > 0} />

          {/* Node 2: Conditional Split */}
          <WorkflowBlock
            node={nodes[1]}
            isActive={currentStep === 1}
            onClick={() => setActiveNodeDetails(nodes[1])}
            extraBadge={activeCondition === "day" ? "Day Branch" : "Night Branch"}
          />

          <div className="relative">
            {/* Split Lines showing conditional path tracking */}
            <div className="absolute left-[38px] top-0 bottom-0 w-0.5 border-l border-dashed border-brand-mute/20" />
            
            <div className="pl-14 space-y-4 my-4">
              <div className="text-[10px] font-mono tracking-widest uppercase text-brand-mute flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${activeCondition === "day" ? "bg-green-400 animate-pulse" : "bg-brand-mute/40"}`} />
                <span>Day Time Path: Auto Scribe Integration</span>
              </div>
              
              <WorkflowBlock
                node={nodes[2]}
                isActive={currentStep === 2}
                onClick={() => setActiveNodeDetails(nodes[2])}
                disabledClass={activeCondition !== "day"}
              />

              <div className="text-[10px] font-mono tracking-widest uppercase text-brand-mute flex items-center gap-2 pt-2">
                <span className={`w-1.5 h-1.5 rounded-full ${activeCondition === "night" ? "bg-green-400 animate-pulse" : "bg-brand-mute/40"}`} />
                <span>After Hours Path: Automated WhatsApp scheduling</span>
              </div>

              <WorkflowBlock
                node={nodes[3]}
                isActive={currentStep === 4}
                onClick={() => setActiveNodeDetails(nodes[3])}
                disabledClass={activeCondition !== "night"}
              />
            </div>
          </div>

          <FlowLink isProcessing={isProcessing} isPassed={currentStep !== null && currentStep > 2} />

          {/* Node 5: Sink / database output */}
          <WorkflowBlock
            node={nodes[4]}
            isActive={currentStep === 5}
            onClick={() => setActiveNodeDetails(nodes[4])}
          />
        </div>

        {/* WORKFLOW INSPECTION INSPECTOR DETAILS PANEL */}
        <div className="border border-brand-mute/10 bg-black/40 rounded-xl p-5 lg:sticky lg:top-24">
          <h5 className="font-mono text-[11px] uppercase tracking-widest text-brand-mute mb-4">
            Component Diagnostics
          </h5>

          {activeNodeDetails ? (
            <div>
              <div className="flex items-center gap-3 border-b border-brand-mute/10 pb-3 mb-4">
                <div className="p-2 border border-brand-accent/20 bg-brand-accent/5 rounded-lg text-brand-accent">
                  <activeNodeDetails.icon className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="font-display font-semibold text-white text-base">
                    {activeNodeDetails.label}
                  </h6>
                  <span className="font-mono text-[9px] text-brand-accent bg-brand-accent/5 border border-brand-accent/20 px-2 py-0.5 rounded uppercase">
                    {activeNodeDetails.type}
                  </span>
                </div>
              </div>

              <p className="text-xs text-brand-dim leading-relaxed font-light mb-4">
                {activeNodeDetails.desc}
              </p>

              {activeNodeDetails.details && (
                <div className="space-y-3">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-brand-mute border-b border-brand-mute/5 pb-1">
                    System Parameters
                  </div>
                  {Object.entries(activeNodeDetails.details).map(([key, val]) => (
                    <div key={key} className="text-xs">
                      <span className="font-mono text-brand-mute font-medium block mb-0.5">
                        {key}
                      </span>
                      <span className="font-mono text-brand-mist font-light">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-brand-mute italic font-light font-mono text-center py-8">
              Select any workflow element block to analyze runtime metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface WorkflowBlockProps {
  node: WorkflowNode;
  isActive: boolean;
  onClick: () => void;
  extraBadge?: string;
  disabledClass?: boolean;
}

function WorkflowBlock({ node, isActive, onClick, extraBadge, disabledClass = false }: WorkflowBlockProps) {
  const Icon = node.icon;
  
  const getStatusColor = () => {
    switch (node.status) {
      case "running":
        return "border-yellow-400 bg-yellow-400/5 shadow-[0_0_12px_rgba(234,179,8,0.2)]";
      case "success":
        return "border-green-400 bg-green-400/5 shadow-[0_0_12px_rgba(34,197,94,0.15)]";
      case "skipped":
        return "border-brand-mute/10 bg-brand-surface-light/5 opacity-40 select-none pointer-events-none";
      case "error":
        return "border-red-400 bg-red-400/5 shadow-[0_0_12px_rgba(239,68,68,0.2)]";
      default:
        return isActive 
          ? "border-brand-accent bg-brand-accent/5 shadow-[0_0_14px_rgba(143,208,255,0.2)]" 
          : "border-brand-mute/10 hover:border-brand-mist/30";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-4.5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 ${getStatusColor()} ${
        disabledClass ? "opacity-30 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 border rounded-lg transition-colors duration-200 ${
          node.status === "success" 
            ? "border-green-400/30 bg-green-400/5 text-green-400" 
            : isActive || node.status === "running"
            ? "border-brand-accent/30 bg-brand-accent/15 text-brand-accent"
            : "border-brand-mute/10 bg-black/20 text-brand-dim"
        }`}>
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-display font-semibold text-white text-sm md:text-base leading-none">
              {node.label}
            </h5>
            {extraBadge && (
              <span className="font-mono text-[8px] bg-brand-accent/5 border border-brand-accent/20 text-brand-mist px-1.5 py-0.5 rounded-full">
                {extraBadge}
              </span>
            )}
          </div>
          <p className="text-xs text-brand-mute mt-1 font-light">
            {node.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        {node.status === "success" && (
          <span className="font-mono text-[9px] text-green-400 font-semibold bg-green-400/5 border border-green-400/20 px-2 py-0.5 rounded">
            Success
          </span>
        )}
        {node.status === "running" && (
          <span className="font-mono text-[9px] text-yellow-400 font-semibold bg-yellow-400/5 border border-yellow-400/20 px-2 py-0.5 rounded animate-pulse">
            Active
          </span>
        )}
        {node.status === "skipped" && (
          <span className="font-mono text-[9px] text-brand-mute bg-brand-surface-light/5 border border-brand-mute/20 px-2 py-0.5 rounded uppercase">
            Skip
          </span>
        )}
        {node.status === "idle" && (
          <span className="text-brand-mute font-mono text-[10px]">&bull; Ready</span>
        )}
      </div>
    </div>
  );
}

interface FlowLinkProps {
  isProcessing: boolean;
  isPassed: boolean;
}

function FlowLink({ isProcessing, isPassed }: FlowLinkProps) {
  return (
    <div className="h-6 w-0.5 relative left-10">
      <div className="absolute inset-y-0 w-0.5 bg-brand-mute/20" />
      {isPassed && (
        <div className="absolute inset-y-0 w-0.5 bg-green-400 transition-all duration-300" />
      )}
      {isProcessing && !isPassed && (
        <motion.div
          className="absolute left-[-2px] w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_6px_#8fd0ff]"
          animate={{ y: [0, 24] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
