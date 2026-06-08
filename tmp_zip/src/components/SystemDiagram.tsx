import type { CSSProperties } from "react";

const diagramVars = {
  "--text": "#f5f9ff",
  "--mute": "rgba(191, 221, 246, 0.7)",
  "--dim": "#bfd2e2",
  "--slate": "#5f7d9d",
  "--accent": "#8fd0ff",
  "--accent-dim": "rgba(143, 208, 255, 0.08)",
  "--sys-surf": "rgba(27,39,53,0.5)",
  "--sys-pur": "#b88ee6",
  "--sys-org": "#e8a84c",
  "--sys-grn": "#5ceaa0",
} as CSSProperties;

const diagramMarkupBySystemId: Record<string, string> = {
  "SYS-01": `<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="var(--slate)" />
      </marker>
    </defs>
    <g transform="translate(29,144)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" />
      <circle cx="16" cy="12" r="4" fill="none" stroke="var(--dim)" stroke-width="1.3" />
      <path d="M8 26c0-4 4-7 8-7s8 3 8 7" fill="none" stroke="var(--dim)" stroke-width="1.3" />
    </g>
    <text x="45" y="188" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Caller</text>
    <rect x="90" y="25" width="140" height="290" rx="8" fill="var(--sys-surf)" stroke="var(--accent)" stroke-width="1.2" />
    <text x="100" y="19" text-anchor="start" fill="var(--accent)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">TELEPHONY GATEWAY</text>
    <g transform="translate(114,64)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" />
      <path d="M11 8h10a2 2 0 012 2v12a2 2 0 01-2 2H11a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" />
      <circle cx="16" cy="25" r="1.2" fill="var(--dim)" />
    </g>
    <text x="130" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Inbound</text>
    <text x="130" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">WebSocket</text>
    <g transform="translate(174,174)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" />
      <path d="M6 16 Q10 8 14 16 Q18 24 22 16 Q26 8 30 16" fill="none" stroke="var(--dim)" stroke-width="1.5" />
    </g>
    <text x="190" y="218" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Media</text>
    <text x="190" y="230" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Stream</text>
    <line x1="130" y1="106" x2="165" y2="170" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="260" y="25" width="310" height="130" rx="8" fill="var(--sys-surf)" stroke="var(--sys-pur)" stroke-width="1.2" />
    <text x="270" y="19" text-anchor="start" fill="var(--sys-pur)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">REAL-TIME INFERENCE ENGINE</text>
    <g transform="translate(299,74)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" />
      <path d="M10 13v6h4l5 4V9l-5 4h-4z" fill="none" stroke="var(--accent)" stroke-width="1.3" />
      <path d="M22 12a4 4 0 010 8" fill="none" stroke="var(--accent)" stroke-width="1" />
    </g>
    <text x="315" y="118" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Speech</text>
    <text x="315" y="130" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Recognition</text>
    <g transform="translate(399,74)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(184,142,230,.15)" stroke="var(--sys-pur)" stroke-width="1.4" />
      <circle cx="16" cy="14" r="6" fill="none" stroke="var(--sys-pur)" stroke-width="1.3" />
      <path d="M12 20 Q16 26 20 20" fill="none" stroke="var(--sys-pur)" stroke-width="1.3" />
      <line x1="16" y1="8" x2="16" y2="6" stroke="var(--sys-pur)" stroke-width="1" />
    </g>
    <text x="415" y="118" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Language</text>
    <text x="415" y="130" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Model</text>
    <g transform="translate(499,74)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" />
      <rect x="13" y="8" width="6" height="10" rx="3" fill="none" stroke="var(--accent)" stroke-width="1.3" />
      <path d="M10 18a6 6 0 0012 0" fill="none" stroke="var(--accent)" stroke-width="1.3" />
      <line x1="16" y1="24" x2="16" y2="26" stroke="var(--accent)" stroke-width="1.3" />
    </g>
    <text x="515" y="118" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Voice</text>
    <text x="515" y="130" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Synthesis</text>
    <line x1="340" y1="90" x2="390" y2="90" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="440" y1="90" x2="490" y2="90" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="260" y="175" width="310" height="135" rx="8" fill="var(--sys-surf)" stroke="var(--sys-org)" stroke-width="1.2" />
    <text x="270" y="169" text-anchor="start" fill="var(--sys-org)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">STATE LAYER</text>
    <g transform="translate(309,224)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" />
      <ellipse cx="16" cy="11" rx="7" ry="3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" />
      <path d="M9 11v10c0 1.7 3.1 3 7 3s7-1.3 7-3V11" fill="none" stroke="var(--sys-org)" stroke-width="1.3" />
      <path d="M9 17c0 1.7 3.1 3 7 3s7-1.3 7-3" fill="none" stroke="var(--sys-org)" stroke-width="1" />
    </g>
    <text x="325" y="268" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Session</text>
    <text x="325" y="280" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Store</text>
    <g transform="translate(439,224)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" />
      <ellipse cx="16" cy="11" rx="7" ry="3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" />
      <path d="M9 11v10c0 1.7 3.1 3 7 3s7-1.3 7-3V11" fill="none" stroke="var(--sys-org)" stroke-width="1.3" />
      <path d="M9 17c0 1.7 3.1 3 7 3s7-1.3 7-3" fill="none" stroke="var(--sys-org)" stroke-width="1" />
    </g>
    <text x="455" y="268" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Audio</text>
    <text x="455" y="280" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Cache</text>
    <g transform="translate(374,184)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" />
      <rect x="10" y="14" width="12" height="10" rx="2" fill="none" stroke="var(--sys-org)" stroke-width="1.3" />
      <path d="M12 14v-3a4 4 0 018 0v3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" />
      <circle cx="16" cy="19" r="1.5" fill="var(--sys-org)" />
    </g>
    <text x="390" y="228" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Tenant</text>
    <text x="390" y="240" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Isolation</text>
    <rect x="600" y="25" width="170" height="290" rx="8" fill="var(--sys-surf)" stroke="var(--sys-grn)" stroke-width="1.2" />
    <text x="610" y="19" text-anchor="start" fill="var(--sys-grn)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">OPERATIONS</text>
    <g transform="translate(629,64)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" />
      <circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" />
      <circle cx="16" cy="16" r="1.5" fill="var(--accent)" />
      <line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" />
      <line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" />
    </g>
    <text x="645" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">CI/CD</text>
    <text x="645" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Pipeline</text>
    <g transform="translate(704,64)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(92,234,160,.15)" stroke="var(--sys-grn)" stroke-width="1.4" />
      <path d="M10 16h12M16 10v12" stroke="var(--sys-grn)" stroke-width="1.5" />
      <path d="M12 12l4-4 4 4" fill="none" stroke="var(--sys-grn)" stroke-width="1.3" />
    </g>
    <text x="720" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Rolling</text>
    <text x="720" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Deploy</text>
    <g transform="translate(629,154)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" />
      <path d="M16 7l8 3v7c0 5-8 9-8 9s-8-4-8-9v-7l8-3z" fill="none" stroke="var(--accent)" stroke-width="1.3" />
    </g>
    <text x="645" y="198" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Circuit</text>
    <text x="645" y="210" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Breakers</text>
    <g transform="translate(704,154)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" />
      <rect x="10" y="18" width="3" height="6" fill="var(--accent)" />
      <rect x="15" y="14" width="3" height="10" fill="var(--sys-pur)" />
      <rect x="20" y="10" width="3" height="14" fill="var(--sys-org)" />
    </g>
    <text x="720" y="198" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Rate</text>
    <text x="720" y="210" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Control</text>
    <g transform="translate(664,234)">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" />
      <path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" />
      <line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" />
      <line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" />
    </g>
    <text x="680" y="278" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">WAL</text>
    <text x="680" y="290" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Recovery</text>
    <line x1="670" y1="80" x2="700" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="65" y1="160" x2="110" y2="90" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="210" y1="170" x2="290" y2="90" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <path d="M 515,115 Q 500,170 470,220" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
    <path d="M 415,115 Q 390,160 340,220" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
    <line x1="535" y1="90" x2="620" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
    <path d="M 45,185 Q 45,310 130,310 Q 250,310 280,260" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
  </svg>`,
  "SYS-02": `<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--slate)" /></marker></defs>
    <rect x="15" y="25" width="120" height="230" rx="8" fill="var(--sys-surf)" stroke="var(--accent)" stroke-width="1.2" />
    <text x="25" y="19" text-anchor="start" fill="var(--accent)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">INTAKE</text>
    <g transform="translate(59,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M11 8h7l5 5v11a2 2 0 01-2 2H11a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><path d="M18 8v5h5" fill="none" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="75" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Contact</text><text x="75" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Upload</text>
    <g transform="translate(59,159)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M16 7l8 3v7c0 5-8 9-8 9s-8-4-8-9v-7l8-3z" fill="none" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="75" y="203" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Validate</text><text x="75" y="215" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">& Dedup</text>
    <line x1="75" y1="106" x2="75" y2="150" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="170" y="25" width="130" height="230" rx="8" fill="var(--sys-surf)" stroke="var(--sys-org)" stroke-width="1.2" />
    <text x="180" y="19" text-anchor="start" fill="var(--sys-org)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">QUEUE</text>
    <g transform="translate(219,84)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><ellipse cx="16" cy="11" rx="7" ry="3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 11v10c0 1.7 3.1 3 7 3s7-1.3 7-3V11" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 17c0 1.7 3.1 3 7 3s7-1.3 7-3" fill="none" stroke="var(--sys-org)" stroke-width="1" /></g>
    <text x="235" y="128" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Priority</text><text x="235" y="140" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Queue</text>
    <g transform="translate(219,174)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="235" y="218" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Reaper</text><text x="235" y="230" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Thread</text>
    <path d="M 235,215 Q 260,240 260,110" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
    <rect x="335" y="25" width="230" height="120" rx="8" fill="var(--sys-surf)" stroke="var(--sys-pur)" stroke-width="1.2" />
    <text x="345" y="19" text-anchor="start" fill="var(--sys-pur)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">PARALLEL EXECUTION</text>
    <g transform="translate(384,69)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M11 8h10a2 2 0 012 2v12a2 2 0 01-2 2H11a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><circle cx="16" cy="25" r="1.2" fill="var(--dim)" /></g>
    <text x="400" y="113" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Voice</text><text x="400" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Dialler</text>
    <g transform="translate(484,69)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(92,234,160,.15)" stroke="var(--sys-grn)" stroke-width="1.4" /><path d="M8 10h16a2 2 0 012 2v8a2 2 0 01-2 2h-3l-3 3-3-3H8a2 2 0 01-2-2v-8a2 2 0 012-2z" fill="none" stroke="var(--sys-grn)" stroke-width="1.3" /></g>
    <text x="500" y="113" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Messaging</text><text x="500" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Channel</text>
    <rect x="335" y="165" width="230" height="90" rx="8" fill="var(--sys-surf)" stroke="var(--sys-pur)" stroke-width="1.2" />
    <text x="345" y="159" text-anchor="start" fill="var(--sys-pur)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">RETRY ENGINE</text>
    <g transform="translate(394,194)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="410" y="238" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Exponential</text><text x="410" y="250" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Backoff</text>
    <g transform="translate(494,194)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><rect x="10" y="14" width="12" height="10" rx="2" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M12 14v-3a4 4 0 018 0v3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><circle cx="16" cy="19" r="1.5" fill="var(--sys-org)" /></g>
    <text x="510" y="238" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Dead Letter</text><text x="510" y="250" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Queue</text>
    <rect x="600" y="25" width="140" height="230" rx="8" fill="var(--sys-surf)" stroke="var(--sys-grn)" stroke-width="1.2" />
    <text x="610" y="19" text-anchor="start" fill="var(--sys-grn)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">OUTPUT</text>
    <g transform="translate(654,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><rect x="10" y="18" width="3" height="6" fill="var(--accent)" /><rect x="15" y="14" width="3" height="10" fill="var(--sys-pur)" /><rect x="20" y="10" width="3" height="14" fill="var(--sys-org)" /></g>
    <text x="670" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Outcome</text><text x="670" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Report</text>
    <g transform="translate(654,159)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" /><line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="670" y="203" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Per-Number</text><text x="670" y="215" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Analytics</text>
    <line x1="100" y1="80" x2="210" y2="100" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="260" y1="100" x2="375" y2="85" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="425" y1="85" x2="475" y2="85" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="520" y1="100" x2="645" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <path d="M 400,110 L 400,190" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <path d="M 395,210 Q 300,210 255,120" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
  </svg>`,
  "SYS-03": `<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--slate)" /></marker></defs>
    <g transform="translate(29,94)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M11 8h7l5 5v11a2 2 0 01-2 2H11a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><path d="M18 8v5h5" fill="none" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="45" y="138" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Job</text><text x="45" y="150" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Submit</text>
    <rect x="95" y="30" width="120" height="210" rx="8" fill="var(--sys-surf)" stroke="var(--sys-org)" stroke-width="1.2" />
    <text x="105" y="24" text-anchor="start" fill="var(--sys-org)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">QUEUE</text>
    <g transform="translate(139,74)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><ellipse cx="16" cy="11" rx="7" ry="3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 11v10c0 1.7 3.1 3 7 3s7-1.3 7-3V11" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 17c0 1.7 3.1 3 7 3s7-1.3 7-3" fill="none" stroke="var(--sys-org)" stroke-width="1" /></g>
    <text x="155" y="118" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Reliable</text><text x="155" y="130" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Queue</text>
    <g transform="translate(139,159)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="155" y="203" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Orphan</text><text x="155" y="215" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Recovery</text>
    <path d="M 155,200 Q 175,220 175,100" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
    <rect x="250" y="30" width="120" height="130" rx="8" fill="var(--sys-surf)" stroke="var(--accent)" stroke-width="1.2" />
    <text x="260" y="24" text-anchor="start" fill="var(--accent)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">CONTROL</text>
    <g transform="translate(294,84)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M16 7l8 3v7c0 5-8 9-8 9s-8-4-8-9v-7l8-3z" fill="none" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="310" y="128" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Process</text><text x="310" y="140" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Supervisor</text>
    <rect x="405" y="20" width="370" height="230" rx="8" fill="var(--sys-surf)" stroke="var(--sys-pur)" stroke-width="1.2" />
    <text x="415" y="14" text-anchor="start" fill="var(--sys-pur)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">5-STAGE GPU PIPELINE</text>
    <g transform="translate(434,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" /><line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="450" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Text</text><text x="450" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Processing</text>
    <g transform="translate(524,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(184,142,230,.15)" stroke="var(--sys-pur)" stroke-width="1.4" /><rect x="7" y="10" width="18" height="12" rx="2" fill="none" stroke="var(--sys-pur)" stroke-width="1.3" /><line x1="11" y1="6" x2="11" y2="10" stroke="var(--sys-pur)" stroke-width="1.2" /><line x1="16" y1="6" x2="16" y2="10" stroke="var(--sys-pur)" stroke-width="1.2" /><line x1="21" y1="6" x2="21" y2="10" stroke="var(--sys-pur)" stroke-width="1.2" /></g>
    <text x="540" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Voice</text><text x="540" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Synthesis</text>
    <g transform="translate(614,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M10 13v6h4l5 4V9l-5 4h-4z" fill="none" stroke="var(--accent)" stroke-width="1.3" /><path d="M22 12a4 4 0 010 8" fill="none" stroke="var(--accent)" stroke-width="1" /></g>
    <text x="630" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Transcript</text><text x="630" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Alignment</text>
    <g transform="translate(704,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><rect x="7" y="9" width="18" height="14" rx="2" fill="none" stroke="var(--dim)" stroke-width="1.3" /><polygon points="14,13 14,20 20,16.5" fill="var(--dim)" /></g>
    <text x="720" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Video</text><text x="720" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Assembly</text>
    <g transform="translate(569,159)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="585" y="203" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Resource</text><text x="585" y="215" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Manager</text>
    <g transform="translate(664,159)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><rect x="10" y="14" width="12" height="10" rx="2" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M12 14v-3a4 4 0 018 0v3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><circle cx="16" cy="19" r="1.5" fill="var(--sys-org)" /></g>
    <text x="680" y="203" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">VRAM</text><text x="680" y="215" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Budget</text>
    <line x1="475" y1="80" x2="515" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="565" y1="80" x2="605" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="655" y1="80" x2="695" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="65" y1="110" x2="130" y2="90" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="180" y1="90" x2="285" y2="100" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="335" y1="100" x2="425" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
  </svg>`,
  "SYS-04": `<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--slate)" /></marker></defs>
    <rect x="15" y="20" width="155" height="270" rx="8" fill="var(--sys-surf)" stroke="var(--accent)" stroke-width="1.2" />
    <text x="25" y="14" text-anchor="start" fill="var(--accent)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">OFFLINE CLIENT</text>
    <g transform="translate(44,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><rect x="9" y="6" width="14" height="20" rx="2" fill="none" stroke="var(--accent)" stroke-width="1.3" /><line x1="14" y1="24" x2="18" y2="24" stroke="var(--accent)" stroke-width="1" /></g>
    <text x="60" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Progressive</text><text x="60" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Web App</text>
    <g transform="translate(114,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><ellipse cx="16" cy="11" rx="7" ry="3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 11v10c0 1.7 3.1 3 7 3s7-1.3 7-3V11" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 17c0 1.7 3.1 3 7 3s7-1.3 7-3" fill="none" stroke="var(--sys-org)" stroke-width="1" /></g>
    <text x="130" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Local</text><text x="130" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Database</text>
    <g transform="translate(79,174)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="95" y="218" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Sync</text><text x="95" y="230" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Engine</text>
    <g transform="translate(44,124)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" /><line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="60" y="168" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Pending</text><text x="60" y="180" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Mutations</text>
    <line x1="85" y1="80" x2="105" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" /><line x1="60" y1="106" x2="60" y2="120" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" /><line x1="75" y1="160" x2="85" y2="170" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="200" y="20" width="130" height="270" rx="8" fill="var(--sys-surf)" stroke="var(--sys-org)" stroke-width="1.2" />
    <text x="210" y="14" text-anchor="start" fill="var(--sys-org)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">GATEWAY</text>
    <g transform="translate(249,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M16 7l8 3v7c0 5-8 9-8 9s-8-4-8-9v-7l8-3z" fill="none" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="265" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Auth</text><text x="265" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">JWT</text>
    <g transform="translate(249,134)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><rect x="10" y="14" width="12" height="10" rx="2" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M12 14v-3a4 4 0 018 0v3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><circle cx="16" cy="19" r="1.5" fill="var(--sys-org)" /></g>
    <text x="265" y="178" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Tenant</text><text x="265" y="190" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">RBAC</text>
    <g transform="translate(249,204)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="265" y="248" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Idempotency</text><text x="265" y="260" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Registry</text>
    <line x1="265" y1="106" x2="265" y2="125" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" /><line x1="265" y1="176" x2="265" y2="195" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="365" y="20" width="290" height="130" rx="8" fill="var(--sys-surf)" stroke="var(--sys-pur)" stroke-width="1.2" />
    <text x="375" y="14" text-anchor="start" fill="var(--sys-pur)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">MUTATION PIPELINE</text>
    <g transform="translate(404,69)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" /><line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="420" y="113" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Write-Ahead</text><text x="420" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Log</text>
    <g transform="translate(504,69)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><ellipse cx="16" cy="11" rx="7" ry="3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 11v10c0 1.7 3.1 3 7 3s7-1.3 7-3V11" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 17c0 1.7 3.1 3 7 3s7-1.3 7-3" fill="none" stroke="var(--sys-org)" stroke-width="1" /></g>
    <text x="520" y="113" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Job</text><text x="520" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Queue</text>
    <g transform="translate(594,69)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="610" y="113" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Worker</text>
    <line x1="445" y1="85" x2="495" y2="85" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" /><line x1="545" y1="85" x2="585" y2="85" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="365" y="170" width="290" height="120" rx="8" fill="var(--sys-surf)" stroke="var(--sys-pur)" stroke-width="1.2" />
    <text x="375" y="164" text-anchor="start" fill="var(--sys-pur)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">DOMAIN HANDLERS</text>
    <g transform="translate(404,204)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" /><line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="420" y="248" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Patient</text><text x="420" y="260" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Records</text>
    <g transform="translate(494,204)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" /><line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="510" y="248" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Clinical</text><text x="510" y="260" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Workflows</text>
    <g transform="translate(584,204)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><rect x="10" y="18" width="3" height="6" fill="var(--accent)" /><rect x="15" y="14" width="3" height="10" fill="var(--sys-pur)" /><rect x="20" y="10" width="3" height="14" fill="var(--sys-org)" /></g>
    <text x="600" y="248" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Billing &</text><text x="600" y="260" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Insurance</text>
    <rect x="690" y="20" width="90" height="270" rx="8" fill="var(--sys-surf)" stroke="var(--sys-grn)" stroke-width="1.2" />
    <text x="700" y="14" text-anchor="start" fill="var(--sys-grn)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">AUDIT</text>
    <g transform="translate(719,84)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" /><line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="735" y="128" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Immutable</text><text x="735" y="140" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Log</text>
    <g transform="translate(719,194)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M16 7l8 3v7c0 5-8 9-8 9s-8-4-8-9v-7l8-3z" fill="none" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="735" y="238" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">290+</text><text x="735" y="250" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Tests</text>
    <line x1="120" y1="190" x2="240" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="290" y1="220" x2="395" y2="85" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="630" y1="100" x2="710" y2="100" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="610" y1="108" x2="510" y2="200" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <path d="M 95,215 Q 95,280 200,280 Q 280,280 280,250" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
  </svg>`,
  "SYS-05": `<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--slate)" /></marker></defs>
    <rect x="15" y="25" width="130" height="260" rx="8" fill="var(--sys-surf)" stroke="var(--accent)" stroke-width="1.2" />
    <text x="25" y="19" text-anchor="start" fill="var(--accent)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">AUDIO INPUT</text>
    <g transform="translate(34,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><rect x="13" y="8" width="6" height="10" rx="3" fill="none" stroke="var(--accent)" stroke-width="1.3" /><path d="M10 18a6 6 0 0012 0" fill="none" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="24" x2="16" y2="26" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="50" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Microphone</text><text x="50" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">16kHz PCM</text>
    <g transform="translate(94,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M6 16 Q10 8 14 16 Q18 24 22 16 Q26 8 30 16" fill="none" stroke="var(--dim)" stroke-width="1.5" /></g>
    <text x="110" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">5-Signal</text><text x="110" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">VAD</text>
    <g transform="translate(64,159)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M10 13v6h4l5 4V9l-5 4h-4z" fill="none" stroke="var(--accent)" stroke-width="1.3" /><path d="M22 12a4 4 0 010 8" fill="none" stroke="var(--accent)" stroke-width="1" /></g>
    <text x="80" y="203" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Speech</text><text x="80" y="215" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Recognition</text>
    <g transform="translate(64,219)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M16 7l8 3v7c0 5-8 9-8 9s-8-4-8-9v-7l8-3z" fill="none" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="80" y="263" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Quality</text><text x="80" y="275" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Gates</text>
    <line x1="75" y1="80" x2="85" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" /><line x1="110" y1="106" x2="80" y2="150" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" /><line x1="80" y1="200" x2="80" y2="215" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="180" y="25" width="280" height="130" rx="8" fill="var(--sys-surf)" stroke="var(--sys-pur)" stroke-width="1.2" />
    <text x="190" y="19" text-anchor="start" fill="var(--sys-pur)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">LOCAL INFERENCE · ZERO CLOUD</text>
    <g transform="translate(224,79)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(184,142,230,.15)" stroke="var(--sys-pur)" stroke-width="1.4" /><circle cx="16" cy="14" r="6" fill="none" stroke="var(--sys-pur)" stroke-width="1.3" /><path d="M12 20 Q16 26 20 20" fill="none" stroke="var(--sys-pur)" stroke-width="1.3" /><line x1="16" y1="8" x2="16" y2="6" stroke="var(--sys-pur)" stroke-width="1" /></g>
    <text x="240" y="123" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Language</text><text x="240" y="135" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Model</text>
    <g transform="translate(324,79)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M16 7l8 3v7c0 5-8 9-8 9s-8-4-8-9v-7l8-3z" fill="none" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="340" y="123" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Hindi</text><text x="340" y="135" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Validation</text>
    <g transform="translate(404,79)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="420" y="123" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Sentence</text><text x="420" y="135" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Splitter</text>
    <line x1="265" y1="95" x2="315" y2="95" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" /><line x1="365" y1="95" x2="395" y2="95" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="180" y="175" width="280" height="110" rx="8" fill="var(--sys-surf)" stroke="var(--sys-org)" stroke-width="1.2" />
    <text x="190" y="169" text-anchor="start" fill="var(--sys-org)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">CONTEXT ENGINE</text>
    <g transform="translate(239,199)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><ellipse cx="16" cy="11" rx="7" ry="3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 11v10c0 1.7 3.1 3 7 3s7-1.3 7-3V11" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M9 17c0 1.7 3.1 3 7 3s7-1.3 7-3" fill="none" stroke="var(--sys-org)" stroke-width="1" /></g>
    <text x="255" y="243" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Vector</text><text x="255" y="255" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Memory</text>
    <g transform="translate(369,199)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><path d="M10 8h8l4 4v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="var(--dim)" stroke-width="1.3" /><line x1="11" y1="16" x2="21" y2="16" stroke="var(--dim)" stroke-width="1" /><line x1="11" y1="19" x2="18" y2="19" stroke="var(--dim)" stroke-width="1" /></g>
    <text x="385" y="243" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Conversation</text><text x="385" y="255" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">History</text>
    <rect x="495" y="25" width="165" height="260" rx="8" fill="var(--sys-surf)" stroke="var(--sys-grn)" stroke-width="1.2" />
    <text x="505" y="19" text-anchor="start" fill="var(--sys-grn)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">AUDIO OUTPUT</text>
    <g transform="translate(524,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><rect x="13" y="8" width="6" height="10" rx="3" fill="none" stroke="var(--accent)" stroke-width="1.3" /><path d="M10 18a6 6 0 0012 0" fill="none" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="24" x2="16" y2="26" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="540" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Voice</text><text x="540" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Synthesis</text>
    <g transform="translate(599,64)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--dim)" stroke-width="1.4" /><circle cx="16" cy="12" r="4" fill="none" stroke="var(--dim)" stroke-width="1.3" /><path d="M8 26c0-4 4-7 8-7s8 3 8 7" fill="none" stroke="var(--dim)" stroke-width="1.3" /></g>
    <text x="615" y="108" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Speaker</text><text x="615" y="120" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">24kHz</text>
    <g transform="translate(561,159)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent)" stroke-width="1.3" /><circle cx="16" cy="16" r="1.5" fill="var(--accent)" /><line x1="16" y1="8" x2="16" y2="11" stroke="var(--accent)" stroke-width="1.3" /><line x1="16" y1="21" x2="16" y2="24" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="577" y="203" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Pipelined</text><text x="577" y="215" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Streaming</text>
    <g transform="translate(561,219)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(92,234,160,.15)" stroke="var(--sys-grn)" stroke-width="1.4" /><path d="M8 16a8 8 0 0114-5" fill="none" stroke="var(--sys-grn)" stroke-width="1.3" /><path d="M24 16a8 8 0 01-14 5" fill="none" stroke="var(--sys-grn)" stroke-width="1.3" /><path d="M20 9l2 2-2 2" fill="none" stroke="var(--sys-grn)" stroke-width="1.3" /><path d="M12 23l-2-2 2-2" fill="none" stroke="var(--sys-grn)" stroke-width="1.3" /></g>
    <text x="577" y="263" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Echo</text><text x="577" y="275" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Guard</text>
    <line x1="565" y1="80" x2="590" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="695" y="50" width="85" height="200" rx="8" fill="var(--sys-surf)" stroke="var(--sys-org)" stroke-width="1.2" />
    <text x="705" y="44" text-anchor="start" fill="var(--sys-org)" font-size="9" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">PRIVACY</text>
    <g transform="translate(721,89)"><rect x="0" y="0" width="32" height="32" rx="6" fill="rgba(232,168,76,.15)" stroke="var(--sys-org)" stroke-width="1.4" /><rect x="10" y="14" width="12" height="10" rx="2" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><path d="M12 14v-3a4 4 0 018 0v3" fill="none" stroke="var(--sys-org)" stroke-width="1.3" /><circle cx="16" cy="19" r="1.5" fill="var(--sys-org)" /></g>
    <text x="737" y="133" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">Zero</text><text x="737" y="145" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Egress</text>
    <g transform="translate(721,179)"><rect x="0" y="0" width="32" height="32" rx="6" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1.4" /><path d="M16 7l8 3v7c0 5-8 9-8 9s-8-4-8-9v-7l8-3z" fill="none" stroke="var(--accent)" stroke-width="1.3" /></g>
    <text x="737" y="223" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Inter,system-ui,sans-serif">On-Device</text><text x="737" y="235" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="Inter,system-ui,sans-serif">Only</text>
    <line x1="105" y1="235" x2="215" y2="95" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <line x1="445" y1="95" x2="515" y2="80" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <path d="M 240,120 Q 240,175 245,195" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
    <path d="M 265,195 Q 265,120 265,95" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
    <path d="M 615,106 Q 615,260 100,260 Q 60,260 60,100" fill="none" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" stroke-dasharray="6,4" />
  </svg>`,
  "SYS-06": `<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--slate)" /></marker></defs>
    <rect x="20" y="140" width="100" height="60" rx="8" fill="var(--sys-surf)" stroke="var(--sys-grn)" stroke-width="1.2" />
    <text x="70" y="174" text-anchor="middle" fill="var(--sys-grn)" font-size="11" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">TRIGGER</text>
    <line x1="120" y1="170" x2="155" y2="170" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <polygon points="210,140 260,170 210,200 160,170" fill="var(--sys-surf)" stroke="var(--sys-org)" stroke-width="1.2" />
    <text x="210" y="173" text-anchor="middle" fill="var(--sys-org)" font-size="9" letter-spacing=".5" font-family="Inter,system-ui,sans-serif">CONDITION</text>
    <line x1="260" y1="170" x2="295" y2="170" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="300" y="140" width="110" height="60" rx="8" fill="var(--sys-surf)" stroke="var(--accent)" stroke-width="1.2" />
    <text x="355" y="174" text-anchor="middle" fill="var(--accent)" font-size="11" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">AI CALL</text>
    <line x1="355" y1="200" x2="355" y2="225" stroke="var(--slate)" stroke-width="1.2" stroke-dasharray="4,4" marker-end="url(#ah)" />
    <rect x="300" y="230" width="110" height="40" rx="8" fill="var(--sys-surf)" stroke="var(--dim)" stroke-width="1.2" />
    <text x="355" y="254" text-anchor="middle" fill="var(--dim)" font-size="10" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">FALLBACK</text>
    <line x1="410" y1="170" x2="445" y2="170" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="450" y="140" width="100" height="60" rx="8" fill="var(--sys-surf)" stroke="var(--sys-grn)" stroke-width="1.2" />
    <text x="500" y="174" text-anchor="middle" fill="var(--sys-grn)" font-size="11" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">WHATSAPP</text>
    <line x1="550" y1="170" x2="585" y2="170" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <rect x="590" y="140" width="100" height="60" rx="8" fill="var(--sys-surf)" stroke="var(--sys-pur)" stroke-width="1.2" />
    <text x="640" y="174" text-anchor="middle" fill="var(--sys-pur)" font-size="11" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">WEBHOOK</text>
    <line x1="690" y1="170" x2="725" y2="170" stroke="var(--slate)" stroke-width="1.2" marker-end="url(#ah)" />
    <circle cx="760" cy="170" r="30" fill="var(--sys-surf)" stroke="var(--dim)" stroke-width="1.2" />
    <text x="760" y="174" text-anchor="middle" fill="var(--text)" font-size="10" letter-spacing=".8" font-family="Inter,system-ui,sans-serif">OUTCOME</text>
  </svg>`,
};

function withScopedMarkerIds(markup: string, sysId: string) {
  const markerId = `ah-${sysId.toLowerCase()}`;
  return markup.replace(/id="ah"/g, `id="${markerId}"`).replace(/url\(#ah\)/g, `url(#${markerId})`);
}

export default function SystemDiagram({ sysId }: { sysId: string }) {
  const markup = diagramMarkupBySystemId[sysId];

  if (!markup) {
    return null;
  }

  return (
    <div
      className="rounded-2xl border border-brand-mute/10 bg-black/20 p-4 md:p-5"
      style={diagramVars}
    >
      <div
        className="mx-auto max-w-[900px]"
        dangerouslySetInnerHTML={{ __html: withScopedMarkerIds(markup, sysId) }}
      />
    </div>
  );
}
