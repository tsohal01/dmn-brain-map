import { useState } from "react";

const SUB = {
  core: { label: "DMN Core", color: "#4A90D9" },
  dm:   { label: "Dorsomedial (Mentalizing)", color: "#E8A838" },
  mtl:  { label: "MTL (Memory)", color: "#7B68EE" },
  aff:  { label: "Affective Node", color: "#E05555" },
};

const REGIONS = {
  PCC:   { x: 235, y: 115, sub: "core", full: "Posterior Cingulate Cortex",          desc: "DMN core hub. Integrates information across subsystems; involved in autobiographical memory and self-awareness." },
  aMPFC: { x: 105, y: 135, sub: "core", full: "Anterior Medial Prefrontal Cortex",   desc: "DMN core hub. Supports self-referential evaluation and judgments of personal significance." },
  dMPFC: { x: 120, y: 78,  sub: "dm",   full: "Dorsomedial Prefrontal Cortex",       desc: "Mentalizing subsystem. Serves both self-referential processing and theory of mind (Moran 2013). This dual role is what makes competitive displacement between the two functions plausible." },
  TPJ:   { x: 290, y: 105, sub: "dm",   full: "Temporoparietal Junction",            desc: "Mentalizing subsystem. Supports perspective-taking, other-focused inference, and self–other distinction." },
  LTC:   { x: 310, y: 155, sub: "dm",   full: "Lateral Temporal Cortex",             desc: "Mentalizing subsystem. Involved in semantic social knowledge and narrative comprehension." },
  HPC:   { x: 210, y: 195, sub: "mtl",  full: "Hippocampus",                         desc: "MTL subsystem. Episodic memory retrieval, autobiographical recall, and scene construction for mental simulation." },
  PHC:   { x: 250, y: 210, sub: "mtl",  full: "Parahippocampal Cortex",              desc: "MTL subsystem. Contextual and scene processing, spatial memory encoding." },
  Rsp:   { x: 255, y: 145, sub: "mtl",  full: "Retrosplenial Cortex",                desc: "MTL subsystem. Spatial context processing and memory–imagination interface. Listed as an MTL node in both Chen (2020) and Zhu (2017) parcellations, but no study in this evidence base reports a specific Rsp edge. Included here as a subsystem member without individual connectivity data.", dimmed: true },
  sgACC: { x: 130, y: 178, sub: "aff",  full: "Subgenual Anterior Cingulate Cortex", desc: "Affective processing node. Dysregulated in depression; linked to negative mood and emotional withdrawal." },
};

const CS = {
  normal:  { color: "#5A6A7A", dash: "6,4",  width: 1.5,  label: "Normal" },
  hyper:   { color: "#22C55E", dash: "none",  width: 2.8, label: "Hyperconnected" },
  reduced: { color: "#EF4444", dash: "8,5",   width: 2.2, label: "Decoupled" },
};

