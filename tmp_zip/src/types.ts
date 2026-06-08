export interface FlowNode {
  id: string;
  name: string;
  meta: string;
  metaHighlight?: boolean;
  desc: string;
  isGpu?: boolean;
  isStrong?: boolean;
}

export interface FlowArrow {
  from: string;
  to: string;
  dashed?: boolean;
}

export interface SystemDetail {
  id: string;
  sysId: string;
  status: 'PRODUCTION' | 'SELF-HEALING' | 'OFFLINE-FIRST';
  badge: string;
  name: string;
  subtitle: string;
  stats: { value: string; label: string; count?: number; start?: number; comma?: boolean; prefix?: string; suffix?: string }[];
  problems: { title: string; text: string }[];
  decisions: { key: string; val: string }[];
  failures: { condition: string; handling: string }[];
  incidents?: { title: string; fix: string }[];
  evidence: { label: string; desc: string }[];
  codeSnippets?: { title: string; code: string }[];
  nodes: FlowNode[];
  arrows: FlowArrow[];
  customInteractive?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  when: string;
  desc: string;
  payment: string;
  percent: string;
  subPayment?: string;
}

export interface ClientProof {
  id: string;
  tag: string;
  name: string;
  place: string;
  metrics?: { value: string; label: string; count?: number; comma?: boolean; suffix?: string }[];
  description: string;
  details: { label: string; value: string; isWin?: boolean }[];
  referenceText?: string;
  cite?: string;
  citationAuthor?: string;
}
