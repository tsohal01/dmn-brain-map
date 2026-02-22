import { useState } from "react";

const SUB = {
  core: { label: "DMN Core", color: "#4A90D9" },
  dm:   { label: "Dorsomedial (Mentalizing)", color: "#E8A838" },
  mtl:  { label: "MTL (Memory)", color: "#7B68EE" },
  aff:  { label: "Affective Node", color: "#E05555" },
};

const REGIONS = {
  PCC:   { x: 200, y: 75,  sub: "core", full: "Posterior Cingulate Cortex",          desc: "DMN core hub. Integrates information across subsystems; involved in autobiographical memory and self-awareness." },
  aMPFC: { x: 55,  y: 110, sub: "core", full: "Anterior Medial Prefrontal Cortex",   desc: "DMN core hub. Supports self-referential evaluation and judgments of personal significance." },
  dMPFC: { x: 90,  y: 38,  sub: "dm",   full: "Dorsomedial Prefrontal Cortex",       desc: "Mentalizing subsystem. Serves both self-referential processing and theory of mind (Moran 2013). This dual role is what makes competitive displacement between the two functions plausible." },
  TPJ:   { x: 260, y: 55,  sub: "dm",   full: "Temporoparietal Junction",            desc: "Mentalizing subsystem. Supports perspective-taking, other-focused inference, and self–other distinction.", lateral: true },
  LTC:   { x: 250, y: 165, sub: "dm",   full: "Lateral Temporal Cortex",             desc: "Mentalizing subsystem. Involved in semantic social knowledge and narrative comprehension.", lateral: true },
  HPC:   { x: 170, y: 175, sub: "mtl",  full: "Hippocampus",                         desc: "MTL subsystem. Episodic memory retrieval, autobiographical recall, and scene construction for mental simulation." },
  PHC:   { x: 210, y: 190, sub: "mtl",  full: "Parahippocampal Cortex",              desc: "MTL subsystem. Contextual and scene processing, spatial memory encoding." },
  Rsp:   { x: 225, y: 100, sub: "mtl",  full: "Retrosplenial Cortex",                desc: "MTL subsystem. Spatial context processing and memory–imagination interface. Listed as an MTL node in both Chen (2020) and Zhu (2017) parcellations, but no study in this evidence base reports a specific Rsp edge. Included here as a subsystem member without individual connectivity data.", dimmed: true },
  sgACC: { x: 100, y: 145, sub: "aff",  full: "Subgenual Anterior Cingulate Cortex", desc: "Affective processing node. Dysregulated in depression; linked to negative mood and emotional withdrawal." },
};