const EDGE_INFO = {
  state: {
    hc: {
      "PCC–aMPFC":  { status: "Normal", detail: "Core-to-core coupling was not reported as specifically altered during rumination induction in healthy controls.", source: "Chen 2020 — not highlighted as changed", v: true },
      "PCC–HPC":    { status: "↑ Hyperconnected", detail: "Core–MTL coupling increased during induced rumination. Autobiographical memory retrieval becomes more tightly linked to the self-referential core during the ruminative episode.", source: "Chen et al. 2020 — significant increase in core–MTL FC during rumination vs. distraction", v: true },
      "PCC–dMPFC":  { status: "↓ Decoupled", detail: "Core–dMPFC coupling decreased during induced rumination. The mentalizing subsystem disengaged from the core, even though dMPFC activation itself increased — a dissociation between activation and connectivity.", source: "Chen et al. 2020 — significant decrease in core–dMPFC FC during rumination vs. distraction", v: true },
      "HPC–PHC":    { status: "↓ Decoupled", detail: "Within-MTL connectivity decreased during rumination. Even as hippocampus coupled more tightly with the core for self-focused retrieval, its normal integration with parahippocampal context processing weakened.", source: "Chen et al. 2020 — 'decreased FC within MTL subsystem itself'", v: true },
      "dMPFC–TPJ":  { status: "Normal", detail: "No change was reported within the dorsomedial subsystem during healthy-control state rumination. Within-subsystem coupling appears to stay at baseline.", source: "Not tested in Chen 2020; assumed baseline", v: false },
    },
    mdd: {
      "PCC–sgACC":  { status: "↑ Hyperconnected", detail: "The only directly verified MDD state-induction edge: during induced rumination, PCC connectivity to subgenual cingulate increased in depressed participants. This routes negative affect into the core ruminative circuit.", source: "State-vs-Trait review — 'induced rumination in depression increases PCC-seeded connectivity with subgenual cingulate'", v: true },
      "PCC–HPC":    { status: "↑ Hyperconnected", detail: "Inferred from the healthy-control pattern. Core–MTL increase is verified in HC (Chen 2020) but not directly confirmed at subsystem level during MDD state induction. The literature notes that 'direction and localization of effects are more heterogeneous' in depressed samples, and that chronic MDD can show opposite-direction PCC changes.", source: "Inferred from Chen 2020 (HC only). State-vs-Trait review cautions against generalizing to MDD.", v: false },
      "PCC–dMPFC":  { status: "↓ Decoupled", detail: "Partially inferred. Core–dMPFC decrease is verified in HC state induction (Chen 2020) and also appears as a baseline group difference in MDD (Zhu 2017, trait). The convergence suggests this edge is plausibly reduced during MDD state induction, but no study directly confirms it during active rumination in a depressed sample.", source: "Chen 2020 (HC state) + Zhu 2017 (MDD trait baseline) — convergent but not directly tested in MDD state", v: false },
      "PCC–aMPFC":  { status: "Normal", detail: "Core-to-core coupling was not specifically reported as altered during MDD state induction.", source: "Not highlighted in available MDD induction findings", v: true },
      "dMPFC–TPJ":  { status: "↓ Decoupled", detail: "Untested prediction. If dMPFC is occupied by self-referential processing during rumination, its connectivity to TPJ (the other-focused mentalizing node) would be expected to weaken. No paper reports this edge during state rumination — this is the gap a concurrent ToM task would address.", source: "Not reported in any paper. This is the proposed study's central prediction.", v: false },
      "HPC–PHC":    { status: "↓ Decoupled", detail: "Inferred from the HC pattern. Within-MTL decrease was verified in healthy controls (Chen 2020) but not directly tested during MDD state induction.", source: "Inferred from Chen 2020 (HC only)", v: false },
    },
  },
  trait: {
    hc: {
      "PCC–aMPFC":  { status: "Normal", detail: "Healthy resting-state baseline. Core hubs normally coupled.", source: "Baseline — no pathology reported", v: true },
      "PCC–dMPFC":  { status: "Normal", detail: "Core-to-dorsomedial coupling intact at healthy baseline.", source: "Baseline", v: true },
      "PCC–HPC":    { status: "Normal", detail: "Core-to-MTL coupling balanced at healthy baseline.", source: "Baseline", v: true },
      "dMPFC–TPJ":  { status: "Normal", detail: "Dorsomedial subsystem internally connected at baseline.", source: "Baseline", v: true },
      "HPC–PHC":    { status: "Normal", detail: "MTL subsystem internally connected at baseline.", source: "Baseline", v: true },
    },
    mdd: {
      "PCC–aMPFC":  { status: "Normal", detail: "Core-to-core coupling not specifically reported as altered in trait rumination.", source: "Zhu 2017 — focus was on subsystem-level cross-edges", v: true },
      "PCC–dMPFC":  { status: "↓ Decoupled", detail: "Core–dMPFC coupling was decreased in first-episode MDD compared to healthy controls. The mentalizing subsystem shows reduced integration with the core at rest — a tonic baseline disconnection rather than a task-evoked pattern.", source: "Zhu et al. 2017 — 'decreased connectivity between midline core and dMPFC subsystems'", v: true },
      "PCC–sgACC":  { status: "↑ Hyperconnected", detail: "The most reliable trait marker in the literature. PCC–sgACC coupling is increased in MDD and positively correlates with RRS brooding scores. This effect is present during rest but not during task engagement, and has been replicated across multiple independent studies.", source: "Multiple studies + review synthesis — 'highly reliable DMN–sgPFC hyperconnectivity in MDD'; PCC–sgACC correlates with RRS brooding", v: true },
      "dMPFC–HPC":  { status: "↑ Hyperconnected", detail: "Cross-subsystem coupling between dorsomedial (mentalizing) and MTL (memory) was increased in first-episode MDD. The mentalizing system becomes more tightly fused with memory retrieval at rest — a rigid integration pattern where healthy brains maintain more flexible coupling.", source: "Zhu et al. 2017 — 'increased dMPFC–MTL inter-system connectivity'", v: true },
      "dMPFC–LTC":  { status: "↑ Hyperconnected", detail: "Within-dMPFC subsystem connectivity was increased in MDD. The semantic social knowledge node (LTC) showed tighter coupling with the dorsomedial hub at rest.", source: "Zhu et al. 2017 — 'increased within-system connectivity in dMPFC subsystem'", v: true },
      "LTC–PHC":    { status: "↑ Hyperconnected", detail: "A cross-subsystem edge connecting the dMPFC subsystem (LTC) to the MTL subsystem (PHC). One of the specific edges correlated with RSQ-rumination scores in MDD — higher trait rumination was associated with tighter coupling on this semantic–memory bridge.", source: "Zhu 2017; State-vs-Trait review — 'RSQ-rumination correlated positively with LTC–PHC'", v: true },
      "dMPFC–TPJ":  { status: "Normal", detail: "TPJ was not specifically reported as having altered connectivity to dMPFC in trait rumination. The dMPFC subsystem's trait-level hyperconnectivity primarily routes to MTL nodes rather than to TPJ.", source: "Zhu 2017 — TPJ not highlighted in rumination-correlated edges", v: true },
      "HPC–PHC":    { status: "Normal", detail: "Within-MTL connectivity was not reported as altered in trait MDD. The cross-subsystem routes (dMPFC to MTL) carry the trait signal rather than within-MTL edges.", source: "Not highlighted in Zhu 2017", v: true },
    },
  },
};

