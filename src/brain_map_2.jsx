import { useState } from "react";

// ── SUBSYSTEM DEFINITIONS ──
const SUB = {
  core: { label: "DMN Core", color: "#4A90D9" },
  dm:   { label: "Dorsomedial (Mentalizing)", color: "#E8A838" },
  mtl:  { label: "MTL (Memory)", color: "#7B68EE" },
  aff:  { label: "Affective Node", color: "#E05555" },
};

// ── REGION DEFINITIONS (medial sagittal coordinates) ──
const REGIONS = {
  PCC:   { x: 235, y: 115, sub: "core", full: "Posterior Cingulate Cortex",          desc: "DMN core hub — integrates information across subsystems, autobiographical memory, self-awareness" },
  aMPFC: { x: 105, y: 135, sub: "core", full: "Anterior Medial Prefrontal Cortex",   desc: "DMN core hub — self-referential evaluation, personal significance" },
  dMPFC: { x: 120, y: 78,  sub: "dm",   full: "Dorsomedial Prefrontal Cortex",       desc: "Mentalizing subsystem — serves BOTH self-referential processing and ToM (Moran 2013). Dual-use is what makes the competition possible" },
  TPJ:   { x: 290, y: 105, sub: "dm",   full: "Temporoparietal Junction",            desc: "Mentalizing subsystem — perspective-taking, other-focused inference, self–other distinction" },
  LTC:   { x: 310, y: 155, sub: "dm",   full: "Lateral Temporal Cortex",             desc: "Mentalizing subsystem — semantic social knowledge, narrative comprehension" },
  HPC:   { x: 210, y: 195, sub: "mtl",  full: "Hippocampus",                         desc: "MTL subsystem — episodic memory retrieval, autobiographical recall, scene construction" },
  PHC:   { x: 250, y: 210, sub: "mtl",  full: "Parahippocampal Cortex",              desc: "MTL subsystem — contextual/scene processing, spatial memory encoding" },
  Rsp:   { x: 255, y: 145, sub: "mtl",  full: "Retrosplenial Cortex",                desc: "MTL subsystem — spatial context, memory-imagination interface" },
  sgACC: { x: 130, y: 178, sub: "aff",  full: "Subgenual Anterior Cingulate Cortex", desc: "Affective processing — dysregulated in MDD, linked to negative mood and emotional withdrawal" },
};

// ── CONNECTION VISUAL STYLES ──
const CS = {
  normal:  { color: "#5A6A7A", dash: "6,4",  width: 1.5, label: "Normal" },
  hyper:   { color: "#22C55E", dash: "none",  width: 2.8, label: "Hyperconnected" },
  reduced: { color: "#EF4444", dash: "8,5",   width: 2.2, label: "Decoupled" },
};

