import { motion } from "motion/react";

export default function AudioWave() {
  return (
    <svg
      className="absolute top-[40%] left-0 right-0 w-full h-[180px] pointer-events-none opacity-40 z-0 overflow-visible"
      viewBox="0 0 1400 180"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Background static wave */}
      <path
        className="stroke-brand-slate/20 fill-none"
        strokeWidth="1"
        d="M0,90 L300,90 L320,90 L332,40 L346,140 L360,90 L700,90 L720,90 L734,60 L748,120 L762,90 L1400,90"
      />

      {/* Main live interactive scanning wave */}
      <motion.path
        className="stroke-brand-mist fill-none filter drop-shadow-[0_0_8px_rgba(143,208,255,0.4)]"
        strokeWidth="1.6"
        d="M0,90 L300,90 L320,90 L332,30 L346,150 L360,90 L700,90 L720,90 L734,46 L750,138 L766,90 L1040,90 L1058,90 L1070,64 L1086,120 L1100,90 L1400,90"
        initial={{ strokeDasharray: "15 1400", strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -1400 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Auxiliary low-latency background voice channel visualizer */}
      <motion.path
        className="stroke-brand-accent/40 fill-none"
        strokeWidth="1"
        d="M0,95 L280,95 L300,60 L315,130 L330,95 L680,95 L695,70 L710,120 L725,95 L1010,95 L1025,75 L1040,115 L1055,95 L1400,95"
        initial={{ strokeDasharray: "30 1400", strokeDashoffset: 500 }}
        animate={{ strokeDashoffset: -900 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  );
}