const ACT_INFO = {
  state: {
    hc: {
      dMPFC: "Activation increased during rumination tasks across healthy samples. The region shows greater engagement during self-focus while simultaneously decoupling from the core — the activation–connectivity dissociation is the central mechanistic observation. (Zhou et al. 2020 meta-analysis)",
      HPC:   "Activation increased during rumination, reflecting episodic memory retrieval for autobiographical content. (Zhou et al. 2020 meta-analysis)",
    },
    mdd: {
      dMPFC: "Activation increased, matching the healthy-control pattern. Rumination drives dMPFC activation regardless of diagnosis. Note: activation meta-analyses are drawn mostly from healthy samples. (Zhou 2020 meta-analysis)",
      HPC:   "Activation increased — memory retrieval engaged, consistent with the HC pattern.",
      PCC:   "Hyperactivation reported in some MDD induction studies, with PCC-centered hyperconnectivity during induced rumination. (State-vs-Trait review)",
      sgACC: "Activation increased in MDD, with the affective node persistently engaged. sgACC hyperconnectivity with DMN has been described as a hallmark of depressive rumination. (Neural Mechanisms review)",
    },
  },
  trait: { hc: {}, mdd: {} },
};

const TONIC = {
  state: { hc: [], mdd: [] },
  trait: { hc: [], mdd: ["sgACC", "dMPFC"] },
};