// ── EDGE DETAIL LOOKUP (every edge, every condition, sourced) ──
const EDGE_INFO = {
  state: {
    hc: {
      "PCC–aMPFC":  { status: "Normal", detail: "Core-to-core coupling not reported as specifically altered during rumination induction in HC.", source: "Chen 2020 — not highlighted", v: true },
      "PCC–HPC":    { status: "↑ Hyperconnected", detail: "Core–MTL coupling INCREASES during induced rumination. Autobiographical memory retrieval gets yoked to the self-referential core — the brain pulls past experiences into the ruminative loop.", source: "Chen et al. 2020 — significant increase, core–MTL FC, rumination vs. distraction", v: true },
      "PCC–dMPFC":  { status: "↓ Decoupled", detail: "Core–dMPFC coupling DECREASES during induced rumination. The mentalizing subsystem disengages from the core even as dMPFC itself activates more. Working harder, but in isolation.", source: "Chen et al. 2020 — significant decrease, core–dMPFC FC, rumination vs. distraction", v: true },
      "HPC–PHC":    { status: "↓ Decoupled", detail: "Within-MTL connectivity DECREASES during rumination. Even as hippocampus couples more tightly to core (self-focus), its normal integration with parahippocampal context processing weakens.", source: "Chen et al. 2020 — 'decreased FC within MTL subsystem itself'", v: true },
      "dMPFC–TPJ":  { status: "Normal", detail: "No change reported within dorsomedial subsystem during HC state rumination. The within-subsystem circuit stays at baseline.", source: "Not tested in Chen 2020; assumed baseline", v: false },
    },
    mdd: {
      "PCC–sgACC":  { status: "↑ Hyperconnected", detail: "MDD-SPECIFIC and the ONLY fully verified MDD state edge: During induced rumination, PCC connectivity to subgenual cingulate INCREASES in depression. Negative affect gets wired into the core ruminative loop.", source: "State-vs-Trait review — 'induced rumination in depression increases PCC-seeded connectivity with subgenual cingulate'", v: true },
      "PCC–HPC":    { status: "↑ Hyperconnected", detail: "⚠ INFERRED from HC pattern. Core–MTL increase is verified in HC (Chen 2020) but NOT directly confirmed at subsystem level during MDD state induction. The literature warns: 'direction and localization of effects are more heterogeneous' in depressed samples, and 'chronic MDD can show opposite-direction PCC changes.'", source: "Inferred from Chen 2020 (HC only). State-vs-Trait review explicitly cautions against generalizing to MDD.", v: false },
      "PCC–dMPFC":  { status: "↓ Decoupled", detail: "⚠ PARTIALLY INFERRED. Core–dMPFC decrease is verified in HC state (Chen 2020) and ALSO seen as a baseline group difference in MDD (Zhu 2017 trait). The convergence across both contexts suggests this edge is plausibly reduced during MDD state induction, but no study directly confirms it during active MDD rumination.", source: "Chen 2020 (HC state) + Zhu 2017 (MDD trait baseline) — convergent but not directly tested in MDD state", v: false },
      "PCC–aMPFC":  { status: "Normal", detail: "Core-to-core coupling not specifically reported as altered in MDD state induction.", source: "Not highlighted in available MDD induction findings", v: true },
      "dMPFC–TPJ":  { status: "↓ Decoupled", detail: "⚠ YOUR HYPOTHESIS — not reported in any paper. If dMPFC is consumed by self-referential processing during rumination, its connectivity to TPJ (the other-focused mentalizing node) should weaken. This is literally the untested prediction your study would test.", source: "Author inference. No paper reports this edge during state rumination.", v: false },
      "HPC–PHC":    { status: "↓ Decoupled", detail: "⚠ INFERRED from HC pattern + shared reconfiguration assumption. Within-MTL decrease verified in HC (Chen 2020) but not directly in MDD state induction.", source: "Inferred from Chen 2020 (HC only)", v: false },
    },
  },
  trait: {
    hc: {
      "PCC–aMPFC":  { status: "Normal", detail: "Healthy resting-state baseline. Core hubs normally coupled.", source: "Baseline — no pathology", v: true },
      "PCC–dMPFC":  { status: "Normal", detail: "Core-to-dorsomedial coupling intact at healthy baseline.", source: "Baseline", v: true },
      "PCC–HPC":    { status: "Normal", detail: "Core-to-MTL coupling balanced at healthy baseline.", source: "Baseline", v: true },
      "dMPFC–TPJ":  { status: "Normal", detail: "Within dorsomedial subsystem normally connected.", source: "Baseline", v: true },
      "HPC–PHC":    { status: "Normal", detail: "Within MTL subsystem normally connected.", source: "Baseline", v: true },
    },
    mdd: {
      "PCC–aMPFC":  { status: "Normal", detail: "Core-to-core not specifically reported as altered in trait rumination.", source: "Zhu 2017 — focus was subsystem-level cross-edges", v: true },
      "PCC–dMPFC":  { status: "↓ Decoupled", detail: "Core–dMPFC coupling DECREASES in first-episode MDD compared to HC. The mentalizing subsystem pulls away from core integration at rest — a tonic baseline disconnection, not just a task-evoked pattern.", source: "Zhu et al. 2017 — 'decreased connectivity between midline core and dMPFC subsystems'", v: true },
      "PCC–sgACC":  { status: "↑ Hyperconnected", detail: "Most RELIABLE trait marker in the entire literature: PCC–sgACC coupling increases in MDD and positively correlates with RRS brooding. Present during rest but NOT during task engagement. Multiple independent replications.", source: "Multiple studies + review synthesis — 'highly reliable DMN–sgPFC hyperconnectivity in MDD'; PCC–sgACC correlates with RRS brooding", v: true },
      "dMPFC–HPC":  { status: "↑ Hyperconnected", detail: "Cross-subsystem coupling between dorsomedial (mentalizing) and MTL (memory) INCREASES in first-episode MDD. The mentalizing system becomes abnormally fused with memory retrieval — rigid integration where healthy brains stay flexible.", source: "Zhu et al. 2017 — 'increased dMPFC–MTL inter-system connectivity'", v: true },
      "dMPFC–LTC":  { status: "↑ Hyperconnected", detail: "Within-dMPFC subsystem connectivity INCREASES in MDD. The semantic social knowledge node (LTC) becomes more tightly coupled with the dorsomedial hub.", source: "Zhu et al. 2017 — 'increased within-system connectivity in dMPFC subsystem'", v: true },
      "LTC–PHC":    { status: "↑ Hyperconnected", detail: "Cross-subsystem edge: dMPFC subsystem (LTC) → MTL subsystem (PHC). One of the specific edges correlated with RSQ-rumination scores in MDD. The tighter this semantic–memory bridge, the more you ruminate.", source: "Zhu 2017; State-vs-Trait review — 'RSQ-rumination correlated positively with LTC–PHC'", v: true },
      "dMPFC–TPJ":  { status: "Normal", detail: "TPJ not specifically reported as having altered connectivity to dMPFC in trait rumination. The dMPFC subsystem's trait-level hyperconnectivity routes to MTL nodes, not to TPJ.", source: "Zhu 2017 — TPJ not highlighted in rumination-correlated edges", v: true },
      "HPC–PHC":    { status: "Normal", detail: "Within-MTL connectivity not reported as altered in trait MDD. The cross-subsystem routes (dMPFC→MTL) carry the trait signal, not within-MTL edges.", source: "Not highlighted in Zhu 2017", v: true },
    },
  },
};