const CS = {
  normal:  { color: "#FFFFFF", dash: "6,4",  width: 1.5,  label: "Normal" },
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

const BRAIN_IMG = "data:image/png;base64,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";

const BrainOutline = () => (
  <image href={BRAIN_IMG} x="5" y="5" width="355" height="275" style={{ opacity: 0.55 }} />
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

const RegionNode = ({ id, x, y, subsystem, isActive, isTonic, isDimmed, isHovered, isLateral, onHover, onLeave }) => {
  const c = SUB[subsystem].color;
  const r = isDimmed ? 11 : 16;
  return (
    <g onMouseEnter={() => onHover(id)} onMouseLeave={onLeave} style={{ cursor: "pointer" }}>


      <circle cx={x} cy={y} r={r}
        fill={isDimmed ? `${c}55` : isHovered ? c : `${c}CC`}
        stroke={isDimmed ? `${c}66` : isHovered ? "#fff" : c}
        strokeWidth={isDimmed ? 1 : isHovered ? 2.5 : 1.5}
        strokeDasharray={isDimmed ? "3,2" : "none"}
        style={{ transition: "all 0.15s ease" }}
      >
        {isActive && <animate attributeName="fill-opacity" values="1;0.45;1" dur="2.2s" repeatCount="indefinite" />}
      </circle>
      {isTonic && !isActive && (
        <circle cx={x} cy={y} r={r} fill={c} opacity="0" style={{ pointerEvents: "none" }}>
          <animate attributeName="opacity" values="0;0.35;0" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central"
        fill={isDimmed ? "#ffffff88" : "#fff"}
        fontSize={isDimmed ? 7.5 : 9} fontWeight="700" fontFamily="monospace"
        style={{ pointerEvents: "none" }}>{id}</text>


      {isLateral && (
        <>
          <circle cx={x} cy={y} r={r + 4} fill="none" stroke="#ffffff44" strokeWidth="1" strokeDasharray="2,2" style={{ pointerEvents: "none" }} />
          <text x={x} y={y + r + 11} textAnchor="middle" fill="#ffffff55" fontSize="6.5" fontFamily="monospace" letterSpacing="0.5" style={{ pointerEvents: "none" }}>lateral</text>
        </>
      )}
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
        <div style={{ display: "flex", alignItems: "left", gap: 8 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: SUB[hovR.sub].color, fontFamily: "monospace" }}>{hovRId} — {hovR.full}</span>
          {isDimmedRegion && <span style={{ fontSize: 9, color: "#5A6A7A", fontFamily: "monospace", padding: "1px 5px", background: "#5A6A7A18", borderRadius: 3 }}>no edge data</span>}
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: SUB[hovR.sub].color, marginTop: 2, fontFamily: "monospace", opacity: 0.85 }}>{SUB[hovR.sub].label}</div>
        <div style={{ fontSize: 10.5, color: "#8899AA", marginTop: 3, lineHeight: 1.5 }}>{hovR.desc}</div>
        {ai && (
          <div style={{ marginTop: 6, padding: "6px 8px", background: "#12182490", borderRadius: 6, borderLeft: "3px solid #EF4444" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", marginBottom: 2, fontFamily: "monospace" }}>Activation increased</div>
            <div style={{ fontSize: 10.5, color: "#B0C0D0", lineHeight: 1.45 }}>{ai}</div>
          </div>
        )}
        {ti && !ai && (
          <div style={{ marginTop: 6, padding: "6px 8px", background: "#12182490", borderRadius: 6, borderLeft: `3px solid ${SUB[hovR.sub].color}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: SUB[hovR.sub].color, marginBottom: 2, fontFamily: "monospace" }}>Tonically altered</div>
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
        <div style={{ display: "flex", alignItems: "left", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
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
      <svg viewBox="0 0 370 290" style={{ width: "100%", height: "auto", maxHeight: 280 }}>
        <BrainOutline />
        {data.connections.map((c, i) => {
          const key = `${c.from}–${c.to}`;
          return <CurvedConn key={i} edgeKey={key} from={c.from} to={c.to} type={c.type} isHovered={hovE === key} onHover={(k) => { setHovE(k); setHovR(null); }} onLeave={() => setHovE(null)} />;
        })}
        {Object.entries(REGIONS).map(([id, reg]) => (
          <RegionNode key={id} id={id} x={reg.x} y={reg.y} subsystem={reg.sub}
            isActive={data.activations.includes(id)} isTonic={tonicList.includes(id)}
            isDimmed={!!reg.dimmed} isHovered={hovR === id} isLateral={!!reg.lateral}
            onHover={(r) => { setHovR(r); setHovE(null); }} onLeave={() => setHovR(null)} />
        ))}
      </svg>
      <div style={{ textAlign: "left", minHeight: 76, padding: "10px 12px", background: "#0A1018", borderRadius: 8, marginTop: 4, border: "1px solid #1A2940" }}>
        <DetailBox hovR={rObj} hovRId={hovR} hovE={hovE} data={data} tab={tab} side={side} />
      </div>
      <div style={{ marginTop: 8, padding: "10px 12px", background: "#0E1722", borderRadius: 8, borderLeft: `3px solid ${side === "hc" ? "#4A90D9" : "#E05555"}`, fontSize: 11, lineHeight: 1.55, color: "#8899AA" }}>
        {data.narrative}
      </div>
    </div>
  );
};

const Tbl = ({ title, headers, rows }) => {
  const colW = `${Math.floor(100 / headers.length)}%`;
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B0C4DE", marginBottom: 8, textAlign: "center" }}>{title}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace", tableLayout: "fixed" }}>
        <colgroup>{headers.map((_, i) => <col key={i} style={{ width: colW }} />)}</colgroup>
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
              return <td key={j} style={{ padding: "6px 10px", borderBottom: "1px solid #141E2E", color: c, lineHeight: 1.4, textAlign: "left", wordWrap: "break-word" }}>{val}</td>;
            })}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
};

/* ─── HIERARCHY TAB ─── */

const TREE = {
  id: "DMN", label: "Default Mode Network", color: "#C0D0E0",
  desc: "A large-scale brain network active during internally directed cognition — mind-wandering, autobiographical memory, future simulation, self-reflection. It's not one region but a system of regions that coactivate. Everything below this node is part of the DMN.",
  children: [
    {
      id: "core", label: "Midline Core Hubs", color: SUB.core.color,
      desc: "The integration layer. Core hubs are not a 'subsystem' in the same sense as dorsomedial or MTL — they're the connective backbone. PCC and aMPFC sit at the intersection of the subsystems and bind their outputs together. When researchers say the DMN has a 'hub structure,' this is what they mean: these two regions have disproportionately high connectivity to everything else in the network.",
      children: [
        { id: "PCC", label: "PCC", full: "Posterior Cingulate Cortex", color: SUB.core.color,
          desc: "The single most connected node in the DMN. Integrates information across subsystems. Implicated in self-awareness, autobiographical retrieval, and the subjective sense of 'me-ness.' Its hyperconnectivity to sgACC is among the most reliable biomarkers in depression research." },
        { id: "aMPFC", label: "aMPFC", full: "Anterior Medial Prefrontal Cortex", color: SUB.core.color,
          desc: "Evaluative hub. Assigns personal significance to internally generated content — whether a memory matters to you, whether a future scenario is desirable. Works in tandem with PCC to form the core axis of the network." },
      ],
    },
    {
      id: "dm", label: "Dorsomedial Subsystem", color: SUB.dm.color,
      desc: "The mentalizing / social cognition arm of the DMN. This subsystem handles thinking about other people's mental states (theory of mind), narrative comprehension, and abstract social reasoning. Andrews-Hanna (2012) identified it as functionally distinct from the MTL subsystem: dorsomedial regions activate more for social/conceptual tasks, MTL regions more for episodic/scene tasks.",
      children: [
        { id: "dMPFC", label: "dMPFC", full: "Dorsomedial Prefrontal Cortex", color: SUB.dm.color,
          desc: "Dual-function node. Supports both self-referential processing AND mentalizing about others (Moran 2013). This overlap is what makes the competitive displacement hypothesis work: if dMPFC is occupied with rumination (self-focus), its capacity for other-focused mentalizing may be reduced." },
        { id: "TPJ", label: "TPJ", full: "Temporoparietal Junction", color: SUB.dm.color,
          desc: "Perspective-taking region. Encodes the distinction between self and other perspectives. Critical for theory of mind tasks. A lateral structure — projected onto the midsagittal view in the brain map tab." },
        { id: "LTC", label: "LTC", full: "Lateral Temporal Cortex", color: SUB.dm.color,
          desc: "Semantic social knowledge store. Involved in narrative comprehension and storing conceptual knowledge about social situations. In trait MDD, LTC–PHC coupling correlates with rumination questionnaire scores (Zhu 2017) — a bridge between the social and memory subsystems." },
      ],
    },
    {
      id: "mtl", label: "MTL Subsystem", color: SUB.mtl.color,
      desc: "The memory and scene construction arm. This subsystem handles episodic recall, spatial context, and mental simulation of scenes (past or future). During rumination, the MTL subsystem becomes more tightly coupled to the core hubs — the memory system gets 'recruited' for self-focused retrieval rather than operating in its default balanced state.",
      children: [
        { id: "HPC", label: "HPC", full: "Hippocampus", color: SUB.mtl.color,
          desc: "Episodic memory engine. Retrieves specific autobiographical episodes and constructs scene representations. During state rumination, its coupling with PCC increases — memories get pulled into the self-referential loop." },
        { id: "PHC", label: "PHC", full: "Parahippocampal Cortex", color: SUB.mtl.color,
          desc: "Contextual/spatial processing. Encodes the spatial and environmental context around memories. During state rumination its coupling with HPC decreases — the normal memory circuit partially fragments even as HPC couples more to the core." },
        { id: "Rsp", label: "Rsp", full: "Retrosplenial Cortex", color: SUB.mtl.color,
          desc: "Spatial context and memory–imagination interface. Listed as an MTL subsystem member in both Chen (2020) and Zhu (2017) parcellations. No study in the current evidence base reports a specific Rsp edge, so it appears in the brain map as a dimmed node — real member, no individual connectivity data." },
      ],
    },
    {
      id: "aff", label: "Affective Node", color: SUB.aff.color,
      desc: "Not a full subsystem with multiple members — sgACC is typically treated as a single affective-processing node that interfaces with the DMN during emotional states. Some parcellations don't include it in the DMN at all; it shows up in depression research because its coupling with PCC is reliably elevated in both state and trait rumination. Think of it as a node the DMN recruits under negative affect, rather than a permanent structural member.",
      children: [
        { id: "sgACC", label: "sgACC", full: "Subgenual Anterior Cingulate Cortex", color: SUB.aff.color,
          desc: "The affective gate. Dysregulated in depression, linked to negative mood regulation and emotional withdrawal. PCC–sgACC hyperconnectivity is the most replicated finding in the DMN-rumination literature — it appears in both state induction and trait resting-state designs. DBS targeting this region has shown antidepressant effects." },
      ],
    },
  ],
};

const HierarchyTab = () => {
  const [hov, setHov] = useState(null);
  const [mode, setMode] = useState(null);

  const W = 800, H = 780;
  const cx = W / 2, cy = 380;
  const coreR = 80;
  const subDist = 220;
  const dmR = 110, mtlR = 110, affR = 62;
  const outerR = 345;
  const nodeR = 22;

  const toRad = (d) => (d * Math.PI) / 180;
  const polar = (a, r, ox = cx, oy = cy) => ({
    x: ox + r * Math.cos(toRad(a)),
    y: oy + r * Math.sin(toRad(a)),
  });

  const subCfg = {
    dm:  { angle: -90, r: dmR,  label: "Dorsomedial Subsystem \u00B7 Mentalizing" },
    mtl: { angle: 150, r: mtlR, label: "Medial Temporal Lobe (MTL) Subsystem \u00B7 Memory & Scenes" },
    aff: { angle: 30,  r: affR, label: "Affective Node" },
  };
  const subCenters = {};
  Object.entries(subCfg).forEach(([id, cfg]) => {
    const p = polar(cfg.angle, subDist);
    subCenters[id] = { ...cfg, cx: p.x, cy: p.y };
  });

  const nodePos = {
    PCC:   { cx: cx - 30, cy: cy - 16 },
    aMPFC: { cx: cx + 26, cy: cy + 20 },
    dMPFC: { cx: subCenters.dm.cx + 16,  cy: subCenters.dm.cy - 42 },
    TPJ:   { cx: subCenters.dm.cx - 48,  cy: subCenters.dm.cy + 18 },
    LTC:   { cx: subCenters.dm.cx + 40,  cy: subCenters.dm.cy + 32 },
    HPC:   { cx: subCenters.mtl.cx - 18, cy: subCenters.mtl.cy - 42 },
    PHC:   { cx: subCenters.mtl.cx - 48, cy: subCenters.mtl.cy + 14 },
    Rsp:   { cx: subCenters.mtl.cx + 44, cy: subCenters.mtl.cy + 26 },
    sgACC: { cx: subCenters.aff.cx + 4,  cy: subCenters.aff.cy - 2 },
  };

  const bobVals = {
    PCC:   "0,0; 2.5,1.8; 0,0; -2.5,-1.8; 0,0",
    aMPFC: "0,0; -2.0,2.2; 0,0; 2.0,-2.2; 0,0",
    dMPFC: "0,0; 1.8,-2.5; 0,0; -1.8,2.5; 0,0",
    TPJ:   "0,0; -2.8,1.5; 0,0; 2.8,-1.5; 0,0",
    LTC:   "0,0; 2.2,-1.8; 0,0; -2.2,1.8; 0,0",
    HPC:   "0,0; -1.5,2.8; 0,0; 1.5,-2.8; 0,0",
    PHC:   "0,0; 2.6,1.2; 0,0; -2.6,-1.2; 0,0",
    Rsp:   "0,0; -2.2,-2.0; 0,0; 2.2,2.0; 0,0",
    sgACC: "0,0; 1.5,-2.4; 0,0; -1.5,2.4; 0,0",
    core:  "0,0; 1.2,1.8; 0,0; -1.2,-1.8; 0,0",
    dm:    "0,0; -1.8,1.0; 0,0; 1.8,-1.0; 0,0",
    mtl:   "0,0; 1.4,-1.5; 0,0; -1.4,1.5; 0,0",
    aff:   "0,0; -1.0,1.6; 0,0; 1.0,-1.6; 0,0",
  };
  const bobDur = {
    PCC: "5.2s", aMPFC: "6.1s", dMPFC: "5.8s", TPJ: "6.5s", LTC: "5.5s",
    HPC: "6.3s", PHC: "5.9s", Rsp: "6.7s", sgACC: "5.4s",
    core: "7.5s", dm: "8.2s", mtl: "7.8s", aff: "8.5s",
  };

  /* ── MODE EDGE DEFINITIONS ── */
  const MODE_EDGES = {
    resting: [
      { from: "PCC", to: "aMPFC", status: "normal" },
      { from: "PCC", to: "dMPFC", status: "normal" },
      { from: "PCC", to: "HPC", status: "normal" },
      { from: "dMPFC", to: "TPJ", status: "normal" },
      { from: "dMPFC", to: "LTC", status: "normal" },
      { from: "HPC", to: "PHC", status: "normal" },
      { from: "TPJ", to: "LTC", status: "normal" },
    ],
    mdd: [
      { from: "PCC", to: "aMPFC", status: "normal" },
      { from: "PCC", to: "dMPFC", status: "reduced" },
      { from: "PCC", to: "sgACC", status: "hyper" },
      { from: "dMPFC", to: "HPC", status: "hyper" },
      { from: "dMPFC", to: "LTC", status: "hyper" },
      { from: "LTC", to: "PHC", status: "hyper" },
      { from: "dMPFC", to: "TPJ", status: "normal" },
      { from: "HPC", to: "PHC", status: "normal" },
    ],
    hc: [
      { from: "PCC", to: "aMPFC", status: "normal" },
      { from: "PCC", to: "dMPFC", status: "normal" },
      { from: "PCC", to: "HPC", status: "normal" },
      { from: "dMPFC", to: "TPJ", status: "normal" },
      { from: "HPC", to: "PHC", status: "normal" },
    ],
  };

  const modeLabels = { resting: "Resting DMN", mdd: "MDD Trait", hc: "Healthy Control" };
  const modeColors = { resting: "#4A90D9", mdd: "#E05555", hc: "#22C55E" };

  const spotlightNodes = (() => {
    if (!mode) return new Set();
    const edges = MODE_EDGES[mode] || [];
    const s = new Set();
    edges.forEach(e => {
      if (e.status !== "normal") { s.add(e.from); s.add(e.to); }
    });
    return s;
  })();

  const activeNodes = (() => {
    if (!mode) return new Set();
    const edges = MODE_EDGES[mode] || [];
    const s = new Set();
    edges.forEach(e => { s.add(e.from); s.add(e.to); });
    return s;
  })();

  const allNodes = [TREE, ...TREE.children, ...TREE.children.flatMap((c) => c.children)];
  const hovNode = hov ? allNodes.find((n) => n.id === hov) : null;

  const hovSub = (() => {
    if (!hov) return null;
    if (hov === "DMN") return "DMN";
    if (hov === "core" || hov === "PCC" || hov === "aMPFC") return "core";
    for (const s of TREE.children) {
      if (s.id === hov) return s.id;
      if (s.children.some((c) => c.id === hov)) return s.id;
    }
    return null;
  })();

  const arcPath = (ocx, ocy, r, clockwise = true) => {
    const s = clockwise ? 1 : 0;
    return `M ${ocx - r} ${ocy} A ${r} ${r} 0 1 ${s} ${ocx + r} ${ocy} A ${r} ${r} 0 1 ${s} ${ocx - r} ${ocy}`;
  };

  const connPath = (subId) => {
    const sc = subCenters[subId];
    const dx = sc.cx - cx, dy = sc.cy - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist, uy = dy / dist;
    const x1 = cx + ux * (coreR + 3), y1 = cy + uy * (coreR + 3);
    const x2 = sc.cx - ux * (sc.r + 3), y2 = sc.cy - uy * (sc.r + 3);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const nx = -dy / dist * 0.025 * dist, ny = dx / dist * 0.025 * dist;
    return { d: `M ${x1} ${y1} Q ${mx + nx} ${my + ny} ${x2} ${y2}` };
  };

  const edgePath = (fromId, toId) => {
    const a = nodePos[fromId], b = nodePos[toId];
    if (!a || !b) return `M 0 0 L 0 0`;
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return `M ${a.cx} ${a.cy} L ${b.cx} ${b.cy}`;
    const mx = (a.cx + b.cx) / 2, my = (a.cy + b.cy) / 2;
    const nx = -dy / dist, ny = dx / dist;
    const bulge = Math.min(dist * 0.15, 25);
    return `M ${a.cx} ${a.cy} Q ${mx + nx * bulge} ${my + ny * bulge} ${b.cx} ${b.cy}`;
  };

  const edgeStyle = (status) => {
    if (status === "hyper") return { color: "#22C55E", dash: "none", width: 2.6 };
    if (status === "reduced") return { color: "#EF4444", dash: "8,5", width: 2.2 };
    return { color: "#ffffff88", dash: "5,4", width: 1.4 };
  };

  const modeDesc = {
    resting: "Resting-state DMN architecture. All subsystems show baseline functional connectivity \u2014 the network during quiet wakefulness with no task demand. Connections between core hubs and subsystems are balanced, with no pathological hyper- or hypo-connectivity.",
    mdd: "Major Depressive Disorder trait pattern (Zhu et al. 2017). PCC\u2013sgACC hyperconnectivity is the most replicated finding \u2014 a persistent bridge routing negative affect into the core. Cross-subsystem fusion between dorsomedial and MTL regions (dMPFC\u2013HPC, LTC\u2013PHC) creates rigid over-integration. Core\u2013dMPFC decoupling disconnects the mentalizing subsystem from the integrative backbone.",
    hc: "Healthy control resting-state baseline. All connections at normal levels \u2014 no pathological hyper- or hypo-connectivity. This is the comparison condition against which MDD alterations are measured. The network maintains balanced, flexible coupling between subsystems.",
  };

  return (
    <div style={{ padding: "0 8px" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#D0E0F0", margin: "0 0 4px" }}>DMN Architecture</h2>
        <p style={{ fontSize: 10.5, color: "#5A7A9A", margin: 0, fontFamily: "monospace" }}>
          Hover any node or circle for explanation&nbsp;&nbsp;|&nbsp;&nbsp;Based on Andrews-Hanna 2010, 2012 parcellation
        </p>
      </div>

      {/* ── MODE TOGGLE BUTTONS ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
        {["resting", "mdd", "hc"].map((m) => {
          const active = mode === m;
          return (
            <button key={m} onClick={() => setMode(active ? null : m)} style={{
              padding: "6px 14px", border: `1.5px solid ${active ? modeColors[m] : "#1A2940"}`,
              borderRadius: 20, background: active ? modeColors[m] + "18" : "transparent",
              color: active ? modeColors[m] : "#5A7A9A", fontSize: 11, fontWeight: 600,
              fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer",
              transition: "all 0.25s", letterSpacing: "0.02em",
            }}>
              {active ? "\u25CF " : "\u25CB "}{modeLabels[m]}
            </button>
          );
        })}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 820, display: "block", margin: "0 auto" }}>
        <defs>
          <path id="arc-core-txt" d={arcPath(cx, cy, coreR + 18, true)} fill="none" />
          {Object.entries(subCenters).map(([id, s]) => (
            <path key={`arc-${id}`} id={`arc-${id}-txt`} d={arcPath(s.cx, s.cy, s.r + 18, true)} fill="none" />
          ))}
          <path id="arc-dmn-txt" d={arcPath(cx, cy, outerR + 14, true)} fill="none" />
          <filter id="synGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="spotGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── OUTER DMN BOUNDARY ── */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#2A3F5A" strokeWidth={1.4}
          strokeDasharray="6,8" opacity={0.85}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHov("DMN")} onMouseLeave={() => setHov(null)} />
        <text fontSize={11.5} fontFamily="monospace" fontWeight={700} letterSpacing="0.24em"
          fill="#5A7A9A" style={{ pointerEvents: "none" }}>
          <textPath href="#arc-dmn-txt" textAnchor="middle">
            <animate attributeName="startOffset" from="25%" to="125%" dur="55s" repeatCount="indefinite" />
            DEFAULT MODE NETWORK
          </textPath>
        </text>

        {/* ── MODE EDGES: node-to-node connections ── */}
        {mode && (MODE_EDGES[mode] || []).map((edge, i) => {
          const d = edgePath(edge.from, edge.to);
          const st = edgeStyle(edge.status);
          return (
            <g key={`mode-edge-${i}`}>
              <path d={d} fill="none" stroke={st.color} strokeWidth={st.width}
                strokeDasharray={edge.status === "reduced" ? st.dash : "400"}
                strokeLinecap="round" opacity={0.55}
                style={{ animation: `edgeGrow 0.8s ease-out ${i * 0.08}s both` }} />
              <circle r="2" fill={st.color} opacity="0.85" filter="url(#synGlow)">
                <animateMotion dur={edge.status === "hyper" ? "0.6s" : "1s"} repeatCount="indefinite" path={d} begin={`${i * 0.1}s`} />
              </circle>
            </g>
          );
        })}

        {/* ── CONNECTION WIRES: core to subsystems ── */}
        {["dm", "mtl", "aff"].map((subId) => {
          const conn = connPath(subId);
          const color = SUB[subId].color;
          const isActive = hovSub === subId || hovSub === "core" || hovSub === "DMN";
          const showSynapse = hovSub === subId || hovSub === "core";
          return (
            <g key={`conn-${subId}`}>
              <path d={conn.d} fill="none" stroke={color} strokeWidth={isActive ? 2.0 : 1.2}
                opacity={isActive ? 0.5 : 0.16} strokeLinecap="round"
                style={{ transition: "all 0.2s" }} />
              {showSynapse && (
                <>
                  <circle r="2.2" fill={color} opacity="0.92" filter="url(#synGlow)">
                    <animateMotion dur="0.8s" repeatCount="indefinite" path={conn.d} />
                  </circle>
                  <circle r="1.5" fill={color} opacity="0.35">
                    <animateMotion dur="0.8s" repeatCount="indefinite" path={conn.d} begin="0.1s" />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* ── CORE CIRCLE ── */}
        <g>
          <animateTransform attributeName="transform" type="translate" values={bobVals.core} dur={bobDur.core} repeatCount="indefinite" />
          <g style={{ cursor: "pointer" }}
            onMouseEnter={() => setHov("core")} onMouseLeave={() => setHov(null)}>
            <circle cx={cx} cy={cy} r={coreR}
              fill={hovSub === "core" ? SUB.core.color + "0C" : "transparent"}
              stroke={SUB.core.color} strokeWidth={1.4} strokeDasharray="5,5" opacity={0.85}
              style={{ transition: "fill 0.2s" }} />
          </g>
          {hovSub === "core" ? (
            <text x={cx} y={cy - coreR - 22} textAnchor="middle"
              fontSize={11} fontFamily="monospace" fontWeight={700} letterSpacing="0.14em"
              fill={SUB.core.color}>Core Hub</text>
          ) : (
            <text fontSize={11} fontFamily="monospace" fontWeight={700} letterSpacing="0.14em"
              fill={SUB.core.color + "BB"}>
              <textPath href="#arc-core-txt" textAnchor="middle">
                <animate attributeName="startOffset" from="25%" to="125%" dur="22s" repeatCount="indefinite" />
                Core Hub
              </textPath>
            </text>
          )}

          {["PCC", "aMPFC"].map((id) => {
            const np = nodePos[id];
            const isH = hov === id;
            const isSubH = hovSub === "core";
            const isModeActive = mode && activeNodes.has(id);
            const isSpotlit = mode && spotlightNodes.has(id);
            const scl = isH ? 1.18 : isSpotlit ? 1.1 : 1;
            return (
              <g key={id}>
                <animateTransform attributeName="transform" type="translate" values={bobVals[id]} dur={bobDur[id]} repeatCount="indefinite" />
                {isSpotlit && (
                  <circle cx={np.cx} cy={np.cy} r={nodeR + 8} fill={modeColors[mode] + "15"}
                    stroke={modeColors[mode] + "33"} strokeWidth={1} filter="url(#spotGlow)"
                    style={{ pointerEvents: "none" }} />
                )}
                <g style={{ cursor: "pointer", transformOrigin: `${np.cx}px ${np.cy}px`, transform: `scale(${scl})`, transition: "transform 0.25s ease" }}
                  onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)}>
                  <circle cx={np.cx} cy={np.cy} r={nodeR}
                    fill={isModeActive ? SUB.core.color + "55" : isH ? SUB.core.color + "44" : isSubH ? SUB.core.color + "1A" : "#0D1520"}
                    stroke={isH ? "#fff" : SUB.core.color + (isSubH ? "AA" : "77")}
                    strokeWidth={isH ? 2.2 : 1.2}
                    style={{ transition: "all 0.3s" }} />
                  <text x={np.cx} y={np.cy + 1} textAnchor="middle" dominantBaseline="central"
                    fill={isH ? "#fff" : SUB.core.color} fontSize={9.5} fontWeight={700}
                    fontFamily="'IBM Plex Mono', monospace" style={{ pointerEvents: "none" }}>{id}</text>
                </g>
              </g>
            );
          })}
        </g>

        {/* ── SUBSYSTEM CIRCLES + NODES ── */}
        {Object.entries(subCenters).map(([subId, sc]) => {
          const color = SUB[subId].color;
          const subTree = TREE.children.find((c) => c.id === subId);
          const isSubH = hovSub === subId;

          return (
            <g key={subId}>
              <animateTransform attributeName="transform" type="translate" values={bobVals[subId]} dur={bobDur[subId]} repeatCount="indefinite" />
              <g style={{ cursor: "pointer" }}
                onMouseEnter={() => setHov(subId)} onMouseLeave={() => setHov(null)}>
                <circle cx={sc.cx} cy={sc.cy} r={sc.r}
                  fill={isSubH ? color + "0A" : "transparent"}
                  stroke={color} strokeWidth={1.4} strokeDasharray="5,5" opacity={0.85}
                  style={{ transition: "fill 0.2s" }} />
              </g>

              {isSubH ? (
                <text x={sc.cx} y={sc.cy - sc.r - 14} textAnchor="middle"
                  fontSize={10.5} fontFamily="monospace" fontWeight={700} letterSpacing="0.1em"
                  fill={color}>{sc.label}</text>
              ) : (
                <text fontSize={10.5} fontFamily="monospace" fontWeight={700} letterSpacing="0.1em"
                  fill={color + "BB"}>
                  <textPath href={`#arc-${subId}-txt`} textAnchor="middle">
                    <animate attributeName="startOffset" from="75%" to="-25%" dur="26s" repeatCount="indefinite" />
                    {sc.label}
                  </textPath>
                </text>
              )}

              {subTree.children.map((regionNode) => {
                const np = nodePos[regionNode.id];
                const isRsp = regionNode.id === "Rsp";
                const isH = hov === regionNode.id;
                const isModeActive = mode && activeNodes.has(regionNode.id);
                const isSpotlit = mode && spotlightNodes.has(regionNode.id);
                const scl = isH ? 1.18 : isSpotlit ? 1.1 : 1;
                return (
                  <g key={regionNode.id}>
                    <animateTransform attributeName="transform" type="translate" values={bobVals[regionNode.id]} dur={bobDur[regionNode.id]} repeatCount="indefinite" />
                    {isSpotlit && (
                      <circle cx={np.cx} cy={np.cy} r={nodeR + 8} fill={modeColors[mode] + "15"}
                        stroke={modeColors[mode] + "33"} strokeWidth={1} filter="url(#spotGlow)"
                        style={{ pointerEvents: "none" }} />
                    )}
                    <g style={{ cursor: "pointer", transformOrigin: `${np.cx}px ${np.cy}px`, transform: `scale(${scl})`, transition: "transform 0.25s ease" }}
                      onMouseEnter={() => setHov(regionNode.id)} onMouseLeave={() => setHov(null)}>
                      <circle cx={np.cx} cy={np.cy} r={nodeR}
                        fill={isModeActive ? color + "55" : isH ? color + "44" : isRsp ? color + "22" : isSubH ? color + "18" : "#0D1520"}
                        stroke={isH ? "#fff" : color + (isRsp ? "88" : isSubH ? "AA" : "77")}
                        strokeWidth={isH ? 2.2 : 1.2}
                        strokeDasharray={isRsp ? "3,3" : "none"}
                        style={{ transition: "all 0.3s" }} />
                      <text x={np.cx} y={np.cy + 1} textAnchor="middle" dominantBaseline="central"
                        fill={isH ? "#fff" : color}
                        fontSize={9.5} fontWeight={700}
                        fontFamily="'IBM Plex Mono', monospace" style={{ pointerEvents: "none" }}>{regionNode.label}</text>
                    </g>
                  </g>
                );
              })}
            </g>
          );
        })}

        <style>{`
          @keyframes edgeGrow {
            from { stroke-dashoffset: 400; opacity: 0; }
            to { stroke-dashoffset: 0; opacity: 0.55; }
          }
        `}</style>
      </svg>

      {mode && (
        <div style={{ display: "flex", justifyContent: "center", gap: 14, margin: "8px 0 4px", flexWrap: "wrap" }}>
          {[
            { color: "#22C55E", dash: false, label: "Hyperconnected" },
            { color: "#EF4444", dash: true, label: "Decoupled" },
            { color: "#ffffff", dash: true, label: "Normal" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke={l.color}
                strokeWidth={l.dash ? 1.8 : 2.4} strokeDasharray={l.dash ? "4,3" : "none"} /></svg>
              <span style={{ fontSize: 10, color: "#6A7A8A", fontFamily: "monospace" }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{
        minHeight: 120, margin: "14px auto 0", maxWidth: 740, padding: "14px 18px",
        background: "#0D1520", borderRadius: 10,
        border: `1px solid ${mode && !hovNode ? modeColors[mode] + "44" : hovNode ? (hovNode.color || "#1A2940") + "55" : "#1A2940"}`,
        transition: "border-color 0.2s",
      }}>
        {mode && !hovNode ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: modeColors[mode] }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: modeColors[mode], fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {modeLabels[mode]}
              </span>
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.7, color: "#8899AA" }}>{modeDesc[mode]}</div>
          </>
        ) : hovNode ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: hovNode.color || "#C0D0E0" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: hovNode.color || "#D0E0F0", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {hovNode.full || hovNode.label}
              </span>
              {hovNode.full && <span style={{ fontSize: 10, color: "#5A7A9A", fontFamily: "monospace" }}>({hovNode.label})</span>}
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.7, color: "#8899AA" }}>{hovNode.desc}</div>
          </>
        ) : (
          <div style={{ fontSize: 11.5, color: "#4A5A6A", lineHeight: 1.7 }}>
            <span style={{ color: "#5A7A9A", fontWeight: 600 }}>Hover any node or circle above.</span> The DMN has hierarchical structure. The <span style={{ color: SUB.core.color }}>core hubs</span> (PCC, aMPFC) sit at the center and integrate signals from specialized subsystems: the <span style={{ color: SUB.dm.color }}>dorsomedial subsystem</span> handles social cognition, the <span style={{ color: SUB.mtl.color }}>MTL subsystem</span> handles memory and scene construction, and the <span style={{ color: SUB.aff.color }}>affective node</span> (sgACC) interfaces during emotional states. Rumination reconfigures the connections between these layers \u2014 that\u2019s what the State and Trait tabs show.
          </div>
        )}
      </div>
    </div>
  );
};