const DATA = {
  state: {
    label: "State Rumination (During Induction)",
    subtitle: "Experimentally induced — connectivity and activation during an active rumination episode",
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
      narrative: "During active rumination in healthy controls, dMPFC activation increases while its coupling with the core decreases. Memory systems (MTL) become more tightly linked to the core for self-focused retrieval. The result is a subsystem reconfiguration: stronger core–memory coupling at the expense of core–mentalizing integration. All edges here are directly verified from Chen 2020.",
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
      narrative: "Note on verification: only PCC–sgACC hyperconnectivity is directly verified for MDD during state induction. The subsystem reconfiguration pattern (core–MTL increased, core–dMPFC decreased, within-MTL decreased) comes from Chen 2020 in healthy controls. The State-vs-Trait review notes that MDD induction findings are 'more heterogeneous' and that chronic MDD can show opposite-direction changes. Edges marked with ⚠ on hover are inferred from the HC pattern.",
    },
  },
  trait: {
    label: "Trait Rumination (Resting State)",
    subtitle: "Questionnaire-measured (RRS/RSQ) — stable tendency assessed outside the scanner",
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
      narrative: "Balanced connectivity across DMN subsystems at rest. No abnormal sgACC involvement. This serves as the baseline comparison.",
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
      narrative: "Trait signature: PCC–sgACC hyperconnectivity is the most reliable marker, predicting brooding scores. The dMPFC subsystem shows increased internal connectivity and increased coupling to MTL, including the LTC–PHC cross-subsystem edge correlated with RSQ-rumination (Zhu 2017). However, Tozzi (2021) found that trait rumination did not predict subsystem connectivity in a large independent sample. These patterns are real in first-episode MDD but may not generalize.",
    },
  },
};

const STATE_ACT = [
  { region: "dMPFC", hc: "Activation increased (Zhou 2020)", mdd: "Activation increased — same as HC" },
  { region: "HPC", hc: "Activation increased — memory retrieval", mdd: "Activation increased — memory retrieval" },
  { region: "PCC", hc: "—", mdd: "Hyperactivation (some MDD induction studies)" },
  { region: "sgACC", hc: "—", mdd: "Activation increased — affective node engaged" },
];
const STATE_FC = [
  { edge: "PCC–aMPFC", hc: "Normal", mdd: "Normal" },
  { edge: "PCC–HPC", hc: "Increased (Chen 2020) ✓", mdd: "Increased — inferred from HC ⚠" },
  { edge: "PCC–dMPFC", hc: "Decreased (Chen 2020) ✓", mdd: "Decreased — partially inferred ⚠" },
  { edge: "dMPFC–TPJ", hc: "Normal", mdd: "Decreased — untested prediction ⚠" },
  { edge: "HPC–PHC", hc: "Decreased (Chen 2020) ✓", mdd: "Decreased — inferred from HC ⚠" },
  { edge: "PCC–sgACC", hc: "—", mdd: "Increased ✓ verified" },
];
const TRAIT_FC = [
  { edge: "PCC–aMPFC", hc: "Normal", mdd: "Normal" },
  { edge: "PCC–dMPFC", hc: "Normal", mdd: "Decreased (Zhu 2017) ✓" },
  { edge: "PCC–sgACC", hc: "—", mdd: "Increased (multiple replications) ✓" },
  { edge: "dMPFC–HPC", hc: "—", mdd: "Increased (Zhu 2017) ✓" },
  { edge: "dMPFC–LTC", hc: "—", mdd: "Increased (Zhu 2017) ✓" },
  { edge: "LTC–PHC", hc: "—", mdd: "Increased (Zhu 2017; RSQ-correlated) ✓" },
  { edge: "dMPFC–TPJ", hc: "Normal", mdd: "Normal" },
];