// ── ACTIVATION DETAILS ──
const ACT_INFO = {
  state: {
    hc: {
      dMPFC: "Activation ↑ during rumination across healthy samples. Works HARDER during self-focus — but decouples from the core. The activation–connectivity dissociation is the mechanistic crux. (Zhou et al. 2020 meta-analysis)",
      HPC:   "Activation ↑ during rumination — episodic memory retrieval engaged for autobiographical content. (Zhou et al. 2020 meta-analysis)",
    },
    mdd: {
      dMPFC: "Activation ↑ — same pattern as HC. Rumination drives dMPFC activation regardless of diagnosis. (Zhou 2020 meta-analysis; note: activation meta-analyses mostly healthy samples)",
      HPC:   "Activation ↑ — memory retrieval engaged. Same as HC pattern.",
      PCC:   "Hyperactivation in MDD during induced rumination — PCC-centered hyperconnectivity reported. (State-vs-Trait review: 'PCC hyperconnectivity during induced rumination in depression')",
      sgACC: "Activation ↑ in MDD — affective node persistently engaged. 'sgACC hyperconnectivity with DMN is a hallmark of rumination' in depression. (Neural Mechanisms review)",
    },
  },
  trait: { hc: {}, mdd: {} },
};

// ── TONIC HIGHLIGHT (trait: tonically altered resting-state nodes, NOT activation) ──
const TONIC = {
  state: { hc: [], mdd: [] },
  trait: { hc: [], mdd: ["sgACC", "dMPFC"] },
};