export default function DMNBrainMap() {
  const [tab, setTab] = useState("hierarchy");
  const d = DATA[tab] || {};
  const n = NOTES[tab] || {};

  return (
    <div style={{ background: "#080E18", color: "#C0D0E0", minHeight: "100vh", fontFamily: "'IBM Plex Sans', -apple-system, sans-serif", padding: "20px 16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap');`}</style>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#D0E0F0", margin: 0 }}>DMN Subsystem Connectivity & Activation During Rumination</h1>
        <p style={{ fontSize: 10.5, color: "#5A7A9A", marginTop: 4, fontFamily: "monospace" }}>
          Medial sagittal view — hover regions and connections for sourced details&nbsp;&nbsp;|&nbsp;&nbsp;
          <span style={{ color: "#E8A838" }}>⚠</span> inferred&nbsp;&nbsp;
          <span style={{ color: "#5A7A9A" }}>◌</span> no edge data
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, background: "#0A1018", borderRadius: 10, padding: 4, maxWidth: 560, margin: "12px auto" }}>
        {[{ key: "hierarchy", label: "DMN Architecture" }, { key: "state", label: "State Rumination" }, { key: "trait", label: "Trait Rumination" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "9px 14px", border: "none", borderRadius: 8,
            background: tab === t.key ? "#1A2940" : "transparent",
            color: tab === t.key ? "#D0E0F0" : "#5A7A9A",
            fontWeight: tab === t.key ? 700 : 500, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>
      {tab === "hierarchy" ? (
        <HierarchyTab />
      ) : (
      <>
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
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="#EF4444" opacity="0.7"><animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.2s" repeatCount="indefinite" /></circle></svg><span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>Activation pulse</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="#E8A838" opacity="0.35"><animate attributeName="opacity" values="0;0.35;0" dur="3s" repeatCount="indefinite" /></circle></svg><span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>Tonically altered</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="#7B68EE55" stroke="#7B68EE66" strokeWidth="1" strokeDasharray="3,2" /></svg><span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>No edge data</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="none" stroke="#ffffff44" strokeWidth="1" strokeDasharray="2,2" /></svg><span style={{ fontSize: 10, color: "#8899AA", fontFamily: "monospace" }}>Lateral projection</span></div>
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
        <br />Midsagittal view — medial surface of left hemisphere. TPJ and LTC are lateral structures projected onto this view (dashed ring). Rsp is rendered as a subsystem member without individual edge data.
      </div>
      </>
      )}
    </div>
  );
}