const NOTES = {
  state: {
    title: "What's Verified vs. Inferred",
    text: `The activation–connectivity dissociation is the central observation: dMPFC activation increases during rumination (Zhou 2020), but its coupling with the DMN core decreases (Chen 2020). The region is more active, yet more isolated from the network it usually integrates with. At the same time, the memory subsystem becomes more tightly linked to the core, supporting self-focused retrieval. Because dMPFC also supports mentalizing, this pattern suggests a competitive displacement mechanism — not structural damage to mentalizing regions, but reduced availability during self-referential episodes.

However, the subsystem reconfiguration is verified only in healthy controls (Chen 2020). For MDD, the literature explicitly warns that induction findings are "more heterogeneous," and that chronic MDD can show opposite-direction PCC changes compared to controls. The only verified MDD state edge is PCC–sgACC hyperconnectivity. The MDD panel above assumes that MDD shares the HC reconfiguration pattern; that assumption motivates the proposed study but is not yet confirmed.

The key gap: no study has administered a ToM task while these connectivity patterns were active. That is the central test.`,
  },
  trait: {
    title: "Trait Findings — Better Verified, Messier Implications",
    text: `The trait MDD picture is actually better verified at edge level than the MDD state picture. Zhu (2017) reports specific subsystem-level edges in first-episode drug-naïve MDD: core–dMPFC decreased, within-dMPFC increased, dMPFC–MTL increased, with the LTC–PHC and dMPFC–TempP edges specifically correlated with RSQ-rumination scores. PCC–sgACC hyperconnectivity as a brooding marker has been replicated across multiple independent studies.

That said, Tozzi (2021) could not find trait rumination predicting subsystem connectivity in a large independent sample. These patterns are real in Zhu's first-episode sample but may not generalize across clinical populations.

State and trait rumination may operate through different edges: sgACC–PCC for trait versus core–dMPFC and core–MTL for state. A state-induction design tests the more tractable mechanism. Collecting RRS alongside the induction makes it possible to test whether trait tendency moderates the state effect, bridging toward the cumulative account without requiring a longitudinal design.`,
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
  return `M ${r1.x + ux * off} ${r1.y + uy * off} Q ${cx} ${cy} ${r2.x - ux * off} ${r2.y - uy * off}`;
};

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

const RegionNode = ({ id, x, y, subsystem, isActive, isTonic, isDimmed, isHovered, onHover, onLeave }) => {
  const c = SUB[subsystem].color;
  const r = isDimmed ? 11 : 16;
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
      <circle cx={x} cy={y} r={r}
        fill={isDimmed ? `${c}55` : isHovered ? c : `${c}CC`}
        stroke={isDimmed ? `${c}66` : isHovered ? "#fff" : c}
        strokeWidth={isDimmed ? 1 : isHovered ? 2.5 : 1.5}
        strokeDasharray={isDimmed ? "3,2" : "none"}
        style={{ transition: "all 0.15s ease" }}
      />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central"
        fill={isDimmed ? "#ffffff88" : "#fff"}
        fontSize={isDimmed ? 7.5 : 9} fontWeight="700" fontFamily="monospace"
        style={{ pointerEvents: "none" }}>{id}</text>
      {isActive && <text x={x + r + 3} y={y - r + 2} fill="#EF4444" fontSize="12" fontWeight="bold" style={{ pointerEvents: "none" }}>▲</text>}
      {isTonic && !isActive && <text x={x + r + 3} y={y - r + 2} fill={c} fontSize="10" fontWeight="bold" style={{ pointerEvents: "none" }}>◆</text>}
    </g>
  );
};