// ── CONDITION DATA ──
const DATA = {
  state: {
    label: "State Rumination (During Induction)",
    subtitle: "Experimentally induced — what happens DURING an active rumination episode",
    sources: "Chen 2020 (HC connectivity); Zhou 2020 (activation meta-analysis); State-vs-Trait review (MDD induction)",
    hc: {
      label: "Healthy Controls",
      activations: ["dMPFC", "HPC"],
      connections: [
        { from: "PCC", to: "aMPFC", type: "normal" },
        { from: "PCC", to: "HPC",   type: "hyper" },
        { from: "PCC", to: "dMPFC", type: "reduced" },
        { from: "HPC", to: "PHC",   type: "reduced" },
        { from: "dMPFC", to: "TPJ", type: "normal" },
      ],
      narrative: "During active rumination in HC: dMPFC activates MORE but decouples from core. Memory systems (MTL) get pulled toward self-focused retrieval. The dMPFC is working harder but in isolation — consumed by self-referential processing. All edges here are directly verified from Chen 2020.",
    },
    mdd: {
      label: "MDD Patients",
      activations: ["dMPFC", "HPC", "PCC", "sgACC"],
      connections: [
        { from: "PCC", to: "aMPFC", type: "normal" },
        { from: "PCC", to: "HPC",   type: "hyper" },
        { from: "PCC", to: "dMPFC", type: "reduced" },
        { from: "dMPFC", to: "TPJ", type: "reduced" },
        { from: "HPC", to: "PHC",   type: "reduced" },
        { from: "PCC", to: "sgACC", type: "hyper" },
      ],
      narrative: "⚠ HONESTY NOTE: Only PCC–sgACC hyperconnectivity is directly verified for MDD during state induction. The subsystem pattern (core–MTL ↑, core–dMPFC ↓, within-MTL ↓) comes from Chen 2020 in HC. The State-vs-Trait review warns MDD induction findings are 'more heterogeneous' and chronic MDD can show 'opposite-direction changes.' Edges marked ⚠ on hover are inferred from HC.",
    },
  },
  trait: {
    label: "Trait Rumination (Resting State)",
    subtitle: "Questionnaire-measured (RRS/RSQ) — stable tendency, not an active episode",
    sources: "Zhu 2017 (first-episode MDD); Tozzi 2021 (null finding); multiple reviews (sgACC)",
    hc: {
      label: "Healthy Controls",
      activations: [],
      connections: [
        { from: "PCC", to: "aMPFC", type: "normal" },
        { from: "PCC", to: "dMPFC", type: "normal" },
        { from: "PCC", to: "HPC",   type: "normal" },
        { from: "dMPFC", to: "TPJ", type: "normal" },
        { from: "HPC", to: "PHC",   type: "normal" },
      ],
      narrative: "Balanced connectivity across DMN subsystems at rest. No abnormal sgACC involvement. This is the baseline your study compares against.",
    },
    mdd: {
      label: "MDD (High Trait Rumination)",
      activations: [],
      connections: [
        { from: "PCC", to: "aMPFC", type: "normal" },
        { from: "PCC", to: "dMPFC", type: "reduced" },
        { from: "PCC", to: "sgACC", type: "hyper" },
        { from: "dMPFC", to: "HPC", type: "hyper" },
        { from: "dMPFC", to: "LTC", type: "hyper" },
        { from: "LTC", to: "PHC",   type: "hyper" },
        { from: "dMPFC", to: "TPJ", type: "normal" },
        { from: "HPC", to: "PHC",   type: "normal" },
      ],
      narrative: "Trait signature: PCC–sgACC hyperconnectivity (most reliable marker, predicts brooding). dMPFC subsystem shows increased internal connectivity AND increased coupling to MTL — including the LTC–PHC cross-subsystem edge correlated with RSQ-rumination (Zhu 2017). BUT: Tozzi (2021) found trait rumination did NOT predict subsystem connectivity in a large independent sample. Trait patterns are real but inconsistent.",
    },
  },
};

// ── SUMMARY TABLES ──
const STATE_ACT = [
  { region: "dMPFC", hc: "Activation ↑ (Zhou 2020)", mdd: "Activation ↑ — same as HC" },
  { region: "HPC", hc: "Activation ↑ — memory retrieval", mdd: "Activation ↑ — memory retrieval" },
  { region: "PCC", hc: "—", mdd: "Hyperactivation (some MDD induction studies)" },
  { region: "sgACC", hc: "—", mdd: "Activation ↑ — affective node engaged" },
];
const STATE_FC = [
  { edge: "PCC–aMPFC", hc: "Normal", mdd: "Normal" },
  { edge: "PCC–HPC", hc: "↑ Hyperconnected (Chen 2020) ✓", mdd: "↑ Hyper ⚠ INFERRED from HC" },
  { edge: "PCC–dMPFC", hc: "↓ Decoupled (Chen 2020) ✓", mdd: "↓ Decoupled ⚠ partially inferred" },
  { edge: "dMPFC–TPJ", hc: "Normal", mdd: "↓ Decoupled ⚠ YOUR HYPOTHESIS" },
  { edge: "HPC–PHC", hc: "↓ Decoupled (Chen 2020) ✓", mdd: "↓ Decoupled ⚠ INFERRED from HC" },
  { edge: "PCC–sgACC", hc: "—", mdd: "↑ Hyperconnected ✓ VERIFIED" },
];
const TRAIT_FC = [
  { edge: "PCC–aMPFC", hc: "Normal", mdd: "Normal" },
  { edge: "PCC–dMPFC", hc: "Normal", mdd: "↓ Decoupled (Zhu 2017) ✓" },
  { edge: "PCC–sgACC", hc: "—", mdd: "↑ Hyperconnected (multiple) ✓" },
  { edge: "dMPFC–HPC", hc: "—", mdd: "↑ Hyperconnected (Zhu 2017) ✓" },
  { edge: "dMPFC–LTC", hc: "—", mdd: "↑ Hyperconnected (Zhu 2017) ✓" },
  { edge: "LTC–PHC", hc: "—", mdd: "↑ Hyperconnected (Zhu 2017; RSQ-correlated) ✓" },
  { edge: "dMPFC–TPJ", hc: "Normal", mdd: "Normal" },
];

const NOTES = {
  state: {
    title: "Why This Matters — and What's Honest vs. Inferred",
    text: `The activation–connectivity dissociation is the core of your argument. The dMPFC activates more during rumination (Zhou 2020) but decouples from the DMN core (Chen 2020) — working harder, working alone, consumed by self-referential processing. Meanwhile the memory subsystem gets yoked to the core. The dMPFC also supports mentalizing. If it's hijacked for self-focus, that's your mechanism: not structural damage, but competitive displacement.

⚠ CRITICAL CAVEAT: The subsystem reconfiguration is verified ONLY in healthy controls (Chen 2020). For MDD, the literature explicitly warns that induction findings are "more heterogeneous" — chronic MDD can even show opposite-direction PCC changes. The only verified MDD state edge is PCC–sgACC hyperconnectivity. The MDD panel above assumes MDD shares the HC reconfiguration pattern; that assumption IS your study rationale, but it is not confirmed.

The gap: Nobody has given participants a ToM task while these connectivity patterns were active. That's Claim A.`,
  },
  trait: {
    title: "The Trait Landscape — Better Verified, Messier Implications",
    text: `The trait MDD picture is actually better verified at edge level than the MDD state picture. Zhu (2017) reports specific subsystem-level edges in first-episode drug-naïve MDD: core–dMPFC ↓, within-dMPFC ↑, dMPFC–MTL ↑, with LTC–PHC and dMPFC–TempP edges specifically correlated with RSQ-rumination scores. PCC–sgACC hyperconnectivity as a brooding marker has multiple independent replications.

But Tozzi (2021) couldn't find trait rumination predicting subsystem connectivity in a large independent sample. Trait patterns are real in Zhu's first-episode sample but may not generalize.

State vs. trait may work through different edges entirely: sgACC–PCC for trait, core–dMPFC/core–MTL for state. Your state-induction design tests the cleaner mechanism. Collecting RRS alongside lets you test whether trait tendency moderates the state effect.`,
  },
};

// ── CURVE GEOMETRY ──
const getCurve = (from, to) => {
  const r1 = REGIONS[from], r2 = REGIONS[to];
  if (!r1 || !r2) return null;
  const dx = r2.x - r1.x, dy = r2.y - r1.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  const curveAmt = Math.min(dist * 0.22, 34);
  const mx = (r1.x + r2.x) / 2, my = (r1.y + r2.y) / 2;
  const cx = mx + (-uy) * curveAmt, cy = my + ux * curveAmt;
  const off = 18;
  const sx = r1.x + ux * off, sy = r1.y + uy * off;
  const ex = r2.x - ux * off, ey = r2.y - uy * off;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
};

// ── SVG BRAIN OUTLINE ──
const BrainOutline = ({ uid }) => (
  <g>
    <defs>
      <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1A2940" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#0D1520" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <path d="M 80 230 C 60 210, 45 185, 42 160 C 38 130, 45 100, 60 78 C 75 56, 100 38, 130 30 C 160 22, 195 20, 225 25 C 255 30, 280 40, 300 55 C 320 70, 335 90, 340 115 C 345 140, 340 165, 330 185 C 320 205, 300 225, 278 238 C 258 250, 235 258, 215 262 C 200 265, 185 264, 170 260 C 155 256, 140 250, 128 242 C 115 234, 100 238, 80 230 Z" fill={`url(#bg${uid})`} stroke="#2A3A50" strokeWidth="1.8" />
    <path d="M 125 155 C 145 140, 175 132, 210 133 C 235 134, 250 140, 255 148" fill="none" stroke="#2A3A50" strokeWidth="1.2" opacity="0.4" />
    <path d="M 170 260 C 165 270, 160 285, 162 300 C 163 308, 168 312, 175 310 C 182 308, 185 298, 183 285 C 181 272, 178 262, 175 258" fill="none" stroke="#2A3A50" strokeWidth="1.5" opacity="0.35" />
    <path d="M 230 252 C 240 265, 250 280, 245 295 C 240 305, 225 310, 210 308 C 198 306, 188 300, 185 290 C 182 280, 190 268, 200 260" fill="none" stroke="#2A3A50" strokeWidth="1.2" opacity="0.25" />
    <text x="190" y="302" textAnchor="middle" fill="#1E2D42" fontSize="7.5" fontFamily="monospace" fontWeight="600">MEDIAL VIEW</text>
  </g>
);