const DetailBox = ({ hovR, hovRId, hovE, data, tab, side }) => {
  const ei = hovE ? (EDGE_INFO[tab]?.[side]?.[hovE] || null) : null;
  const ai = hovRId && data.activations.includes(hovRId) ? (ACT_INFO[tab]?.[side]?.[hovRId] || null) : null;
  const ti = hovRId && (TONIC[tab]?.[side] || []).includes(hovRId);
  const isDimmedRegion = hovR && hovR.dimmed;

  if (hovR) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: SUB[hovR.sub].color, fontFamily: "monospace" }}>{hovRId} — {hovR.full}</span>
          {isDimmedRegion && <span style={{ fontSize: 9, color: "#5A6A7A", fontFamily: "monospace", padding: "1px 5px", background: "#5A6A7A18", borderRadius: 3 }}>no edge data</span>}
        </div>
        <div style={{ fontSize: 10.5, color: "#8899AA", marginTop: 3, lineHeight: 1.5 }}>{hovR.desc}</div>
        {ai && (
          <div style={{ marginTop: 6, padding: "6px 8px", background: "#12182490", borderRadius: 6, borderLeft: "3px solid #EF4444" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", marginBottom: 2, fontFamily: "monospace" }}>Activation increased ▲</div>
            <div style={{ fontSize: 10.5, color: "#B0C0D0", lineHeight: 1.45 }}>{ai}</div>
          </div>
        )}
        {ti && !ai && (
          <div style={{ marginTop: 6, padding: "6px 8px", background: "#12182490", borderRadius: 6, borderLeft: `3px solid ${SUB[hovR.sub].color}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: SUB[hovR.sub].color, marginBottom: 2, fontFamily: "monospace" }}>Tonically altered ◆</div>
            <div style={{ fontSize: 10.5, color: "#B0C0D0", lineHeight: 1.45 }}>This node participates in connectivity patterns that are altered at rest in MDD. This reflects a tonic reconfiguration of the resting-state circuit rather than an activation change.</div>
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
          {!ei.v && <span style={{ fontSize: 9, fontWeight: 700, color: "#E8A838", fontFamily: "monospace", padding: "1px 5px", background: "#E8A83815", borderRadius: 3 }}>⚠ inferred</span>}
          {ei.v && <span style={{ fontSize: 9, fontWeight: 700, color: "#22C55E", fontFamily: "monospace", padding: "1px 5px", background: "#22C55E15", borderRadius: 3 }}>✓ verified</span>}
        </div>
        <div style={{ fontSize: 10.5, color: "#8899AA", lineHeight: 1.5 }}>{ei.detail}</div>
        <div style={{ marginTop: 5, fontSize: 9.5, color: "#5A7A9A", fontFamily: "monospace", fontStyle: "italic", lineHeight: 1.4 }}>📄 {ei.source}</div>
      </div>
    );
  }
  return <div style={{ fontSize: 10.5, color: "#4A5A6A", fontStyle: "italic" }}>Hover a region or connection line for sourced details</div>;
};

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
            isDimmed={!!reg.dimmed} isHovered={hovR === id}
            onHover={(r) => { setHovR(r); setHovE(null); }} onLeave={() => setHovR(null)} />
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
                if (val.includes("Increased") || val.includes("Hyper")) c = "#22C55E";
                if (val.includes("Decreased") || val.includes("Decoupled")) c = "#EF4444";
                if (val.includes("⚠") || val.includes("inferred") || val.includes("prediction")) c = "#E8A838";
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
          <span style={{ color: "#E8A838" }}>⚠</span> inferred&nbsp;&nbsp;
          <span style={{ color: "#5A7A9A" }}>◌</span> no edge data
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
                <svg width="22" height="10"><path d={`M 0 5 Q 11 ${k === "normal" ? 3 : 1} 22 5`} fill="none" stroke={c.color} strokeWidth={c.width} strokeDasharray={c.dash} /></svg>
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
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="#7B68EE55" stroke="#7B68EE66" strokeWidth="1" strokeDasharray="3,2" /></svg><span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>No edge data</span></div>
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
        Data sourced from verified papers in convergence evidence document. ✓ = verified from named source. ⚠ = inferred from HC pattern or untested prediction.
        <br />TPJ and LTC are lateral structures projected onto medial view. Rsp is rendered as a subsystem member without individual edge data.
      </div>
    </div>
  );
}