// ── CURVED CONNECTION LINE ──
const CurvedConn = ({ edgeKey, from, to, type, isHovered, onHover, onLeave }) => {
  const pathD = getCurve(from, to);
  if (!pathD) return null;
  const s = CS[type];
  return (
    <g>
      <path d={pathD} fill="none" stroke="transparent" strokeWidth={22} onMouseEnter={() => onHover(edgeKey)} onMouseLeave={onLeave} style={{ cursor: "pointer" }} />
      <path d={pathD} fill="none" stroke={s.color} strokeWidth={isHovered ? s.width + 1.8 : s.width} strokeDasharray={s.dash} opacity={isHovered ? 1 : 0.72} strokeLinecap="round" style={{ pointerEvents: "none", transition: "all 0.15s ease" }} />
    </g>
  );
};

// ── REGION NODE ──
const RegionNode = ({ id, x, y, subsystem, isActive, isTonic, isHovered, onHover, onLeave }) => {
  const c = SUB[subsystem].color;
  const r = 16;
  return (
    <g onMouseEnter={() => onHover(id)} onMouseLeave={onLeave} style={{ cursor: "pointer" }}>
      {isActive && (
        <>
          <circle cx={x} cy={y} r={r + 12} fill={c} opacity="0.12" style={{ pointerEvents: "none" }}>
            <animate attributeName="r" values={`${r+8};${r+16};${r+8}`} dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0.06;0.15" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r={r + 6} fill={c} opacity="0.2" style={{ pointerEvents: "none" }}>
            <animate attributeName="r" values={`${r+4};${r+9};${r+4}`} dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      {isTonic && !isActive && (
        <>
          <circle cx={x} cy={y} r={r + 10} fill={c} opacity="0.08" style={{ pointerEvents: "none" }} />
          <circle cx={x} cy={y} r={r + 5} fill={c} opacity="0.15" style={{ pointerEvents: "none" }} />
        </>
      )}
      <circle cx={x} cy={y} r={r} fill={isHovered ? c : `${c}CC`} stroke={isHovered ? "#fff" : c} strokeWidth={isHovered ? 2.5 : 1.5} style={{ transition: "all 0.15s ease" }} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="9" fontWeight="700" fontFamily="monospace" style={{ pointerEvents: "none" }}>{id}</text>
      {isActive && <text x={x + r + 3} y={y - r + 2} fill="#EF4444" fontSize="12" fontWeight="bold" style={{ pointerEvents: "none" }}>▲</text>}
      {isTonic && !isActive && <text x={x + r + 3} y={y - r + 2} fill={c} fontSize="10" fontWeight="bold" style={{ pointerEvents: "none" }}>◆</text>}
    </g>
  );
};

// ── DETAIL BOX CONTENT ──
const DetailBox = ({ hovR, hovRId, hovE, data, tab, side }) => {
  const ei = hovE ? (EDGE_INFO[tab]?.[side]?.[hovE] || null) : null;
  const ai = hovRId && data.activations.includes(hovRId) ? (ACT_INFO[tab]?.[side]?.[hovRId] || null) : null;
  const ti = hovRId && (TONIC[tab]?.[side] || []).includes(hovRId);

  if (hovR) {
    return (
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: SUB[hovR.sub].color, fontFamily: "monospace" }}>{hovRId} — {hovR.full}</div>
        <div style={{ fontSize: 10.5, color: "#8899AA", marginTop: 3, lineHeight: 1.5 }}>{hovR.desc}</div>
        {ai && (
          <div style={{ marginTop: 6, padding: "6px 8px", background: "#12182490", borderRadius: 6, borderLeft: "3px solid #EF4444" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", marginBottom: 2, fontFamily: "monospace" }}>ACTIVATION ▲</div>
            <div style={{ fontSize: 10.5, color: "#B0C0D0", lineHeight: 1.45 }}>{ai}</div>
          </div>
        )}
        {ti && !ai && (
          <div style={{ marginTop: 6, padding: "6px 8px", background: "#12182490", borderRadius: 6, borderLeft: `3px solid ${SUB[hovR.sub].color}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: SUB[hovR.sub].color, marginBottom: 2, fontFamily: "monospace" }}>TONICALLY ALTERED ◆</div>
            <div style={{ fontSize: 10.5, color: "#B0C0D0", lineHeight: 1.45 }}>This node participates in connectivity patterns that are altered at rest in MDD — not an activation change, but a tonic reconfiguration of the resting-state circuit.</div>
          </div>
        )}
      </div>
    );
  }
  if (ei) {
    const sc = ei.status.includes("↑") || ei.status.includes("Hyper") ? "#22C55E" : ei.status.includes("↓") || ei.status.includes("Decoupled") ? "#EF4444" : "#5A6A7A";
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#B0C4DE", fontFamily: "monospace" }}>{hovE}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: sc, fontFamily: "monospace", padding: "1px 6px", background: `${sc}18`, borderRadius: 4 }}>{ei.status}</span>
          {!ei.v && <span style={{ fontSize: 9, fontWeight: 700, color: "#E8A838", fontFamily: "monospace", padding: "1px 5px", background: "#E8A83815", borderRadius: 3 }}>⚠ INFERRED</span>}
          {ei.v && <span style={{ fontSize: 9, fontWeight: 700, color: "#22C55E", fontFamily: "monospace", padding: "1px 5px", background: "#22C55E15", borderRadius: 3 }}>✓ VERIFIED</span>}
        </div>
        <div style={{ fontSize: 10.5, color: "#8899AA", lineHeight: 1.5 }}>{ei.detail}</div>
        <div style={{ marginTop: 5, fontSize: 9.5, color: "#5A7A9A", fontFamily: "monospace", fontStyle: "italic", lineHeight: 1.4 }}>📄 {ei.source}</div>
      </div>
    );
  }
  return <div style={{ fontSize: 10.5, color: "#4A5A6A", fontStyle: "italic" }}>Hover a region or connection line for sourced details</div>;
};

// ── BRAIN PANEL ──
const BrainPanel = ({ data, side, tab }) => {
  const [hovR, setHovR] = useState(null);
  const [hovE, setHovE] = useState(null);
  const rObj = hovR ? REGIONS[hovR] : null;
  const tonicList = TONIC[tab]?.[side] || [];

  return (
    <div style={{ flex: 1, minWidth: 290, background: "linear-gradient(168deg, #0D1520 0%, #111C2C 100%)", borderRadius: 14, border: "1px solid #1E2D42", padding: "14px 12px 12px" }}>
      <div style={{ textAlign: "center", marginBottom: 8, padding: "6px 0", borderBottom: "1px solid #1A2940" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: side === "hc" ? "#8BB8E8" : "#E8A080", letterSpacing: "0.03em" }}>{data.label}</span>
      </div>
      <svg viewBox="20 10 350 310" style={{ width: "100%", height: "auto", maxHeight: 280 }}>
        <BrainOutline uid={`${tab}${side}`} />
        {data.connections.map((c, i) => {
          const key = `${c.from}–${c.to}`;
          return <CurvedConn key={i} edgeKey={key} from={c.from} to={c.to} type={c.type} isHovered={hovE === key} onHover={(k) => { setHovE(k); setHovR(null); }} onLeave={() => setHovE(null)} />;
        })}
        {Object.entries(REGIONS).map(([id, reg]) => (
          <RegionNode key={id} id={id} x={reg.x} y={reg.y} subsystem={reg.sub}
            isActive={data.activations.includes(id)} isTonic={tonicList.includes(id)}
            isHovered={hovR === id} onHover={(r) => { setHovR(r); setHovE(null); }} onLeave={() => setHovR(null)} />
        ))}
      </svg>
      <div style={{ minHeight: 76, padding: "10px 12px", background: "#0A1018", borderRadius: 8, marginTop: 4, border: "1px solid #1A2940" }}>
        <DetailBox hovR={rObj} hovRId={hovR} hovE={hovE} data={data} tab={tab} side={side} />
      </div>
      <div style={{ marginTop: 8, padding: "10px 12px", background: "#0E1722", borderRadius: 8, borderLeft: `3px solid ${side === "hc" ? "#4A90D9" : "#E05555"}`, fontSize: 11, lineHeight: 1.55, color: "#8899AA" }}>
        {data.narrative}
      </div>
    </div>
  );
};

// ── TABLE ──
const Tbl = ({ title, headers, rows }) => (
  <div style={{ marginTop: 20 }}>
    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B0C4DE", marginBottom: 8 }}>{title}</div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace" }}>
        <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "7px 10px", borderBottom: "2px solid #1E2D42", color: "#6A8AAA", fontWeight: 600, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "#0A1018" }}>
            {Object.values(row).map((val, j) => {
              let c = "#8899AA";
              if (typeof val === "string") {
                if (val.includes("↑") || val.includes("Hyper")) c = "#22C55E";
                if (val.includes("↓") || val.includes("Decoupled")) c = "#EF4444";
                if (val.includes("⚠") || val.includes("INFERRED") || val.includes("HYPOTHESIS")) c = "#E8A838";
                if (val === "—") c = "#3A4A5C";
              }
              return <td key={j} style={{ padding: "6px 10px", borderBottom: "1px solid #141E2E", color: c, lineHeight: 1.4 }}>{val}</td>;
            })}
          </tr>
        ))}</tbody>
      </table>
    </div>
  </div>
);

// ── MAIN ──
export default function DMNBrainMap() {
  const [tab, setTab] = useState("state");
  const d = DATA[tab];
  const n = NOTES[tab];

  return (
    <div style={{ background: "#080E18", color: "#C0D0E0", minHeight: "100vh", fontFamily: "'IBM Plex Sans', -apple-system, sans-serif", padding: "20px 16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap');`}</style>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#D0E0F0", margin: 0 }}>DMN Subsystem Connectivity & Activation During Rumination</h1>
        <p style={{ fontSize: 10.5, color: "#5A7A9A", marginTop: 4, fontFamily: "monospace" }}>
          Medial sagittal view — hover regions and connections for sourced details&nbsp;&nbsp;|&nbsp;&nbsp;
          <span style={{ color: "#EF4444" }}>▲</span> activation&nbsp;&nbsp;
          <span style={{ color: "#E8A838" }}>◆</span> tonically altered&nbsp;&nbsp;
          <span style={{ color: "#E8A838" }}>⚠</span> inferred
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, background: "#0A1018", borderRadius: 10, padding: 4, maxWidth: 440, margin: "12px auto" }}>
        {[{ key: "state", label: "State Rumination (Induction)" }, { key: "trait", label: "Trait Rumination (Resting State)" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "9px 14px", border: "none", borderRadius: 8,
            background: tab === t.key ? "#1A2940" : "transparent",
            color: tab === t.key ? "#D0E0F0" : "#5A7A9A",
            fontWeight: tab === t.key ? 700 : 500, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, color: "#8899AA", fontWeight: 600 }}>{d.subtitle}</div>
        <div style={{ fontSize: 10, color: "#4A5A6A", marginTop: 3, fontFamily: "monospace" }}>Sources: {d.sources}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: "12px 14px", background: "#0A1018", borderRadius: 10, border: "1px solid #141E2E", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 9.5, color: "#4A5A6A", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Subsystems</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.values(SUB).map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: "#4A5A6A", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Connections</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(CS).map(([k, c]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="22" height="10"><path d={`M 0 5 Q 11 ${k === "hyper" ? 1 : k === "reduced" ? 1 : 2} 22 5`} fill="none" stroke={c.color} strokeWidth={c.width} strokeDasharray={c.dash} /></svg>
                <span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: "#4A5A6A", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Markers</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: "#EF4444", fontSize: 12, fontWeight: "bold" }}>▲</span><span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>Activation + pulse</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: "#E8A838", fontSize: 11, fontWeight: "bold" }}>◆</span><span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>Tonically altered</span></div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <BrainPanel data={d.hc} side="hc" tab={tab} />
        <BrainPanel data={d.mdd} side="mdd" tab={tab} />
      </div>
      {tab === "state" ? (
        <>
          <Tbl title="Regional Activation Changes" headers={["Region", "HC", "MDD"]} rows={STATE_ACT} />
          <Tbl title="Functional Connectivity Changes" headers={["Edge", "HC", "MDD"]} rows={STATE_FC} />
        </>
      ) : (
        <Tbl title="Functional Connectivity Changes (Resting State)" headers={["Edge", "HC", "MDD"]} rows={TRAIT_FC} />
      )}
      <div style={{ marginTop: 22, padding: "14px 16px", background: "#0D1520", borderRadius: 10, border: "1px solid #1A2940", borderLeft: "4px solid #E8A838" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#E8A838", marginBottom: 6 }}>{n.title}</div>
        <div style={{ fontSize: 11.5, lineHeight: 1.65, color: "#8899AA", whiteSpace: "pre-line" }}>{n.text}</div>
      </div>
      <div style={{ textAlign: "center", marginTop: 20, padding: "10px 0", borderTop: "1px solid #141E2E", fontSize: 9.5, color: "#3A4A5C", fontFamily: "monospace" }}>
        Data sourced from verified papers in the convergence evidence document. ✓ = verified from named source. ⚠ = inferred from HC pattern or author hypothesis.
        <br />TPJ and LTC are lateral structures projected onto the medial view. Regions on approximate medial sagittal positions.
      </div>
    </div>
  );
}
