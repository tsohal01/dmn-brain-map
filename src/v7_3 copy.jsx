import { useState } from "react";

const SUB = {
  core: { label: "DMN Core", color: "#4A90D9" },
  dm:   { label: "Dorsomedial (Mentalizing)", color: "#E8A838" },
  mtl:  { label: "MTL (Memory)", color: "#7B68EE" },
  aff:  { label: "Affective Node", color: "#E05555" },
};

const UI = {
  color: {
    bgA: "#060B14",
    bgB: "#0E1729",
    textStrong: "#D6E3F2",
    textBase: "#A3B4C8",
    textMuted: "#72849B",
    textQuiet: "#546579",
    borderSoft: "rgba(163, 189, 219, 0.22)",
    borderStrong: "rgba(163, 189, 219, 0.34)",
    glassA: "rgba(12, 20, 33, 0.62)",
    glassB: "rgba(15, 24, 39, 0.72)",
    glassSoft: "rgba(11, 19, 32, 0.46)",
    inferred: "#E8A838",
    hyper: "#22C55E",
    reduced: "#EF4444",
    normal: "#FFFFFF",
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
  shadow: {
    soft: "0 10px 26px rgba(0, 0, 0, 0.25)",
    deep: "0 16px 40px rgba(0, 0, 0, 0.38)",
  },
  type: { xs: 9.5, sm: 10.5, md: 12, lg: 14, xl: 18 },
};

const glassCardStyle = (variant = "base") => {
  const bg =
    variant === "elevated"
      ? `linear-gradient(155deg, ${UI.color.glassB} 0%, ${UI.color.glassA} 100%)`
      : variant === "soft"
      ? UI.color.glassSoft
      : `linear-gradient(155deg, ${UI.color.glassA} 0%, rgba(10, 17, 29, 0.7) 100%)`;
  return {
    background: bg,
    border: `1px solid ${variant === "elevated" ? UI.color.borderStrong : UI.color.borderSoft}`,
    borderRadius: UI.radius.lg,
    boxShadow: variant === "soft" ? UI.shadow.soft : UI.shadow.deep,
    backdropFilter: "blur(12px)",
  };
};

const GlassCard = ({ children, style, variant = "base" }) => (
  <div style={{ ...glassCardStyle(variant), ...style }}>{children}</div>
);

const CardHeader = ({ title, subtitle, accent = UI.color.textStrong, right, centered = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: centered ? "center" : "space-between",
      gap: 10,
      marginBottom: subtitle ? 8 : 4,
      flexWrap: "wrap",
      textAlign: centered ? "center" : "left",
    }}
  >
    <div style={{ width: centered ? "100%" : "auto" }}>
      <div style={{ fontSize: UI.type.md, fontWeight: 700, color: accent }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: UI.type.sm, color: UI.color.textMuted, marginTop: 2 }}>{subtitle}</div>
      )}
    </div>
    {!centered && (right || null)}
  </div>
);

const CHIP_TONE = {
  neutral: { color: "#D0E0F0", bg: "rgba(208, 224, 240, 0.12)", border: "rgba(208, 224, 240, 0.28)" },
  inferred: { color: UI.color.inferred, bg: "rgba(232, 168, 56, 0.15)", border: "rgba(232, 168, 56, 0.35)" },
  verified: { color: UI.color.hyper, bg: "rgba(34, 197, 94, 0.14)", border: "rgba(34, 197, 94, 0.34)" },
  hyper: { color: UI.color.hyper, bg: "rgba(34, 197, 94, 0.14)", border: "rgba(34, 197, 94, 0.34)" },
  reduced: { color: UI.color.reduced, bg: "rgba(239, 68, 68, 0.14)", border: "rgba(239, 68, 68, 0.34)" },
};

const StatusChip = ({ label, tone = "neutral" }) => {
  const t = CHIP_TONE[tone] || CHIP_TONE.neutral;
  return (
    <span
      style={{
        fontSize: UI.type.xs,
        fontWeight: 700,
        color: t.color,
        fontFamily: "'IBM Plex Mono', monospace",
        padding: "2px 7px",
        background: t.bg,
        borderRadius: UI.radius.pill,
        border: `1px solid ${t.border}`,
      }}
    >
      {label}
    </span>
  );
};

const hostPolicyLabel = (policy) => {
  if (policy === PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT) return "highlight-attempt";
  if (policy === PAPER_LINK_POLICY.ANCHOR_ONLY) return "anchor-only";
  return "stable";
};

const hostPolicyTone = (policy) => {
  if (policy === PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT) return "inferred";
  if (policy === PAPER_LINK_POLICY.ANCHOR_ONLY) return "neutral";
  return "verified";
};

const CitationLinks = ({ refs, jumpToEvidence, label = "Source links:" }) => {
  if (!refs || !refs.length) return null;
  return (
    <div style={{ marginTop: 7, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: UI.type.xs, color: UI.color.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
        {label}
      </div>
      {refs.map((r) => {
        const canHighlightAttempt =
          r.hostPolicy === PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT &&
          r.highlightUrl &&
          r.highlightUrl !== r.stableUrl;
        return (
          <div
            key={r.paperId || r.label}
            style={{
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid rgba(61, 88, 117, 0.45)",
              background: "rgba(9, 14, 24, 0.45)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: UI.type.xs, color: "#C5D7EA", fontWeight: 700 }}>{r.label}</span>
              <StatusChip label={hostPolicyLabel(r.hostPolicy)} tone={hostPolicyTone(r.hostPolicy)} />
              {jumpToEvidence && r.anchor && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    jumpToEvidence(r.anchor);
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: UI.type.xs,
                    color: "#8BB8E8",
                    fontFamily: "'IBM Plex Mono', monospace",
                    textDecoration: "underline",
                  }}
                >
                  in-app evidence
                </button>
              )}
              {r.stableUrl && (
                <a
                  href={r.stableUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: UI.type.xs,
                    color: "#7EA7D2",
                    fontFamily: "'IBM Plex Mono', monospace",
                    textDecoration: "underline",
                  }}
                >
                  open study ↗
                </a>
              )}
              {canHighlightAttempt && (
                <a
                  href={r.highlightUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: UI.type.xs,
                    color: UI.color.inferred,
                    fontFamily: "'IBM Plex Mono', monospace",
                    textDecoration: "underline",
                  }}
                >
                  try highlight ↗
                </a>
              )}
            </div>
            {r.quote && (
              <div style={{ marginTop: 4, fontSize: 9.2, color: "#6E89A5", lineHeight: 1.45 }}>
                "{r.quote}"
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const getSemanticEdgeStyle = (status, scale = 1) => {
  if (status === "hyper") {
    return { color: UI.color.hyper, dash: "none", width: 2.6 * scale };
  }
  if (status === "reduced") {
    return { color: UI.color.reduced, dash: "8,5", width: 2.2 * scale };
  }
  if (status === "inferred") {
    return { color: UI.color.inferred, dash: "6,5", width: 2.0 * scale };
  }
  return { color: "#ffffff88", dash: "5,4", width: 1.4 * scale };
};

const typeFromEvidence = (ei) => {
  if (!ei) return "normal";
  // If not verified, always render as inferred (yellow), regardless of up/down.
  if (!ei.v) return "inferred";

  // Verified: map based on the status text
  const s = (ei.status || "").toLowerCase();
  if (s.includes("↑") || s.includes("hyper")) return "hyper";
  if (s.includes("↓") || s.includes("decoupled")) return "reduced";
  return "normal";
};

const REGIONS = {
  PCC:   { x: 200, y: 75,  sub: "core", full: "Posterior Cingulate Cortex",          desc: "DMN core hub. Integrates information across subsystems; involved in autobiographical memory and self-awareness." },
  aMPFC: { x: 55,  y: 110, sub: "core", full: "Anterior Medial Prefrontal Cortex",   desc: "DMN core hub. Supports self-referential evaluation and judgments of personal significance." },
  dMPFC: { x: 90,  y: 38,  sub: "dm",   full: "Dorsomedial Prefrontal Cortex",       desc: "Mentalizing subsystem. Serves both self-referential processing and theory of mind (Moran 2013). This dual role is what makes competitive displacement between the two functions plausible." },
  TPJ:   { x: 260, y: 55,  sub: "dm",   full: "Temporoparietal Junction",            desc: "Mentalizing subsystem. Supports perspective-taking, other-focused inference, and self\u2013other distinction.", lateral: true },
  LTC:   { x: 250, y: 165, sub: "dm",   full: "Lateral Temporal Cortex",             desc: "Mentalizing subsystem. Involved in semantic social knowledge and narrative comprehension.", lateral: true },
  TempP: { x: 90,  y: 170, sub: "dm",   full: "Temporal Pole",                       desc: "Mentalizing subsystem. Involved in social and emotional semantic processing, entity-level knowledge, and abstract social concepts. Carries the majority of significant cross-subsystem edges in Zhu (2017), including the dMPFC\u2013TempP edge that correlates with trait rumination scores.", lateral: true },
  HPC:   { x: 170, y: 175, sub: "mtl",  full: "Hippocampus",                         desc: "MTL subsystem. Episodic memory retrieval, autobiographical recall, and scene construction for mental simulation." },
  PHC:   { x: 210, y: 190, sub: "mtl",  full: "Parahippocampal Cortex",              desc: "MTL subsystem. Contextual and scene processing, spatial memory encoding." },
  Rsp:   { x: 225, y: 100, sub: "mtl",  full: "Retrosplenial Cortex",                desc: "MTL subsystem. Spatial context processing and memory\u2013imagination interface. Listed as an MTL node in both Chen (2020) and Zhu (2017) parcellations, but no study in this evidence base reports a specific Rsp edge. Included here as a subsystem member without individual connectivity data.", dimmed: true },
  sgACC: { x: 110, y: 135, sub: "aff",  full: "Subgenual Anterior Cingulate Cortex", desc: "Affective processing node. Dysregulated in depression; linked to negative mood and emotional withdrawal." },
};

const PAPER_LINK_POLICY = {
  STABLE: "stable",
  HIGHLIGHT_ATTEMPT: "highlight-attempt",
  ANCHOR_ONLY: "anchor-only",
};

const PAPER_REGISTRY = {
  chen2020: {
    label: "Chen et al. 2020",
    year: 2020,
    quote: "Core↔MTL increased and core↔dMPFC decreased during rumination vs distraction.",
    stableUrl: "https://www.sciencedirect.com/science/article/pii/S1053811920306716#abss0001",
    highlightUrl: null,
    hostPolicy: PAPER_LINK_POLICY.STABLE,
    anchor: "ev-chen-2020",
    match: /chen\s*(et al\.)?\s*2020/i,
  },
  chen2025: {
    label: "Chen et al. 2025",
    year: 2025,
    quote: "Used in convergence synthesis for heterogeneity/context caveats.",
    stableUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=Chen+2025+rumination+DMN+depression",
    highlightUrl: null,
    hostPolicy: PAPER_LINK_POLICY.ANCHOR_ONLY,
    anchor: null,
    match: /chen\s*(et al\.)?\s*2025/i,
  },
  zhu2017: {
    label: "Zhu et al. 2017",
    year: 2017,
    quote: "Core↔dMPFC decreased; within-dMPFC and dMPFC↔MTL edges increased; RSQ correlations on dMPFC–TempP and LTC–PHC.",
    stableUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5320523/",
    highlightUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5320523/#:~:text=increased%20within-system%20connectivity%20in%20the%20DMPFC%20subsystem",
    hostPolicy: PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT,
    anchor: "ev-zhu-2017",
    match: /zhu\s*(et al\.)?\s*2017/i,
  },
  zhou2020: {
    label: "Zhou et al. 2020",
    year: 2020,
    quote: "Meta-analytic rumination activation includes dMPFC and memory-related regions.",
    stableUrl: "https://doi.org/10.1016/j.neuroimage.2019.116287",
    highlightUrl: null,
    hostPolicy: PAPER_LINK_POLICY.ANCHOR_ONLY,
    anchor: "ev-zhou-2020",
    match: /zhou\s*(et al\.)?\s*2020/i,
  },
  tozzi2021: {
    label: "Tozzi et al. 2021",
    year: 2021,
    quote: "Large-sample trait rumination did not robustly predict subsystem connectivity.",
    stableUrl: "https://doi.org/10.1016/j.biopsych.2020.09.024",
    highlightUrl: null,
    hostPolicy: PAPER_LINK_POLICY.ANCHOR_ONLY,
    anchor: "ev-tozzi-2021",
    match: /tozzi\s*(et al\.)?\s*2021/i,
  },
  andrews_hanna: {
    label: "Andrews-Hanna et al. 2014",
    year: 2014,
    quote: "DMN architecture separates core, dorsomedial, and MTL components.",
    stableUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4039623/",
    highlightUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4039623/#:~:text=dorsomedial%20PFC%20subsystem,mentalizing%20and%20social%20inference",
    hostPolicy: PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT,
    anchor: "ev-andrews-hanna",
    match: /andrews-hanna\s*(et al\.)?\s*(2010|2012|2014)/i,
  },
  moran2013: {
    label: "Moran et al. 2013",
    year: 2013,
    quote: "dMPFC contributes to both self-referential processing and mentalizing.",
    stableUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3713343/",
    highlightUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3713343/#:~:text=Thinking%20about%20those%20social%20actors%20independent%20from%20ourselves",
    hostPolicy: PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT,
    anchor: "ev-moran-2013",
    match: /moran\s*(et al\.)?\s*2013/i,
  },
  berman2011: {
    label: "Berman et al. 2011",
    year: 2011,
    quote: "DMN-affective coupling findings align with depressive rumination burden.",
    stableUrl: "https://doi.org/10.1016/j.biopsych.2010.10.028",
    highlightUrl: null,
    hostPolicy: PAPER_LINK_POLICY.ANCHOR_ONLY,
    anchor: "ev-berman-2011",
    match: /berman\s*(et al\.)?\s*2011/i,
  },
  bora_berk2016: {
    label: "Bora & Berk 2016",
    year: 2016,
    quote: "Meta-analysis reports robust ToM impairments in depression.",
    stableUrl: "https://doi.org/10.1016/j.jad.2016.02.026",
    highlightUrl: null,
    hostPolicy: PAPER_LINK_POLICY.ANCHOR_ONLY,
    anchor: "ev-bora-2016",
    match: /bora.*berk.*2016|bora\s*2016/i,
  },
  nestor2022: {
    label: "Nestor et al. 2022",
    year: 2022,
    quote: "Rumination may compromise attention to others' mental and emotional states.",
    stableUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8961451/",
    highlightUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8961451/#:~:text=this%20inward%2C%20internal%20bias%20toward%20negative%20thinking%20or%20rumination",
    hostPolicy: PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT,
    anchor: "ev-nestor-2022",
    match: /nestor\s*(et al\.)?\s*2022/i,
  },
  kim2023: {
    label: "Kim et al. 2023",
    year: 2023,
    quote: "dmPFC↔TPJ resting coupling links social inference processes and rumination.",
    stableUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10272121/",
    highlightUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10272121/#:~:text=has%20been%20reported%20across%20numerous%20fMRI%20studies%20of%20mentalizing%20or%20theory%20of%20mind",
    hostPolicy: PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT,
    anchor: "ev-kim-2023",
    match: /kim\s*(et al\.)?\s*2023/i,
  },
  kuang2016: {
    label: "Kuang 2016",
    year: 2016,
    quote: "Self- and other-focused attention can interact competitively.",
    stableUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4734343/",
    highlightUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4734343/#:~:text=the%20mechanisms%20underlying%20these%20two%20polarities%20will%20interact%20and%20compete",
    hostPolicy: PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT,
    anchor: null,
    match: /kuang\s*(et al\.)?\s*2016|kuang\s*2016/i,
  },
  hamilton2015: {
    label: "Hamilton et al. 2015",
    year: 2015,
    quote: "Depressive rumination as functional integration of DMN and sgPFC.",
    stableUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4524294/",
    highlightUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4524294/#:~:text=an%20integration%20of%20the%20self-referential%20processes",
    hostPolicy: PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT,
    anchor: null,
    match: /hamilton\s*(et al\.)?\s*2015|hamilton\s*2015/i,
  },
};

const STUDY_LINKS = Object.entries(PAPER_REGISTRY).map(([paperId, paper]) => ({
  paperId,
  label: paper.label,
  match: paper.match,
  url: paper.highlightUrl || paper.stableUrl,
  anchor: paper.anchor || null,
}));

const PAPER_ID_BY_ANCHOR = Object.entries(PAPER_REGISTRY).reduce((acc, [paperId, paper]) => {
  if (paper.anchor) acc[paper.anchor] = paperId;
  return acc;
}, {});

const makePaperRef = (paperId) => {
  const paper = PAPER_REGISTRY[paperId];
  if (!paper) return null;
  return {
    paperId,
    label: paper.label,
    year: paper.year,
    quote: paper.quote,
    highlightUrl: paper.highlightUrl || null,
    stableUrl: paper.stableUrl || paper.highlightUrl || null,
    hostPolicy: paper.hostPolicy || PAPER_LINK_POLICY.ANCHOR_ONLY,
    anchor: paper.anchor || null,
  };
};

const dedupePaperRefs = (refs) => {
  const seen = new Set();
  const out = [];
  refs.forEach((ref) => {
    if (!ref) return;
    const key = ref.paperId || ref.label;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(ref);
  });
  return out;
};

const getStudyRefs = (...texts) => {
  const haystack = texts.filter(Boolean).join(" ");
  const refs = STUDY_LINKS
    .filter((s) => s.match && s.match.test(haystack))
    .map((s) => makePaperRef(s.paperId));
  return dedupePaperRefs(refs);
};

const findingEdgeKey = (tab, side, edge) => `edge.${tab}.${side}.${edge}`;
const findingActivationKey = (tab, side, nodeId) => `activation.${tab}.${side}.${nodeId}`;
const findingArchNodeKey = (overlay, edge) => `arch.node.${overlay}.${edge}`;
const findingArchSubKey = (overlay, edge) => `arch.sub.${overlay}.${edge}`;

const CS = {
  normal:  { color: UI.color.normal, dash: "6,4",  width: 1.5, label: "Normal" },
  hyper:   { color: UI.color.hyper, dash: "none", width: 2.8, label: "Hyperconnected" },
  reduced: { color: UI.color.reduced, dash: "8,5",  width: 2.2, label: "Decoupled" },
  inferred:{ color: UI.color.inferred, dash: "6,5",  width: 2.0, label: "Inferred (proxy)" },
};

const EDGE_INFO = {
  state: {
    hc: {
      "PCC\u2013aMPFC":  { status: "Normal", detail: "Core-to-core coupling was not reported as specifically altered during rumination induction in healthy controls.", source: "Chen 2020 \u2014 not highlighted as changed", v: true },
      "PCC\u2013HPC":    { status: "\u2191 Hyperconnected", detail: "Core\u2013MTL coupling increased during induced rumination. Autobiographical memory retrieval becomes more tightly linked to the self-referential core during the ruminative episode. Note: Chen (2020) reports this at the subsystem level (core\u2013MTL), not as a specific PCC\u2013HPC edge.", source: "Chen et al. 2020 \u2014 significant increase in core\u2013MTL FC during rumination vs. distraction (subsystem-level finding)", v: false },
      "PCC\u2013dMPFC":  { status: "\u2193 Decoupled", detail: "Core\u2013dMPFC coupling decreased during induced rumination. The mentalizing subsystem disengaged from the core, even though dMPFC activation itself increased \u2014 a dissociation between activation and connectivity. Note: Chen (2020) reports this at the subsystem level, not as a specific PCC\u2013dMPFC edge.", source: "Chen et al. 2020 \u2014 significant decrease in core\u2013dMPFC FC during rumination vs. distraction (subsystem-level finding)", v: false },
      "HPC\u2013PHC":    { status: "\u2193 Decoupled", detail: "Within-MTL connectivity decreased during rumination. Even as hippocampus coupled more tightly with the core for self-focused retrieval, its normal integration with parahippocampal context processing weakened. Note: Chen (2020) reports this at the subsystem level (within-MTL), not as a specific HPC\u2013PHC edge.", source: "Chen et al. 2020 \u2014 'decreased FC within MTL subsystem itself' (subsystem-level finding)", v: false },
      "dMPFC\u2013TPJ":  { status: "Normal", detail: "No change was reported within the dorsomedial subsystem during healthy-control state rumination. Within-subsystem coupling appears to stay at baseline.", source: "Not tested in Chen 2020; assumed baseline", v: false },
    },
    mdd: {
      "PCC\u2013sgACC":  { status: "\u2191 Hyperconnected", detail: "The only directly verified MDD state-induction edge: during induced rumination, PCC connectivity to subgenual cingulate increased in depressed participants. This routes negative affect into the core ruminative circuit.", source: "Author\u2019s synthesis of convergence evidence \u2014 'induced rumination in depression increases PCC-seeded connectivity with subgenual cingulate'", v: true },
      "PCC\u2013HPC":    { status: "\u2191 Hyperconnected", detail: "Inferred from the healthy-control pattern. Core\u2013MTL increase is verified in HC (Chen 2020) but not directly confirmed at subsystem level during MDD state induction. The literature notes that 'direction and localization of effects are more heterogeneous' in depressed samples, and that chronic MDD can show opposite-direction PCC changes.", source: "Inferred from Chen 2020 (HC only, subsystem-level). Author\u2019s synthesis cautions against generalizing to MDD.", v: false },
      "PCC\u2013dMPFC":  { status: "\u2193 Decoupled", detail: "Partially inferred. Core\u2013dMPFC decrease is verified in HC state induction (Chen 2020, subsystem-level) and also appears as a baseline group difference in MDD (Zhu 2017, trait). The convergence suggests this edge is plausibly reduced during MDD state induction, but no study directly confirms it during active rumination in a depressed sample.", source: "Chen 2020 (HC state, subsystem-level) + Zhu 2017 (MDD trait baseline) \u2014 convergent but not directly tested in MDD state", v: false },
      "PCC\u2013aMPFC":  { status: "Normal", detail: "Core-to-core coupling was not specifically reported as altered during MDD state induction.", source: "Not highlighted in available MDD induction findings", v: true },
      "dMPFC\u2013TPJ":  { status: "\u2193 Decoupled", detail: "Untested prediction. The dMPFC subsystem (dMPFC, TPJ, LTC, TempP) supports mentalizing and is decoupled from core during rumination at the subsystem level. Whether this reconfiguration degrades mentalizing capacity is the convergence gap \u2014 no study has administered a ToM task during active rumination. This edge represents one within-subsystem connection that may be affected.", source: "No paper reports this. The gap is framed at the subsystem level (convergence document, Section 6).", v: false },
      "HPC\u2013PHC":    { status: "\u2193 Decoupled", detail: "Inferred from the HC pattern. Within-MTL decrease was verified in healthy controls (Chen 2020, subsystem-level) but not directly tested during MDD state induction.", source: "Inferred from Chen 2020 (HC only, subsystem-level)", v: false },
    },
  },
  trait: {
    hc: {
      "PCC\u2013aMPFC":  { status: "Normal", detail: "Healthy resting-state baseline. Core hubs normally coupled.", source: "Baseline \u2014 no pathology reported", v: true },
      "PCC\u2013dMPFC":  { status: "Normal", detail: "Core-to-dorsomedial coupling intact at healthy baseline.", source: "Baseline", v: true },
      "PCC\u2013HPC":    { status: "Normal", detail: "Core-to-MTL coupling balanced at healthy baseline.", source: "Baseline", v: true },
      "dMPFC\u2013TPJ":  { status: "Normal", detail: "Dorsomedial subsystem internally connected at baseline.", source: "Baseline", v: true },
      "HPC\u2013PHC":    { status: "Normal", detail: "MTL subsystem internally connected at baseline.", source: "Baseline", v: true },
    },
    mdd: {
      "PCC\u2013aMPFC":  { status: "Normal", detail: "Core-to-core coupling not specifically reported as altered in trait rumination.", source: "Zhu 2017 \u2014 focus was on subsystem-level cross-edges", v: true },
      "PCC\u2013dMPFC":  { status: "\u2193 Decoupled", detail: "Core\u2013dMPFC coupling was decreased in first-episode MDD compared to healthy controls. The mentalizing subsystem shows reduced integration with the core at rest \u2014 a tonic baseline disconnection rather than a task-evoked pattern.", source: "Zhu et al. 2017 \u2014 'decreased connectivity between midline core and dMPFC subsystems'", v: true },
      "PCC\u2013sgACC":  { status: "\u2191 Hyperconnected", detail: "The most reliable trait marker in the literature. PCC\u2013sgACC coupling is increased in MDD and positively correlates with RRS brooding scores. This effect is present during rest but not during task engagement, and has been replicated across multiple independent studies.", source: "Multiple studies + review synthesis \u2014 'highly reliable DMN\u2013sgPFC hyperconnectivity in MDD'; PCC\u2013sgACC correlates with RRS brooding", v: true },
      "dMPFC\u2013TempP": { status: "\u2191 Hyperconnected", detail: "Within-dMPFC subsystem connectivity was increased in first-episode MDD. The dMPFC\u2013TempP edge is one of only two edges specifically correlated with RSQ-rumination scores \u2014 higher trait rumination was associated with tighter coupling between these dorsomedial nodes.", source: "Zhu et al. 2017 \u2014 'increased within-system connectivity in dMPFC subsystem'; dMPFC\u2013TempP correlated with RSQ-rumination", v: true },
      "TPJ\u2013LTC":    { status: "\u2191 Hyperconnected", detail: "Within-dMPFC subsystem connectivity was increased in first-episode MDD. TPJ and LTC, both dorsomedial members, showed tighter coupling at rest in the depressed group.", source: "Zhu et al. 2017 \u2014 'increased within-system connectivity in dMPFC subsystem'", v: true },
      "LTC\u2013PHC":    { status: "\u2191 Hyperconnected", detail: "A cross-subsystem edge connecting the dMPFC subsystem (LTC) to the MTL subsystem (PHC). One of the specific edges correlated with RSQ-rumination scores in MDD \u2014 higher trait rumination was associated with tighter coupling on this semantic\u2013memory bridge.", source: "Zhu 2017 \u2014 'RSQ-rumination correlated positively with LTC\u2013PHC'", v: true },
      "TPJ\u2013PHC":    { status: "\u2191 Hyperconnected", detail: "A cross-subsystem edge connecting the dMPFC subsystem (TPJ) to the MTL subsystem (PHC). Part of the broader pattern of increased dMPFC\u2013MTL inter-system connectivity in first-episode MDD.", source: "Zhu et al. 2017 \u2014 increased dMPFC\u2013MTL inter-system connectivity", v: true },
      "TempP\u2013PHC":  { status: "\u2191 Hyperconnected", detail: "A cross-subsystem edge connecting the dMPFC subsystem (TempP) to the MTL subsystem (PHC). TempP carries several of the significant cross-subsystem edges in Zhu (2017), reflecting its role as a bridge node between social-semantic and memory systems.", source: "Zhu et al. 2017 \u2014 increased dMPFC\u2013MTL inter-system connectivity", v: true },
      "dMPFC\u2013TPJ":  { status: "Normal", detail: "TPJ was not specifically reported as having altered connectivity to dMPFC in trait rumination. The dMPFC subsystem's trait-level hyperconnectivity primarily routes to MTL nodes rather than through the dMPFC\u2013TPJ edge.", source: "Zhu 2017 \u2014 TPJ not highlighted in rumination-correlated edges", v: true },
      "HPC\u2013PHC":    { status: "Normal", detail: "Within-MTL connectivity was not reported as altered in trait MDD. The cross-subsystem routes (dMPFC to MTL) carry the trait signal rather than within-MTL edges.", source: "Not highlighted in Zhu 2017", v: true },
    },
  },
};

const ACT_INFO = {
  state: {
    hc: {
      dMPFC: "Activation increased during rumination tasks across healthy samples. The region shows greater engagement during self-focus while simultaneously decoupling from the core \u2014 the activation\u2013connectivity dissociation is the central mechanistic observation. (Zhou et al. 2020 meta-analysis)",
      HPC:   "Activation increased during rumination, reflecting episodic memory retrieval for autobiographical content. (Zhou et al. 2020 meta-analysis)",
    },
    mdd: {
      dMPFC: "Activation increased, matching the healthy-control pattern. Rumination drives dMPFC activation regardless of diagnosis. Note: activation meta-analyses are drawn mostly from healthy samples. (Zhou 2020 meta-analysis)",
      HPC:   "Activation increased \u2014 memory retrieval engaged, consistent with the HC pattern.",
      PCC:   "Hyperactivation reported in some MDD induction studies, with PCC-centered hyperconnectivity during induced rumination. (Author\u2019s synthesis of convergence evidence)",
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
    subtitle: "Experimentally induced \u2014 connectivity and activation during an active rumination episode",
    sources: "Chen 2020 (HC connectivity, subsystem-level); Zhou 2020 (activation meta-analysis); author\u2019s synthesis (MDD induction)",
    hc: {
      label: "Healthy Controls",
      activations: ["dMPFC", "HPC"],
      connections: [
        { from: "PCC", to: "aMPFC", type: "normal" },
        { from: "PCC", to: "HPC",   type: "inferred" },
        { from: "PCC", to: "dMPFC", type: "inferred" },
        { from: "HPC", to: "PHC",   type: "inferred" },
        { from: "dMPFC", to: "TPJ", type: "normal" },
      ],
      narrative: "During active rumination in healthy controls, dMPFC activation increases while its coupling with the core decreases. Memory systems (MTL) become more tightly linked to the core for self-focused retrieval. The result is a subsystem reconfiguration: stronger core\u2013memory coupling at the expense of core\u2013mentalizing integration. Note: Chen (2020) reports these patterns at the subsystem level (core\u2013MTL, core\u2013dMPFC, within-MTL), not as specific region-to-region edges. The edges shown here are reasonable subsystem-level inferences, not individually verified connections.",
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
      narrative: "Note on verification: only PCC\u2013sgACC hyperconnectivity is directly verified for MDD during state induction. The subsystem reconfiguration pattern (core\u2013MTL increased, core\u2013dMPFC decreased, within-MTL decreased) comes from Chen 2020 in healthy controls and is reported at the subsystem level, not as specific region-to-region edges. The author\u2019s synthesis notes that MDD induction findings are 'more heterogeneous' and that chronic MDD can show opposite-direction changes. Edges marked with \u26A0 on hover are inferred from the HC pattern or from subsystem-level findings.",
    },
  },
  trait: {
    label: "Trait Rumination (Resting State)",
    subtitle: "Questionnaire-measured (RRS/RSQ) \u2014 stable tendency assessed outside the scanner",
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
        { from: "dMPFC", to: "TempP", type: "hyper" },
        { from: "TPJ", to: "LTC",   type: "hyper" },
        { from: "LTC", to: "PHC",   type: "hyper" },
        { from: "TPJ", to: "PHC",   type: "hyper" },
        { from: "TempP", to: "PHC", type: "hyper" },
        { from: "dMPFC", to: "TPJ", type: "normal" },
        { from: "HPC", to: "PHC",   type: "normal" },
      ],
      narrative: "Trait signature: PCC\u2013sgACC hyperconnectivity is the most reliable marker, predicting brooding scores. The dMPFC subsystem shows increased internal connectivity (dMPFC\u2013TempP, TPJ\u2013LTC) and increased coupling to MTL nodes (LTC\u2013PHC, TPJ\u2013PHC, TempP\u2013PHC). The dMPFC\u2013TempP and LTC\u2013PHC edges specifically correlate with RSQ-rumination scores (Zhu 2017). However, Tozzi (2021) found that trait rumination did not predict subsystem connectivity in a large independent sample. These patterns are real in first-episode MDD but may not generalize.",
    },
  },
};

const STATE_ACT = [
  { region: "dMPFC", hc: "Activation increased (Zhou 2020)", mdd: "Activation increased \u2014 same as HC" },
  { region: "HPC", hc: "Activation increased \u2014 memory retrieval", mdd: "Activation increased \u2014 memory retrieval" },
  { region: "PCC", hc: "\u2014", mdd: "Hyperactivation (some MDD induction studies)" },
  { region: "sgACC", hc: "\u2014", mdd: "Activation increased \u2014 affective node engaged" },
];

// ─────────────────────────────────────────────────────────────
// #6 — TABLES DERIVED FROM EDGE_INFO (single source of truth)
// Put this AFTER EDGE_INFO and BEFORE BrainPanelSingle
// ─────────────────────────────────────────────────────────────

const EDGE_KEY = (a, b) => `${a}\u2013${b}`;

const statusBadge = (ei) => (ei?.v ? "✓" : "⚠");

const displayStatus = (ei) => {
  if (!ei) return "—";
  return `${ei.status} ${statusBadge(ei)}`;
};

const makeFCTableRows = (tab, edgePairs) => {
  return edgePairs.map(({ from, to }) => {
    const key = EDGE_KEY(from, to);
    const hcEi  = EDGE_INFO[tab]?.hc?.[key]  || null;
    const mddEi = EDGE_INFO[tab]?.mdd?.[key] || null;
    return {
      edge: key,
      hc:  displayStatus(hcEi),
      mdd: displayStatus(mddEi),
    };
  });
};

// use the SAME edge set you actually show in the panels
const EDGE_PAIRS_STATE = [
  { from: "PCC", to: "aMPFC" },
  { from: "PCC", to: "HPC" },
  { from: "PCC", to: "dMPFC" },
  { from: "dMPFC", to: "TPJ" },
  { from: "HPC", to: "PHC" },
  { from: "PCC", to: "sgACC" },
];

const EDGE_PAIRS_TRAIT = [
  { from: "PCC", to: "aMPFC" },
  { from: "PCC", to: "dMPFC" },
  { from: "PCC", to: "sgACC" },
  { from: "dMPFC", to: "TempP" },
  { from: "TPJ", to: "LTC" },
  { from: "LTC", to: "PHC" },
  { from: "TPJ", to: "PHC" },
  { from: "TempP", to: "PHC" },
  { from: "dMPFC", to: "TPJ" },
  { from: "HPC", to: "PHC" },
];

const STATE_FC_DERIVED = makeFCTableRows("state", EDGE_PAIRS_STATE);
const TRAIT_FC_DERIVED = makeFCTableRows("trait", EDGE_PAIRS_TRAIT);


const NOTES = {
  state: {
    title: "What\u2019s Verified vs. Inferred",
    text: `The activation\u2013connectivity dissociation is the central observation: dMPFC activation increases during rumination (Zhou 2020), but its coupling with the DMN core decreases (Chen 2020). The region is more active, yet more isolated from the network it usually integrates with. At the same time, the memory subsystem becomes more tightly linked to the core, supporting self-focused retrieval. Because dMPFC also supports mentalizing, this pattern suggests a competitive displacement mechanism \u2014 not structural damage to mentalizing regions, but reduced availability during self-referential episodes.

Important methodological note: Chen (2020) reports connectivity changes at the subsystem level (core\u2013MTL, core\u2013dMPFC, within-MTL), not as specific region-to-region edges. The edges displayed above (PCC\u2013HPC, PCC\u2013dMPFC, HPC\u2013PHC) are reasonable inferences from subsystem-level findings but are not individually verified.

Furthermore, the subsystem reconfiguration is verified only in healthy controls (Chen 2020). For MDD, the literature explicitly warns that induction findings are "more heterogeneous," and that chronic MDD can show opposite-direction PCC changes compared to controls. The only verified MDD state edge is PCC\u2013sgACC hyperconnectivity. The MDD panel above assumes that MDD shares the HC reconfiguration pattern; that assumption motivates the proposed study but is not yet confirmed.

The key gap: no study has administered a ToM task while these state connectivity patterns were active. In this state panel, the central mechanistic claim is subsystem-level reconfiguration, not node-level verification (except PCC\u2013sgACC).`,
  },
  trait: {
    title: "Trait Findings \u2014 Better Verified, Messier Implications",
    text: `The trait MDD picture is actually better verified at edge level than the MDD state picture. Zhu (2017) reports specific subsystem-level edges in first-episode drug-na\u00EFve MDD: core\u2013dMPFC decreased, within-dMPFC increased (dMPFC\u2013TempP, TPJ\u2013LTC), dMPFC\u2013MTL increased (TPJ\u2013PHC, TempP\u2013PHC, LTC\u2013PHC). The dMPFC\u2013TempP and LTC\u2013PHC edges are specifically correlated with RSQ-rumination scores. PCC\u2013sgACC hyperconnectivity as a brooding marker has been replicated across multiple independent studies (Berman et al. 2011; others).

That said, Tozzi (2021) could not find trait rumination predicting subsystem connectivity in a large independent sample. These patterns are real in Zhu\u2019s first-episode sample but may not generalize across clinical populations.

State and trait rumination may operate through different edges: sgACC\u2013PCC for trait versus core\u2013dMPFC and core\u2013MTL for state. A state-induction design tests the more tractable mechanism. Collecting RRS alongside the induction makes it possible to test whether trait tendency moderates the state effect, bridging toward the cumulative account without requiring a longitudinal design.

Trait findings do not carry the same concurrent-interaction gap claim as state induction. The "untested bridge" emphasis applies specifically to ToM performance during active state rumination reconfiguration.`,
  },
};

const getCurve = (from, to, positions = REGIONS) => {
  const r1 = positions[from], r2 = positions[to];
  if (!r1 || !r2) return null;
  const dx = r2.x - r1.x, dy = r2.y - r1.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  const curveAmt = Math.min(dist * 0.22, 34);
  const mx = (r1.x + r2.x) / 2, my = (r1.y + r2.y) / 2;
  const flipCurve =
    (from === "PCC" && to === "dMPFC") || (from === "dMPFC" && to === "PCC");
  const dir = flipCurve ? -1 : 1;
  const cx = mx + (-uy) * curveAmt * dir, cy = my + ux * curveAmt * dir;
  const off = 18;
  return `M ${r1.x + ux * off} ${r1.y + uy * off} Q ${cx} ${cy} ${r2.x - ux * off} ${r2.y - uy * off}`;
};

const BRAIN_IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAEYCAYAAABxx2wUAADpvElEQVR42uy9OZRc5dk1ut8zD3Vqrurq6kndmsH+xA0gwpEciQQiiCCSExxBBIn5Eohg3QASSC5EOMKJiHAEEV7/+uH7bCQ09FxVXXPVmef3BqeqLYRa6qGqW8K919KSkbvP+J7nfca9yf/7/93AKU5xilOc4skDc/oITnGKU5zi1ECf4hSnOMUpTg30KU5xilOcGuhTnOIUpzjFqYE+xSlOcYpTA32KUxwVwugPTMumumH+4k8cx38Z/Zx2yONXHzwmgBdPH/spfmsgp212p5gE4pi+NRjqH4IAjuOBEIBSQFVkMAwBpRSEEACA43oIwwgAwPMcGEKQSWvf8Tz3h4cd2/eDm7bjXnJcF47jgeUY5DLpX/yMZTu75xBFAZIoQpbENwghX5y+nVOcGuhT/MfBD4LvO93+8wCB7/vgeA5RFGNpfpYc5BhRFD0/GBqIYwpJFFDIZ1cAoN3trbquD8O0wLIMFFmGKAjgOBb5XGavc1xZ26z9oKUU+H6IKIqQ1lLIpFPkMPcYhtGXQRi8ChAAFEPdhCDwkEVx92dkWVoBsHa6Ik5xaqBPcWRYtkPv92gfMEhIpZQPWIb5GED9Yb8fRdGnW7Wd64ZpgeO4sVFFWksRAMtHMFZF3TDbrU4PqqKAYQgM00JaS6FczL8G4K/7TYGMr91xPdpotiHwHLSUiiiOocpyRxSFPwLwRn9Ew7RuRlE8+ioAz/MRhhEEngPD/DsTmM2mP/A8/x3bdgBCQAAEYYgoiiGJAmRZgiJL5HSVneLUQJ/icRAAXDMt+yvHdWFaDuIohqapMEwLQRDifhtNKVDMZxHFMaIoAsMwYBgGgsAjm9YIgBebre63juuCYRhQADOlPCRRnKhB2q43KSHA7Ez5bYYhH03imFEcv2/bzjuW7YxSMjHGXjEAKIoMdmSIk9SM9AnLsn8+yDlMy6ae56PTG0BVZFQrk7v+U5wa6FP8RkApvW6Y9qc7rQ4oTQzQ2Mt1HBeqqkCRpdfCMLpGGFIjgDE26AzD/Pd9h1p2XG+1P9DBMAS27UIUeRDCIJ9LT9wwJx6vSxs7HWiaglIh/7R6os+3Or3vu70BJFHA8tL8SwC+Pl2Zpzg10P/BCMPoy42t+qs8zyGmFCzDQEspUFXla57jru+VsngcgiD8xrTsq73BEPlsBrls+jKAW9O4hziO39nYbryfy2jIZtLHbaCLADqO69F2pwdJElEuHm2TaHf7tN3pIZ/LoFIunqY+TnFqoP8DcaXZ7v5gOy5URQbLMpBEEaoiT8IgvFjfaX/reh5kScLszHSNTKvTo5RSaKoCZTLXfyBYtkNX17fx+2fOT3ITqq5t1mqW7eDCytKaIPArYRh9zrLMd5btfOp5/q9+IZtJf8Qw5EcAGiHkk9Ml/p8J7vQRPNkIgvAbz/evPiSNAUWRP2AIuXXzzurnmqqCIQT5bOYLjmPfmOD5P0ipSavccXmAhmlhplQ4CW/z5TurG/j95fOfTDhCqC8vzhHTsun6Vn25XMxTy7ZhWvbrkiQiCMJf/UKnN3gLoJAlCRzHfqylVEii+Hee5/54+lWcetCnOF4sR1H8Z9Oy3yKEQDfN3Y9WkSQIAv+geQYIgeO4sB0X+WwGcRwjk9Ym/gG3Oj0axzEkSRwXCqcG3w9u+kFwaaibmJst/xHA34/zJdy+t06L+dyjWviOjK3aDqWgICAo5LOglEJV5DSSOoCGpKsEpmV7lFL4QYDB0IDjuJAkcbe3fHam+CdCyGenn86pB32KKSCKok9tx71uOy5s2wHDsojjGL4foFopwbSSwYt8LrOn0c2mtTfXNmsfA0CxkJuGUblCkAyWzJQKf572M4lpfKnbG0CRJQD49jjeQ6fbp7IsIYoiqIoyVeMMAJIkghBANyy4nod89hfnGxdrkVKV3X8v5LK7m5fr+SDJZvKpKIqfnlmonhYgTw30KSYYvtNmuwvHcZHWUojiGJqqQJJEaCn1D5TSFULIF1pKfXz4Q8hnhVz248FQRz6XAZK2On9S10opvWJYNjRVASHk+6kvRpb9m2U7L2cyGiZ5H3t67EHwg+24KBZyZLu+Q+erleemfc5SIUcs26Ge56PeaCOlKDcFgb/8uN8TBP6yIPBIqUpitPNZdHp9+q+f797IZdKoVsqnhvo0xXGKQ+JFx/W+3diqQRAEVMpFBEEAlmWRUpX0/Z7TAVMCq5u1xjIhBDzHYfEAE3z7wWBoUM/3QSk9lvxzHMfvbDea76eOwZNNUhobdGlhth7HcdWynGlFIQ9FfadN4ziCH4RYWZo/ynm1Zrurt9pdVCtlFPLZ006R3xBOyZKmaGws26E7rQ6t77S+1Q0T55aX/rqyNE8UWSKZtEZGYaxx2HMIAr9SrZSRy6Th+QHurW3RSd6D5/vgWHZ3gGPa6PWH76e1FGIaT/1clNLXFVmCKAhzvb6OXDZ9rPncaqUksiyHIAhg2c5R3psxUyqQZy+de3egG7i7tkkN06KnX+CpgT7FHimMnVaH7rQ67zuui1Ih/1G1UiYzpQLhOPa1SZ9PkSWSyWgfFPMZMCyDn++uUST9vJNIOaDTGyCfz35wHM8uCEPEUQwaT9++EEK+GA3xVKMoAsuyfzrmpeKnVBmKLKPRbB/9Q2aYD86eWSBpLYVub4Cf765R3w9WT7/IUwP9H40oij/0PF/vD3S6WWvQUVfFWrVSJsV8jrAs8/a0r4FlmHdz2cwr2bQGWZJw8/ZqGwkfxdG8zLExG3UWHIPRhOcHkJMi4dSRUhXUGq3acZ3vV7mJlEo4LikOB0H4DUYUrUdBuZgnZxbnyOJ8FTdvry4/sA6eB3A1CMJve/0hHQx12h/odDA0aH+gU8/zdQAvUkqvn37ZTwZOc9AHdXuC4HtQaN3+4BJAQAjAcRwMw4Tjelg5Mz+VEeh94spgqP9g2Q5Ylj1S3phS+maz3f0YAPK5zI8Czz837YtvNDvUME1cOHvm0Hn5gyAMo8/XNrZfz2Q05DLpE+kx7g91OtRNUEoxU8xDUeQ5HHLi80H0+kPaaLZxZnEOjuvC9wOYlg1FlhBGMXzfByEJFSzPcRAEAaZlgec4KIoMAMhl0gbHsV+eQIRxCpx2cewLcRy/Yzvu+4ZpwfV8+H6A8yuL7zEM8x1GvbrFfLYIoHPCl/pjNpMmgiDQja06JEmkh+1dJoR8z7EskrYuYhzXDRDCYJSimfo5OY59I5dNv+4HIRzXvcrzqWN/Yaoi/+h5/pU4pmAYBq7r1SRpMht8PpcpmZbd7vYHME0bmbSGmVIBoiBAksQ0gBUAOoA0gFXfD35UFXlZkgQMhgZsx8VQNzWAXpcl6XpaU8Hz/KQmVE9xaqCP5o12e4Mf2t0+ZFlCGIbgWBbZtAZJEvEAqRCeAOO8C0WWXpqdKd3Yru0gpShfHjb3PTRMCDwPQsgx5TLpmF3v2PiVOY5FFMXw/OBE3pXA88/5QUAZwsCyHViOg8W52Ykc2/P9H2VZRBxTpGaUB3uuAeDHX1yLwK+Mh6Iq5YTv2vP8dhhFRd0w0R/oYFgW9Z02VWQR5WJhT5GFU0wGpznoBxDF8fvNVpfevrf+Q68/TCa9ZAlnzyy8trRQJblsmsiS+KR7EF8HYQCGZdDtD1495DH+kVIVBGEIx3VfPx7vmSCb1tDtD745Ng9WVb6O4giu653Yy5qfnXmX5zl0egPIkjix44qC8NZgYIwpAA61ZkVRKKmKTGZnSmRhrvK3bDqFlCojCELcvrf+4trGNvX94Oap5Tj1oKcNbau2ow91A5QCs5Uicpn0JyzLfvagp/E0oFTIz0VRXBsMDWS0FD1M2DxTKqw0291V3TCxn8GZo6eSKFiRRfgQboppgee4l1zPp1KikHIVxzxeDiQdGAzDvD8aNppcPEJpMaYJLcBkog3ulUxaQyatwbRsOh60qu+0LsVxTGcrJcjSqVjBqQc9YZiWTX/6+Z5OGILlpXmUijkUctk/jwjbf3xKb6suCjziOEajdejsy5rA8wDIUXt195uagWUlBc7jRFpTEUURLNv55qReVlpT65RShGEISulEIhZCSI1SimlYzJSqkHwuQwq57Nsz5SLKpQK2ak3cXdukAF49tSqnBnoi2Krt0G5/gLSmopTPGaoik0q5SH4LFI+5bIYszFXguh6CMDxUuw7LsiAEMC176tebUpUvxoonxwmB56En+fa/n9S7EgVhbpRSQLvb/3wSxwyC8G1B4BHT6e2tDEM+kiWRpFSFXDi7RLJpDf/7050ve/3h6bDMqYE+Eq7+8+YdGkURNFVFIZ+FKArp39pNjnUHh7px7ZCeHQEIbMcdpwCmBj8IXi/ms+OC3YvH9YyiKEIhn8VQN66e5Ltiky4OgCYq6Uc93lA3XiSEIK2l/OO6h2IhR37/zPnX2t0+bt9bP51qPDXQh/ogP/6//3vrm/m5CmYrpXo+l3luSrmz50/6XlVFJtVKCW5CCn+o66lWSpezaQ29/nCqKQBFlkRB4OF6HgB8d4yRxkue58P1/RN9V4V89o+DoYFOvw/HdT884uGWbdcFz3OQROHKMd/KXy+eO0MW52axvlnD6sY2pZS+eWpuTw30Y+G4Hv3xX7ffvHB2Cdm0Rkah5STyzFcHukFbnR5tNNt0q7ZDfT8Yq1CPR6+18X/Xd9p0p9Wh3d6AOo5LTcumruc96G0Ik7hnzw/AMiz6A/2wjHS3ctn0nGlPPc3hD3UToiDgIc9imvg6CEMQnHh96+/PXDx7+cLKmb8GQQAAlw57INOyV2lMx10ht07iZiRJJM9cPPdRLpvGP2/d/bi+0z71pk8N9CPx4t1EMeO7UbO9MKHjXqk1Wt/UGs1xeAoA6PYHy7VGi9Z3Wu36TovWGi291mjRWqPVDsMQcZwQsm83WrAdFxtbdaxt1minN6BRFH2MCVFuZrRUZ6jrYNnDv+5ef1hjGRbTbqlKaypEgcdOq4sgCL89roVByBPTfHCL49jX/CBEf6gf+ll7ng/P95HRtC9ONG3DMm/nMmny+8vn07bj4M7qBj3O9/q04z9q1PvWnTUqSyKWFqoT+Rptx6W6YSKOY4iCAE1T/xFF8fOSKOxL7SKO47/4QfAeAJimjSiO4boeoihGFMcQRR6Lc7NHHtqIovjDnVbnLYBibnbmUPfe7Q+obbtIqQpy2emKufaHOvU8H+1OH+dWFnEcfef31raoJImYmy3/FtrEhM3thsdxHGZnim8QQr54Ui5MNyy6ur6FlTMLo/rGKU49aCQscxzH7hKeHxHaxnaddnsDlIr5D6qVMinks0Tg+RdkSST7lSJiGOa/JVEkkiiSYiFHZkoFUikXDZ7nAFCAAv+6dXc1juO/HNWLieMYtnP4YYxCLlsSBH5cLJwqcpk0UWQZM+UC7q5uQDfMaYfGyxzPjb3o5ad9rUdx/B6lFJRSTNs4j4iV9l3bSGsq+a9nL7y7urGNdrd3mvL4TzTQURR93On2aSeRvKedbp/ajotMOoVCPvvSJOz90nw1vTBXISzDvDvJaxdFIb0wVyHVShm246JUyOPm7dX3jpqTZVkWqiIhiqJPD3mIjiJLSHp1oy+n/Q7TmkpkSUS1UsZ2o3n/dQvTOqfAc9ANaxVPQHH3SBHIQH+H5zkosjj1c9V32p+GYXQQxkaBYZgPnvvdxbmhbuLm7dXTvun/BANNKb3eH+r01p1VurZZezOVUpBKKdC0lK+ORpZd1wcmJws0VTIfVZHJpfPLLzmuCy2lYqu2c6TjlYq5r2NKYZj2oakktZQ6p8gShoZxLB+UllJJTCk0VcXqRu16GEafYzpSWCJDCASBRxiFAPCPp/lb4FgGhmlDVZVpD1ldjeMYB+R6Gb+/+rnlRTI7U8IP/7z15Wle+jdsoHdaHfrTz/c+dV0PqqKgUi5inDqQREGUJZF0ugO4roeN7cbTFFZ9vTg/+0Ycx1BkCY57eC86DKNrum6C4440pVcPwvBYhlZ2N5ZCTpQkEWlNxc931163HXca7281jCIMdOPQnBVPEkzLRjajgVJamrJTNEdxtNeRzWjk4rkz+NfPd1/s9PqnKY/fkoF2XJfeW9uifhAgl01jplR4b2GuIt6viDzG7EwRDMPA933Ud1pPzUIghHyxtFB9IwhC+Efo0yVkMp0KjuMmHQIJuftxwC8VciSOY8iyhHa3B8d16SRTHaZle4QQaJOpT5wowjD8ilIgDKPd6cQprs1vmGRNXT3K+5AliVx59uKfdN3Ez3fXT430b8FA313bpDvNDvL5DGaKBaNaKZMRBehDrdhMqUC0lApJFOH5AY5aeDtuI53LZnbb9w6DOIp3qTWPgqWF6p9kSUKn19eO8xnMzpRe4lgWvh+i0x1gu970/CD4wfP9mh8EP/hB8P19f37w/eDmfsPmIAgQhiEURa4/7R/0UDdf1lLqsbQNer7/D8f10B8MvwHgO65HdeNwk4OEkM9WziwQLaXinzfvTnQDPjXQx4vqrTtrlGNZZNIaMlrq3f2OaJdLeaKqMhRZQq8/fO9puulESPXwBlqWpTe0lHq/B3rYzeKzXDaNMIoQhuFXx5zuIZVyAQxD4Pk+Vte3r6yub1dHfz8//rO2sX3l3vrWpd5g+CKSgt+LQNIWaVr2/ZqNrw6GOqU06RsmhNSe9g+a5zn0+kNoqelHA7phVrWUikxae1c3THrz9ioE4WgEmdVKiVRmivifn257OMZx/yfWOXua+qAppddv3l79VEupSKkKshntwD2erud7vf5AYBkWM+XCxOSFpo3tepPOV2dewhGKnK12j8Y0xlA3cfHcmUO7WIZp0U5vgFxGQzaTPpGcrWU7lOPYOujI0yL3RU4UGgDPsp3iaGwcDMPAMCzwPIcgjDBfnUGj2YZtO2AYBvPVym+iL1c3LLpd38G55cVbgsBfnua5Or0B5VgWlu0gjmNUK6VPRgyQR0ar06OGaeHsmYX/6F7pp4oP+va9jU9TqoK0piKT1g41wCEK/HWWZT8nhMB23JoiPx38tVEcAUfsQMnnMn/drDVeFQUe240mnT/k0IqWUuc6vUHNtBxkMyfDL7Uf2SVR/EWUXC0X82+4rve+Ydno9hNyfC2loFTIvwbgr7+JkJghY2emOO1zkSTNAUHgUCrkJ/odlYt54gcB9f1gVRD4ldMUxxOOWqNFJUnA3Gz5k0xaE3HI6TpCyBeyJMIPApwEteXhPwYC/JvL43C7Mce+Vi7mAUJg2+5YSfowqBfzWURxdJS+6uNGnWGYDxRFJjOlApmfnXlhdqZERoblr7+VDzoMQ0iSiCiOp26gWZZBfzBELpP+2zSOPz8780q721/GfzCeCgPdH+i0P9CxNF99aRRCHakXVlWVD3iOQxzHx51HPSqO3HudUhWSUmUAFFEcH1pPjlIKGlOY1uH7qk8YJ9nrfOW+IvW1SQ7+6KYFRZYg8Nzfpn0TiVgLAaWYVsH4b0PDgGU7NAjDG3Ecv3NqoJ8caECS79yuN1GZKcB23IkkzFmGeZdSCo5jsb5Vf3nC130NT/i4cCGX/bMkieA57uPDHiOtpV6IEwONUxxghzUturax/cNPP997b32rTn/6+d6NerM1scGfMIzgej44jntl6lEdQ5KNGnRqea5zy4v/6PWH2Gl2rt1Z3Xh/u96kg6FBoyj+8D9hvTzJBtrw/eDmvbUtPHNx5bNcNvPBJPPFuUzaAE2KR0cZALkfruvR1fWtGwC8J/mlB0H4tuO4R81TdghDwDAsAFzBKR4J3w9udrp96vtBorKtKqiUi/4zF8+SxbnZiazrOI7fEQQe3PFIhhVt20UqpYJlmB+m5qXH9BLLMsjnMqhWyqCUwjAt1BrNtxrN3z596RNroGuNFr11Z+3SxfPLYFn2T9PgvEi4h3n0+oOJHLPV7aFaKQNPeGfI3bXNZS2VQrvbf33UdnYYrGXSKZimhSAM3z81wXviZdtxqe04lyiAerONcimPM4tzRBKFiZJl2I77vmU5yGWPpXDbsWwbDCFgWfZP0zrJZm1HC6MIqiITLaWShKem9MlcdeYDSilu3l6lznSmS08N9MPguB7d2G7QMAzxX89eIPukmlzuD/QDv6SFucp3AIFuWIctdgkAEMXx+1u1HUpAcJ969hPbaH/x3PJH8mh8OqUqh85DExCEUQSGMLdwir1SGl/5QQAKYKfVwbMXz72tpabTzkcpBcsyoHT69opS+qYoCFPVOwQAjmN/JaTAsuyfWYZ5V0upyOcyuH1vA0Pd+E0a6SfJQGu1Rouub9YgCjwW52f3tStHUfSp43qrh8mF8jz3B0VODNWd1c3DFLt8ANiu77zjej4K+SwM06KNZoc2292JpTnanR6N4nhiD5plmbdz2TQZtaodWloqiiLkcxkMhvpbOMVeaQe4rodao4XfXz5fYhjy0bTONRgaSKkKOI6bunaXbpgfe36A3JTbLONHTL5qKZWUi/k/XfndxVc2azvYqu385oz0E2Ggoyj69NadVT0IAizMVZDNaNgvp/JgaFzf3G5gplz4cTDU6WB4ME86l83M+X4ASRIPRKRkWjatNVrUtGzKEAYMIdjcbmAwNJDRVMyUChPzkmzXBZ2ggZ7Y4mEZsCwLPwhPLfHDdm8/uNnrDxFFMX536RwB0JnWucIw+pxlWfh+gEmnTh4Gzw/AcSx4jrs1xee3KkkiGGZvMzWyE3/7/eXzhOc5/M+/bv+m6EtP3EBvN5q01mhdV2QZ+VwGKVV5ThL3r6DB8zziOIbvB1cM0x6Lox4EdU1T4fs+ojDEfYWHXxXQ/CD4wTAt2mx36VA34QcBBroBSRSQz2Vw6fwyWZirEGUfQxQH8ngZBooiw37Ccm35bOa5/mAIhpwKY+xhPGqe7x/L2LVp2a9TSiclSPG49MbrjutB4HlMc1rRMK1lWRZ3h28eh0q5SJYWZvF///fWl34QfP9bWEMnOkm4trFNgzBCIZeBKAp4GAvd49AfDJHLplFrtFAq5JDPHZwuspjPkSiKqSyJqO+04fsBvV8Wy7Idalr2bgVZlkQIvIBiPtsRRaE07eeU1jSEUQjP86DI0hO3iI5KOflbRW8wvKoqyrF0VdiOC4Yhx7I+LNv5PApD5DLT5csSBB7NdheV8r6bjbRMWiOXzp2hN39efX6mXKCVcvGp9h5OzIO+fW+dUgqUCjlk0toXhzHOQRjekEQR3d4AS/OzhzLOY8yUCsQwbeSyaYRhhPpOmzquR+s7LdrtDxBFEUzLhiyJmJud+XO5lCfHYZwBQJbFrzvdPnief9LWj0dPbfOeiKIYQcKSN1UjMdQNSmmSApOmr99Y7HT7EAQeKVV5b7pRgQMtpR6k6Gkk34tErvzu4mXHcXHrzupTvUJPwkC/+NPP96goishl08hmtDc4jn3jEGHWm67rXQvCEMV8biILc262/Md2t49cNg1CCAZDHZ4fIAwiMAyDlaX5d+erFUII+eQ4H1gYhtfCMHriFk8c02uKLI2pLS+dmuRfOg/Hld4Y6CYAAkmcvsSVadntMIogCAJG9L7TSqNcZxgCAgKOO1Sgf2t5aZ6kNQ3/vHmHHiN/+dNroKMo+vSfN+98m9CEqshl088dVtSy0+t/bFoODNPCTHliBbm/P3Nh5T2OY8FxLERBwEypgJUz83+olIuEYZgPTuY1JYt0iu1Th2oJZBhS43kOURSj0ezcPDXL93m1Q+MayzBQZXmq53E9j6qKDI5jkdZSH037vhzXBSEEkjjdLlLDtD6NohgMQ46k6l6tlMjZ5QXcvLOmxTF96rqNji0H7XoevbO6iWI+B1kSkc1oaRyeW6LoeQEs28bZ5YWJciowDPPfaS3130/SSwqCELIkwrRsaCl1Gqf4RWXV94ObQRheYggBYRjfNC1h3O8axzHiOAYhBGEYgWUZVCvll27eXr0RxzHlOQ4ggCJLkCXxsyCM3mAIqUVxvCyJwp/viz6Eh537N4KXPT+AYVpYnJ+dasrBNG0MDRMZLQWWZd6e5rkazQ71Ax9RFCGtpabWXxeE4Y3+QIcfhMhUjpxF1GRJImfPzNObt+99+Oylcx89TQvpuAz01dt3NzBTLiAZkEgdadHqhtkGgHKxAIHnX/ite2NpTf1Dq9P9lmEkAHgZwN8mGUrqhvUpQBGEIYJRyxzLsnA9D47jCdmMBgICCoowjBBFEUCSQRVKgfpO60Yumx6T3oNlGTiui51W5/ooNbMsyyLy2czH3d7gYwpAFARUK6WS7bjtMAwBkFGEQMFx3JhOdFyFEpGMz89RSl84bNR1XFjfqn/leT5mSoVpe5l0oBsghKBYyE17fPBaHMcIghCVcgmYnmjyq4ZpXRutzn3Ryj7uMQFASlX+rMjSx6Zl08PUu37LBnr51p3Vb2ZKBaQ1FbJ0ZD6Nl1udHjRVhSxLv0Xv62H4rlIuYqfVgWFaXx11Es20bGo77m7IKkvSiNkvAs9xICSZ3cpoGirl4o9RGF0BIQAoZEn6Ax4x3BKE4Y0wCK8BQDqV6hBCOiAwXNd/3rZdiKIIgIIhDJrtbtswLUTJNCLS6VQynRhGiKKYNtudEVta4r1LoghB4JHWUp8ng0l0d8oslVJ9SRS0IAi/1g3zqqLIEHjukzCMXj2uYi4ADHWTxlGyiRULuWkagqtD3YTjeFhempumwQQAbGzXb6S1FCilSGvqtDaD53v94ZeGacH1PFw8tzwxTUVCyCfLS/O3NmuNb1JPkfbk1A30vfWtVUEQIEnCJIwz+kP9qzhORlqPoyH/SUpzZNMaLNs5bJrjUn2ndRMg8H0fHMchimOosgyGYcAKAlKq8hEhpParabcDdI/wHPcS/5CijsDzSGvqLzz3KIqvlov5vxNC9Dimc0Nd/3CcZvd9H4Vc9r4vLJkqi+IY/cEQjuNhPAHMsSwYhhG6vb6nGxYK+Sx2Wh2EYfRmWlMRhhElhIzqCjwEQRhvNhM1oFEUfdzt9cFxHBaK+amuh7XN2jeEEBTymalPDlq2Q1mGgSxJPigVprQZaEAy2m07Li5fWJnG5tbhWA5IGCe/fhq++6ka6Ha3RwFgaaH6AcswH0/imLphQhB4qL8BBeaDIJvR3tiuNz8/oBio5nqebpg2dN1EEIZIpRQwDANVkZDLZh7pDU8ThJDPOI7dnRZlGIJcNrOf/ODzSCbydgUb4jh+x7Ts99NaCpm0hjimUGQJcUzhuO5uzhyURZLbDJDWUmg0O5RlGVRnyn+3HeeqwPOQZekygENNx21uN94URQEsy2JafBsA0On2aRAEyGczEAQBjuMI0yza1RpNZNIadpptYVppm/5Q113XQ7vbx+8unXt3SrfyYxzHsGznhjrl1scn3kB7nq/XG2387vL5jybJRJfPZtDtDyEfR0/REwRCyBdjqS7dsOhe+nlhGH1OQYtD3bxGRp5nfzAEy7KoVkpIaykRT3dh7ldFYYZhPkhrqYd22NzntV9yXe9mNqPdoqBp3bCq4xbBZrt71XZciAIPPwhuzs6U4CXcKn8E8CP2MaK90+pQXuDhByGWDykltt/0VKvTQzaTRiatfdfq9F6cmy1PLf/c6vSoKAq7tQl5OhJxLxIAnd4Av798/o0p1hgu9QZDuJ4HTVUpCFDIZf52HNzZT5yB3thuaLOVEnzff0uWpX1Xl8Mw+pLj2I8f5tk5rkcd1xu3+PwBwN9/o/Z4Gb/klBYBXPF9H9VK+dbNO6uXFudn6ThfTClNJKzCACzLwrRsqIoM3TDB8zyqlTKepsLIlHDr/l75UuHfHmccx+8wDPPtUDe/jeII7W4fAs9hfbP2jaokKSAtpa4JAv/KyGDfj2u37qzeUGQZURxjcW52ml0C19Y2tjFfnYGWUv+2VW++LAoCppRyQBhGn7c7PSzMzWK7voNnLp6d+BpyPd9zHFeoNZp49uLZd6dcAL6S6FCqKOazn3ie/+btexsvCwJP87kM8tnMoXROnzoDvV1vUs/3IUvigXdc1/NeNXv2q+6oI0CVpd2ppcFQh5ZSMRgaiKL4GssyT72BppS+HsfxC7phvgkQyLLkW7Yt3D+YMu6gkJNncfn3l8//pdXpvReGISzbReAHSKdTo58ku6Ox+Wymc5wFsqcQAgB/3N+eSSfdRflsBn4Q/OD7wRXLduA6LvpDfTmtpX6gMYUkCdBS6rvd/vB923GgpVIYdamUMCVCpCAMb9xb27qWbLwWhrr5MqUU1UppGhuvBsC4s7rx+oVzZ752HPdaGEbwPF8XRWFi3noUxR/6fiB0un3MVWcweg/CtCI8SmmaIQyCIATLsl8qivzn+eoMjeIYtXoLluWsplQZuWzmiXFmyP/7/92Y6AF7gyHtD3Rk0xqyGe2zg5B5x3H8zvpW/X1VkZFIUnFIqTJ8P4DtJA3yLMPAdl1YloPZmSKymfTT5hk+7/vBF57vXzJMC74fIIpjyJIE07LA8/yefAqEkKTjgWHAsgxAk35jQRC+iKLolUl+PKf4dWQ3NIxXLdvBcGhClkUsVCu7G+D6Zo2eWZwjkz1n+BXHcV+22r0vu/0BUqoCw7SwMFeBIPB1URDmpnW/nV6fGqYNjmWhmyaeuXD2T/tlmNxvlGha9upgaCAMQ0z62T0M3f6AmpaNYj73YPte0XbctuO4GOgGHNfD5fPLn4z0T387BjqKoo//z48/vTk7U8LCXOUwD3xZN6xVVZU/2Ctv7QfBD5ZlX2m2u2BZFizLIq2lUMxnn7jw5IFn86lh2tdbnS6SYY7k8YwGDMCyLFKqsgLgchTHLxKQzsONNLxRGGjgFCeBq7bjfuM4LmJKwfMctJT6QaPZfieb1o6USopj+pbtOB8apgVRFNDp9jF2VkAIRJ5HNpv+mue4l6YZUbQ7vSSVKIkIghBzs+WJG8/B0KCGacG07Gl1bDzUQLc7PVw8t/znPeganrcd93vX89DYaSObSU/l3k/KQFd/+vleLZ/LQJGlIw+jPA6O61HbduB6HmzHRUpVoKVUpFTl0FX4aWCom7Td7YFjWQRhCEkUkVIViAI/dRKdU0wd1wzTutEb6GBGbXwAkM1oj+0Xv99L7g/0l+OYwnYcBGEIWZLAMAT5bAYxpVBkadLe657wPL99d22zePnCyrv31rffP7+yOPHvybRs6no+ur0+VpYWvuN57g/H8a7qO60bADA7U/rzfvh07qxuUIYwOLu8cGLf6cQMdK3RpAAwN8UK9l55LMO03uoPhrvE3jPlon/CPdKC47ieYdmgMcXQMJDWUmAZBqVi/tQo/wahGybtDXSAUqRSKlKKjJGW3kONgeN61HU9ABSd3gACz0NVZKS11Jog8O8A+Otx34PrenSrtgNZkTDUDZSLeZQK+Ynn1VvtHiUECKMYszPHQwfaH+g0UTtnUCrs/xvc2KrTKfZlH4+Bth2Xrq5v4XeXz5+Y8bFthw50E2EYImERU3ESXLD9wZBGcQzHSTx7lmVQzOeQzWinhvk/Ay9v1Xa+clwPLMtAlkSwIz7oQi77V9fzXg2jCKZpwbQcZNIppLUUTrov13FcatoOdN1MuhwK2XcnTQ4WhtGX61u1VxVZQkwpRimhl3AMQyP1nRYNwwjVSvmvHMe+dpDfbTTbdNQCeOxzA0c10AIA/87qBp2dKSGlKifeY2uYFrVsB1EUwzAtLC1Uj8SGdQC82O0NvrUcBwwhMC0HC3MVqKdpjP9IBEH4Tbvbu2paNjJpDYQQ+EEA23bA8zyCIMDsTGmqAy37QRzTt4IgeGeom8V2t4eZUmFqI+qU0tc3a43PGcJAVWT0BkMsLVSnmVPf9Z43ths4e2b+0M+72xvQVqd37J70kT3o7XqTdnsDFPJZlEv5fzwJ5EWU0tcN0/rctByYVlL1nvRY7/2wbIfatoMwinZHsSepSXiKpxovBkH4HgVNM4RZZVnm73EcP8+y7Ns44UJvq9OjrushlVLQ7vRRrexuGFNrdbvvG30zpnRukkNse6D608/3aul0CmLSrntoW7C+VaeUUiwfQ8fJRAz0dr1JdcNEOp3CTKmw1054bbvevDFfnTl2g6UbJm13+0ipCkzTxtnlhUl6+FXbdmqm5YCCwvV8uK6L8ytn3p6mcvMpTjEB7/5bw7Re1E0LKUUGx3G/1RTcq//70+0vl5fmoSryn1qd3qeEEDiOC0opBIEf6yoipar7+m5/vrtOC/kMivncsTyvQxloz/dr65u1ajadhpZSIIrCI3sG1zZrdHFu9qNp89U+DI7rUcdxYVo2TMvGMxfPvoYjFGAopW8OdeNjzw/geT6CMATDMMhmNOSevp7sUzwaywBWAHyLp3Q8nlL6+ng6z3Zc2mx3wbEsCrkMFEV+2sf+H2mjbt/dqM7OFBFGEYa6iXwuA0opoijGmFExiiO4no84jhFFMeZmy4iiCLIs/Sjw/HMPOfSl//nX7ZtLC9XdwaYnzUAvN5rtVYBASymP6/sUAPj31rZodbY01TTDY3BlMNR/sGwHumHh8oWVQ1Wmx4rfhBCYlg2e41As5E7zzL9RDIYGvX1vHStn5lHM506MWOqw8P3gZrvbv2RaFlRFgSJLyKS1E3GUjhnFzVqjTUBg2TZymQxmyoWHvb9rURRdi2N6xbSsF9vdZBgojmN0+wNktBRmysWH1bCu/e9Pt2/8/pkLT5yBvvTTz/duFgs5pFPqvnQA4zh+p9Fsvx/H9LDDK5OCMNQNzw9CsCyD/AHGOT3Pbw8Ns0gIgWFYiGmMQj576jH/B3jQ2/WdVUkSoRsWVpbmn6r3vdPq0IQeIYW52fJz+DWPyG8OQ92gvf4QqqKg3e3h8oWV9/arnThO/bieB1EQ0BsMwXMcqrPlX9XWGs02dVxv6mviQAa61mhRgCKtpR5ZDY3i+P1Wu/fOmBkzDCPYjoNCPotCLnuii3yrtkMpTZRBVs48/uFatkO3603IsgjH8ZBNa5PUQHya8bhCkhBF0UcA8QAqJjzTj27bCsPo81GE0qGUFgmB8SSM2zbbXQoAsiRCVZUPjqGwdWjPsT/Q27IkYn2rDkkSsTQ/O6khl10O5SiKPgWI8YR54lc3a41vTNNGqZhDu9PHMxfPHkpWr77TogPdwNmlBSOMIu0hEbIAwL91Z43OV2emSkS2bwNtmBbt9YfjkP5xuatiFEXvgRCdIeRWp9f/nGEYNFtdzFdnpj5l+BiP/i/tbv89z/PHOekX8BAKSyApMhJC4Hk+mu3ugXbjJ/UDHi2u+pSO7Y3+7tiOq29uN0AIQCnAMAxmSnnsxWcdU4pWu4s4prsMfaqSCK6yLAOO5aCq8omkk6Io+vSnn1evF/LZ0f1QVCvlPdfNScBxXRqGETq9ARzXxWy5hFz26BEepfRN3bA+th0HoiAgk059srpRe5MQ4Nzy4pPgqLza7va/7A908DwHx3FRLORQyGWPlMrpD3WqKvJeeegkhRQE39+5t/H8s5fOnayBjuP4nX/9fO99LaXizEL1jzgEzafr+d5waAgMS5BNp49rvHNPYzIYGm3TssEwzEMZwYa6QXmOg25a6PWHeObi2aetoCIA+IMfBB9YlvM8z3O7BPZRFCGZYktkrPZeHQQ0psjl0sho2keU0jnCkFXDsN5JdARHnm8UIYriMb0IKEXCUaEqoPed5f7feRi4+5RYCADTtuG6PliWBcMQOK6HYj4LLaUeag0ebWOnb61vbn8oyzJsx4EkCohjinwuc9I1iFc7vcGXQRCg1x+ikM+iUi5ObK3WGi0aRiHCMIIkCojiGALPoz/QcX5l6QuOY984ibU9GOqewPNodnrw/QCqKkPgeTiui6X56rG9j/XNGs1m0lPrgtmXgR7qBu32h9BSyoHGJB9Eo9mhQ91ANqMhpSonzlG80+pQx3EhSSJmSsW3Xc/7UJElsrHdoKoswfMDmJaNi+fOPBUpjTCMvvR8/1XTsiHwPNrdHrSUCtO0wbAMUoqyKxM11vLbtYYPdZ/Gf9FdXUAASKnKLu8EQHxJFF7FBIVsH4JLruf/GASB0BsMwbEc8rnM/cWbqfft3u9RbtebH7uen/Bv8BwkQYAo8sfKrBjH8V8azc57kiSg1x+CZRiUS4VpfFPLANZs26H9oQHbcUFpjJSqwrQsLC/OH5uz5bgeFQX+vSiK/7BZa1wVeB6iKCCjpQye5z6Y9OTjfuD5fm273qyePbNwYgZaqzWaOsuyExmdbra7NAxDDHQDs+US8rmT416N4vj9eqP1DmEIOJYFz3EYe9W+H4BlmWOhQTwirpiW/YPjerBtZ7ftT5ElSJIISRAgSeIKgCKl9AVKITIM+Tue3oLR841m+/veYIhiPndiA0HjVJntuGAYgjCIoCgS8tmMIYrCa/j1+PKlUfrnu33++55rtt3pvRMEIQzTGkeAx5k21PqDod7tD8EQBpKUCB9UK+W5KaXOEATht1Ecv9BsdYQgDKHIEgq5bEcUhWtPQJrp+R//9fP3Z88sTMXhfKyBdj2PDobGRHktbMeltu2g1ekhn8ucCGfGGJbt0PXNGpYWqkipSglAp93tU8MwsZLsikVMiYT9kLjW6Q1usGxCDNXtDcAQBgxDkEqpUGXpSLp6TxGurG5s/+B5PsrFPLSUeksQ+MsncB1Xu/3BN4ZpI4qikTCtAGEktDseiKCUJvwsros4inejFoHn8TiS+CiO37dt5x3X9eB4HnTdAsexJ04l0O72aa8/QBhFWKhW4AcBcpn0JHmUhW5v4FEAg6EOlmFQyGdPtIb1kKj183a39/q0Ojoea6AbzTYt5LOPTJYfBq7rUctx0O4knLcn2YK30+rQMIwwX50hrud7t++tC//1zIWp55xHhOyvAAnPdRiEV3arag/JNhAk+d52tw9KKbSUCpZhkvybIDzJ3QVTjYJ2mu13hoaJ6kwJ2Uz6FQB+0gUyVfmkX0E3TOr5PoIgQhzHoJTC9TywDAtFSfQPGUJGXODJG6WUgsYUMY3/7aKm1N1iqiQKn2zXm2+yLIuxegvHsSgVcsdCMrQfdHp92un24Qch8rnMmATplSOmvZa7/cEqx7JotrtQFfnYmTL3C9Oyaac3QLmYhzJhzcbHGuhao0nLxcJU8ky+H9w0LftStz+EKPBYnJ89qRcgrG/VvTML1bmbt1drSwvViT/o+43yYGi8zDAMDMsCzyXelSjwu3Spj3xhhCCXTb8E4PsnzLN/AgzFgHZ7fVAKVCslBEGIbDZ9EhvXq47rfckyzC1B4F8YRWEvjDaNB6lHi5TSVwghOpIuGHGoG1+GYQRCCIIwBM9xu4x4xzG9dtjIrt3t3+j2BqN2RBk8xyGTPlTx7OX+QP/KsCxYloO52fIT5TX/Osvge/VGU1BVZeIpt3150OViYWrTR2EYfd7tD153HBfpdArpVOpEKsPd/oDadlIwLE2BzctxPZpMH7JodXqglKJcKiCdUg8kC3aKfaTQbIeO283EJAd/omm0/yT4QfDDVm3nCiggigK0lHJQI/18tz/4XjcSObiL5848Fd1TA92gIxm+ibbiPtZl8zwf/cHwLQBXp3FjHMe+US7m/+QHIYIgxN21zdc73T6d9Hkopdf/z48/Uc/z9T02CsSUIp9NfzLpc++0OtSyHbiuh0azg2I+h4vnlku5TJqcGufJQ1Fksjg/S5aX5n/keQ6dbh+9/pCePpljCEV5/rmzZxYIz3MIggCO62GgGxRJp81jYdnO95RS+L4/7p56Klpbs2mNiAIPy3bem+RxH2mgm+0uHatrb9eb3wRB+O00bo4Q8tmFs0skpSrI5zLoDYZodXo0DKMvJ5RKWf357vqnZxaqiONYA/AqgOr9qZYoiiAKPFiWnai0kGnZlBCCVqcLjmNx+cKKOOpcOU1PHIOxmJudIZfOr3xhWjZu3Vmjo82/evp0povF+VkyWyn7nd4AluVgMNQ9JB0re2G51x/SoW6i0ezg4rnll562e86kte9My56sbXxEiuPK7XvrP8zOlEAphe24aHV6WFman2r/sut51DBtuK6HmCZq1+VDykTZjktNy0ZC4B8hm0kjipICzv2Fz25vQG3HhaapyKYn13A+1E3qeh5anR6W5mef6DzaEULa7ymlcwREp6BpAuLtK6IBFaepSr1HFPWmadkfj4tOcRxDVRVIonjSEmm/Zbz408/3vk2lFKiyjEI++9DiYbvboxzLotHs4JmLZ586YqoRLq1v1m5OsjV3TwNda7RoFEUo5rNQFJkYppUYm3YP1Up5ImOkj0sLhGEEx3WR1lJQZGlfaghBEH7juN5Vw7TgBwF830cumwHHstA09aGc1f2hTtudPs4sVicmONDp9SnLsKg1mji3vLgvYqkn2Qh7nv/8fRsfkiJWMv13qBsjQBBEuH+SkRACVVF2x6m1lPrGqBNDw2TJ7TXX8zutTlfw/SDxtgUexXwOiixNXIPvFMCtO6s0l82AYQhKhfwveqaHukmjKNr9VmRZemq/lUazTUuF/IFltQ5qoIs/311rS6KIpYV/j03atkN7gyEoBaIowpnFuVdGO91UFnQUxR/2BoO3HMeD5wdIqTJURUFa2zXULwP4MYqit03LfpPSpF/S832oigxVkcHz/GM9/rXNGhUFAdVKaSL8Cq7r0Z1WB7bjnjj3yOMQx/E7hJCOZTufup4Pkvwb/CDc7fgTBA48zwM06RDTUup7DMN8BkAEsHbES7g/3XB5qBvf0H8/R0RRPOotTrpc0lrqjyOD/bcJPYKXm+3uV67rwfV8SJKI+dnyJyzLfo0npI1tUrBshyqytC9F6ymg+s+bd2qlYh4Cz+86eK7nUd2wMBwamCkXnvoos9Xp0ZHtmch9PNRAD3WDDoYGctn0rx6YYVp0q74DTVXBcSxYlgXPschm0m8QQm4e1cC5nkfjKIZy3w32+kPa6SX8rF7gJ72/iowwjNAbDFEq5JAop6jgeRaZtPYPgedfx/6GNS6tbdZuciw7sV7snVaHBkHCOzE65rGNIj9u4wABDNMakZYnniqlgCJLEEU+4dHguL/zPPfHJ2XRd3sD2hvoSKnyrqQYIQRpTQVDmEkNqFzq9gY3u/0h4jgCw7CoJAbjxId+LNuhpmVDliSkNfW1MIxeiWl8iee4z+43tnEc/yWO6WWOY18b6AYNR2swimMwhGCgJ0FItVKGqsjHHikEQfjtndWNF2crJXheIuysKvLcdr1Zi+P4JNtsJ2eg2z2aSikTa9N9qIHuDYa02xvgzMLcXv3PlzzP/9aynWIQhrAsGwzLIqXIiKIYaU2FLEv7Vi5xXJcSwviSKMz93/+52X7m4llDFIX0g970v36++9Z/PXPhBQD+6vr2D4oiQRQFUEqR0bSPWJZ576Ch8GCYyLGzLHMknpHddMlgSAGCnVYHly+snCTj2bJhWqthFMG2XRBCwPMJGVFaU+scx33OMswXBzA+J7bJxDF9ixB0hrr5eUxjeJ4P3w8QRRFEMUkdS6KAlKp0RFGYO+p1DnWDtjp9BEGAQj4LSRQO2897aDiuS3v9IQhhEAQBwiiCKAjw/QB+4EMURcwU81ASQysAMLr9gd7u9FEq5BCPBmAoKCzLBmEYZLQUXM+HYVqYr85AEsVjJ+/vD3TabHcxN1uGKAo/Cjz/5//96c63v3/m/JNgnI+8xo/FQK9v1qiQhPz79R40y3Z023FgmDZ834eqKOMR1kcyjzmuRz3Pg6oof//57trVhbnKnh9Df6hT1/VQLOS+7vYG1ybR22qYFt2uN3H2zMKaIPArRz2ebph0qJsoFXLHnneOovjDoWG8lRivGKoqg2UYaCl1ajwJJwQNwIplOz/YtgNvZKxZlkUUx8hlNKS11MpR0y+6YdJmqwte4DFXKf/ddpyrx2yoNSTDK2Ojcc2ynRvMaIDFdlzEcYwxXyDP80gpMsIo2p1ETPL6MgFQ1A2rzTAEvf4QjuuikMuCZRnkspljLcqtbdZoIZdBWkuRW3fW6EypMPWa1ghXdcP8Jnlm41nOZJpTlkTopgXDtAAAhVz2UAx1rU6PKrI0sUaKhxroe+tbVBR4zFcPF/LvtDp05ImjlM+BYZOUhCT+0mA5jks7vQEIkyiVVGaKj1Upaba7VOD5RNUkIf8/EleGadl0c7uBs2cWfuW1H8Zr7fQGq74foFopPYdjICSKovjDRqv9FkMIGIYZqRaLnzwJRPfHiEu+H3wVxfGlbn+AOIoRRhFkSURKVfZVXH6coW53+okSTy6DlKq8exLMaRP1ZIc6re+0kFIUqIoMQeDvL8pOHbVGi0qSgOHQ3JdwxuGjr/gv/YH+nigKaOy0IYg8fC+4z0Anf3McC1WWAfJvox3TGAzDIJdJ79t5q++0aKU8uWGVhxro1fUtKggCjqrEbdsO3aw1wLLsOH+2m9MeDA0aBAGa7R6ymdS+N4Nxd0m1Up7IxKHrerTTHyCXSR85sW+YFrUdFyzLopifvnLMxnad2raLQj6LcjH/tLYmTRpVy3ZqjuOiP9R38+tRHKFUODJXwqu9/vBLf5RySCkyWJaFllKfVnKqa+ubtRt+ECKKIiiyhOps+WuGMLcOkvrY2KrTbEY7UBqo0exQgecgSeJUCJ9sx6We78MwrF0Oa0kSoMgyZEkc1yzGLaEigDkAq/dHXZTSN4MwvO663pV9Fi+vbGzVf7i/sWJKBnqbCiKP+QmRkwx0g9Z3Wshl0pBlCbphgsYUjuthbrZ8IA+nvtOituNOTM2hvtOmgsBDTDyII29IjVYHi3OzUy2yDXWDbtWbyGXSmJstn44wP+KD0Q3zB90w4fshgjAAx3EoFfL3dwIdOloyTGs1jmNYtgOGYcAyDASBR0pVnqrxfT8Ifmi1e1dMywLLsmAZFrIsIpvRIEvSH+OYXmEY8tH9EXIQhJAkAYOBAY7nsLw4d6CRbM/3a+1uv5p5jHzeYZwkRZY+cVzvzXanhzCMsLRQHXOiGNN+lvWdNn2YAMhh8dBJwpjGoPHkJmOzaY1cPLv8Uac3gOO4mKuUPwujCJm0Nn45wn6PVa2UCZ9QOT4/kR1q1HO7lxTTAfBif2iMyeynFSZqt+6s0m5vgMsXVj44Nc6PxY9pLUXmq5WVcimPTFqDJIqo77SwsV2nrud7Rzj2mpZSSSatkWqlTCrlIsmktTWGYdDq9K/vtDq00WzT/mBIXdejURy/v9PqUMd1KaX09SfpIQk8/9x8dYZcPLf852xaQ1pTYdsuOt0B7q5tfrOxXf8wuZ8ObXV61A8CDIY6oijG0mL1x+VkMONAxbUwjKq6bt4n/HD0VN/Gdp2GYYT1rfqbO60O8rkszp9dIqMun6ka5yAMb9y8vUp1w4Rp2RMzng/1oLfrTZrLpqcRelz65827N88sVtHrDw/cVhME4beu572oGxbmZiejCddotinPJaHWURP7d1Y3qKrIqFamYzhv3VmjuWz6xEjqfwvwg+B7gedfaDTbdKgbEAQBxelwDF8DoJmW/aXjuPD8AACFZbvIpFOolItPelpE8IPge9f1roRhBN20EIURHC+RHSsXC2/f71UfFJbt0K3aDpbmZ488mOIHwfeGYT0fRhG6vQFKxfxUCM8egZebre5XluOA5zgYpgWe48ae+5FaQB/qQbMsA1EQpuEF3rp8ceWDze0GGJY58C9TSufqO20kmrVPjmAnkPB5VMpFxHQ6nDz9gU5ZlhkbZwGnOKy3+AIAFPO577KZNFiWQaPZwcZ2gyZq1RPD1wD+mlIVUirmyXx1hsxXKy+dWagasiRiu968udPq0E6vT/0g+CFJXZl0oBuUUnr9SVjSAs8/l9ZSJJ/LkDMLVTJXnfFVWYIsiTiKcR59ywkH9hEjV9txqW6Yz3Mch1anh7PLC/XjNM5BEH5z8/bqV1Ecgec4ZDManrl49vJMuYCfbt+7NEyIoiZnoCml1+OYYlqUnyzDvJvLZkBjiiAIvzmQu8+Qm5TGIISZ2PXEMcUkTKpumpdsx4U4UtKYMKrd/gArS/PjoQQfpzgSeJ77Q6VcJJVS0chmNDCE4M7q5vX6TotGcfz+lE77tSgK6UxaI/PVGVLIZ7/WVNUYDIwr9Z027fYG6A90DIbGp61Ob7xhvHqwUD/6uL7TpoZp0ZF3+cOk7kcSBRGEoLbTmsRGeYvneERRdOhjmJZN4zhGGEZodbr4/eXzrx0nv0tvMKR31zavapoK23GxMFcho5TtrbSWIs/97tIrG1sNtLu9Q5uYX6U4+gOd+kGAmVLhOUypTcy0bLpdb2JxfvZAVfUojt+/c2/jnUn2TQ6GBg3CALJ0tN7FoW7S+k4L55YXJy5uoBsmDcJw3Fb4REwl/sbwfBhGb/eH+quGYcLzAxTzWZSK+eMMk4sAPNt2dN204Hk+4lF/LgBk0tr9IrmPggbgD/Wd1o2hbiZDXGktaRHMZo4cctu2Q6M4PnJhr9PtU9f3MT87cyjlFdtxqeMmfeCtTg/PXjx3XO/qiuN6P2xuN6ClFBDCoNcf4OK55T35N/71812aTR+uoP8rV5TjWHR7Aziu98O07pCQpM8QB0wHhEH451Ixd6Rd90GIooD+wNhVrDhC0Da+r+Kknxel9H4V7lPjPHn8g+PY1/K5zAfFQh6ZdAq6YeHe2ha1bOe4eKQ7AAxFkUmlXCRLC1UyWy5C4Hn4QYD1zRp0w6LNVnfs4e+1zgwAX1crZXLp/PKfioUcTCshv291upe2ajtHuh9Fkckkui5008KIDuHAxjmK4/cdx4VhWOj19Wka56tRFH8I4KphWrTd7dHN7cYPzVYHszNFMAyD3mCAZy+dm3sUOdKzF8+RoWEcipP8ISkOgGEYEEKmZghURSbnlhf/LknigaSIthtNLdF0m2QOKYAfBGAZ5sgFmziOQQipTfp56YaFfC7z3KkdnS5Yhnk3ramkVMh/l06nIEkitus7WN+sUUxJsOKRKQVJJPlchizOzb5QLuZhWjZcz0O/P3wHCbfyFTyC25oQ8lm5mCcXzy2XOI6FaTkYpz1O+FFfEQU+0Wc8uLPy+trG9jsxpQiCcEzqPzFEUfRxFMUfNpodWms0v7m7tvHW2mbtG9txoRsWJFFEJq1hzII42hweO6X7zIWzf9ys7Rw8rftgimM8+ryyNL87Wdfu9mipkD9R6Zl2p0cFQQDPczAt+9Ac0Q9LH4yJoY7iGQyGOh0Z0onzZW9uN+ji/Gwax9DHeYp/Y0xSZDsuGEJw0GGMaSAMoy+HuvFqtz+AKIoo5bPgeX5fabX+QKemZYNhmBPtn3dcl9YaLRQLuQPzr5uWTQdDHbphTZI3+nkAK7VG68swDEEpTfrBWQaZtLb73/IRqRtMy6b1nRYunN3/prKvapsiy7izuuG5nu/dW9/at3zNZF+qh0w69QpDJruu0lpqRUsp6A/1Ix0nm0m/oKoy+gN98jef3LL2n2QcE0/m339O4hpURSYzpcJL6YR1DY1mB812lwJ48aSeC8exrxXyWXJ+ZenPcRxjq76Dga6/aO8jFZPLpgnHsTBMC0ftLjjqt8yyLLhDpBWHugnTsnFmcQ4TMM5XkpH39veNZvtLy7YhCDwq5SLmqzNvVCtloioySakKkSfAq5M4bgR7ye499H0/LMUBABRUu3+hplMpem99U0gpCmqNpletlI+FV9ZxXep5wTjv/Dc6+Ta2tV5fh6JIGIWNh0113Or2BtBS6sSfweiWf7Mk8lEUf+j5/ltxHKM/0HcVfB5Y3G8yDHlk2WLMX73Xv6uKDIYh9xvgz0acJeIjopOvC/ks8YPg+zCKno/jGP+8effblTPzU1N+39eeTcgny4tzn3R7A9podlAu5RFTSh8XvaW1FOKYYjA0kElrxZNYV7bjgmNZpFSldNDfrZQLn4VheF2RpSOl/CzboSzDwLIcOK4LRZZxZnFuYoIde+HMQvVWbzC8VCnvr1T1qxQHpfT19a365w8b3XRcj3a6fQRhCFmSoKUUpFRlkg33y/2hvsqxSb6M0hiu6wGEQEupYAiBIPBwPW8i1KBjdPuDhF71iC/IMC3aG+hYmp89VGV6z9B0qFM2Iav/rQyoPG+Y1veUUvQHicBCHFNk0imEYQSOY5FNa0n7I01UAhRZWhkZkyL+zaEwhn9fhOE9xOiIAETDtNpxTHdbbx3XQxgmBWeWZXY9OlEU0O70kcumAQLwHLebttINk9qOi8HQgCgKWJ6gvNFR1t1WbQeCwGNpofpQ1aD7sdPqUI7jxs/5WK+/0+3TgW4gn81gpM15ELxaazS/FAThKIMorzqu+6Xr+mh1euB5Dkvz1WOlXd2uN2mlXNyX6gr3kJ35C45lP8dD8s2yJJKFuUqx1mi2h7qBMAxhmPbNEV/uoSeLoij62LScN23HRbc3QEqVIUkiGIbFXHWmzhDmZhzHL3R6fa3d7aNSLkw2zZFKfRcE4YuO4z4vHKGPmec5uK6Lbm/wVWGCZEnJhmUjraWAp7TNLgjDG5blXLPsRCOS0uR5qYqM0dTqZyMVk8dtbHt5uo/yBH0AxoM1htHz3N00HNf7nhDiO64rpFQFrufDNC1IkgiWYSjP839NaykShhEt5rOwXRc3b6/SyxdWTtRIaymV5LIZ2h8M8TjjDAC5TNq4u7appbUUTNOmRyVFO2h6Q+B5qKp8YPrbOI5XdMNCuXg4+cg4pm/1+oMPNU2t1xrNanW2jHw2c+zvLpvRMBjqrxYLucca6IfmoAWBf9Q8eWdudoYsL84ZlFLohgnH9bDTan/YaLZpHMfvHOjDDcJvh7r5ZqfXh2kmRbbqbPkflXKRzJQKRBSEOZ7n/iiKQnpuduaPSYpjss+U57mrjuth1Dd66CkuSRQva6kUmp0uHNejE/wAX+v0BuNre1qMczWK4g9HhRF6b23rWrvbQxhFmCkVcPbMwhcrS/NkplQgaS1FRuRCDzPOL+PfnQrLumFR07J3/1i2Q3XD/MV/P+wR7uN6/yFLIpFEQcxl0qRcypPZmSI5f3ZpZXam+DfLcdHtD17drjep7bpwXA+Lc7Mkk07h1p21A6/7SWN2pkg4jkO78/ihCFEU0meXF8DzHDzfH3epTB2mZVNRFMBxHERBWD5EYieJnA75+e+0Oh/yPIfbd9erZxbnxsb52OtpKVW57LgesA91+YdycURR/GGz3X1rP6xMvh/c1E3zku+H6A+GUGQJsixB4Hlk0tpHhJAaw5Cv8AB5umnZ1HE9EAAD3YAoCJidKT2SQtT1PFqrt5DNaChMmM6z1mjRMIpQKuSOlFvUDYsOdQOO6x6oWvs4tDs9yiQj+EipypPc0SEA8OOYvrVd3/nQcV1QSrEwN4vH6eGNR60HQ+M6IQQxpYiiCI7rjXrBkzzyQDd+QUifz6bRHxiI4giyJCEMw12uX8IwoHEMRZHBsgxAAUWRIYnCnyml6cPwOtuOS+M4xkA3IPA8DNMCIWRanB4HQfFfP99tn1mY2xePTn+g03a3B4HnwbIsqpXyR4RAZxjmH3FMLw11/UMKgGUYZNJaGsAfRu/3MOm7a81W94btuhiT9R/iGC/Xd9pf3Ud5cKDUiuU4sCwHZ88sdERRKJ3kR1JrtGi5mH8s6+Weqt71nTZlGLJvUhdK6Zu9/vBjSil00wJBooXGcRwkUcD9uT9CCBzXg2XZ4HkeC3OVfRnFOI7foZQuN5qd6/PVmUmTzVy9s7rxTRRFuHT+SCHrpXa3d9O0HLAMM1GdtTv3NqgoClicn30JT6ag6SXDtG5atoMgCCFLIrSU2hFFYSwu/Kt8oGU7X0ZRDMu2x8YPosDvhsKKLCEII/i+v8t8JggCHNeDLIkwTCsZs63OIIwixBGF7TgYG3hZEsGNCGxGUQ6CMEAQhEipCuI4BsuwUFUZlFJIoriXk7BnaikMw69qO+2XRYGHKAjHpQ6yJ36+u04lUcDSQvWx66TbG9BOrw9BEMBzHIIwhO8HKOQyIxoEirGCi2HaUBUZHMdCS6kQBWHf6tV31zapLImwbBcXzi4dqmW30+1TPwiRSacOSuT2aqvT+9IdrZljnhDd05GLohC5x6RY9jTQrud7d1Y3hN9fPpxWWBhGn9uO83oUxbAcB2EQAqMJwrEnI8vSgZP9Q92g3d4AK2cWJv6QE3VvHpIkHik3FcXx+6129x3TsiHL0sR4tYe6QZvt7kQ980l7BbbjIJtJQ0upviQK4l73EQQhojiGKApwRh0blAJBGECVZXh+ANfzEiNBEyOaTquwbBcCz4FlWJi2jXw2jU5vCEIAgefheT4Ik6wznuPA8RziEWF7FMW72oyGYUFVZNiuC0WWQAiBJApwPR9RFEFVZFAKZNKplwB8u4+IZXmgG6vuaGPJ5zJHltw6/MdvUt0wUSzk93wHDzhXr/cGw89p/O/+3/GzGtPxAgQMkzhWY3Y+QeBRyGUeq8Ri2Q41zWTI5mFC1PuOIrt92un2cfnCyn6dMwGA3+72qe048LwAF84uPRHfTjIM03rrcUIlexpoANiq7dBCLgOO4yalnHxkbGzVaRTFWDkzP3FV4jAMv2p1+i8PdB3PXDh7JC/VD4LvDdN6vtPtQ1UVzM/OTMTr3dhuUIaQiSmQTwDL/YG+alo2FFlCNpN+sCK+63n2+kPa7Q/AMiwy6RS0lHqr0+tfclwPaS2FIAiTrh1QKIqMcUslIQTplArdtCBLUiJ+SxOSK9Oykw4fhvHjOBYYhvEppcI4ghvzUURxBMfxIAg80ikVCftZF+lUCq1OF4oio5DLIo5juJ4HPwgxUypgqBuglEKRZaRU+ROWZb95VIhvmBa1bAccy6JYyJ1YpHNvfYtKojitgZRqf6jX3FHqCSAYpUOXH9yUXNeja5s1zJQKaHW6R4lOr5iW/cNQNzA7U9q3pNRWbSchVIoirCzN/4kQ8tmT8NEktqb38uOoiR9poOOYvrW6sfUhzyeL+qRDNyBp9bMsGyzLTuV62t0+9TwPtuMdebcNw+jLIAxe1Q0L3d4Ac7PliUyi/evWXbo4PztRJYrDoNnuUtf1kE6nkMuk9+Tndj3fa3d6QhRFYBIRWxCSDB3wPA+GIQjDEGTURkkpUMhnP2AZ5t1JXWscx3+hlM5tN1rXWYYgDCMEYQhRFBBHMViWhe04EAQBqizDspOJu6WF6ktRFF9tdXpvuZ6HdEqF6yXReWWm+OA1CgD8scfIsATFfO5Y5gUezEXfXdtsq4qM2ZnSVNdIEITfrG3WrjIMQT6bGSvKkHFNYbvRus6xDIa6iWcunj0Kh/vVW3fWvsnnMvudIq52eoPamO0upcoTrQ80211qWTbS6RSK+cO1/NUaLVopFx/Z4vfISUIKWuQ4DpqqwE84K74/aQPNMsxaq9tL0iRTQKmQeyGfy4JhCHqD4ZGq2xzHviZLElEVGcVCDs12F/fWto6sqHHp/MpH99a3oBvmNKkxH5nCSdQjLCwtVP8wEvp96Ie3WWvQze2GEMcxgiBEsZDb9boopTBME67rIZPWMDc780KpkCflYp5M0jgDAMMw/82y7J+W5mdJtVJ+t5DPgmVZeF6A+erM30rFvC9JIhRZgqrKWJyf/SyVUvB/fvzpxt21jbd4jkUQBCCEoFop/UlLKeh0++/8fHed+n6wen+koCoySadTiKIY9Z32xzgh/m56DL0ZPM/98cLZJVIs5FDbacF2XGxs1WlvMKS1Rus6QwgM08IzF8+SIxhneL7/hSQK2O+gWhhGHximhTiO0e0PIEnixJg5RyRaEEURruuh2e7SwVA/5NOm2qE9aD8Ivu8P9OcFgUez1UUhl4GiyFMRedz3jh2GNxzHvWaYFuZmp9O/GQTht7ppvtjY6eDS+TN/4zjulUl4cJbtvDcYGhjqBvK5LEqF3KG1C6Mo+nh9s/5mOimYHNtUm+N69NadNZw9M/9Yj+T2vXXKsiw4jkMYhijmswjCCM12B7IoIYoizFZKSKnKHPZBODMNdHsDatoOfN8fK6LDdlyEYQRJEpHWUn6vPxTSmgrP89HrD6GqMhRZQlrT3vaD4INWuyv4QQBREDBTKuwqQPcHQ+q4PkSRH1PFHhsSdR8Fk9TH209edTDU3+oPdVQrZXAse+vne+uXLp49c+QUaac3oIOhjsW52Ucei1L65mBofFzfaaFaKT22CHdQ3L63TnmOQzqdAsMwsG0Ho5Y5yJJ4IJuUeNCFR+pXPtJAA1iu77RX87k06jtt5DIadNOC6/q4eO7MxHPA47TK4wZeGs0O9YMAS/OzfwTw92ksNttxqWFacBwXZxbnJlXwWQ6C8LNuf3B1XGgRRQGzM0VI4sFn/XXDohvbdVTKhSPzWT8OrufROKao77SwUK3sEmk9Kg0zUyqAZVkM9aS+lqQRXKiKjHIp/6PA829P6/0dFK12j3b6fYiCMI7UIAg84jiGH4S7XUnFfA62k7DCOY6HMf9KIZ9FSpExNEzYjovZmRIUWSKO69HxtORxTR3GcfyXrfrOezzHTU1+7XF5X8IQSIIwESk5AMLmdsOjAJbmZx/ZAdJsdSnPc8jnMhOd5gWSLipB4JHWUr8YzNuuN6ntuEhr6kF4u/dloB+XJ1gb7YxYWZpP57KZy5qqQpIE3F3bbE9D/HKr1vgQCSfGnlBkEVEUwTCtb6a1yBRZIgwhYFkWP/18b5VS+uYEDrvG89wfK+UiKRXzyGY0+L6PnWYH2/UdOhgadMQ/u69B/bSmkjMLVbTaPeiGhdHvTgW6bmF9s4bZmRIeZZwppa//8M+faamQRz6XeU83kjzzuG95plTAfHWGCDz/3JNinAGgXMqTZy6cJaVCblx0xE6rgzCKUchlcWZx7o20lsLQMOD7AWZnSn86u7zwx0q5uHL5wkppp9mBaTmolIt/LhVysB0X/7p1l449qziOMVY5mTYGQ+M9URBQKuS/O4lnuTBXIZ7nw3KcSTkNf0giFB54THveTLlARiPkEzPOYRh92RsMaTqdQlpLIZdNP3efEynMV2dIJp2CZTvYru0gDKMv95+GoqVDpziAREHBsp37ewevdHuDH4aGOSKfYSYi0EgpvX5vfevTXDb92HAwiuP3a/XmOxzHTTuEE4a66ZmWDcM0j9ofvWfEMNSNDw3TSgYzwgiyLILnOWTS2j8Enn/zcbm7OKZv7bQ6H1q2jfnZmbEI50SJcGzboYZlo5jP7rnjN1td2ux0kU1r42lUeJ6PfC4zasl6fJjv+X6t2epWBYH/RS513O7l+QHmZ2f23X97WJiWTWuNFrJpDaZtY6ZUQEpVSBzH71i2875uWJDlpB0zCMJvwyh6MQxDOI4H07KQSWvIZTNv313b+JBSIJvW4AfBsXTftDs9alg25qszUyf/2Qsb2w2KxOM9Orm/YdLeQEcuk0YmfbyDQL4frOqGuTzQDeRzmb3abwUA/ur6NmVYBpmkaP7Y63QclxqmjXJp76LnYw00gEtbtZ2bC3OVX/Qedrp9GoQRXM8Dx7IoF/NHms7pD3TquC4EnkdxHwZ/p9Whnu9jdqb048gbm5qR3ml1PNf1EEYRzi0vTnOBFE3Lbvf6Q9DEKCKtqRB4HrIsQVXkPxNC/rqX4bUdl65v1qAqMqIoRrGQA8exEHj+iyNoTFZ//NfPtbSWgiJL4FgWqiJDSsK4IgDddT1vbbOWiImyDBbnZkmt0aJDw8D5laWv98MPkaRRfK/b6wtpLQVFkT8AADIiRqIU6f5g+NZOq4NsJo1j4o+4dmd144bA82AYBrIkQlVkEIbxJVEQ6zttmvCKUKRUGSzLIopi5LNprG/VkFJVzFdnSKPZobph4OK55WMxLqsb21QShYmmN6Io+lQ3reu+FyCVUjDUDcyU9u5AWNusUYYQLC1Uj3wN9Z02DcIA89XKB5MuHj/K7hmmdTMIQjTbXaS11GNbFpOOlu2raS2FSrn42LRoFEUfN9vdNx/1nvZjoNFq96imqb/KrfhB8P1Os/P8ePgkiumhR6Wb7S61HRfzszP7Ih+3bIc2212wSSvUVBd+HMd/6Q/19wzDguv5uHR+eSr59wfDqp1251UAYAiTDF7wHChNJrtYjkVG0x76gQx1k7a7PSiyhKFuIo5jnFtZrB9QUPNabzC80ekOoCoS5mZniO24dHV9G5qmIApjCGKiisGyLLJpzRBFIb22WaMswyAMowP1qieN++239mF4hdv31j1FkVEu5o/FQ0xGovtQFRn9YeLJzc2WyWBo0KFhoJjPodFs49zyIgnD6MvNWuPV2ZkS6jstcCyLhbnZt++tb35YrZSnWWAXAPi6YdKhbqJUyI030YkY543txvVub4DZmSL8IMSZheqevchxHP+lvtN+D8CRN9IgCL+p77SuSpJ44PHuo2zMA924oY+4p4uF3L4FQpJe/yGWF+f2FeWNxDheA/DXQxvoMAy/ure+9fJeHkCz3aVD3QDPJyq9KVVBqZB7ZPL7wY9zbXP7LUkUD/JClze26qs8z6NSLrx7GE6FA+LV/lD/0jRtmJaNi+fOHMc5x2HWzf5Av+R6Hgr5LKIogmk5u6PPPMchlVJ+JCCdB7tCojh+vz8YvhNF8WgqL/H2OO7fRIayJL5h2c7nhmkjURRLRnsdx0WhkEU+m3kFycCFP66Sj4SFf9V9EcfxXxiG+SsOOIbvB8EPne7gyihl9VjGvlt3VqksyyhMQcFmL4/KtOybrXYXYRShWikjjmNYtguGIeA5Dq7nIZtJJ61dvQEkUcTQMKClVFAKpFQFaW26vet37m1QEOD8ytKeH/1B0en1abvTx+xMEdl9hO6W7dBao4lqpXzkd9MbDOlgaKBSLh5Hp9JVz/e/MAyr2h/qIEkEsO8IEEiogXXd3PfEZK8/pDzP7TnTsC8DDSSz9KVCbs9BiyiKP2x3e2+Nx3Y5jku4FBQJDPPwWiTPc/9otbvPj0ZqYVo28rnMvjsaao0m7faHyGczxxXyXhkMjR+GugEQgGO5Y5UOopRe7w/0T6M4GmlHEnieD4ZhYNkOUqoC3w/AMEkebCyEO1rYz/tB8JnA8382LfvbMaEQpRRhGCUq0nGMmFLQmIIwyWivYdgIggCXL57d19jwETylb9vd/osjA63h8aPVr25sN74kwET5TvZjfGzbAcuy6PQG4FgG0kh5O5/LoD/QkUxGquj3dYRRhHIxD0rpvlJ3R4Hn+e1mp1tUJOmo59rdIB3Xo90RV8d+vcgxb/wkvPjNWoMyhMF8dWZS8lYPjVZ1w3x1zENiWjbmZsv3G9iDUPw+f29963tZkvZVH3Nclw51E5Vy8WgGOorj93/6+d47++DmuNrpDb7xvITcRtdNxDR+6A8m6g7xqJ/QhSDwsB3nILm6a2sb2zc8P8DK0vxu/+m0Ud9pU5ZloBsmeI7DmZMhbX8xiuNroBBdz3sLAEzTRhCGI4Ntg1IKLZWCZdsgCek9JFEYGW4CSRLGKYIXAYzTH3/9ZV7Yo7VGC3EU4/zZpftZ9F7GBCvlg6FO290BysXcfqctL+20OjcBYKZUOO4R3qt31za/UWQJrudDFBKeD45jIYoCREFIxtY9D3Ecw3E9zM6Upj4/cHdtkwJAKVEm33ckGsf0FYYhX3V7g1VRFOAHAXr9IQgIojjC7EwJpuVgdqa4n2NerTWa3wRBeOTvwrId2usPIYnCVAiOwjD8Sjesl7v9ATwvgCQJeJQTul8DfefexvdpLYWZ8uNTMmEYfdnu9l7da+Jz3wZ6bJgc18XZfRIVJfSRJPmgCTzy749bGF3ca+Om8zCMvry9uv6qJIqQJXHfI6q6YdHBUIfnBzi/sriv8HhCu+7numG+PtANRFGM2ZnicYXa+0ExiqL3RvnoN6MoAggQxxSW7SRj1SC7fMDjFrj7Wd0oBSRJQEpVfhR4/rlWp0eDIPHOdcNEWkuN39FEnncc07c6vf6Hg6EOSRSx+Ige9yiKPl3fql+XJRFBEGJpoTqNmsC1oW7c2OtjpZS+2e70PzYtG5IkIJfNgGPZv7e7/asMk0zPnV9JqALWN2t02pt4tz+gluVgcX72le168ytR4KFpKgjInsX7EYc2XM8Hz3FwXBeEEKRUBQxDQAiDIAhh2w4ymf2NNDeabdof6tBU9cgdK9v1HQoQzM1OTl6PUnpdN8xPDdOGYVpgGGY34iwVcpPY6F9tNNtfAkCxkNtXemRjq06XFqoPLSoeyEAnub81Wi7mDyNXs6/dvL7TWt1vJ8d4x2q2ut/bjgPpAIZ9Eojj+C9hGL3R6Q2WxyxuxXx2asMzk3i+SDovbgHQDNOqjY0xIUA8EmCIoyTioYmXgUxaG4e3GqX0taFhflqrNzE7U5roOrBsh9qOA98PEEYxBJ7bTY/JUjJ56PsBeoMhJElMPKtC/igdKo90RmzHQaVcBMMwe+Y/dcOi61s1XFhZQhhF2K7vYKZURH8wxOxMCRvbDczOFKeqBh6E4Y2f76xdK+RzCMMQLMuCYQjGPegMkxSZGYaAY7lRepGFZbtwXXfU7cMhm9bun9DbrSG0Oj06HBqYr+62cO7ptNy+t/56HMd49tK5RzLcPQ6GadFxgXtCKazqUDdqrU4fHMuAF3hoqgJZlibeBdbpJRJ651cW91Wn6g90OtokyJENNIDqD/+8VfvdpfNT+TAO6305rvvh2mYNz148e+zkNKZl01a7B5ZjwBAGKVWe+IjpCeHa2sb2DZZlQSl9sFvm0v/8dPvmXKU8UfEE3w9uWrZ9yfMDEBCAAAwhuyKy43yvIkvQUupzAH6cxo1v1ho0o6XQ6vQwUyo8suDj+8HNn++tX5opFRCGEQhJyJ92Wh2cWZybyJzA45ymtJaksuarFciSSFzXo4QQw/N9zbTs0Sac1BWS1EWyCZeLucdSGQRB+M2d1Y2rj+tm6HT7dGiYUGR5v+mQvXBlq7bzgygK0A1zIq2tumHSXn+YKOHMz0413dTp9Wm3N9y3gTZMi7qu99A0zmEYh+oXzp7BzTurrz8pVoRhyEe24yKX0XD73vrHx33+lKqQM4vV91iGRUwphrqJTrdPbceleLrx9dLC3NuCwI8LkfS+FNWt/3rmAhkaJtwJynsJAn85l82QSrlIisXcB/ls5u+ZtLZWLuUxX618VMhl/zpTKpBR1fvHKd33su8HIw6RaLfYugc0QeAvV8pFeJ6PaqVEZmeKpFTIYXF+durGeWO7TgWeg8BzOL+yRMatsJIkElEU0mktRaqVMpmbLZNqpUQq5eJrpWL+7WqlRKqVEtkPzwzDMD8mxp15pAEMowgcx2F2pnjUYvKcadkQBR6yNJm69HiDP7e8+N1xcAlRGoMQUtvPzyqK/EEQhg9/9oc5uSJLJJdNY2OrTgG8CuDaSVuSUiEn8jwPjuOwOZpiwjGyiDEM89/z1RlSKRU6sixBNyw0mm3cXduk/UMzXT0Zm99MqfCGHwTYrjd3ncbx/ygX82i0ptMSzjLMuzzP/VEQ+BVZkgjLMm9Pe4JwhDVB4NEf6JAlccRRvbcDNFp/ZOSVXgUAPwjBc9xUL3Kn1aG+H0DTUshktMfxTo+/hb8eVNyZZZkPivksMunUw86x3On1qWk5aHf6mKuU/oaj1yT0MTVvqZj/xwQeVdFxvUQ1hufeOsqB2t0e7fT6j/yeoyiGnBSQP9/vOg+C8KH26tCcnfOzM8T1fGxsN77s9gY3xnpyJwg/l01/XSrkYFo2dlodihMQWBVFoTRTKpCZcgHamBi+3cVOq0P3I+j5JIIQ8kU+m8GIMvTbB6KHlRFHwlX8hlDM5xBFUWKBLRu6YT723ZUKObQ7vW+SSIDb5Y32fL/24HObgEdIOZZFPptBIZd5bx/FqKN8C51SMU8eco4r7W5v1XZcmJaNZy6d/WASzI8AvhunlCY0iNRZXpy7LEsi1jZr3x9mrY6i4Wq700c+m337MQ4sOJaFYVj7Pr6WUqEbpjcxAw0AF8+dIWPyfEohnvRHxXPcS0PdxIWzZ77QDRPd3uDEDKKqyKRczJPZcrFTyGfhej4GuoFGs01bnR49LuKcSSGdTn2gKjJ0w3zxQW8TAMIwuo7fEBRZIrMzpVtz1ZmvwzDEUDexlqhfv/yIdy6OqCeLkii+FI/yvEEQVnuD4YuTurZuf0CHuoF2t49sRvtkv+oik8hA3e9JNpqdHxzXg+8HuHB2STzGMezD4FYmnXovCAJQSi8dIlpBfadde+bi2VceF4FoKZVEUbzLergfZDLaB2PdzIkZaAA4v7L03fpWDcDJGmjfD246rksTkh7r9UxaQ6PZxkA3aBCGN07qukRRKBXzObJQnfmskMuiP9ShyBJ2Wh2sbmyPjfSrow9feFJXN8sw76ZUBUPD/NV6DIIQlNI5/MYgCPxlnuNeOre8SBbmKnNaSkF/oH/1qGUoigJs22kD+HqU8ng5pSpkFMIeORVY32lT07ThuB7mqzNgWfbPx/mZRVH0cbJBmHA9D57r49zy4qFEYI8/Xcf894WzZ8hBmwgopW9yHIs4joB99v7LsgQKwPN8fb/fF5Li7S8EOA7TxfErOK5Lb9/dwJXfXTyJzoWXdcP8yvcDGJY9ZtcDM1IO73T7kKSktzqXTe97/HxaaLa71PMScnhKKTiOQ7c/QBRFOHtm4djGxx+CS3jMePb6Zo2Oxl93ezbbnR7t9AbIZzP7asx/2uC4Hh0MdeRzmbooCHMb23W6NL8394sfBN93uv3nq5UycV2P1ndaWDmzQDzP11udnnaU3uC1zRodUynkMukjkZMdFEEY3uj2Btc4jkN/MAQhBJXyE9X7PzWMhapLxfy+ZeY836/VG61qSlX2PWTT6w8pwzDIZv7dkjkR3ShZksjcbBn/+9NtCqB6nA+vNxh+FQRJS5OWUrA0P0sUWSKSJJJcNk1yuTRcz8NQN9Hu9q83mu2TTC0IM6UCSakKOr0BKIBmu4OVpfk/nF9ZIidlnOM4/kut0br5uJ+rlIuQJQn9gb4KJETlvYGOUjEHVZV/o58nhWnZ2NxuVAE8zzLsmO/3ykNfMM+/GCeyTC9HcQzPD6AbFhVFIe16Hlr/rkMcJFq6NE7XZdMaZkqFPx+XcQ7C8MZWbYc2W91rhmHBsmwUclmcW1584T/BOANJB4ggCEipyr6dO1EQXhRFEV4QIAjCffHWp7XUF47rTjbFMUaxkCMz5SJu31uvHdeDGwwNyrEsGs02zizOPXTSqZjPkfMrS0SWRXh+AD8Isb5Zo84EW8MOEiICQD6XeSGtqWAZglIxj63azrfTJNt/vIdgvqellP2EiLc6vT5kSUR9p00N08LFc2eI7wcQBeHvv8WPU5akP5SKefAch51W53stpeLO6sar2LvFz2cIAz8I3iWEIK2p2K7vwPP92vmVJdJotsdGel8pgYFu0Hand9NxPYRBiEI++8Zx9fk7jkvvrW1dS4qlFKqqYG525ovRcNI/jvE1nFjqr9FMKGVTqowDThmuZdIp0Jhis9bYV1GS49g3fD+YjoEGgHIxT3iex+1769M2fi83mm0aRRHWNms4v7LUedxuXq2UyfzszEc8xyGOKYa6gfpOmyLhoThu/KNSLpJcNvNKNq29sTBXIY9S9p0Wuv0B7XT79P5x78d42pdYloHtuIiiCJcvrBAkXA7gee6kUjPTSpuN1/B32bSWFgQBg6GBTDpFWJZFrdHaXTuO61LbcWkYhl8BQCGX6QyHxvOKLM3JkoR8LoOf765XLduhV569SHr9Ie6ubdIwjB7ZhrXT6tDGThsgBJl0CufPLpGjTOcdAFfqOy1q2g54nkMQhJidKX2W9E1PfjjND4LvgyD8xveDVc/z23s5NicBQgh4nkdKVQ/83FVFJqlUonN5b32LIiEBe+z5fvHfk8hBP4jtepMODQPPXjw3jRDo2ur69o1MJoURC9SBaQiHukk934dp2UinVORz2bcP2hv6tKPd7dNOt49CPguB52A7HqqV0kt+ELy3V2uT63p0Y7uBfC5RvCoV8mSn1aFhGB0Xm+CxYUzUAwCqKkPXTfhBgFIhj1w2TZrtLo3jGJRiLMWEaKRcHkaJskpKVTBfnSFhGH1u2fbra5s1LM7NIp/LkKFu0Ha3j0IuA8IwSKdSbzMM+SiK4/cdx33Hsh3YjgtFkpDNagfl8j4KXu10+18alg3HcVEq5qc2bOO4Hh3qBoa6CYBCEASkUyoIITAtG7IkQlFkxHEMLaX+QjDkmFJ/7+y0Ou8LgoDi4adln291et97ng9VkR9LjTDihyZTNdBAMr+/0+zgv5698BISLuEjoT/QqTWieZREAZ7vIwxDzFcPXXS5dG9966bA86CgmABF41OBKIo+tmznTd2wwPMcFFlCpzcYiaVSaCl1z0KI63l0fbOOaqUEw7QxN1smURR/yLLMO3gKqvgH9aKbre5XYRQiimLksmkwDIPN7QaW5mehPGYaTTdM2mx1wbAMzp5ZIOPicLc/hKpIyGczYFgG0YhzJIpi2K6LIEgoL1VFhiyLSKdSh1Z+Pyg6vQEFKHTDQhzHWJirTGRjiKLoU4Zh/uG63qeO5yEIQpimDUHg4fk+xlFGEARwXR9BGIKCAhSwbBuCICQFdZaFoshIKTJEUZg6g+FQNxPa1GJuX9zOj8Dy+mZtVZLEkRr83sc6NgM9vsG1jW08e+nckRbZVm2HAkB1trwreWOYFu30BodVSt5lYLNth7a6fXAcC01Vj13zbEq49sCmeKXT7f8QxTHCMEIYhhBFASzDgALIZdL7ej+O69FaowmGMCiX8r/ZCn4QhN/889bdq+dXFuH5PlKqUhcFYc5xPbq2sY2VM/NjzvLHMvlt15vUMC2cWahCliXS6vQoz3PIprU/6Yb5qWHZUGQJ2/UmeI5DJq2hWMj+g+e4j48pnZE4VO0e1U0zoUoNQ6wszU/i3b6sG+ZXrudjMDQgCjz8IIAsSxAFAQLPQVHkPRnf4jh+B4Dg+cF7pmUjjmLohgmWY8GxLMYK2yzDdKI4LnIsuwYCHRRpEOg0piuEIauHIEMSAPjb9SaNoghLC9UjE6DdL0f3KAWoYzXQ4wu7dWcNly+s7FuO/MGHZTuu97A0RhCE3+5HHutxcD3fu7u6KZSKOViWjcpM6TjUG6aF5Y3t+uq4FcyyHWqaNlRVRm8whO8HKOSyyGXTB1bccFyX1hotADgWfuMThDYY6jrDML/wdvoDnXb7AziuhwsrS8aj1M3vRxiGX928s/ayllKRH3nifhCg2eqOFMQJWp0enrl49thFXm3Hpa7rwbIdRFGE+erMw8iTrgDQ8RiNvV/ec/R5baf5OgDQmCKT1sCyLNKaOmbMO2y64mXdML9yXA+O4yKK4oQiNaVgMNQRx3RXYJhlOWgpBWEYQkup4Hl+39/1YGjQVqcHnucO6wQ+bOP/loJqj9owjt1Ajxfo/9688/LK0sKT7KG+2hsMvwyCEK12D0sLs0cNa04MtUaLVsrFj9rd3luKLMF2XOiGhXw2jWIh9wIOWYF3PY/Wd9qIohjVym/aQANICPAX52ZvjTjLNQBGrz+k/aEOAgJNUyCJ4n57Y4Wffr7nKbKEVEqBbbvgOA4pVQbDMCcRjRT7A7091A0wDIM4jnFmce453NedUt9p07GxC8Pofs71Rxs33aC27SIIAvA8j0Ius+/N7ICoup5XC8MItuMmmx0hHSRDc14Ux0XDtBDHFIOhjjAMMVspQ0spe6ZugiD8pt3tXx3oOpbmq+gPdERRhNlK6Vg2zwf77I/FQI93vv/51+2vqpXSE53rNS2buq6HnXYXlVLhacxLa1u1HX1hrrLSavdWu/0BtJQ6sSKebph0TMG536b9pxWGadHN7QaevXTuF4ar3e1Rzwtg2SOag5ji/NmlfYXB//vTbSoIAs4tL3xyzFOAu+h0+9QPQoRhCD8IkFIVxDGFwHPj9X7lXz/f/UFLqVicm92tIdV3WtSyHZxbXnwYpa9g2Y5n2w78IIRhmliarz6SP/o4MRaZZkZdEpqmQhKT4WeGJPSrlu0gjmMYZiLCIEvSL5RxeI6DqipJfUAS71cXmpyBTsj7T8RAA4Dwr1t3vbSWOrLawrTDPsdx0er0kEmnJipffxwGutHs6BlNxb2NbSwvzk3UO6vvtGgSqqYOm7KaJC6Nwm9vqBtfRVG85w9SUGQz6Q9YhvkeB5Dq2qw1qK6bqMwUd/vst2o7VJEl5LKZtw3T/LA/0BNl84z2yE3L83x9fauuVcrFY48kTcumvh/A8wM0212UCjmM1JHGxbZr/7x198aZhSpanR5URX6oivZmrUEdx0VKVeG4Ls4tL654vv9dtzesup4H3/eRz2ZRyGdOfGr3YegPdNobDCFL0q7ochAEI8krESyTaEwKCdUpAUZqP93+h7bjIIpiUFBoqgpJEpFJp17BBKXfNrYbdOm4UxwPy7PohonzZ5eOs33oQPB8v2ZZTrU3GIJj2ZPSHTxU6FrfabUN08J8tTLxNMT6Vp3GcTypItKBkRD6O5f8hPQGcZy0K6c19d98xZTu4RHbiBOeXhBCwCY55luEkJrlOFezae1XXrDn+zUC4t1d21xeXpqHLImkP9CpKPDjTo5LtUbrpuO68HwfLMNivjoDnuMMAIhprAVBOEozmRB4HvPVynGKXVRv3l6tlYt5SJIIgoSdj1KKSrn4qw6rtc0aZVkGi3MPVzHZqu3QtKYik9ZIrz+k7W4faS0F13XB8zxmSoXvJlEXmva3fW9tq1rIZ8EwDDiOhSJLdZZhv9nHe7m2WWvcSAaXuigXc1AVGdlM+siya7ph0SAIfiGAcSIGGkg6Am7fXcd8dWaiihyTRBCGN1rt3jXP91HMZ8c56f0oTp8Y/CD4fnV9+3lZEsfV4klpNApRFH3cbHevj3QAj/WdjRUxZFlCSlUgCvzfjkBteSUMo3eiKLo2NEzN930Ypo1sRttTMi0Iwxud7uDaXkohnW6fchyXSIZRCk1VwLAM4ijGYGiAYRKtP9N2JlZ0ehSiKPrYD4I3oyjGUDd/oT6vGya9t7aFZy+f+5Xc0zitc35l6Re59/v/f1EUdn/v1p01SgjB8uLcLcKQ1U63fy2fzXREUfij5/tfP6kO2FFBKX292e5+blo2eI6DLElQVflIDlGn26eSJP4i4j0xAz26yesbW/VPHdfD5QsrxHZcGsfxE9W+1e70aG8whKoqkAThic9J64ZJm+0uFuZmfUkUJsYw6PvB6t31zeViPod0SoV0TOmNTrdP+wMduVwaKUWZ1nmFKIo+HgyN651eH/lcJsnJCjxymfTu+W7dWaPnlhceuzFs15vU9wPksml4frI3lgq5T9a36m+ePbNw4O6Z+42j5yVTn/lc5g1CyLcARErpC6Zlf85xLGRJmuv0+rVOdwCWZSDw/K82U9OyabOddJCUi/nncF9+3Q+CH1qd3hWB41Eu/fL/exia7S4FgDCMMNATsViGZTAcGkipChbmZn/TQ2BxHL+zvlV/PwgCaKkUeI5FIZ871D0/2MFx4gb6/pfc7vZRrZQQxxSmae3V7nMiGOoGdVwPQ91AMZ97Yj3+oW7QWqMFQeAnouN2P8Iw+rzT679uWjbKxfzUO1xcz6MbWw3wHIelhdljK6hRSl+v7bQ+73T7yGXTUGV5NDQiESSiux6A+uOOY9kO/d+fbuPyhbMTyzf7QfB9FEXPAwSNZhtRGIECSKkKCAGGemIUY0ohjNSF/NEY/+xM6Q8Avrv/WIOB8bwkiUhrv8ybG6ZFx/UX1/XR6Q1w5dkLDxWB7XT7VDctBEGImVIe2dGGZtkObbW7KJcKk0izVe+sbtTGKulPIgzTojutLliWQTatIa2lDpTGimP61trG9odnlxd+cY/Mk3BzM6UCuXx+5aOdZieZolJlrG/VX763tkXxBMhpZdIaGS9407bhPIFag5TSN8cFjGqlPPlIott7PYwiiIIAVZGnOsE10A16684aFucrWDkzT46z24EQ8sX87Az5/eXzn8mShP7QwNAwx7y+a/sxzkDCw/D8//O7T2qN5uTcfJ5/QZYkIksiKeazKOSzKBVzkCUBvf4Qi3OzqFbK7xbzOfT6Q6RUGaZlw3ZcrG3Wvn3wWAxDsLFd/xUHMR2pu6cUBdmMhmqlhAeNs+8HN03Lpo7rgSEEF8+dWcneF22oikxmSgVYtjOJW6+rinI/f/oTBy2lkvMri4QA6PYHGBrG634Q/LDfVOpWvfEhxa9v74nwoH/lTXd6mK2UQGOKbn+AQj53lFn4iaHR7FCGIeh0+1iYq4y9yEnleI+C5z3P//ru2mZxtlJCfsKK4pbt0P5Qh8Dz8P1gqrwb7W6PNnY6+K9nL/zC4zsp2LZDDcvGmIc5pSoH4uzeaXVoLpueZjFc+J+fbnvPXjz30f2EW51un3Z6AyiyhMX52YcS6kdx/L5l2e88GA3ZjksbzTZy2fSea2m73qStTg9RFOG/nr0wvr9ffAu37qzRfC4Dy7KxvDS/yyF+WNy+t07PLMytCQK/8iSnPbbrTWrZNrKZNFRFfmzKttPtU1WREYTRuFYxWT7oSXvTz1w893Z/oEM3kk4EUeBx684qHee7TgqzM0USxzHSWgr1nfZYUutEjbNlOzSO42t3VjeK5VJh4sZ5tOAgiQLCMJqYyvJDjaHj0kbC30JGxvnEFWaUxBMsWbaLdreP3mD4/oMe56OQUhXoujlxjnRK6fXN7QZd26x51UoZI+O8y5ZWLOQIyzJIaypGa/RXz5JlmHcflqpSZIksVCtrpmnfL8D8C8zNlv/8u8vnfsymNQyGxvj+fvEtnFte+Fu5mCcsy8Jx3dUJRLJodXrLeMIxX50h2Uwaruej2e6CUvr6oyJfPwhg2Q4839/VwXxiDTSQKEmfW14klXIBm9sN9AY65mZnYNkObNs5YSNduuy4HhRZQrvbx731Leq4x5/yCMLwRq8/pP2Bjn/9fO+9udnyVFjHtmo7tFzKQzcsMAyBpqk/TuV+gvCbn++u4fL5lfu95ieFgKlzfmWRMAwDy3Jwd3XzHdfbH584x7EIH/joDgLfD27WGi263WjSRrNNa40m3art0Fqj9akg8FhenHvpvujy/u4iQZFlNNtdjNbngZ6lIPArWkqFblpwH8KdTgj5ROD5586fXfpjEIZ73HtSQ5IlETzH//UoL4BSet1xPUjiE6sK94vHN1MqEJ5jwXMcuv3hnrSypmV/HEUxGIZBPpv+zLKnRNg/Le/l8oUVkk2nsLndgCJLkCTxvRO+rFsXzi6RbEZDLptGHFM0mp2xivhxpDLarU6Pttq9a7WdFjzfx7MXz76bm7znfK3WaNEoiuD7AQghyKY1HIJ4Zj8o3rqzevXS+RU8yT20y4tzJJPRkNZUjKhIi4/7HUkUiecH2K7v0Cjav/K9ZTv0p9v3aLPdvSQKPOZnZ56bnSmJc7MzRJEl6KY55g7eiynSn5stvyIKAmqNFoIg/NYwLdrrD/e9TtOa+hnHsuj0Bo/aQD72vQBD3aB7RUVDw8RQN149ipoRIeQznuPguB76Q318nOK03/khhT18AKiUi++alg3fD+AHwfd7GGioqjziDmH/NO76eSoM9H2hDXn20jmREILb99bfW9usUd8Pbp7kNaW1FJkpFcj5lcVXshkNcUzR6vSoNWEPP4riD30/WO30+vR/b975vtZoFnXDhGnZWKhWcPbMwlSksprt7g1B4FGdLf+j2xuAYQh4gR+f5+VJhekjL71dLhaehMnExyKb1oiqyKAUqDWabUrpm4/7nTMLVZLLZtDpDa5vJENaj10j7U4PF1bOfLEwVyGj1s4fxx9+IZ8lAs9jrBr+CKwpigxCCHZanRfrO200291932t/oF+nlKJczO+ZO3Y971JMY2zVdsYCGPfjZct2wBACRUkk0f558y497PqpzBQ/iKIIjuOhPxhSHHEw5PHfXvTx2ub2mFXvEJkA5oNSMSnY6ob1/K+seBD8wDIsREHYJepnjoOwf9oY6Aat1ZvIpDXMzhSfmJFS1/M907KEIAghCDw0Vb0lCPzr2D850TXDtG4wDANCkmJkOp3CTrMDnk+a4VOqDC2lvnEcVJSW7dDN7QZy2TREQUAumyZ3VjfoTKn4q9asw3gmQ92AYVqoVspPHfHSODebjARL+x759Ty/vbFdL6ZUFdXKr4diTMumpmVD4PkxuXvxIYZoeX2ztqqqMjiWQy6b3uvZvRiE4TumaV1rNDuQJRHLB5gA7Q912thp4+K5M3t+YzutDo3jGKqiQJGlX9DWDoYGrTWaWF6a32WRG0ealXLxUO/bMC06GBojciRlqjQMpmVT3bDu5yg5VLrj9r11L5dNo1T4pXis63nUNG0EYYhKufgGIeSLB0e9GTyFyCYeNZFEAfWd9vWf767TTq9/4i04kiiIxXyOzM6UiCgIGBrmpfpO+/tmu0tb7R5ttrrU83y92xvQO6ub9O7aL//0B/qNZruL7XoTumGCYRkEQYDlxbnO2TMLL1QrJZLWUsche/R8GIZfGaYFUUzI0nPZNGl3ehQURzbOYw/RdT1UysWnkhVvcX72D2EYJgT7gQ/Tsr/az++JolC6cPYM6fYHCMLwV95RSlX+yPPcmP7z4z28xLUzi3NEFAQYloV2d8+1/x3PcS/lshkyNzsDnuextrFNO93+uOD+fLc3oKZlP+z3L9m2i1w2A4ZhHtpNMxgadKibKBXyf8+kU+RBTnHX85JUpSzt/nulXCRhGAGHFJfWUiqZKRf+UcxnYVrOVFOLkih+0e70wDAMKKWvR1H0MaX0TUrpm/cVil9+TNTsVytlmKb9q3QJz3GfmZaNkUP2dfIefnkoDk8xxrtaGEaft7u91ze3G1QUBMyUC6N/D786qWGXlKqQlKqMQ/k3gzB8gxDSHg6NaxQU+WwaFAABdv8OowhnFqp/Yxjm+yiKrx6XksYDaYfXB7rx+XBowA9CpFQZszOl11zPG3dYzI09C55jwXLsgTtHfr67TkcFrqeZDe+7M4tz79Z32u/HMYXreXBclyZRzuMnYedny9hpdq4tzFV+4fF6vv+F7wcQBB53VjffvHB2qc0wzH/vlWbz/IA6jjuK3myhPxhieXH+rxzHvvbLNGGKWLZDwygCwzLIpLXvAPyj0xsgpcoYr9UxgjD8sD8YIpPW4AfBB6IgfIEHxr4VWVrTUsqy5/tXef6XpsTz/Zph2tBSKvAAv8koNVPCPnvKf+WS8vwLmXTqK8f1XvYSMQCqKNLE6UCHhvG6okhotrtod3ufA4lmYBzTcST7ju14MC0LxXyO7hXJcCybpDAe4IgxLfs6z/NjVr3OTqsDnuOe/hTHXohj+tb6Zu1D1/OwvDSPOI5R32mhmM89Kgw8xb8/nL8MdOM9w7DgBwEyaW30gVHcWd3EmYUqegMdpmlBkkRoKRVRFCOKon2xE1JKr9+8vfppLpvek/PiaUN/MPz/23tvKLmq9Ft8n+tN3Vu+qrvat1wLmBHvrQURE0EECUQQMZFIIGIiJhl+CUQQQSIiiCCCBCKIIPkz670nxiAh077Lu+v9Pf+gqpqW1JJaFglqr6Ulqcz1tc93vvN9e1PTcvYJbmCYR5ZiHRomNcyRdscE3d4AT50+AUkU3ori+K8Czz+HW1dgvLq5vfd5SikYQmA5Lk4dW57oaFwD1/Npu9vH3EzlSIJGvcGQ1psdVEqFQ5Xt4jj+8tL61stZTbtG6wMYiS7xHIv52sw1re1hGK13eoOV6z9/lznic1u7jbMsy8K0bOSzGuZrM/fsfuK4Hh0aFpI0gcDzk4ALlNL9XHEYRrBdFxzLIQhDLM3PvnuzgRQYqdSxDHNND8Feo0XnZqv7x7u1W6eguKY1n/s9EQzDkA9Xl+c/9Dyfbu82IAo8quUiDNNGo92hywtzj7NTygNFFMXfGqb1vGk5SNIEuayGYj73LsMw31xe3/qxWi6i3uxAlsWJCuEKgGcbrc738ajS48JhpHAwMv/Xz5fOrS7N35K84jj5PE3TM7fa1qOEfC5LHM+nnh9AVWXksjoMy4YoCBdudw6iKMIP+tC1DBhCYNo2Jop540jx4yOQ1F/a3T5OrC7dNgihlCKKYiRp8hx/hJ9+MZ8jhmFR07TR6vRotVy8hqgHQ/NlRZahqvKhUeNoXrhPzgKAcHuvsTJTuT/FFyzLvrG6NP9Gf2BQliFIKcX65u636ii6hSjwdyQRYFo2DYIQjuuBMASUAjOV0uHaKSpQyGePni4RBHA8O0nt1EdiVjE83/9WlqSJrOkNi4Tc75FsZFkip44vo93p00arO3JXnq2i0eqAY1k6N1u9YQr4R0cYRc87njdKWWhZGJYFnrPfNW3nXZZhwbIM5mYr15ArpfR0mlIs1GY+Y1nmu+uj5ThJXuY57iXDtOjG9h5WFvfJ+dDuy916k9qOh6yeQRwnVOB5VCvFh+7mfKeYn62S9c0dSunI2oljWZi2s1Yq5G4dUBDSzeqZ0mTBzLAsmjmE7G5DunP57NHMSliGQRzHiONk5DlyBGR1Dd3+SFK0PzBQLRdXMOoIXAnCCKLAI6drT1//vUNmVKFlO9SyXRxfUfb1Onw/QJwkkCXprtc2CvksKeSzguv5geO4cFwPY4PpN1mWeVMWRaiKvJ9K3L92k1SD7SAYKxpmVAVxkqCSv796M1pGwdC0MTDMvXxWJyzLvkuANw9omJ/RNRVBEP7+CXqCSrlAKuUC6s02bbV7yGZHP57tvcarLMO8WikXMBm9/sjo9ofUsmyUinnEcQLH9ZDVNPA8h8W52RtadNM0fScIwvc4jvuBUorDRGHCKHr3yvp2TVUVmtM1PLV24uCgePApFACEIw+4AY6vLCJOYuiagE63j8tXty5ksxoqpcIjfZ9KxTxanR6USIIg8DAtG0OOpTldIzdPcVilrD5q/mu1e5QQglEzxu3Zsz80qCrLliDw74RR9DJw+7WyKB65qAwNC4osvcMwzLdBGH7l+UGNjMj4hmNN0hSEMFian72+cmhjaFiT6PkozUvP7TXaWJyfwU//+YVKkoh8VoeWUcDz/Bd7zfarO/UGXVmcv9tZbqjIElFkCWWgZjvunu8HcD0frjfqAr0ZVEUGYQjmZisQRaEuCsIa7rOksKLIpNsfUsdJkdO1s4SQT0RRgCxJH47TT+e7vQHmazN/HIKeYFyK8/xeo/2tYVr7lvfNdg8A6Gyl9NDkMx81NNtd2h8YeOLUsWcvr2//yHEsFm4jKG877nuNVhccxz43N1sNAazYjrueURXi+T7t9oaQZQnHlhcgSSJJkvQDlmU+utkPq9sf0nqzjTNPnXqfZZj3DdM2e/0hMqoCWR4t0ti2S1eX5x/Ze6RrGRKGEbVsB9msBlEUYJg2FEm6aaojjCKIgvC3CXlKoohmq4sjRMTCzl4TT5w89mNK6ZwfhPvGBTfNJ/eHNKUpyqUCwijChcvr72VU9T3fD0AI4Ach/vyEdoPWOceyoJSCUpSum31j7cTyVwzDfn+U69Pp9b9nGIKspn3RlYavrizNXbOotzQ/+1oUx1//9+KVF59+au35e8wj1w8u0idJco5SWgZIANADo9/o/4SQvYchyJXLami0ugjC6CNJFD7x/QBBELytKPLf0jQFpdjPcf+hCHqM7+ZmKySO4y+b7d7LQRAikxkl/vtDE67n0ZWl+fdZhvn7H+FiUEpf39qpf+r5AVaX59Hq9H7M6RmUjxCpJkkCnmNBKSAK/FnLdtaHhoV2p0ejOMbifA1JksB2XViOQwEgCKK3KaU3TH33Gm06NEz8+YmT+44UpmVjcX72JT8Iv6w324IoCAijCM12l95t/exDiqJXe4PhumFYyOey8DwfVza21544dezwFAfDgJARIc7XquTKxjYdk8qa6/kXBkMTN1lMC888eWry+otLCzUEYQjfD+jNAg1FkcEwpC4Kwtxeo009L4CWUbE4PwtZEl8YR8HWYRE0P7aGuiHPfJsKKc/3qWW5kGVx5O+nJri6uf3qqeMrB/38JoOCwHPcSwu1GXp1Y+fb62U37zVX/Sg8H6PqDwVBEAoMIRdkWZq48mAwHImRXT97YPAHA8dxr8zXquTYysJf0jRFmqYQRR6VUgF/FHIOgtA8/59fPs3qGlaX5+vbuw0U89mvykdMIwxNG4RhIEoCCCGfmZYDw7SRyahYXpyrb+82MDRMcCwL3w+hZzLd+VqVJEmCi5c3aLc3oN3egP5yZYOGYYgn146TCTnHcfwlyzIA8I0kCuLq0jzxfB+yJMK0HOARkJ+9BTaq5SKGhoXeYIhSMT9ZSLpBQML3A5qmKcZ+gGMfzGAygF1UZInMzVbKR9jnNzld+wwA6q0O0jT9x2EfkiWRTBT15mYrz+qaClmSJguS3+EmXXk0pVBVBXcjQG/ZLprtLlRF/ntGVcjQMCHLEjDS1N7/2MG0V7GQIyzLwLIderNzeUx+Y53rX8vqmTeSJIHn++gNjLVCLjtZWzkTxTGkQ4TIfldldncb+PQHRqc/NMAyDKqV0u+20sMPAhpFMa6sb+PJteMX76ZSwnZc2mh1oSoSeJ5Dr29AlkUszdeebrQ6513PR6mQG+sAE3iej9pMed/dOU3p22EYfgBCQp7nPrh+UNytN2khn7v+HtQuXt7Yq82UxwqH1Uf6/ly+ukVZjsVstXTTNY6dvSaVZXHfiLY3GFKGMMjn9DncRX2w43r00tVNFPM5XO/KcWgOoNmmnh/g2PLCLRdhKaVn9xqtc47rYWm+djepwNpo7OhRw7RGLd+UYr42mklZtkO1jHrDOsduo0U5lkW3N8CJ1SVLFAX9MfmZPfPvC5d/PL6yeKh0wdXNHcoyDDKqst/H4bge3dlrYHG+No2gD0G3kM+S4yuLpFwqoN5sY2evOdFL0H4PJ+h5Pt2tN2mvb2Bzew9P/2ntrbstY2t3epDHNdCW5WC2WsL87MyHVza2z/tBiKyWGUXTqoLaTJkcW1kgV7d24Y5NDhiGfChJIpFEQbyenC+vb9Eoig8bIOuVcgEMw0wspM48ytd7brYCx/EwGFo3TS8xDNkn5zCM1ru94aRM7q6aN1RFfmWythJF8bem5dD1rV16M6nLXFZHkqQwLfuWmjaEkE+0jApKRznzu8kHA9Ba7R5mq2VwLAvX8wFAiOPk83qzgyiKDxpACLbj0vnZqjhTKZHjq0vhpatb2uPwW7Qdl+7Wmz/GcQyB5w4ztSiJogBRFKDrmX35B8O0wB+S3pgS9HXIqAo5vrJIFuZm/mKYNja298x6s0OTJP3gcTuXNE3fsR2Xrm/u0qtbuxAEAYZp4U9PnDxNCPn4brbZ7Q0oBaDIEnr9ITRNhSAI+NfPv7ytZVRkVBl+EGC+Vv07pUC7O2pvzygy1jd30e0P6SFayoJhWvTCpXUqS9JNtSJyuvZurz8Ez3HodPvnH+Vrrygyyec0eJ6Pnb0mHQzNa0S0kiR9ftKbEgSh6bjeSqVUuFXL9lHwVbVcRKc7wPZu43nTsqEqMpIkff7QY5QlfUQONjq9Ad3cqdOxANH1eLHZ7h00Tb4bWCtLc+j0BrBsB7nRImjIcexrp44vX9MiHobRT/+9eAWDoRkAI/mEfE6D7bjmI3zLV7Z3G7TR6iBJUszPVsGy7LuHfE5gCANVkZGm6TPApOPSga5lDt3wlKAPxw8LczNkZXGO5LIadvYab2/tNmi3P6TX6yeEYXTBvztJwgeBF8fdYvSXK5vvOa4HTVNHHYADA+MGgbuqKfb8gLY6vZFubT77Cs9z0DIqLq9v4eSxZYRhhF5/iEI+B0KIWW+2YZg2XM/D8uLcS0+dPv605/nodPvv1Jsd2mh16OjvbmDZDlaX5q1bpS4YhvkfitFKuGW7j3wUPVMpfSWKAqI4RpKmaHV6B/OS+8nGZqenDYYmdE392LIdWLZD4zj59G72maQpOJZBtVLEfK1KsroW3qIaJygXc+McOUVGkQFy4+VPkvR5QggY5t6oIqMqbxBCoGVUMIRMLMRuZDCBf+fYysI1TTe1mcq7pmU/kulRw7Tof3+5sh7HMQq5LCrlwmSh/bCZUJgkCbSM+oYkiq+MZqT9WppS5HTt0KqVaQ76DsjP8/yvDctGHCdQZAkZVbnoB8FapzdARlUgigLSNAUBgev5UGQRmYz6Dc9xLz2kY3y+0+t/yxAGGVWxtnbrGkAwaqDIoFTI31WDzsQpXBAECDwHURQg8Dw2tvewdnzlO9txnzdtBzw3anvlWHZkuKrIb0wWwa6/lgf+/c2dTCEbrQ5qMxV0un0sP+JaHt3egHp+gFIxD2AkELU4P/sSRmVyXy7MzZC9RmvfqVvLqLBsB54f4MTq0nd3qsXiuh7d3mtiaaF2FOnWZxqtzo/lYuGWz0S726fd3gBrJ1Zu2cp8OwRB2BmaVikIQmRUBa1OD4vzs0cWyrp0dYuWi3moinwry6uHZT93ZmhY513Ph+24qJQLoCmFrqm3U9ZcqTfb67qWgSyJH7Ms++Veo/3tOC1GpgR9/yDYjhu4no8kGZH1yEE5GkVMSQqWZeC6HpI0hSSKUBQJupa572V8lNKzSZI+Z5jW63SUbwYAsOyo+y+rZZCkKSil6PWH1/T5H4lk+gPa6Y4crhnCIJNRQAjBXqOFYj6HfE5/pdPrfxkEESRRgCxLUBX5nvUQbobB0KCEEDiuj1xWe9SV8F68vL71tZZRMVMpkSRN3xsOzXdGNdIW5marZLfeomEYQdNU0JSikM9+1h8ar7c7fczNlnHAiOHMOA97U59Gy3ZovdnGQm1mv3zrVjj/n4u0kMtOFhUPJTfP96njeCgV88/iNrK5lNKztuOeC8MIqiLvLyjGcfL5+tbOq6IoYGm+RvwgDIaGKVBKMVst39KrsD8waBhFY92XBOtbe1heqCGXvbap5tLVTQoQFPNZFB+Qf2mapu8YpvVeq9ODLEuQJQkMISgV80f2z9zY2qUcx2Fhbqbc7Q86nhcgn9NvKrDFTbn2rhAeLIR3XI+6ngdCCAgBJFEAyzJgGAKGMDAsG7EZoz8w3lEV+Z0oiqFrGWgZZRKV3NAgcNSI+dLVrXMMw0AQOKQphSJLkCURsiRNBHGev3R181uGYSCJIoIgNI+yIh4EYafebJe8IMDJ1eXPLlxef/2pteNvEUI+3tzeozzHodsfoNHqfFkq5jFfq973luwwjC5QSkumbZeiKAalFFpGRbc/xOrS/LPn/33xx2MrC/QowkS/Eb7J6hoarQ7yWb0TxXGp0+tjcW4WhDAAsAJQzM6UYNkuCnn9K45j/1opFd5PkuSCLMv7hNnu9M8naYrZ6rV14JTSs61O71xWz0CRpY9zWf1N03YgiuIHB01kr5+JGKYNWZImdlzP3Ix8Ry7i0k2fEQBiEIaaaTlwXBeEEHAcB8t2wDAMrZQL2NlrglIKPZOB7bg0oypEFAVqmjaubGyvF3JZJEmCcqmwXwv/awqoC57l9vWjn37q1Mv/uXDly1z22jVDnuchCgI6vQGCMKT3WSda6/T65tCwQSmFJEkgIMhn9Tud5TwHQsCyLNI0PZumI/GlW6kfTiPo+wxK6Vk/CM+tb+5A01SoigzbdkEphSxLIGSUcuA4FmNdXICOhN8ZhiBNUwiCgCRJfvWyO5DhDsJJ1xgFIQy0zGiQUGT5Q5ZlPjgk9yUAeCGK4nf2Gq3nJroHM5XShyzL/Phr8OV+nSQJgjCC5/tgGQaOOyqZa3a6WJqvIaMqpNHqUNtxwTIssnoGsixB4Lmv7qesq+241PV8TIRrMqqMJEkBMlqg9PwAaZJieXGu/H//daHzv/98+mkcrd34ocPzA1pvtFGbLUOWJLKz16SFfHayJvBDbzB8TlVk7NZbOH1yldzF8/b6hUvrn87NVpDVNTI0LLqz18Ti/MyhrduT67u1W0etWkYUJWBZ5q6izqubOzSKYsiSCEopeJ7HbLX0d0LIXn9gfDo0LYiCgCAMUS7mEQQh/CBEtVzcEAR+9ermDhUFARlVRrvbx8ljyzfMvNrdPo2iCHOz1X3zAst2aJwkyGevFYfy/YC6vo9ubwhVkTE3W9Fxjy3bhmnTVqc7snzLauBYDo1W565SPv2BQSmliJMEupbBhUvreOLk6i1LF6cE/YCmQoOh+Z6iSKg3OyOhFkphmDZYhgHDMmBZFookgYKCUgqGMAABRIHH1m4Dq0vz+22fB7VkFUU+Up1sGEXnKaXlIIhqtuPC83xkVAX5vP7PKIqfsWwH9IDMpZZRYZg2pHEe3XE9zFTLoWFYguU4OL6ySBqtLjUtC6VCHooi33eLqiiOv+72Bi+O8t4OsnoGhXz2J5Zhfri+Fffi5Q1aLRchSQIuXNrAn5448TBz/XeC0m691WFZZl9idXOnTjmWgecHyKijqXuaptAy6j3L4lJKz27u1M9FUYxjKwu3TanVmx0aRhEKOf1uqjS0MIq+p5SWJ00wB/O0YRR92h8YZ3K6BkkSSRhG65eubq3MVksoFnKk2e5SlmFu2b1qWg5NkuSa6zJx4zmsqzSK46873cGLURQhTpK7NYQ40+0NzveHJihNR6kMlkFO1+D7AWzXw/xs9ZZyCDdLQe01WlhdWrgYRtGaZbs3zIimBP0QMMmxzVRKf4ni+J0DxPE8pXR1YJjnCIB8LvtSHMdnARK4nvdqkiTgeR5hGE3sjnCLxZASACsIwnU/CEuEAJ4f7EflHMeCgECWRSiydFvZRW8smWlaNmRZgigI2NypgxDgzJOniO24dGevCUWWkNW1G3KA94q9RpvGSQIy+pGhWi7eTvh+7fx/Ll44eWwZBMCVjR3kc/oj2cTSaHVpGIWolkuhJApiq9Ojk4aeoWGB5zkU8tl/2o77TOE+mP9Gcfz19k7jRVmWDrXVmpArAMsPwmC33hQyqoL70EY/yWNrAKw4jr/c2m28fPBeUkrPThaOB0OD9gYGREG4mZ74M3uN9o/FfPaGKHN7r0EX5w5vyEmS5Fy3NzwbJSPHG57jwPPcKC8uijcl1iRN37Ms+51GqwuGYaDIEoIwxNxsZb/h6NLVTaprmbu6VoOhsa/WuL3XxFOjDlpMCfphJ6hHJq8rd5kHq128vLEnicI1rZ8jIZXxTQPZt2IRBA7c2IVBy6iHa9di1MEHUC2K4rcsxymNj3NfhFyWRips6jhCD6Poxyvr2888ceoYSZLko//+cvXNWrUMjuPuhZyvWYiilL5JCLnYGwy/NQxr0gZ8J2L+L/6/f1/8+n/9aU0HYG3tNqjjulhZnH+kDGgd16O79RbmZivIqApJU/p2q9P9oFTIf2eY1vOSJMKyHbiej0JOx/1waO8PjFFdbpqiVi3f0lOv2e7SeOSLd19TVeM6ePzpiRM3+DXGcfyl6wUvR9FoYV2RpRsi+KFh0c2dPTx56vgNBgOX17eoKAqoVcs3PeY0Td+xbPc9y3bAcez+DJFhGGgZFbIs1nmO+8i07PdcL0AYRUiTBBw3KiFVVfkaQacwjNab7e7KOJVzx/doe7dBazPlr/718+WXT59Y2e+unRL0wyboKDrfHxhnquXiX/0g+PQuJE1f/c+FK5/PzpSgqeoGpVQjhByaS2MY8hMhZG8cATxHKS1bllOL4ng/PXIwlcFzHNTx4ubNSMyyHXrp6hb+dPrEhiDwZy5e3jBVZSTMfg8R3nNXN3e+VxV5P50ThhE8zwcv8EiSBCuL83+7U80H03Lo1Y1fW9eDMNzbq7dr48EGWkb5Kk6Sl6MohucFYBiCrK59x3Hsl3fbsHPHEW0Uf9vq9J5nGGY/om20OjSf1TEwLPhBgJXFOdIfGHR9axfVcvFIDjW3jtZMyrIMTMsZLVgTBtVK8dCcrO249OrmDmYqpUOdU66NTtMPtvcabxfzWQiCEAKAwHPv9Yfmu0kyciCZrGWEUYTlhdpbACxCyOcHB2fX8+nFyxt44uQqhqYFw7Qhy+I18rZxnHxq2vbrWV07mKopNdvdDsey4HkOrU4PJ48ti7hNeV0YRT8CwHBoPRMnMWzHRVbT4HjeyDWFAALHgzAE5RsHMw2A1e70qaJIyKjKLStPbvYMDAzz+Va7i5PHlo/cuj4l6AeAIAg7pm2Xspp2sTcYrt2tvZNlO9QPglHEfDDPeJP/TT6n65l/ciz79fhd8U5K+9rdPm00O/jTEyf/xjDkw1a7Rx3PQ7mYh5ZR76VSQzMt2xR4HnvNNjiWxWy1fNH1vLUwilEpFSZR1h3XsrquR3cb7VHKwLQgjRtEeI5HRlUQhiHCKIbvBwAowigGwzCQJRGqKkORJUjig424N7b3KAH2a7eDIDQNy9Z0TcVeo41CLot8TidbO3XaHxp4cu34TwLPP32Xu6v9cmVzb+J6PakfP7G6dNg5Prdbb30fhCGOLS8cybas3uyc43kOhIyeuSRN4TgueJ4frbWMm0rmZ6vIZbW/XtnY+fTE6uL1pWj7lUvjlnTUZipHmvkkSXJuUm/c7Q+pJAoT0kcUxRAFHqIo3Mq5R/A8P6i3OuBGnprQMuptS0N3Gy06f8Ci6k7ux8bW7t54YfOOHMKnZXYPAKIorCZGahqWvWZaDmar5btjtIxKxqab9wMTn6FDVcviOPn80vrmqzzH4cxTpyYRwvO9wRBPnDp2P+qarckU9tjywq+/FIG/Idi504dfUWRy8tjS81c2tr8Nw2gymBz4Eag3/DjjJMHQsBAE4agkjDA0q2ega5mXcAfNM0d+JgQeLMtOjGWJKAqlZJgGcZxAlkTkc/qzAFYIQzBfmwFDmIs3z9e3aH9o4olTx262CFgfKwICQC2jKuTE6tLNNvdDFMdYmq99caSIjpBP5mYrNzYflYv7uWGWZfDEyWMvAfgmSZJztZkycGOd8CSSf4YQMikPJbdLiwHXyofKkojdegsMQ7AwNxtKovCiH4TfbO3sCQLP05tIB4S26yGrZZDJqKEkCkfxl1mL4wSDofntnS7kGqa1Z1g2Fudmb7e2NCXohwQrSVJY9mh6iYfX4XQrXE/Mz3t+8K0fBPD9EEkSozZTwUEHkCRJXhnXm373iJzDYaj3Bwbda7ZRLRdRKRVuF+WHk9zfZPDrDwzaGotAWbbz9YOoq86oKprtDg4MuCFAIQj8Txg1ofwTADRVheO6uFV3nzLO1bMM881hEW6cJC/ndA1xkqDe7OzdYqFwPHgIYFnm+3s5P0rpm5TSku8H0EfneH5Cpqoi36q77p+FnI4wilBvduhMpXh9+Vp469RBhCRJcOr4sf3qJkkUxFPHV7C+tUt7/SG9voQwDKP1NE2R1TI4IjnDsp0LhBCoinxHqQ3X86njepAlCYWjepNNCfrBI6MqIAQo5nPWo3A8g6FBCcPA94P9Tkee4yDLEnK69tZh+ViWZb+J4+TNu4xsHwqa7S7tdAf40xMnjtzNdT0mnnYP8hwZhiBJUjAMs7+PrK7BNO0zAs8jiuJveZ57IZ/TieN5dEzah9Z253NZks/daFjquB7d3NlDuVhApVQge402TdMUhmnTrH7zErokSeB6/keqIt9xTj6K469N036x2R55f+paBhzHodsb7JWK+ZsuWu/vO03f6w8MZDIqSoXcxYFhvlvM545UXzxOt4DnOeCQ0tPVpXmy22hRSunrB+269prtlSRJIAj8oRrMh6HTHSCKIzDMHQ1kr7quB88PsLI0d6ghwpSgfyNIomB5vq/91jq2hmnT3XoT+ZwOLaOiWi7eTB/jMHyjyBJ+ubJBTx1feeTK17Z3G9RxPfzpiRP349ge+AA0so5KhQNpj08c1z0rCiIM03q+VMyDUjoxEr3jxhtVkU+fOrbyzqSMrFzMbzTb3RXX8yEIPJUl8ZU0Tc9cF6G+3B8aYJiRytp1MyUNwLO41mJWA/CF5/nUsGy4ng/H8VDIZ1HI6ZBliZiWTXf2mrAc9/OVxblDCXpomDQMY3i+D1EUwfMcBIE/XRRyt838TYjOMK1zlVLhoKv4i2EYfXRQqyOna7iysf3pwtzMp5Iokt16izIMA0WSkM/qdyC5S6EqMu6g9vk507I/t52REe3dridMCfoBQRQFPUlSOi4l+/i3OIZmu0u7/SFOHV++6yaOUjFPTMumt6o7/S3Q6w+p63l31X33WyBJEmR1DZIo/vXADOUN3w/PZlQVrucBAAghP4FSNNtdGkUxZiqlO2knvniQQASBX12cn32+PzC+bXd6iOL4yzhOMDdbefdAGuercjGPAxH5/kA1MEyz3myD5zj8WghEUSkVPh8aFlzfx+LcLJbmax8ebCvXtQwRRYHezCoLANrdPshIxwJBEKLbGyCnazXcpglrfXPXFEUec7NVMtJQlifGEyuXrm59LQo8lhZqwLjrEADiOAHHsl9RSs8OhgaWF+cmi4JHWvAeGhbN6tpEi/xIs4pOt//iqBFJuW1lzC1nXlMqfXDIZTVs7zU/+i327Xk+7fYGeGrtOLnXDrvV5QXCsRz+/fMlCuD5R4Dszu02Wlg7sfrs4/IsJGkKbSQ0ddAZG8V8FrIkPhuE+2L4PwZhiFIh91VGVbC5s/e8ZTvXy9mWcIiN1k3wnSgKyKjKpFphUi+/j9pMhRy2QJfP6mRpvoaZSgmz1RJmKiXMzVZhWA7CKEKlVICWUclhmh88xyGM4pse1Mljy+TE6hLJZ3WSURXwHAfP8/dudzK1mTIyqoIoir+vN9pwXHdt/NbG0vysVa2UJizapZS+GUYRHNdDb2C8fHl969zifA2yJH2BO1j01rXM37wguK0xLzAqsd3aqb+YJClEgb8ncgamZXYPHP+5cIXOVEsoPSCFrZtht9Gihax+JFWzI0etgyHt9gb4rdMdjVaXjsWBHhtrsv7AoON24WuO2fMD2mh1MFstY6/RwvGVxbl6s7NXyOv7pX+tTo8yDLNfn9tsd6ntuIjjkabDTRYBNc8PzE63D9N28NTa8fKYtF6/fpC4U7S7fWpaNuZrMzetgNjabVBCAN8PMFGxu91sL0nSm8puHkKEP25t15+ZqZZuWk7X7Q9oGMbI6hm4rgfLcbG6dHfO8Fs7dSoIPIr53E3lTsMwutDu9tfiOL7G0upeMI2gHzBOHV/+zradh73bV0FxX8l5FO3liCAIuInzxsPAM/Vmm9q2MyFn4XF5DjiORTrKLV8DWRKJLIlwXBdZLYN//XxpTxT4a+qyc7pmtbs9eGPbsGIh900uq6FYyCGrH+7EUW92zM3tPfhBgGgUnT87TqHcNTl7fkDrzQ71/JEjeLfXF+I4+fyQj67xHIskSUf13bcpXvD8gIZhdNNzOQyGaT2TpMl+F+2haUZBQCGfDVVFJuVSgfDc3Wd0CTNq+LJdd+WQt1+0HZcalrU2yTnfD3KeEvRDAM9zL3Ach+3dxh2RWhCEHT+4O6cWSql4sHvwfqJUyIH+dv4x//S8AIvzs5OSwfBxeQ50LUMsxz30vdlqudwfGJBlCcsLNQRhhAuX1ukktRGEkVabqSBJU/T6Q8pz3EulQp6Ui3lyMyGgSqnw2XytilxWhz4ivnuq7Q6CsOO4HoamCUWWUC7m/x6OJGBL13+21eldiOIEWS2DUjFPbiPCpA2GJgzLRkZVjtQwYFo2dV0fkijCdlxQSt88dMMZlUwi/KFp0cyvi4l3jGq5WAcIXNe/5nXH9Wi92f660+3DdkYNXfeLnKcE/ZAwX6sSy3EwNqLFESM/cX1zF/Vmm/YHBk2S5KND/PwOH+0J6RLyYGb/WkYt2677W13KNUkSIYrC6cfxObjFHemePLZMRFH4JopiZFQZx5YXNja369jaqVNdU8WhYSGjKsS0HWzu1G87RHIc+1cto5JyMf8GASYBQulujjtJ0/csxy01Wx1US0WUi3nCMMz7q0vz5LAFTD8IEATBrZoynknT9B3PD+gvVzbNca72SL+LIAz3egMDYRSBZVk0Wx14nn+zdZ797dmOC13X3r/LwcnsdAc1XVNRLuYtYFS22un2ab3RhuN44HkeK4tz5fttFjDNQT8kpGn6zk//+eW9E8eWbqXSJgAI/SAM+gNDAEbKbpRSRFGEjKoiTVNkVBmEMNA19aaaAHuNNq2UCjeIzNwrwjC6MBiaa9VK8WHnf180LfvrMIzua4TyMLG926Bj95JbTlJsx+1kVOVZAP+sNzt0aJrIZ3WkKYWqSLBdDyzDgudY5LL6rWQvBQBhs92lWzt1rC7Po1wsHOnaBWG45/tBzbId9AcmojjGidUl6Notm3g03w/MZqeHOI6xMDdTP0SGFL9c2aSGaaE2U8FYSvRIUqdpmv6jNzDeTcZ6yooskTRN/3E7XeY4Tj5vdXqvHjW/fT12600KEOhaBmSsIWOMTXn1jApRFO9YQ2ZK0I8mSf/jXz9fendpfva2imWm5VBZEn/gee5FPwi7QRAInh+gVMh/4fn+q3Ecw/UCEEIgCjw4joWuZd6glNYYhvmfJE3f291rvnOnFle3w+X1bSpLIsrFvPUwa7y7vcGkZPCv97rI9YgT9A0YGCatN9oo5LMwLQfztSoAoN3pged5zNeqt9UID8PoAsuxXx5Vl2Vzp05N04auqSjks2AY5rbyr67rXRgYFnw/QC476mSslos3KNn5QUCjKEaapthrtHF8ZXFSKnfLFItp26XB0EQxn7utwYBp2XTs8/iX9a3d78ft/3Om5ezpmnpbIf8wjNb9IFxptbuQZXFkXGs77xIAkig+tGd/StAPH2f+feHy+XFb8g0WP3cD1/NpkiSwHXdsuzX602x1MVMtoVIq3DNJU0pfX9/a/ZRhGIgCj9pM5a479+44ao+i861270wUx1hdmr9jJbHHnaCBUWlho9U56/nByL2E4zA7U8bQsDD29jtsu6/iNp18twom4jh5bUycr/YHxue30pGglL6+W299Wi4VQkkUnrVs53yj1cHcbPWmgvnd/pBatoPZaum2YlVJkn7wz//377f/9MTJIwnwT7SX/SBAPqsjSVLESQJKU3Ach5lK6bDn6HnDtL+NogjBWGArp2fui/zrlKAfMwyGBt3abeKJU6v3olp26A9lc6f+aUaVIUsSrm7uQMuomK9V/ynw/IsAgvGfCcTxn2cN0/4aoNAy6t8ZhvkUgB6G0TeO560MhiY4lkUYjVbbjzpVvkuUADzruN7XruuBMAS27UKWpUld6aOqC/LACPpgqqfT639tWs5YOlZGHCWI4lHueqIop8jS303beY9j2dtFvreFHwS02xsexQzhRYwXI13Pp3uNFk6sLh1qNmtaNh0YFmRRRKV8+2cpDKP1KxvbK5VS4Y5SXBcvb1COY3F8ZZEAkwankeHwuDxP8/3AdFwPjuuN7ehGAv/3I7CZEvRjDNf16NZuA4oiY2n+/nfpxXH8pWU7L5u2iySOoaoK4jjGvtr/r48BxkIw4DgWrudh3G4MhmHG9bYqOI4Le/2hMDdbEe8XQVJKzwKA43rnwjACYQh8PxxLhEbI6Rryuexne83W67Vq5U5NOn9vBL0/MHmeT23Xg+f5YBgGSZIgSVOk6ei+jazLKIqF3P1wPi+laXqWYZgjL7Jt7dSprmdu8A0ERnXdrU4PK6OOvtumZyzboYZpIwjDozjtXPO93sCA63p44tSx/e/Yjks7vcFIlnZsRhxGIydyXcsgoyr33QB5StCPMdY3d2icJDh5bPmBjNhD06K2ParPvJ0bytAwqSxLdY5lv6YU4tAwX+8NDMiSCNfzoGsZsAwLRZFuWYN6CBHDHOsE7xvnsiyGpgWe41As5BAnCQzTgsCPXNG1jAqB5z5hWfaNZrtL8zn90EWnP1gEfRDPYSRg/2W5mP+4PzTetGwXSZIin9UgSeI9R8/3gJu2bZuWTR3XO5JzzmA4UhrM57IoFwtHXozz/YD2BkNEcYJqqXDQveTV3Ubrc5Zh9l2KBIFHPpt9YAt9U4L+HWC30aKGYeHJI/iU3V00nXze6Q1eTdMEFIAiSWMX8VH0EIYRLNvB8uIcGq3OvrfhbLWMrJ4pAzABvEApLVFK5yzbeS+KExz1YMeuyH+P4+TsXqO1AkLAMAxYhkGpkIPlOHAcD+VSAYos3SDoVG92aKmQu+1i0h+MoK/Hiuv5693+AHEUww9CKIqM2UrJEkVhDUcwG37UEMfxl54fvKxl1Nuu18Rx8qnrea8LAo96owPX85HJKFi+dqF8rdnuXiiXCu/TND3dGxgv32s79pSgf//QAFidXp82Wl2sHV954ETkej6Nohg8z0ESxb9duHT1g6yegaooEAUeDMOAAhAE/v07cWS5Q7y4tdv42nFdLM3XbjYVFwCEjVaHFvOPN0Fv7dTp/a6quWkEGQQ0jhNQSsdOIxFEUQBDmAfiyP4ooNnu0p29Jgr5LDRVhe26YAjZd7E5dNAciYDdNs3yW2GqZvdowAKAcrFAZEmiVzd31lRFpovzsw+sUkKRJQJ5tKj48y9XP9U0FaIgIJ/TH1r+bWhYXzOEYG6mcqs86cFct/g432Se52A7LpUl6cPDBIbuJyRRJJOrNTEJcFyPJkmC3mAI3w/o8ZXF+1JF9IigVsznfpAk8bmJ3kkFBeA2zTlBEO3//h5FTDsJHzFkVIWcPrlKREHAv3++9H2vP3xgjdXtbp/+95ern5aKeSiShFxO/+ZhkbPr+bTT7YPjWGR17bZRMaUAyONNJhlVwdZuHXEcv/6Qd70WRfH3xticVRSESQpr7ffyu+n2Bnv/uXD5OU1Vr88jd2+cXYSBYdp0r9GmHMfiwqV1E4+orss0gn5EUa0USamY+2iv0X6z3e3TXFbDTKV0J2L7t8Slq5tUliTMzVQmTtcPdcprWQ5kWZxEd7cdFAgB0jR95nG+p5QCHMuCMORh1HGXkiR9x7Cstw3DgiiKIIRA11QIgnCYc/VjjVIx/5qiyJ8fZWbSHwyFNKVwPQ8njy2TerND17d2g7tVuptG0H9QsCz71uL8LDl9cvUlgODC5fVzWzt1GobR+l1ucsUwLbq+uUNFUYQsS+B57qGTc7c3oIZlgef5I1cZ8DyHnd3mTYVxHieSfsB42XZcOhganSsbW2+PBkIJjVYHupZBVtfIPeafn6OUHnUGcCYIws5DurRfHFV+tjZTIVEc4+Sx5VdG/y+TMIzQHxj0UXtepgT9eOCb2WqJPHHyGNE1FUPTWtlttGi3N6CeH1AAL49/NM+NBZlWADzjej7tDYa0PzDoxvYevbKxvb610wDFyGU6n9U+fthlWEEY7jU7PWR1Dbp2dHlJc0w0v5U7zf0AIRPbK/pASgWTJPmo1e592e70MNJWrqI2U/mOZVnkszpURb6nHD6l9Oy/fr70fbPd/XRje49u7zZof2jQi5c36FiCtjbhwFGkapy/cGm91Or0bkp8URx/3e0PabPdpWmavnO/r4njetS0bDqRagVGNeRjtcev9nNAJ1Ze2mu0kCTpB4/UMzOt4nh84bge9f0AQRiBECBJUjiuh6yeQRCGKORGGgrj1uCuKArlMIrOJ3FyRpal+9ZscgcEcu7C5Y2zpUIOsiThVkamE0Lw/OBcEIQYDE3ouopSIU/GA9Bj1+7d6fUpz/G3rUW/U/hBGAwNU2BZFqAUKaVHdvKglJ7t9AbnslrmSPoSSZKcGwzNs9GBhqdRh2kMQgBvrA+jayqyWe2bC5fWX9Qz6k0rKTa292iapCNrqErxGo2MNKVvE4LuvWivXLy8TglhsFCr7uuj9/pD2h+aqJTyIzsvAKoik1anR0FH6cUpQU/xIPA8pXR1YJjnwjBCmqaozVQeiYctCMLOxcsbpeOri2h3eli5fb5P2NqpB97YkcN1PTy5dvzZIAi/GZpW6VGuXb3V7GFoWLX7dexxnHze7Q9edVwPYRihUi4gTSlKhdxbR5xpCP/676WgWMhiplq+p3LKerNNJ7XzPM+h2x+iWirCsCzIkgRZFqFrmRu8MQdDg3Z7Q5w4tnTDNfnlyiZlGAYnVhfv5XqVMLJpu0aTZHOnTudmKt+1u/3n0zRFsZCDIkun//XzpQt/fuLkoe3p0xTHFPeK7wghnxRyWTJTKZEkSbG5vUd39po0TdN/XPfZh7qC/5+LV0rHVhagyNIbFCP5VUrpm+M/Z9M0/Ud/YNDeeLq712gHWV3DyuKctbI4R7SMCkrpadN2SneSGnmUIArCnO8H92VbruvRbn/wKiEE+ayOE6tLn0miCNt2cOHS+lF8MEuNVjdI0hSlYr5+D+RcAkaSABzHYnF+lsxWy/rJ1SWrUi6QhbkZcBwL03LQ6fZfDKPox+uuCaI4RhCGN/gRSpIIUeDv9VJ1cRPBKJ7n3pqbrTydy2rY3m0gjpN3F+dnYZjWj9MIeoqHBtfzqWFamIj4syyD4dDC0mLtJ8tyzsRJAoHn7otqVxwnn0Zx/LplOfDDACzDgOM4TJpi0pSC49gDmiDjB5FgX29XlqQXcJ2pp2FalBACx/WQJAnmazOPYxXCmZ295vmFuXs69pWt3ca6ZTuoVcsAAQoH7tvYc9DEdRKfh+DVC5fWPy8VcijfH1Gg53ELI9Z2p0+DMEQUxdA1FaVi/rX+wPic41g0Wh2cPLZ8Q4VSmqbv7NSb793Oz/Bu0Gh1KcOQg6mgUr3Z6dRmys/u7DV/vMd7NCXoKe7uR5Qk6Yu247ydUoowjH5V8GJZ5HOjFKSWUd8ghHyJozcxlACYSZJ8eHl9+02GIeBYDoLAQ1Ek6JnMFxzHvnYvB04pffPK+vZHoiggpRQz5SKkx68bbm17r3Fhce6u272f6/WH3wdhCNfzwXEcBJ5DEEZIkgSSKCKjyshl9cMaUNYopc9O8rn9oUGHhoXVpfmnAfz0ME7edlzquB4cx4UgCBgYJkCBE6uLN72Xm9t79Lr8tVBvdgIto9zULPao2NlrUoHnUa0Uie24tNHqYGFuNhwaplAq5O/5mb0fmNZB/8FSICzLfJfVtcNqRVcM014nBGh3+ufiJDnHsgw4lr3tRsfedGBZBkvzs2A59r5KqE52oygyBIHDYGhhaFqYkR7DxsJ7KOTarTe/T5IUhXx2f23B833a7Q2RJAkqpcJGFMcrGIkoXRNBm5Z9wfMCVCvFz6Io/ta2XfhBgP7QOF/IZe+0o7A0/nOkpibP9+nG1h54jsPq8vzH1XLxLQBabaZytt5qf9Dq9iAKAp2plA52zr7quN7noihcN0OLvxgMDYjiPac+IPA8WI5Fs92lcZIgoyowLVvQMioGhvFquViYEvQUjww2JlUVB3K8L/pB+CUBAnrTNmsq3E5s/b5M9Qj5hOe4c2lKMXLB9m47rX4EYd6tV+Ruo0WjKEYYRZBEcXLOL0ui+NeFuZn9KgfhJjlbRZY/Yxjm9TRN3xkY5vP9oYHlhRrqzQ5yuvbm9bZRSZKcY1n2jcO2dXl9q8OyLI7a2JGmFLmsjnxOB8uyb41fthiGfKQq8geDgYmePYTjet8rsgSGMAjCUYHRfK16XW6cBDzPgfn1OtYA1PsDg1qOi6X52ddwBJOC9c1dqmsqtIxSb7a6NV1TwY6DkU5vAPkRGfynKY4pHhtEUfz9bqP1HMMQRFGMarl4z9Pch41Wp0e1jIqjNlUAI9PSoWFpURwhjpN9IasoijA3Wz2y8FG3N6CyLKHTGyCjyBPh+0PND37+5SqdqZQONX6dyIWyLHvXovaU0jdbnd5HAKBnVCiKfNqynQtBEMK0HXAsC57nMVstXUO4cRx/eXl9++WZSgn53EhrOk3Tf2ztNt6llIJhGGRvokN90GWFEILjK4vEdly6vdvAbLUM07JRyGcn6ZgjyaE+aEyrOKZ4bMBx7GcMw2B+duZDWZLgev5jdw4TLew7wNrVrR0tSRPM12ZeWF6c+8tIk5tBMZ+9I1U6zw/Q7Q+wvFB74YAryaG18IV8FrbjTmYp10DXMsTzAvQHBuI4+fwur8PGuLNxUp98UcuopFTMk9WleaJrKmzHwX8uXPl8t96ktuNSSunrDMN+r8jSNdewNxi+6/sBKqUCKsU8NFU9tG6a53mEY1U/WZIAYC2jKmS2WobtuFBVGVpGJXGc4G5nOlOCnuIPi3GaA4Sgm8tqcBwPGDWtPDZI0xQMc/Sfnev5F0RBmHznAoAfclmNzNeq5HZVNxtbu3RomBQYmcZajoN8NovbpYWSNH1vfG1BKT20HLM2UwbLMIji+NWbbEYD8PItdvONIkvXt50Lo/RK+kGcJEhTimqlAEIY7DVauLq582mn2/9AkkQU8tm/AKMmnSiKsbRQQ0ZViKLIZOxy/uK/f75MD4qNZVSFSKKISqmArJ5Bvdm+AAD5nD43cfKJ4/hLQgiSJMWD6GycEvQUv2tk9Qz6Q/M9SRLf94MAjuutP07HL0sibMeFYdpHCqMHQwO1mQpsx8VgaExqhUtH+OoZhmXg+SHSlL7dGxhrlFLs7DXgHmh7vkkq5J0kTTBbLX93s4YXQeDfFUUBPMcdGq0apmX+6+dLX9qOeyfThbDT69P/7//+623DsHHq+PIL5WKBzM1WyPLCXLc2U8HQNOE4LoIg/AYA2t2eMDQsKLL09HXb+nZ1eR7FQu7ZyQub23s0n9Ph+wEarS7YkaMPBVDPZ3VIogDLdl9mGALbcUAI2ZsS9BRT3AFURdaDIESr3X1HkkQMhsZjNsBoen8whGU7R5w1MOj2BqO8am4UNeJoFRc/Lc3XiCKL6PT6H6RpgpXFeWgZFRzH/vOQSH2i4QJulFvGrfwfbcd913E9JGnywk3O87ViPgfDtNAfGDRJko/GUfWtr4+mbdSqZRxbWXjpYKQvikJZkSWytFBDFMe4urmjdXp9miQpTh5b/gw3lgqGqiKToWn9GMfxlzt7TUoIgSJLZUpHno2248K2XSRJ8pGqyHMTZyHTckAIA0LIby5vOyXoKR43WJSmqJZLH85Wy/D8AEEQmo/LwVNKXxMFAZVy4UitxIQQuJ6HcrHwAu7cvOH5Tm+AIAghCAIUWSKL87NE4PnXr4vCtU6vDwBzAFAs5Ihh2rfcsK5l5jiOxdZOvZam6T8c16PXKQ1+MTdbIQBBFMfY3K6/uVtv3vY+CQK/Oq57/ubgefhBQAFokiiS2kwF87UZxHE6MstNklfCKDp/zUNiO/TfFy7TXm+Ibn/4sigKqFZKYZKmbzuuB1kWwXEcgjDEYGi+SSl9gVLAD0MoigRZEpGm9DfXy54S9BSPHcqlQr3T678tSyIRBAG9gaE9LsdOCPlEFAVwLPvl0Qg9Bc/zwBHKCSmlZw+mL3b2mt8yhCCrZ67Rf06S5O1frmx2wjC6YNkO3dzeM4XRPn4cb+dNlmVxfVv2dagL49y4adnv7jXaaLa7N7SYz81WiGnZIIQgn8ve1TXr9Prf/p/zPyMZ54S1jEp0TSWSyGNxbvbi5k5d6w+MM41Wl+412rTZ7tLdegunT6x+RgjAMszIHJbn32EZ5u8sy2BoWFian31NFHj4YQg/CD8da46DYKQnQmk6JegpprhTiIIwF4YRAJSymgo/CA7VcnhUUSrkv9vcqb83GJq3zc8yDAP/11nCc47rUcO06dZOncZxfA3J+0Fwbnu3gd1Giw6GBvWDAElKb9D7Zln2DVkW0e0P1vpDA0majrr6gNPj6POj/tBAHMUTgwQBGC06/vzL1f1jXpqffVaSRFi2C4CiWi4d2gAVBBFUVYbtuHBc71bn/FySJOduGJCLhRee+d9P/XRQL2Rrp07b3QEYhvmxUipgaJjI6hlEUYRiPvfd6ZOrpNnuvs5yHAaGiYyqYuLarcgSeI6DZTufz81W/5rECQZDE9VK6f00SZEk6SPzrEwJeorHErqmYmhYnVxWJ5Iootc3ao/LsfM894okihiaFnBIGdt+pJum7wHA4vwsWt2etltvfd8b569ZlgHDMAen9Wdsx0VtpgzbdtDtDZHTNRxbXjjUYSQKY/Ach1q18sOx5YW50ydW3wLwk2nZdLfegirLkCRxQoghAGiaClmWJsL2awD+OT9bJTzPgWEYOK57mJbyxlOnj78iigIazQ4s28HQMOlhxgv1Zvv7C5c2zuLGRdDvru9MXVqo/eXU8eVnOY79az6nk9pMBYZpYXlxjvA890Kz3aXlYt5amp/9iyiK6A+Gv+ZzMurfHc9DFMUghHzG8xyiOALLMN8UizkwDIMkSYBpDnqKKe4Ouaz+wmShjWUZGKZ1u+jsUYIlS+LEG/DsTQk6Tl6buHILPA+GIZBEEZbtQMtkYJj2uxg7qFzZ2D4fRTFanT50TUMmo6BcKpBJ1HgQEy8+XuDB89xfANQn1Rrtbh+ZjILV5fm3GIZ5/7rIn8xWSwjCaL9EDQBmKqVnCSH73X+H4KucrpFjKwsIghBDw8LQsG5Ih3Ach5SmwNGUFn/AAUlQXcuUGYbBbqNFN7b3KMdxGOtb/yAKPNKUIgyjCwAQJ8mrkigiSUfyqBlVQRKncFzv+ziO4bge4jgByzCf/dYPypSgp3hc8R3LMkiS5Fy1XCyLooCt3TpwhEqBR2QG8IntuBga5s3qiOEHwQrDMPudb7I0sijLqAo83wfLsrh0dfPL3sDATKUEWZJQyOkQBR48x8G0bBqG0frBUrc4Tj6fNMt0uv0bBrVyMQ8Cgq2d+kdjl5RrIIkiCcIQ4xTTBBcVWUanO4DnB7TR6tDDUk5aRiVLC7W/hFEMy7mxisXzA4ACvf7w+8lrzXaXHsWKKknSd6Iogp5RkVEVlAq5SZckFFm+Zn8Czz+tyBJMa/Sa7XgAAWzbBQGBLIvIqArwkAyUpwQ9xe8S1XLx42a7dxZAd3VpnhRyWTiu91hUdLAs+0Yuq0269V487DND00K5mP/74twsmeiPCDw/LrnT61EUoVwsQBIFGKaFIAzBsiyKhRzJZfUvTNvB1m5jZWiYmJAtx7Gv1WbKhOM4GKaNerO9v78win7sDwz4fgA/CMe55WtxdXOHCjwHjrtGRGuVYUak3+sPYTsuPM+/PuX0zC9XNmij1fme57kJwV+jhFSrlr+rzZYRxfEk2n3RdtxJfvwG7NZb1HZcajsu/fnS1be1jApdy7wQRdcMHlAV6WOe42Hazn5knqbppBtRq82USTGfQ0pTeH6AwdBEVtc+exSekylBT/HYgmXZt9I03Se4mUrphf7g0a6LTtL0vd5gSHv9IbUsB8no+A81Vi0X8mh3+++Np/BEkSVc3dxBEEYIgrBWLORIPqeTarn4kqooSJIE7W4Pe402vbKx9aosiajNlDFfmyGW7aLR6tD+wKA7e03qBwGWF2s4sbq0H2mub+4+k6QpFEXC2okVsjh/oyzq3Gw1DIIQaUoP+vf9VC0XSS6rw7RsVEoF5EZaGAcJWAQI+kMDcZxAy6joDYYBgH2ndp7nXshnsx8apo2denMtDKMPsnoGczOVQ68lz3Ho9YeoN9uYrZRAAWzvNr7luH0NuHDynBAC3MQsQQNGeuSmZSOX1aAqCliW+eFReF6mBD3FY41yMY9WuzdR/PpOy6g42N77CEBwPZ+2O31ab7Zpp9t/R5YkKIqM5cXaJzzPAcChXoAj3z+g0xtQACjks2RlcQ6+H6DbG6Dd6dOxSfA3uaxG5marpFwqIAxDKIqMoWEhimJ0egNaKRfDSqnwiev5iKIIjuOBpnQyuIUAsHZi5TWGEEysqw6DJAqiOpLlBEDFa1MYCrJ6Br2+cQ1BjvHDqePL5MlTx589sbr4Upqm6HQH+M+Fyz96/q+lgSzLfFYcCxYNhuYapThMK1oDgGIh91kYxSjmc+B5Hlkt85br+YfqaAi3cWZJx9oeQRiCUorrzQOmBD3FFHcBSRJJFMeI4vhrAKCg2Npt7FdA/EY4MzQt2mr36G6jFbiej2w2U6/NVJ6dqZTIRIOCZdk3BJ5HGEaHWlSN0x/QM+rESFXQMipZmJsh2awGx3XRGxhY39wZu2LTt/NZnawszZOZSumnYj6LIAzRbHUwNEyh2x+e5TgWhUIOaydWLD8IceHS+tc//feXCUF+kaR0IuV6A+I4+TRJknO240IbyXO+tT8zSJJzrU4Pvh9CkgQYpnWNk/YB/BPAN7PVMsnqGbAsC1mSTh94/6dSMU9qM2X4YYhiPnsYUVoAcGVj+3WB5xBGEbJ6hlBKdZZhcJhASU7XoCryTW9YFMWYrZbhecEjIzU6JegpfhfIZTVcuLT+ou24NKtl3l2cm8H65s7DFrp50XU9ur65S3f2mucZQlAs5D6bn62SUiFHREGYwyFGpBlVwcAwD61aYBgGtuOi0epo4waUEOMStGI+R3ieGynayTLanT62d+sfWLZDgzDcE3j+6VxWJ9VykZw4thz2BkMIPA91HFm3uj1NlkaLYbmsjna3T1udHmVZZl9y8zo8s7Vbf31nr3mWEAJREK5PN72xujT/bj43SnO0Oj1s7TZudb2e8TwfmqYCo8W4SWnd2vrmLt1rtKHIInbrrbMH0yCU0jeb7S7d2qlTYVSFgtlq+fT4er1frRTheB4OfgcYLUBeL/4/jrQtACjk9I8d1wPPc8jn9L9OCXqKKe4TMqpCCrksWp0eGIb5n6yufRdF8UQI54EijKLzzXaX/nzp6teeH2C+Vt1YmJshupaZqKrdErIkfZgkyS0/M1Mp4dLVLRij89mvzZ2vzczpWoaoigRJEqCqCjrdPq5u7NSa7e7k3F/mOfbT+dkqWp0eKKVQZAlpMmpOiaIYekZBGEWwbRcsw6DR7OzPSA5gI5fVwHEcWIaBH4RotLoUwJkDA8r/FPJZUpupgBAyMX64oarGsh26W2/96PoBMqqCoWHSS1e3Ohip311cXZ5/RZFlRFEMjuOwW2/+CABpSt++srH9UZKkIIRAVeTJPi5irCPieQHCMEKSpK9dT8bXy7yOr7s2HmDeZhgGaUoxsQWbEvQUU9wnzNeqp13XRxCEJs9zL8zXqljf3EWa0rcfwO6e6fYG9MrGNh0MzTO5rB4+cfIYKRZyRBD41TvZEMsyfxvnmm+QTSUgI+F6gX//6adOvbK108AB4hUA1AFA1zJPry4tfFYu5snq8sLpxflZcCyL3UaLbu82vryysX223R0go45Iz3Zc5LI6ZFkCQMGyLDR1lD/meR612Qqubmy/2L+2zK5bzOfIfK1KgjAEQwiiKAKl9Lnrj1vXMqRSKmBomrBs54YSDEWWPpEkEVktg25vAMOyEY5yv3Pjj3xVmymT2kyFiAIPEIJ6s03b3d4HupaBJAmQRBGm5Rws99uglL6ZUorlhbkf2t3e2weu0/VYA/YHkBAAeoNh0OsPUcxnLz5Kz/WUoKf4veDi8dUFXNnY1iYkcWJ1Ef/95coH92PjSZJ+0Gh1aLPdpc1290dB4LG6NP9utVwkkijcU9JSz2RgWvb6IakbK04SDIbGOwC++vOTJ8ue5+PnX67S7d1GEARhZ0Q2+GkcrQsALmZUhZSKeTI/XjRcnK9hYunkByEUWYLtONBUBZIkYbfRwtCwkCQpJElAIZf9YXlxPux0+9jaqdN6szNZjIQfhAFDGFBQLM7Plq+XIw3D6MLPv1ylIwlQGVpGXb1xUGLfKBVyRJZE+EEIgGC+NoPDpE09P0Axn8PQsBAnCYIghCSKqJQLRBR4GKa1/9k4Tl4ZNfZ4zx2wRBstVFKAYUbZ6SiKP7JsZ1Lr3E3T9B1RECBJIgSBPz0l6CmmeACQJYkosoTdRmtU4JpRST6r45crm3ed6gjD6MLG9h5ttrtvsyyLYj733UylRHQtQ6738btbiKKAVrt3w+s8z33A8xySeF8boruyNE8W5mbguB6CMCztNloXduutSWNIeOM1EYksiaRaLpLZaplUy4WvBJ4fpyg6yOkZLM7NQpJGreemaWO33nzOsmyhNlNBLqshp2ewvdfEXqNFgyAQNE3F0nyN4BDZU0Hgz5SKeVi2g9pM+ScAGzc771Ix/3RGkVEp5pHLaoRS+vok4g3CcO/S1dF9s2wHi/Oz0DMqJEmEOnJgwcTi6sBs5DvfD9AfmqCUYmCY3x54D73+EBh5GIosO2oAArDiuN57zXYXtWr5kXumpwQ9xe8KK0vzxLZd7DXadJz6IBlVxoVL63dM0q1Oj168srFWyOmYm62QSqlAbqWRfLdQZImklOJ6cXuGYT4RBQHd/gCtTm//PS2jktMnV0m3P0QSJyiX8vVmu1cbDPd1l28KjuNeEQQetZkKKqUiBoaFdqeHSqnw1qnjyySfywKEwLIdtLt9GKYNRZFXn1o7TlRVgcCPFua2dxuUUjppUz+4IBdWSgUSxQn+e/HqmUnkff3n0jT9x5WN7fMppbBsF61Oj/7nwuVPd+utoNHq0o2t3Vouq0OWRFRKhdcyqkJkWfomPNiEQnBNXpkQYiZpAoHnwXHcNY70LMvAtBxEUfyZYVrPRVEMgeeRpulr27sNFHLZw8r5fnNMTWOn+F3i3xcu0+WF2r6p7NZOnVJKMdYavhW03XrTZFkWYRhhaaFWxtEE8u8JYRSdv3x168yTa8evOb5mu0v5cdefNGo8ueb9n3+5SrN6BhlVAcMw6A8M8DwPgeeQ1bUfeJ57G4dUj1y/j0arg2q5hGq5+CHLMn/rDwza6w/BsiwEgYMfhKiUitAyyhuEkE/6Q4MGQQhJEtHrD6GpKvI5/SIIgq3t+plsVoMo8NhrtpHTNcRJAt8PUC4WEMcx2t0+ysUCyqX8W/2B8ZEoCsioyrOmZf8oCEI4GJpCMZ+9KAj8axiL8YdhtN7tD1cm12Brt05p+us97Q8N2un2cfLY8l/rzc6nIz3qXwP2je29jiQKAAiGhonTJ1eJYVq03uzg9MnVR9J8eBpBT/G7xJOnjr17dXNnoryGpYUa4XgO//r5Eh3nbm9AHCef/p+f/muKgoBqufj3pYXDp/EPAgLPP60oMrrXNdkUctkNSRIRhCF4nsV44e7lyftPnDr20tCw4Lg+tIxKZFmCZdtwPR9XN3ee22u0f9xrtKlp2fRgQ8hBzFRK5H/96bSepgn+/fOlt13Pp4V8lpw4tkQq5QIM00a1XITrebi6uXOu2e5SRZJGdcWUYqE2YyVpgv7QWBsMzTPZrIZSIf+3rK6Vnzh5jFRKxc/yWR2SJML1fEiSiOOri/UgDHHx8sZHKaUwTBvNdvfHrd0GbNsReJ6b5IN/+nVGQX66phKDYtQCOMakGoYQ8hkhBJ1u/+D5BnGcIJfV4boe5mYrcD2fXt3cxdqJlTce1ed4GkFP8XvGmf9evHJey6hYnJ99AcB3nh/Q/sAAwzDgeRYEBBSjabbn+ZBEAavLC5NfvYCbuF4/ILz87wuXv/zT6RPiwf3ajkvjOIE98uJDbbZyg5v3hUvrVJEljAcVxHHyqR8Er5uWjThOECcJOI5FkqTI6RryOf3QiNH1fLq+uYNCPrcfrTuuRy+vb+Ppp079xfX87wkAPwhByKhWe5J2YAiDOE5AGAKAIk0pLNsBpWMhfAKoigJdU9Hu9qHIMjzfhySK0DUVGVUpt7v9Trc/wNxM5QYd63a3TzOKPHEBx/Zug8ZJgtWleQIA3d6ADgwTc7NVDIYGXM/HidUlcRR8Rz92e8NngjCEqsgQeB6bO3WcefLkWzfzXZxG0FNM8WDx05Nrx4ksS/jPhcvftjo9KksiGeWT8x+rigJVkaHKMkqFHGYqJYAQHBDCDx/y8X5VzGex22jdIBoRRRHma1USJ6P0wPU4fXKVJEmKS1c3aRhG6xzH/jWjKqQ2UyGL87Nkvlb9Sc9kwBCCdreH/1y4Qi3buT6iFhRZIk+dPkFMy8LWbp0CgKrI5OSxJfz34pXvW50eGu0u8jmd5LI60bUMKRXypJjP/RUAwjgaiedr2kVKKVRFRpqmiOMYkijCMC0Ypo1CTsdstURkSYJp2RB4/iKAbrGQe59lGNDD00DgBf4bYFQTHUbRwe7Alf7QgK5lYFo2/CAEP9LkCNOUvt1odZ7hOBaSKMD1fOw1Wnj6qVNzjzI5Twl6ij8EysU8eer0iRds28XFyxvUMC3KsuxbsiQSSRKJLEskimIMDHPU0HB47exDQW2mcjqK4kPmuqNg8tTxFRLHMS5f3bqBw1aX58l8bQb//eXqyvVuLaPOQo3MVErW8sKcdfLY0sVmu4srG9s0jpNPrx+Q1k6skjhOsL61S4HRQmZGVZBRZbAMg3RsP7W5vUevbu7QX65sfMqyDOZnq6dVRcal9a01VZExWy0TjmNRKRewMDfzxtJCDUPDwkTQqFIqfLi8UEOnN1gbRf7xXynFoe3aDCGgKV0FAM/3PwijaFIqhzCMvhFFAbIkIghGpzHR12AY8hM7FuG3bBeKJGGc668/6s/ulKCn+KPgu2MrC2Rlca6bphR7jTbda7ToXqNNd+stmozlJ4v5LHiOe+k3PM6LhVwWA+NXgs2oytMHldiOLS8QWZZw0H4K4444RZbI00+d+mu728cvVzbpAcU5AIAoCrooCrog8KdPrC6RYj6L//5y5XXX9ehYv2TSGSgcW14gSZyg3elTSunr+ZwORZZRLORgO+57YRSdd30fosBDGTmw1AFcrM1UiCJL+3KlupbB0LBBCPmW57l/qqqMeCwExbLM3yRJfG2sSggCclO5WEoBkFFrNs9zPzGE2c87m5a9NhFJ4jgOWT0zaeWuAfiuVMyj0xvg5LGlVyrlAnlcHtopQU/xh4IoCuV8TidzsxUyN1slc7MVMl+rknIxT3K6BlEQfnObo6yeecmyrhG0/4nnuYO+i9p8rUpKhTz+9fOlSbmb9WuwTT47dXyZlEt5XLi8/na7079piWE+lyWrS/O4eGUTjWbnnU6vf/6A7geOry7+da/ZRrPd/ZRlWZiWDcf1oGuZZ/sD48zi3CzmazMkjCIMDat2MNoNxw4rBPsLeGdYlv1WlkSYI/IWRsRLS/sKdOTX8ziIUUcohcDzzwKA7wdnRFGArmWeBoBg1N49GlkEHgxhUKuWu6Zl77meTze361hZnAOArx6n53VK0FNMMUYhn/37Tr1ZegQO5RtRECau2itpSt/O6Rq2duoTArQAoFIukKX5Gn6+dPVco9W5gYQLuSx5au24bpgWLl7eoFEUf3/YzrSMSv73n0+/wvOjcj7b/tXclRDy2cLcDPwgRJIkcD0fvh9gt976kedHuhwAVpIkmfz716wM82ugyjAESZL+hWWYv4+0MpJJSkUghHw8ej/5iGPZr+k4VL4uwxMcrOAYmhbSESH/BOBly3ZQLuYRJwmGhomhYaLZ6ZbCMMLVzR3kc/p+yeWUoKeY4jEEwzDvU0pxXXPFbwENBHAc75kkSd9qtjsfSJJIBJ4/LNomT546TizbwfrmLh1P6Q/COnFsiczXqri6ufPc9l6D4jqltzG+Greto9XpwfU8TBYRS4Xc0wLPw3Y8FHJZ+EGA2kz57wRkP887Fhm6MSWx/28KQsjemPQPfjachM6UToSLGKTprwJSpmXTzZ36R8VCbrKt11mGRS6ngVJ6dq/R/pLj2JG0aruL+doMmJGMKbZ2G1icm0G1XCSP5TM5/VlOMcWvWF1eeH99axcAXv0tj8PzA3i+j2a7+7Y01ie+1ahx8tgyURQJ//rvpb3rOxKBkeLf2okVkiQpLl7e+HGv0aadXp+mafqPg5+br82Q1eV5NFpdOK6HJEnOAfhpbrbybK8/gOf7yOey8PzgvSiKwbJsCGBPEoWJOwz2SXhCzqBgGBYUtHQoe4+RJMkrDMP8z0gQSbpmW2EYQhSEicu4NikfbLQ655IkQU7XUG90cHxl8Z+maUNTFQyGBpYXajeU600JeoopHlOwDPP31aUF/L9/X/z8QLndw4ZVzGcxNCwYprWv2JbTM+h0+/QwAgZGDSdPrh375OrmzkQK9AaUi3lk9QzCKEKz1UN/YLybJMlH43QKgFFZ3dqJlZ8cx8Olq1tnXc+nQRh+pSryxPPwfct2EIQhxkJRYblUuDbFQfZTHK8mSQpdU5HEyWtjIr7lyQdhBFkSJ8p2gu24UBUFE5dxQsjHYyU6EMJAlkQYlo3aTBlpmj4zNE10egOUiwUUR+axj++sbvqTnGKKa6FrKlk7sYJ//Xz5ZfdwV5AHn+PIqKtBGKFYyCGjKrh4eYO63kh0nlKK/1y4QnGI2SzLsm+cefIUieIIFy6tU9OyqWFaNIribwGUMqpCZiqlNzKqjEq5gE5vgF+ubL65sbX3THdsrQWgJvD809VKEZRSpGmKXt+osRyHXFarJ0nyQhCEyGV/deoaDE3ksvqHYwL+KJ/VwbEcAHxv2Q5AgYkUa7GQu6YDcD+oBkQAAjN6b6KCF3pegMkswrIdapgWHeeswXMs2t0+FudmfygWcsS2XQRhhJPHlv9WyGfJ4/4sTgl6iikOgSyJ5M9PnPzs0pVNBEH4WziFb/yvP62J1XKRZFSFLC/OhfmcDst2oGVUMler4Py/L34dRtH5w748N1t9X1VkbO820Or0sbVbf77bH3SiKP6eEPJJuVggWT2DUjEHWRIRxaM6cM8PKMb1wRlVIStL8/D9AJZtQ8soEAVhzveDZwZDE4IwqmVO0/QfLMvs6zl7fvBmvdlGVs8AQF0Q+Im/4hkAUGT5wwO2Uvt55zAMhfWt3WD83g8AngOA+bnqP0uF3NNjoX/YjgeAgGM5NDs9FAs58Dz3ar3ZoQPDxJ+fOKkzDPnw9/AcTgl6iiluAo5j/3rqxAqubu1ov9Eh7DeOSKIgKrJEtIyKn3+5SvNZnaydXEGr3TszaSa5PlUzUy39VCkVQQgQj+qZsdtoPdcfGtTzAyqJIikXC2RlaZ6cWF2sH19Z/KtlOxNTgOf8IAw6vT78YKTJnNP1v0VR/K1hjtyvJVEkAJ6/urn7LsMw4Dj2NWDkpciP7LVeGKde6nEco9XunQcA07LfHpvlAuOKFFUZmQmEYYRsVvsGAHbrze9Ny6bj0jphaFiYr1Xheh60jAI/CMAQgplKiWxu7+1ZtoMTq0s6cHip3pSgp5ji9wVBlkQiCSLqzfaj4BQu6FqGiKKAZrtLJVEkC3MzROB5bO02bmjdFnj+6Uq5QI4tL7xbLuUhjT35mq0urmxsY3Okc01dz6eiILxJCPmsUiqQXFbD5k79+3qjLZimDVEUkc9lP2QY8mGr03vecb19BblOt/+tIPD7Rqu249I0pZBHi3zfjQm5FicJ8nn9n8Co5I4cKKPrDwxq2S7CKIKuqeA57iU/CIN2t7+ff+/2Bj8qigTDtCGKAhiGQTpuJb807qo8dXyZ/J7IeUrQU0xxhAh2dXme9PpD/Fb56OuPp1zMo9nuwg+Cfc3r2Urp4vZuAxvbexS/2medGREi8z/FfI6sLi+8sLI4R544deyFmUoRiiLDdly0Oj1curr55V6jTSfEr2dU+EGAmWoJsiSCZZm/DcYSowfTE53eAKB0v1IioyqvABRaRpl8ppYkKfiRPvOXAEZaHPnsX8bvl3qD4f7C4aR127Rs4eSxZbAsi15/SIMwgmFYsB0X87PVvw+GBqIogqLIWJybOYqM7JSgp5ji94rTJ499cenqFjCymPqNUy8ccrqGTncweWlFEPjTaydWPwSA7d3G+uX1bbq1Wz/v+cFBmdHvJn+XiwVSKRXI8ZXFcrmYx0ylhCRJIAg8BkODhlEEURCgyDIyqkKiKP7WdjxwPIfF+dm3xiRq6loGWkY9eHhfJUkKLaPqABBF8ReGaUPXMmAY5v0wis6P0xs/jCPuDvnV3xC6liH9gUFdzwfHcWG91YYfBGBZBqIoolTM4fL69nsMw+DE6hIpF/PkURTanxL0FFM8VFJkX1uoVfHLlY0Lv/WxKLI0F8UxBGG/cWUDGOlarCzO6Yvzs6fzOR0CL6DXH6LZ6mJrt067/QGN4+Tz6zoKuxlVIbqWIYQQDA0Lpu3CcTzMVEtQZIkkafqeYVrPcxyLaqkw8Q58frRYBxTy2deAkVSpYVpUkSVMUg2GaT1HaYqsrv0NQK0/MM5I4igCHwxNutdoYaZSQrGQB8dxoJS+absuMqqCX65sCFlNA8/zSFMKPwhg2S6WFmYxWy2TP8JzN9WDnmKKO8D65i5lOWbiyfdb4ZndeutHhmFQrRTfNwzrHUWRQ4YhFwSef/rgB5Mk/cC07Lcd14Pn+6CUIklSiIIAnufAcdxIAS4MEccJdE2FH4Qo5rN/n9Qdd3oDao+qR1Aq5gkwsgMLwwiZjIJ8VicAtL1GyzQt5xp3kvXNHaprGZSKedLtD6lhWji2vLAKYOPq5g7lWBZzs9XPTMt+PaUUSZKAEALP9yEKAgghCMIQsigin9O/4jjulT/S8zaNoKeY4g6wujxPXNefOJv8VvinqkgYGiYcx3tHVWSr0+0L9Ub7TBTF346EhUYt3yzL/C2f08l8rUpOrC7NlUsFKLIEaZRXRpIk2K03QSmFIPDY2m1AlsRJU8hau9unQRiC47h9co7j+EvH9WDZDvJZvQwAvcHQDMIIJ1YXv5ocpGFatJDPTr73jOt5GNc4b7ieTyVRhKoq2NlrvM7zHPJZ7ZOcrlmu64HnOExkVxfnZk+XSwXyRyPnKUFPMcVd4PTJ1Zd29pr7gkK/BeI4QbGQg+O6EEVBX5ibIbMz5frG9u7zrU7vg43tvb1Wp0dNy6ZhGK37QRgAEAWehySJqJYLn3AsB8t2sHZi9YtKqfi3RrODhdoMMqpCANS2dusXfD+A7weYm61M2qwRhNHLoBTHlhcsAF3bcanjeKCUYkKijuvRTm+A3Ci6Fjq9wY8EBDPVMoIg7HS6fVBQ7NZbmJutXhQF4eJgaJ69srGtZXUNtZkKWZibIWMNjYt/1GdtStBTTHHn+Oap0yfev3x1C9drWTw0ECBJUnR7v1aXpCmtzVbL4DgWosDDtGyYtoOdveZKvdkWgjD8gWEIwjDCpatbZzVNxemTqyQIw1evbGx9cPL4cpjVMySOk89bnd5ekqTgOA7HVxZXJ+mOoWHSRqsDVVEgioKepuk/DNMGwzI4NrYK8/2Abu82oMj7bierAEVKU8iSSNI0LYmiAJHnMVstodXprdVbnbUkTfHk2vGXbmbH9UfENAc9xRR3Cdtx6frWLv78xMmHTijNdpfqWgZBEKLbHyCjKhgaFhiGga5lQMYE7vk+CCFgGQaiKMC0bAAEWkZFbaZMOt0+7fQGOHFs6Rue414Ko+jHRqvzTEZV4HkB5mvVpzGW9NxttL4EgNlK6ROWZd8wLZv2BwYopZidKUMSReK6HjUse+KIToIg7Hi+X2q0ujixuvQFx7GvTaJrgefGuXAeuqZOSfkQcNNLMMUUd4eMqpBysUB/vnSVPnHy2EMnGIYhyOd0ouuZ92hK52ar5Y+SNH2FZZj9dESapu9QSlcIIXsMw/zPbLWMXn9Iczn9fQAolwqvlEuFrwBge69BRUH4dQE0v59O+fTfFy6/vrxYQz6rE9fzqWUNzzquB0kSIEnipKsQcZKg2xvg1PGViwC0gWGWhoaF0ydXX6KUlja2dmkYxZivVaGOzV+nmEbQU0zxwNBodahpOZNOtocWQWf1DGRJIqZl025/CF1TUSrk7/gYDNOie402MhkFi3Oz13zfcT16ZX0bJ48vQ5bEcqfX74iCgIyqvNvpDt7VNRWyLBEAGBgm3dqpY+3EahiGoRDHCQzLhijwEHgeA8NETtdQLj02llOlwdDoHO6QeH/TVaBAPqe/BOCbaQQ9xRT3EbPVMnFcj+42WnR+tvpQyCdNKRjCdIGRGL7A8wdzvrf5bvqPvUb73ZSmiKIYNKU4eWz5i4mWhuf71PdDcByLbn+I5cU5RFGE/sDojCo/Ulxe33p3eXGuLgrCi93egBJC0O0P8eTa8W/qjfaLHMeCUkBTFbi+D1VRcGJ16bGKmE3L6Zi2i2I++8D2MTYygGnZiHvx1+XitYPXlKCnmOI+4PjKIvn5l6t0IMv0YSxyCTyHIIxKLMt+mtU1ktWPpufkB2Hgeb6QUgqaUhTzOVx/vGEYIU5i9AZDlIp5WI6DUiEfZlQqeH4A23FRm6kgDKNaf2CeL+azF03bWZMlEZ1u/0VVVUDTFPlc9jOGYX4qPabKckmSoJjPTqpaHuz9FPjzQ8M6M01xTDHFg8OL5/998euVpbmH4uJRb7ZpGEbgeR6SKIDjWGR17TUAgWnZX1JKEccJLNsBBaBnVHR6fXAcB5ZlIUsiFFlGfzCEJIkoFXJfWbbzMsMw8IMQHMtCFAUkSQLLceGMiVng+a5lO6WhaUHXMiNdZp4DIQTFfO4F/NpS/ljDMC2aphQPY8B1XY86rndD+mdK0FNMcX/x/Pn/XPz2qbXjD7TrbWunTgFgaaFGAGiu55txnMB2XERxjCRJkFEVZBQZtjupUWaR07VPWJb9OI7jd7d2Gi8zLINSIYf+0IDvh1AVGWmaQhQFOI6HQiGLVrs7rgwhSNMUAIEg8NAz6gbDkJ9+rw0kA8OkDGGQ1TMPJTWztVOn4/s5JegppnhQ8DyfXt7YfiDld47r0fXNXVRKBWQyCoIgxPXOIZTSN8Mwet9yXC1NU9Br3FtHHoFxHCOOR23VoiiAY1m4vr/fwSdJIliGAQXAMgSEMFBV+RuOZb8Za3H87rFbb9HaTOVvD0v8f3u3QRfnZ6c56CmmeJCQZYmUCnm6vrlLV5fn75mk05S+bdn2B5btwvN9HFueh6LIJI6TzwdD89XCaBFLwFiOlBDysSgKH4sj/eczB987gA5GgkYBgDmMBJcEjKymTIxdVf7ISNIEDEO+f1j7O6wtddpJOMUUDwC1mTIJowimZd9VO3gYRuvtTp/Wm23a6vQ+AID5WvXZE6tLRBnXD6c0XWV+NWoNb7KpnwD8c/z3wT/1MUGHY3KebOPilJxHYBkWaZq+cLNoNwhCk1L6eq8/pAAQBKHZbHdptzegjVZn30AhDKMLwEi4amevSQG8fNRjmEbQU0zxgHB8ZfGLja3dV6M4phzLAgB0LfNXQsiXGBmkBkEQ7vlBoJGxiarr+UiSFALPgVKKarn4Mcuyb91kF8LhcdcU9wO5rIbeYPheuVh4/9rIOn3P9Xw0212NYZhPpV/dZDTTcsAwBJRSsCwLVZH/8cuVzTVFlmg+p6M/NFAq5r+Uj6hhPSXoKaZ4QOA49jVdz7wqieK+Y0ir0/s0SdJPCQEoBURRAM+NfoaUAjOV0msAvj9KFCvw/NMppZRS+uYfJS/8MEEIOXT8S5LkhXxOh5ZR0esP9x1mOI5FmqZIEopCPotKqUAs26EL8zPgWBZ7jTZURQZDyJFtuaYEPcUUDxDj6om6qshz4wj6/m4/paCUliYR+BQPJfXxveN6z3ieD0WRYVo2MqoiMAwDlmGQ0vTXz7IshsaIj2szZcRxgiiOtfH6wG0xzUFPMcUDxEyl9Gyr3as9qO0LAo8wit6dXumHSNAs8/3QsKBpKjKqgl5/CNf1AkpHin0sy6I/MGCYFuU57ruhaaGQz6LebKPZ7oIdp7sOGc2nBD3FFA8Z/+Q4FnGcfD7h1Pu58ayuhYOhOb3KDxdfnTq+jHxWf1eRJbKyNA9FkVd1LfOX+doM5marWFqoIaMqn/A898pTa8ffUBWZnDq+cnq+VoU88fw6AMt2qKrIU4KeYoqHjWq5+Em723sVAHbrreB+blsShdfTlAJjB5UpHg5URSYMw/wPgEkr+AaAH1RFJrIkEkWWCMuybwCwCCGfjL92UcuoBIdU3Eii+F0Ux1OCnmKKhz8lZt8ghCAMo3VdUzE0rPtZevFFnMQAUJ5e6YeG2sXL69QwR/fRdT3qeT6llL5pOy4FgG5vQK9sbNMwis6vb+3S3XqL7tZbdPL+9eB57oUwjKYEPcUUvwVyWR1XN3dWdC1DDNMCgJX7tW1FkuB6/vnpVX44SNL0rTSl8PwAfhDQnXoTYRRjt976qNHqAADCsUqg74dnKKWwbAeu56M/MG663cMWeqcEPcUUDwGyJBKe52BaDq1WSmGn11+/j9PtsVMKgPuc457iRtCUzmVUBa7rY3O7DkUe6ZdQUIiCMJ41MWBZBoQAAs9DEHhkVBlhFCGOk08P3e4hr00JeoopHhJWl+bf3dqtQxIFMQhCUErfvC8RtCL/JY6TCTmH0yv9YMEwZD2MIkiSgHIpD9OyIQgjPW5CCPoDg9q2C44bNRvFSYIkScCyLASeh+v5rx95X9PLPcUUD+uHzfxPVs+g0+vT2Wr5k0ar+9F92vQPY0GkV6ZX+aHcx29sx4Ug8Cjmc0SWJKRpCi2j1G3HRW8wBMsyKJfykETxYhCE4FgOvh/AcT2oivTJUfc1VbObYoqHi9q//ntp789PniTNdpcW8tmfBJ5/+l43ajsuDcPoBmW7Ke4ejutR9xCNZgCglL5OCPkev+qYaBhpmzwPoJSmdG6igpem9G1C0KWUrjAM89mB71yDqZrdFFP89qjXZsu4vL5NT6wu6tu7DXNxfva+bNjzg+nVfUgghHx23UuT9u3vxmmQgymRD8ffueU26bRRZYopfnuMjF0pHNczRVHAbr15R2V3URR/6wcBHRoW7fT6tD8waL3ZhmFZ9+X4XM+nu40Wbba7tN3t33c1pv7AoJ3e0bYbBGEnSZJzh72XJMk53w9+F2pRaUrf5vkb4+VpBD3FFL8Bji0v/P3nX66+99TpE+Ty+hallJ490NCwz+UA4PtBJwgj+EGAOI7Bczx4noMkCiAEaLZ7AIDVpYV7XiD0gzC4fHULp0+uXuR57sNGq3OuPzRoIZfVKaWvWLbzaavTw8LcDCgFTMuGrmUwNEyEYYTZavlipzdYk2URkiii3mwjp2vQMqrFMMxPPM/9ZWhacBwPQRDRrJ5Bf2CAZVnwHIdCIftNu9N7MU0pJFFAFMdwPf8sy7JnK6UCGIYBx7HftNq9F1VVRrvTA8/zNKtlUCzkTgPY6w8M0/V9pEmKUjG/r4WRy2roD4YYSbSOrLQZhsFMpXSDm/Z+VPuQnocojv52QDp2StBTTPFbgmGY97O69l6r3aMnVpfm/vvLlb21E6sroLRkWPbZOE4QxwkoTceKdzyq5eI+kfhBQOvNDtI0xWy1BF27P7ZMnucLx1YWwDDMT+1O/5wkioiiGFEUf9nqdJ8nhIGeycBxPJi2g3anh6WFGniOg6rIsBxnrdHqQFEklPJ5KLIEhmHQ7Q81StPn5mszEHge+TkdjuOi3myjVMyjmM+R/1y8QlVVfhEg4HkWQRhB11R4fgBR4DE0LBACyJL0ouN6SNMUPMfB83yAUuSy+lmWZb7sDYYghECWxJFOhueBZVkEYQiGIbBsF7qWge044DgOpmV/fbPrx7IPJ8kg8Py7lNIbZgrTRcIppvgNsx3/+vlS59jyAjrdPgSBByEEWkYFz3N1URDmDn44juMvXc9/2XE9RHGMYj4HdSzef79g2Q6tNzuYr1WRJAna3T5kScLcbOXZnb3mj1pGRaPVQblUQJqk4Dh2nPumcD0fWV0DIQBNR0JOvcEQoiBAkkQwhIzK0IYGREFASlNIgghFkeD7AVzPh+24qJQLowg7DCGJInQtg1anu//vwdCAIAhwPQ8Cz4NhmJEHY0YFwxAMhxYyGQWEENi2A0mSME4pgVIKURRg2S40VYHr+ajNlA81+XVcj3a6fVQrJVBKcS+KgTzHfjWKlJOXD8bnlI5y04ZpjSo/ioXpIuEUUzwi6D5x8tgX//dfP7965qlTNxAygBeHhvl1mtJ9v0BJFFAtF//OMMz7D+KAtIxKtIxDu73Bfh3v3GzlLwD+Wchn4bgeVpfmLdN2NEWRkFEV0u0PKMeyyOeycF0PpWL+FQAX253+hZlKCXEcI4xiFAq5l/Ya7a+r5SI8z4csS5BE8bO9Ruv1JE0hSyIq5QJyuv6FqsivOq4/SU08S0F/5FgWjutBFEUUcjryOR2m5exrbXMcC4wJOAhDxHECTcuMTRASlAo5cBwHLaO+0OsPv83l9Pd9P3hHEoVDtbRVRX7Wyyg/uq5319dzkiJJ0/RlAGAPSWOAjI69mM+9MY2gp5jiEYNlO3Rrp45KqQiKUaQWRTEIIVAVGRzHQlVkEdMmlD8cphH0FFP8xtAyKnnq9IkXgyD8nBDSBRAIAn/6NzykaUfilKCnmGKKA/hGFAX9ETmWKTk/IpjWQU8xxRRTPKL4/wHd/W4HQwn9hgAAAABJRU5ErkJggg==";

const BrainOutline = () => (
  <image href={BRAIN_IMG} x="5" y="5" width="355" height="275" style={{ opacity: 0.55 }} />
);

const CurvedConn = ({
  edgeKey,
  from,
  to,
  type,
  isHovered,
  onHover,
  onLeave,
  onClick,
  isPinned,
  positions = REGIONS,
  rumination = false,
}) => {
  const pathD = getCurve(from, to, positions);
  if (!pathD) return null;
  const s = CS[type];
  const highlighted = isHovered || isPinned;
  return (
    <g>
      <path d={pathD} fill="none" stroke="transparent" strokeWidth={22}
        onMouseEnter={() => onHover(edgeKey)} onMouseLeave={onLeave}
        onClick={() => onClick && onClick(edgeKey)}
        style={{ cursor: "pointer" }} />
      <path d={pathD} fill="none" stroke={s.color}
        strokeWidth={highlighted ? s.width + 1.8 : s.width}
        strokeDasharray={s.dash} opacity={highlighted ? 1 : 0.72}
        strokeLinecap="round"
        style={{ pointerEvents: "none", transition: "all 0.15s ease" }} />
      {rumination && (
        <circle r="2.3" fill={s.color} opacity="0.85" filter="url(#synGlow)" style={{ pointerEvents: "none" }}>
          <animateMotion path={pathD} dur={type === "hyper" ? "1.3s" : "1.9s"} repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

const RegionNode = ({
  id, x, y, subsystem, isActive, isTonic, isDimmed, isHovered, isLateral,
  onHover, onLeave, onClick, isPinned,
  sizeMode = "none",              // "none" | "state" | "trait"
  importance = "normal",          // "active" | "normal" | "dormant"
  ruminationHot = false,
}) => {
  const c = SUB[subsystem].color;
  const highlighted = isHovered || isPinned;

  let r = isDimmed ? 11 : 16;
  let op = 1;

  if (sizeMode !== "none" && !isDimmed) {
    if (importance === "active") { r = 20; op = 1; }
    else if (importance === "dormant") { r = 11; op = 0.45; }
    else { r = 15; op = 0.78; }
  }

  return (
    <g
       onMouseEnter={() => onHover(id)} onMouseLeave={onLeave}
       onClick={() => onClick && onClick(id)}
       style={{ cursor: "pointer", transform: `translate(${x}px, ${y}px)`, transition: "transform 0.9s cubic-bezier(0.23, 1, 0.32, 1)" }}>
      <circle cx={0} cy={0} r={r}
        fill={isDimmed ? `${c}55` : highlighted ? c : `${c}CC`}
        stroke={isDimmed ? `${c}66` : highlighted ? "#fff" : c}
        strokeWidth={isDimmed ? 1 : highlighted ? 2.5 : 1.5}
        strokeDasharray={isDimmed ? "3,2" : "none"}
        opacity={op}
        style={{ transition: "all 0.15s ease" }}
      >
        {isActive && <animate attributeName="fill-opacity" values="1;0.45;1" dur="2.2s" repeatCount="indefinite" />}
      </circle>

      {ruminationHot && !isDimmed && (
        <circle cx={0} cy={0} r={r + 6} fill="none" stroke={UI.color.inferred} strokeWidth="1.2" opacity="0">
          <animate attributeName="r" values={`${r + 2};${r + 11}`} dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}

      {isPinned && !isDimmed && (
        <circle cx={0} cy={0} r={r + 5} fill="none" stroke="#fff" strokeWidth="1" opacity="0.4"
          strokeDasharray="3,2" style={{ pointerEvents: "none" }} />
      )}

      {isTonic && !isActive && (
        <circle cx={0} cy={0} r={r} fill={c} opacity="0" style={{ pointerEvents: "none" }}>
          <animate attributeName="opacity" values="0;0.35;0" dur="3s" repeatCount="indefinite" />
        </circle>
      )}

      <text x={0} y={1} textAnchor="middle" dominantBaseline="central"
        fill={isDimmed ? "#ffffff88" : "#fff"}
        fontSize={isDimmed ? 7.5 : r >= 19 ? 10 : 9}
        fontWeight="700" fontFamily="monospace"
        opacity={op}
        style={{ pointerEvents: "none" }}>{id}</text>

      {isLateral && (
        <>
          <circle cx={0} cy={0} r={r + 4} fill="none" stroke="#ffffff44" strokeWidth="1"
            strokeDasharray="2,2" style={{ pointerEvents: "none" }} />
          <text x={0} y={r + 11} textAnchor="middle" fill="#ffffff55" fontSize="6.5"
            fontFamily="monospace" letterSpacing="0.5" style={{ pointerEvents: "none" }}>lateral</text>
        </>
      )}
    </g>
  );
};

const DetailBox = ({ hovR, hovRId, hovE, data, tab, side, isPinned }) => {
  const ei = hovE ? (EDGE_INFO[tab]?.[side]?.[hovE] || null) : null;
  const ai = hovRId && data.activations.includes(hovRId) ? (ACT_INFO[tab]?.[side]?.[hovRId] || null) : null;
  const ti = hovRId && (TONIC[tab]?.[side] || []).includes(hovRId);
  const isDimmedRegion = hovR && hovR.dimmed;
  const renderRefs = (findingKey, ...fallbackTexts) => (
    <CitationLinks refs={getRefsForFinding(findingKey, ...fallbackTexts)} label="Study links:" />
  );

  if (hovR) {
    const nodeFindingKey = `node.${tab}.${side}.${hovRId}`;
    const activationFindingKey = findingActivationKey(tab, side, hovRId);
    return (
      <div>
        <CardHeader
          title={`${hovRId} — ${hovR.full}`}
          subtitle={SUB[hovR.sub].label}
          accent={SUB[hovR.sub].color}
          right={
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {isDimmedRegion && <StatusChip label="no edge data" tone="neutral" />}
              {isPinned && <StatusChip label={"📌 pinned"} tone="verified" />}
            </div>
          }
        />
        <div style={{ fontSize: UI.type.sm, color: UI.color.textBase, lineHeight: 1.55 }}>{hovR.desc}</div>
        {renderRefs(nodeFindingKey, hovR.desc)}
        {ai && (
          <GlassCard
            variant="soft"
            style={{ marginTop: 8, padding: "8px 10px", borderLeft: `3px solid ${UI.color.reduced}` }}
            >
              <div style={{ marginBottom: 5 }}>
                <StatusChip label="Activation increased" tone="reduced" />
              </div>
              <div style={{ fontSize: UI.type.sm, color: UI.color.textStrong, lineHeight: 1.45 }}>{ai}</div>
              {renderRefs(activationFindingKey, ai)}
          </GlassCard>
        )}
        {ti && !ai && (
          <GlassCard
            variant="soft"
            style={{ marginTop: 8, padding: "8px 10px", borderLeft: `3px solid ${SUB[hovR.sub].color}` }}
          >
            <div style={{ marginBottom: 5 }}>
              <StatusChip label="Tonically altered" tone="neutral" />
            </div>
            <div style={{ fontSize: UI.type.sm, color: UI.color.textStrong, lineHeight: 1.45 }}>
              This node participates in connectivity patterns that are altered at rest in MDD. This reflects a tonic reconfiguration of the resting-state circuit rather than an activation change.
            </div>
          </GlassCard>
        )}
      </div>
    );
  }
  if (ei) {
    const edgeFindingKey = findingEdgeKey(tab, side, hovE);
    const tone =
      ei.status.includes("\u2191") || ei.status.includes("Hyper")
        ? "hyper"
        : ei.status.includes("\u2193") || ei.status.includes("Decoupled")
        ? "reduced"
        : "neutral";
    return (
      <div>
        <CardHeader
          title={hovE}
          right={
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <StatusChip label={ei.status} tone={tone} />
              {!ei.v && <StatusChip label="⚠ inferred" tone="inferred" />}
              {ei.v && <StatusChip label="✓ verified" tone="verified" />}
              {isPinned && <StatusChip label={"📌 pinned"} tone="verified" />}
            </div>
          }
        />
        <div style={{ fontSize: UI.type.sm, color: UI.color.textBase, lineHeight: 1.5 }}>{ei.detail}</div>
        <div
          style={{
            marginTop: 6,
            fontSize: UI.type.xs,
            color: UI.color.textMuted,
            fontFamily: "'IBM Plex Mono', monospace",
            fontStyle: "italic",
            lineHeight: 1.4,
          }}
        >
          📄 {ei.source}
        </div>
        {renderRefs(edgeFindingKey, ei.source, ei.detail)}
      </div>
    );
  }
  return (
    <div style={{ fontSize: UI.type.sm, color: UI.color.textMuted, fontStyle: "italic" }}>
      Hover or click a region / connection for sourced details
    </div>
  );
};

const BrainPanelSingle = ({ data, side, tab }) => {
  const [hovR, setHovR] = useState(null);
  const [hovE, setHovE] = useState(null);
  const [pinnedR, setPinnedR] = useState(null);
  const [pinnedE, setPinnedE] = useState(null);

  const rObj = (pinnedR || hovR) ? REGIONS[pinnedR || hovR] : null;
  const tonicList = TONIC[tab]?.[side] || [];

  const displayR = pinnedR || hovR;
  const displayE = pinnedE || hovE;
  const isPinned = !!(pinnedR || pinnedE);
  const handleRegionClick = (id) => {
    if (pinnedR === id) { setPinnedR(null); return; }
    setPinnedR(id);
    setPinnedE(null);
  };
  const handleEdgeClick = (key) => {
    if (pinnedE === key) { setPinnedE(null); return; }
    setPinnedE(key);
    setPinnedR(null);
  };

  /* Node sizing differences:
     - STATE: emphasize dMPFC + HPC (+ PCC/sgACC in MDD) as “active”
     - TRAIT: emphasize sgACC + dorsomedial↔MTL bridge nodes (TempP/LTC/PHC) in MDD
  */
  const getImportance = (id) => {
    if (tab === "state") {
      if (side === "mdd") {
        if (["dMPFC", "HPC", "PCC", "sgACC"].includes(id)) return "active";
        if (["Rsp"].includes(id)) return "dormant";
        return "normal";
      }
      // HC
      if (["dMPFC", "HPC", "PCC", "aMPFC"].includes(id)) return "active";
      if (["sgACC", "Rsp", "LTC", "TempP"].includes(id)) return "dormant";
      return "normal";
    }

    // trait
    if (side === "mdd") {
      if (["sgACC", "PCC", "dMPFC", "TempP", "LTC", "PHC"].includes(id)) return "active";
      if (["Rsp"].includes(id)) return "dormant";
      return "normal";
    }
    // HC trait baseline
    if (["PCC", "aMPFC", "dMPFC", "HPC"].includes(id)) return "active";
    if (["sgACC", "Rsp", "LTC", "TempP"].includes(id)) return "dormant";
    return "normal";
  };

  const sizeMode = tab; // "state" | "trait"

  return (
    <GlassCard variant="elevated" style={{ flex: 1, minWidth: 290, padding: "14px 12px 12px" }}>
      <CardHeader
        title={data.label}
        accent={side === "hc" ? "#8BB8E8" : "#E8A080"}
        subtitle={side === "hc" ? "Reference condition" : "Rumination-associated profile"}
      />

      <svg viewBox="0 0 370 290" style={{ width: "100%", height: "auto", maxHeight: 280 }}>
        <defs>
          <filter id="synGlow">
            <feGaussianBlur stdDeviation="2.1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <BrainOutline />

        {data.connections.map((c, i) => {
          const key = EDGE_KEY(c.from, c.to);
          const ei = EDGE_INFO[tab]?.[side]?.[key] || null;
          const derivedType = typeFromEvidence(ei) || c.type; // fallback to existing type
          return (
            <CurvedConn
              key={i}
              edgeKey={key}
              from={c.from}
              to={c.to}
              type={derivedType}
              positions={REGIONS}
              isHovered={hovE === key}
              isPinned={pinnedE === key}
              onHover={(k) => { if (!pinnedE && !pinnedR) { setHovE(k); setHovR(null); } }}
              onLeave={() => { if (!pinnedE && !pinnedR) setHovE(null); }}
              onClick={handleEdgeClick}
            />
          );
        })}

        {Object.entries(REGIONS).map(([id, reg]) => (
          <RegionNode
            key={id}
            id={id}
            x={reg.x}
            y={reg.y}
            subsystem={reg.sub}
            isActive={data.activations.includes(id)}
            isTonic={tonicList.includes(id)}
            isDimmed={!!reg.dimmed}
            isHovered={hovR === id}
            isPinned={pinnedR === id}
            isLateral={!!reg.lateral}
            ruminationHot={false}
            onHover={(r) => { if (!pinnedR && !pinnedE) { setHovR(r); setHovE(null); } }}
            onLeave={() => { if (!pinnedR && !pinnedE) setHovR(null); }}
            onClick={handleRegionClick}
            sizeMode={sizeMode}
            importance={getImportance(id)}
          />
        ))}
      </svg>

      <GlassCard
        variant="soft"
        style={{
          textAlign: "left",
          minHeight: 76,
          padding: "10px 12px",
          marginTop: 6,
          border: `1px solid ${isPinned ? "rgba(34, 197, 94, 0.35)" : UI.color.borderSoft}`,
        }}
      >
        <DetailBox hovR={rObj} hovRId={displayR} hovE={displayE} data={data} tab={tab} side={side} isPinned={isPinned} />
      </GlassCard>

      <GlassCard
        variant="soft"
        style={{
          marginTop: 8,
          padding: "10px 12px",
          borderLeft: `3px solid ${side === "hc" ? "#4A90D9" : "#E05555"}`,
          fontSize: 11,
          lineHeight: 1.55,
          color: UI.color.textBase,
        }}
      >
        <div style={{ marginBottom: 6 }}>
          <StatusChip label="Narrative summary" tone="neutral" />
        </div>
        {data.narrative}
      </GlassCard>
    </GlassCard>
  );
};

const Tbl = ({ title, headers, rows }) => {
  const colW = `${Math.floor(100 / headers.length)}%`;
  return (
    <GlassCard variant="base" style={{ marginTop: 20, padding: "12px 12px 10px" }}>
      <CardHeader title={title} accent={UI.color.textStrong} />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace", tableLayout: "fixed" }}>
        <colgroup>{headers.map((_, i) => <col key={i} style={{ width: colW }} />)}</colgroup>
        <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "8px 10px", borderBottom: `1px solid ${UI.color.borderStrong}`, color: "#90A9C5", fontWeight: 700, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(9, 16, 27, 0.45)" }}>
            {Object.values(row).map((val, j) => {
              let c = UI.color.textBase;
              if (typeof val === "string") {
                if (val.includes("Increased") || val.includes("Hyper")) c = UI.color.hyper;
                if (val.includes("Decreased") || val.includes("Decoupled")) c = UI.color.reduced;
                if (val.includes("\u26A0") || val.includes("Inferred") || val.includes("prediction")) c = UI.color.inferred;
                if (val === "\u2014") c = "#3A4A5C";
              }
              return <td key={j} style={{ padding: "7px 10px", borderBottom: "1px solid rgba(20, 30, 46, 0.9)", color: c, lineHeight: 1.45, textAlign: "left", wordWrap: "break-word" }}>{val}</td>;
            })}
          </tr>
        ))}</tbody>
      </table>
    </GlassCard>
  );
};

/* ═══════════════════════════════════════════════════════════
   HIERARCHY TAB
   ═══════════════════════════════════════════════════════════ */

const SUB_NODES = {
  core: new Set(["PCC", "aMPFC"]),
  dm:   new Set(["dMPFC", "TPJ", "LTC", "TempP"]),
  mtl:  new Set(["HPC", "PHC", "Rsp"]),
  aff:  new Set(["sgACC"]),
};

const TREE = {
  id: "DMN", label: "Default Mode Network", color: "#C0D0E0",
  desc: "A large-scale brain network active during internally directed cognition \u2014 mind-wandering, autobiographical memory, future simulation, self-reflection. It\u2019s not one region but a system of regions that coactivate. Everything below this node is part of the DMN.",
  children: [
    {
      id: "core", label: "Midline Core Hubs", color: SUB.core.color,
      desc: "The integration layer. Core hubs are not a \u2018subsystem\u2019 in the same sense as dorsomedial or MTL \u2014 they\u2019re the connective backbone. PCC and aMPFC sit at the intersection of the subsystems and bind their outputs together. When researchers say the DMN has a \u2018hub structure,\u2019 this is what they mean: these two regions have disproportionately high connectivity to everything else in the network.",
      children: [
        { id: "PCC", label: "PCC", full: "Posterior Cingulate Cortex", color: SUB.core.color,
          desc: "The single most connected node in the DMN. Integrates information across subsystems. Implicated in self-awareness, autobiographical retrieval, and the subjective sense of \u2018me-ness.\u2019 Its hyperconnectivity to sgACC is among the most reliable biomarkers in depression research." },
        { id: "aMPFC", label: "aMPFC", full: "Anterior Medial Prefrontal Cortex", color: SUB.core.color,
          desc: "Evaluative hub. Assigns personal significance to internally generated content \u2014 whether a memory matters to you, whether a future scenario is desirable. Works in tandem with PCC to form the core axis of the network." },
      ],
    },
    {
      id: "dm", label: "Dorsomedial Subsystem", color: SUB.dm.color,
      desc: "The mentalizing / social cognition arm of the DMN. This subsystem handles thinking about other people\u2019s mental states (theory of mind), narrative comprehension, and abstract social reasoning. Andrews-Hanna (2012) identified it as functionally distinct from the MTL subsystem: dorsomedial regions activate more for social/conceptual tasks, MTL regions more for episodic/scene tasks.",
      children: [
        { id: "dMPFC", label: "dMPFC", full: "Dorsomedial Prefrontal Cortex", color: SUB.dm.color,
          desc: "Dual-function node. Supports both self-referential processing AND mentalizing about others (Moran 2013). This overlap is what makes the competitive displacement hypothesis work: if dMPFC is occupied with rumination (self-focus), its capacity for other-focused mentalizing may be reduced." },
        { id: "TPJ", label: "TPJ", full: "Temporoparietal Junction", color: SUB.dm.color,
          desc: "Perspective-taking region. Encodes the distinction between self and other perspectives. Critical for theory of mind tasks. A lateral structure \u2014 projected onto the midsagittal view in the brain map tab." },
        { id: "LTC", label: "LTC", full: "Lateral Temporal Cortex", color: SUB.dm.color,
          desc: "Semantic social knowledge store. Involved in narrative comprehension and storing conceptual knowledge about social situations. In trait MDD, LTC\u2013PHC coupling correlates with rumination questionnaire scores (Zhu 2017) \u2014 a bridge between the social and memory subsystems." },
        { id: "TempP", label: "TempP", full: "Temporal Pole", color: SUB.dm.color,
          desc: "Social-semantic processing node. Stores entity-level and abstract social knowledge. Carries the majority of significant cross-subsystem edges in Zhu (2017), including the dMPFC\u2013TempP edge that correlates with trait rumination scores \u2014 making it arguably the most load-bearing node in the trait connectivity findings." },
      ],
    },
    {
      id: "mtl", label: "MTL Subsystem", color: SUB.mtl.color,
      desc: "The memory and scene construction arm. This subsystem handles episodic recall, spatial context, and mental simulation of scenes (past or future). During rumination, the MTL subsystem becomes more tightly coupled to the core hubs \u2014 the memory system gets \u2018recruited\u2019 for self-focused retrieval rather than operating in its default balanced state.",
      children: [
        { id: "HPC", label: "HPC", full: "Hippocampus", color: SUB.mtl.color,
          desc: "Episodic memory engine. Retrieves specific autobiographical episodes and constructs scene representations. During state rumination, its coupling with PCC increases \u2014 memories get pulled into the self-referential loop." },
        { id: "PHC", label: "PHC", full: "Parahippocampal Cortex", color: SUB.mtl.color,
          desc: "Contextual/spatial processing. Encodes the spatial and environmental context around memories. During state rumination its coupling with HPC decreases \u2014 the normal memory circuit partially fragments even as HPC couples more to the core." },
        { id: "Rsp", label: "Rsp", full: "Retrosplenial Cortex", color: SUB.mtl.color,
          desc: "Spatial context and memory\u2013imagination interface. Listed as an MTL subsystem member in both Chen (2020) and Zhu (2017) parcellations. No study in the current evidence base reports a specific Rsp edge, so it appears in the brain map as a dimmed node \u2014 real member, no individual connectivity data." },
      ],
    },
    {
      id: "aff", label: "Affective Node", color: SUB.aff.color,
      desc: "Not a full subsystem with multiple members \u2014 sgACC is typically treated as a single affective-processing node that interfaces with the DMN during emotional states. Some parcellations don\u2019t include it in the DMN at all; it shows up in depression research because its coupling with PCC is reliably elevated in both state and trait rumination. Think of it as a node the DMN recruits under negative affect, rather than a permanent structural member.",
      children: [
        { id: "sgACC", label: "sgACC", full: "Subgenual Anterior Cingulate Cortex", color: SUB.aff.color,
          desc: "The affective gate. Dysregulated in depression, linked to negative mood regulation and emotional withdrawal. PCC\u2013sgACC hyperconnectivity is the most replicated finding in the DMN-rumination literature \u2014 it appears in both state induction and trait resting-state designs. DBS targeting this region has shown antidepressant effects." },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════
   SUBSYSTEM WORD CLOUDS
   ═══════════════════════════════════════════════════════════ */

const SUBSYSTEM_WORDS = {
  core: [
    { text: "Self-referential", size: 10, dx: 0,   dy: -52,  nearNode: "aMPFC" },
    { text: "Self",            size: 12, dx: 42,  dy: -35,  nearNode: "PCC" },
    { text: "Autobiographical", size: 7, dx: -48, dy: 25,   nearNode: "PCC" },
    { text: "Memories",        size: 9,  dx: 52,  dy: -8,   nearNode: "PCC" },
    { text: "Retrieval",       size: 8,  dx: 55,  dy: 5,    nearNode: "PCC" },
    { text: "Personal",        size: 9,  dx: -10, dy: 52,   nearNode: "aMPFC" },
    { text: "Moral",           size: 8,  dx: -42, dy: 38,   nearNode: "aMPFC" },
    { text: "Judgments",       size: 8,  dx: 15,  dy: 60,   nearNode: "aMPFC" },
    { text: "Rating",          size: 7,  dx: -25, dy: 60,   nearNode: "aMPFC" },
    { text: "Person",          size: 8,  dx: -65, dy: -8,    nearNode: "PCC" },
    { text: "Social",          size: 7,  dx: 35,  dy: -45,  nearNode: "PCC" },
    { text: "Recollection",    size: 7,  dx: -58, dy: 10,   nearNode: "PCC" },
    { text: "Positive",        size: 6,  dx: -20, dy: -65,  nearNode: "PCC" },
    { text: "Negative",        size: 6,  dx: 50,  dy: 35,   nearNode: "aMPFC" },
    { text: "Mentalizing",     size: 7,  dx: -45, dy: 0,   nearNode: "PCC" },
  ],
  dm: [
    { text: "Mentalizing",     size: 14, dx: 0,   dy: -88,  nearNode: "dMPFC" },
    { text: "Theory of Mind",  size: 10, dx: -40, dy: -78,  nearNode: "dMPFC" },
    { text: "Mental",          size: 10, dx: 55,  dy: -72,  nearNode: "dMPFC" },
    { text: "Meaning",         size: 9,  dx: -60, dy: -58,  nearNode: "dMPFC" },
    { text: "Person",          size: 12, dx: -82, dy: -15,  nearNode: "TPJ" },
    { text: "Social",          size: 11, dx: -78, dy: 35,   nearNode: "TPJ" },
    { text: "Scenarios",       size: 9,  dx: -88, dy: -2,   nearNode: "TPJ" },
    { text: "Comprehension",   size: 10, dx: 82,  dy: -15,  nearNode: "LTC" },
    { text: "Story",           size: 10, dx: 78,  dy: 52,   nearNode: "LTC" },
    { text: "Sentence",        size: 11, dx: 75,  dy: -38,  nearNode: "LTC" },
    { text: "Semantic",        size: 13, dx: 85,  dy: 15,   nearNode: "LTC" },
    { text: "Language",        size: 9,  dx: 55,  dy: 62,   nearNode: "LTC" },
    { text: "Word",            size: 9,  dx: 25,  dy: 78,   nearNode: "LTC" },
    { text: "Syntactic",       size: 7,  dx: 65,  dy: 72,   nearNode: "LTC" },
    { text: "Knowledge",       size: 10, dx: -45, dy: 72,   nearNode: "TempP" },
  ],
  mtl: [
    { text: "Episodic",        size: 12, dx: 20,  dy: -72,  nearNode: "HPC" },
    { text: "Remember",        size: 11, dx: -45, dy: -65,  nearNode: "HPC" },
    { text: "Recall",          size: 10, dx: 52,  dy: -50,  nearNode: "HPC" },
    { text: "Autobiographical", size: 8, dx: -8,  dy: -85,  nearNode: "HPC" },
    { text: "Past",            size: 12, dx: -72, dy: -30,  nearNode: "HPC" },
    { text: "Future",          size: 9,  dx: 75,  dy: -25,  nearNode: "HPC" },
    { text: "Memories",        size: 11, dx: 40,  dy: -75,  nearNode: "HPC" },
    { text: "Retrieval",       size: 9,  dx: -78, dy: -5,   nearNode: "HPC" },
    { text: "Contextual",      size: 10, dx: -68, dy: 40,   nearNode: "PHC" },
    { text: "Recognition",     size: 9,  dx: -50, dy: 50,   nearNode: "PHC" },
    { text: "Famous",          size: 8,  dx: -18, dy: 75,   nearNode: "PHC" },
    { text: "Familiar",        size: 9,  dx: -65, dy: 58,   nearNode: "PHC" },
    { text: "Engaged",         size: 8,  dx: 68,  dy: 42,   nearNode: "Rsp" },
    { text: "Encoding",        size: 9,  dx: 48,  dy: 65,   nearNode: "Rsp" },
    { text: "Recollection",    size: 8,  dx: 80,  dy: 5,    nearNode: "Rsp" },
  ],
  aff: [
    { text: "Affect",          size: 9,  dx: -32, dy: -28,  nearNode: "sgACC" },
    { text: "Mood",            size: 9,  dx: 32,  dy: -28,  nearNode: "sgACC" },
    { text: "Negative",        size: 8,  dx: -35, dy: 18,   nearNode: "sgACC" },
    { text: "Emotional",       size: 8,  dx: 32,  dy: 22,   nearNode: "sgACC" },
    { text: "Withdrawal",      size: 6,  dx: -5,  dy: 40,   nearNode: "sgACC" },
    { text: "Dysregulation",   size: 5,  dx: 5,   dy: -42,  nearNode: "sgACC" },
    { text: "Sadness",         size: 7,  dx: -30, dy: -5,   nearNode: "sgACC" },
  ],
};

const CONVERGENCE_LENS = {
  ruminationNodes: ["PCC", "aMPFC", "HPC", "PHC", "sgACC"],
  tomNodes: ["dMPFC", "TPJ", "LTC", "TempP"],
  bridgeNode: "dMPFC",
  ruminationWords: [
    "self-referential",
    "self",
    "autobiographical",
    "memories",
    "retrieval",
    "episodic",
    "remember",
    "recall",
    "past",
    "future",
    "affect",
    "mood",
    "negative",
    "emotional",
  ],
  tomWords: [
    "mentalizing",
    "theory of mind",
    "mental",
    "meaning",
    "person",
    "social",
    "scenarios",
    "comprehension",
    "semantic",
    "language",
    "knowledge",
  ],
  flows: [
    {
      id: "flow-core-dm",
      from: "PCC",
      to: "dMPFC",
      track: "rumination",
      status: "established",
      cite: "Chen 2020 (state subsystem-level) + Zhu 2017 (trait core↔dm reduction)",
    },
    {
      id: "flow-core-mtl",
      from: "PCC",
      to: "HPC",
      track: "rumination",
      status: "established",
      cite: "Chen 2020 (core↔MTL increase; mapped representative edge)",
    },
    {
      id: "flow-affective-gate",
      from: "PCC",
      to: "sgACC",
      track: "rumination",
      status: "established",
      cite: "Replicated PCC↔sgACC hyperconnectivity (brooding marker literature)",
    },
    /* Gap is no longer represented as individual node-to-node flows.
       It applies to the entire dMPFC subsystem — see RESOURCE_FLOW.gapSubsystem.
       Retained here as a single entry for the convergence lens pillar rendering. */
    {
      id: "flow-gap-subsystem",
      from: null,
      to: null,
      track: "tom",
      status: "gap",
      cite: "No study has measured ToM performance during state-induced DMN subsystem reconfiguration (trait rumination alone insufficient per Tozzi 2021)",
    },
  ],
  pillars: [
    {
      title: "Rumination Stream",
      text: "State-induced rumination reconfigures DMN subsystem coupling (core↔MTL up, core↔dMPFC down). Trait rumination does not reliably predict subsystem connectivity (Tozzi 2021). MDD generalization still heterogeneous.",
      cite: "Chen 2020; Tozzi 2021; convergence caveats §7",
    },
    {
      title: "ToM Deficit Stream",
      text: "Depression-related ToM deficits are robust in meta-analyses, but rumination is rarely modeled as the mechanism.",
      cite: "Bora & Berk 2016; Nestor 2022; d ≈ 0.4–0.6 summary",
    },
    {
      title: "Convergence Gap",
      text: "The dMPFC subsystem supports mentalizing, but no paper tests ToM during state-induced rumination while tracking subsystem reconfiguration. Trait rumination alone does not predict subsystem connectivity (Tozzi 2021).",
      cite: "Andrews-Hanna 2014; Moran 2013; Tozzi 2021; convergence document §6–7",
    },
  ],
};

const RESOURCE_FLOW = {
  /* Subsystem-level coupling changes — the established findings */
  subsystemEdges: [
    { fromSub: "core", toSub: "mtl", label: "core↔MTL ↑ (state)", status: "established",
      cite: "Chen 2020", note: "State induction: enhanced core constraint on MTL" },
    { fromSub: "core", toSub: "dm", label: "core↔dMPFC ↓ (state)", status: "established",
      cite: "Chen 2020", note: "State induction: decoupling frees dMPFC subsystem" },
    { fromSub: "dm", toSub: "mtl", label: "dm↔MTL ↑ (trait)", status: "trait-context",
      cite: "Zhu 2017 (trait MDD only)", note: "Context: trait MDD shows subsystem fusion; trait rumination alone does not predict connectivity (Tozzi 2021)" },
  ],
  /* The gap applies to the WHOLE dMPFC subsystem, not one edge */
  gapSubsystem: "dm",
  gapQuestion: "During active rumination, does dMPFC subsystem reconfiguration degrade its mentalizing capacity?",
  gapShort: "Trait rumination doesn't predict subsystem connectivity (Tozzi 2021). State induction does — but no study has tested ToM during it.",
  /* Node roles simplified */
  nodeRoles: {
    PCC: "core-hub", aMPFC: "core-hub", dMPFC: "gap-hub",
    TPJ: "gap-member", LTC: "gap-member", TempP: "gap-member",
    HPC: "receiving", PHC: "receiving", Rsp: "dormant", sgACC: "affective",
  },
  citations: {
    chen2020: { paperId: "chen2020", label: "Chen et al. 2020", doi: "10.1016/j.neuroimage.2020.117185",
      passage: "Core↔MTL FC increased, Core↔dMPFC FC decreased during rumination vs distraction" },
    zhu2017: { paperId: "zhu2017", label: "Zhu et al. 2017", doi: "10.1038/srep43105",
      passage: "dMPFC subsystem 'is thought to play more of a social-reflective role, allowing individuals to infer the mental states of other people'" },
    kim2023: { paperId: "kim2023", label: "Kim et al. 2023", doi: "10.1038/s41467-023-39142-9",
      passage: "right IPL/TPJ 'has been reported across numerous fMRI studies of mentalizing or theory of mind' — sustained dmPFC↔TPJ correlation at rest 'may signify the presence of social inferences and evaluations associated with rumination'" },
    nestor2022: { paperId: "nestor2022", label: "Nestor et al. 2022", doi: "10.1016/j.jad.2022.02.028",
      passage: "rumination 'might diminish or compromise natural curiosity, concern, and engagement with the mental and emotional states of others'" },
    kuang2016: { paperId: "kuang2016", label: "Kuang 2016", doi: "10.3389/fpsyg.2016.00063",
      passage: "Only paper explicitly using competitive language: self- and other-focused attention 'will interact and compete with each other'" },
  },
};

/* ═══════════════════════════════════════════════════════════
   MODE NODE ACTIVITY CLASSIFICATIONS
   Nodes that are more active/relevant grow larger,
   nodes not involved shrink, unchanged stay normal.
   ═══════════════════════════════════════════════════════════ */

const MODE_NODE_ACTIVITY = {
  resting: {
    active:   [],
    normal:   ["PCC", "aMPFC", "dMPFC", "TPJ", "LTC", "TempP", "HPC", "PHC", "Rsp", "sgACC"],
    dormant:  [],
  },
  mdd: {
    active:   ["PCC", "sgACC", "dMPFC", "TempP", "LTC", "TPJ", "PHC"],
    normal:   ["aMPFC", "HPC"],
    dormant:  ["Rsp"],
  },
  hc: {
    active:   ["PCC", "aMPFC", "dMPFC", "HPC"],
    normal:   ["TPJ", "PHC"],
    dormant:  ["sgACC", "LTC", "TempP", "Rsp"],
  },
};

const ARCH_SOURCES = {
  baseline: "Andrews-Hanna et al. 2010/2012 — DMN subsystem architecture (core, dm, mtl)",
  state_hc: "Chen et al. 2020 — state rumination: core↔MTL ↑, core↔dm (dMPFC subsystem) ↓, within-MTL ↓ (subsystem-level)",
  trait_mdd: "Zhu et al. 2017 — first-episode MDD: core↔dm ↓, within-dm ↑, dm↔MTL ↑; RSQ correlations on dMPFC–TempP and LTC–PHC",
  trait_sgacc: "Multiple replications (e.g., Berman 2011 and later reviews) — PCC↔sgACC hyperconnectivity correlates with brooding",
  state_mdd_sgacc: "Convergence evidence synthesis — induced rumination in MDD increases PCC-seeded connectivity with subgenual cingulate (node-level verified in your base)",
};

const ARCH_EVIDENCE = {
  /* NOTE: “kind” controls whether the edge connects nodes or subsystem anchors */
  /* Node↔Node edges (verified if v=true; inferred if v=false) */
  nodeEdges: {
    trait: [
      { from: "PCC", to: "sgACC", status: "hyper", v: true,  cite: ARCH_SOURCES.trait_sgacc },
      { from: "PCC", to: "dMPFC", status: "reduced", v: true, cite: ARCH_SOURCES.trait_mdd },
      { from: "dMPFC", to: "TempP", status: "hyper", v: true, cite: ARCH_SOURCES.trait_mdd + " (RSQ-correlated)" },
      { from: "TPJ", to: "LTC", status: "hyper", v: true, cite: ARCH_SOURCES.trait_mdd },
      { from: "LTC", to: "PHC", status: "hyper", v: true, cite: ARCH_SOURCES.trait_mdd + " (RSQ-correlated)" },
      { from: "TPJ", to: "PHC", status: "hyper", v: true, cite: ARCH_SOURCES.trait_mdd },
      { from: "TempP", to: "PHC", status: "hyper", v: true, cite: ARCH_SOURCES.trait_mdd },
      /* Baseline architectural links as neutral context (not “findings”) */
      { from: "PCC", to: "aMPFC", status: "normal", v: true, cite: ARCH_SOURCES.baseline },
    ],
    state: [
      { from: "PCC", to: "sgACC", status: "hyper", v: true, cite: ARCH_SOURCES.state_mdd_sgacc },
      /* Chen 2020 is subsystem-level; show node edges but mark inferred */
      { from: "PCC", to: "HPC", status: "hyper", v: false, cite: ARCH_SOURCES.state_hc + " (mapped to PCC–HPC as representative edge)" },
      { from: "PCC", to: "dMPFC", status: "reduced", v: false, cite: ARCH_SOURCES.state_hc + " (mapped to PCC–dMPFC as representative edge)" },
      { from: "HPC", to: "PHC", status: "reduced", v: false, cite: ARCH_SOURCES.state_hc + " (mapped to HPC–PHC as representative edge)" },
      { from: "PCC", to: "aMPFC", status: "normal", v: true, cite: ARCH_SOURCES.baseline },
    ],
  },

  /* Subsystem↔Subsystem edges (anchors) */
  subEdges: {
    trait: [
      { from: "core", to: "dm",  status: "reduced", v: true,  cite: ARCH_SOURCES.trait_mdd },
      { from: "dm",   to: "mtl", status: "hyper",   v: true,  cite: ARCH_SOURCES.trait_mdd },
      { from: "core", to: "mtl", status: "normal",  v: true,  cite: ARCH_SOURCES.baseline },
      /* sgACC is treated as affect “interface”, not a subsystem. Keep it node-level only. */
    ],
    state: [
      { from: "core", to: "mtl", status: "hyper",   v: true,  cite: ARCH_SOURCES.state_hc + " (subsystem-level verified)" },
      { from: "core", to: "dm",  status: "reduced", v: true,  cite: ARCH_SOURCES.state_hc + " (subsystem-level verified)" },
      { from: "mtl",  to: "mtl", status: "reduced", v: true,  cite: ARCH_SOURCES.state_hc + " (within-subsystem verified)" },
      /* MDD generalization is heterogeneous → keep MDD state subsystem edges inferred if you want to show them later. */
    ],
  },
};

const EVIDENCE_HIGHLIGHTS = [
  {
    id: "ev-chen-2020",
    study: "Chen et al. 2020",
    summary: "State rumination reconfigures subsystem coupling at subsystem level.",
    highlight:
      "Core↔MTL increased, core↔dMPFC decreased, and within-MTL decreased during rumination versus distraction; this is subsystem-level, not single-edge verification.",
  },
  {
    id: "ev-zhu-2017",
    study: "Zhu et al. 2017",
    summary: "Trait MDD shows specific edge-level DMN alterations.",
    highlight:
      "Core↔dMPFC decreased, dMPFC↔MTL increased, and dMPFC–TempP plus LTC–PHC correlated positively with RSQ rumination in first-episode MDD.",
  },
  {
    id: "ev-zhou-2020",
    study: "Zhou et al. 2020",
    summary: "Meta-analytic activation during rumination.",
    highlight:
      "dMPFC (and often hippocampal-memory regions) shows increased activation during rumination tasks, supporting self-focused retrieval load.",
  },
  {
    id: "ev-tozzi-2021",
    study: "Tozzi et al. 2021",
    summary: "Generalization caveat for trait associations.",
    highlight:
      "Large-sample trait rumination did not robustly predict subsystem connectivity, constraining how broadly first-episode findings should be generalized.",
  },
  {
    id: "ev-andrews-hanna",
    study: "Andrews-Hanna 2010/2012",
    summary: "Canonical DMN architecture.",
    highlight:
      "Core, dorsomedial, and MTL components are functionally separable within the default network and support distinct internally directed processes.",
  },
  {
    id: "ev-moran-2013",
    study: "Moran et al. 2013",
    summary: "dMPFC overlap between self and ToM processing.",
    highlight:
      "dMPFC organizes both self-referential and mentalizing functions, with self-processing as the primary driver — ToM is secondary (Moran's framing, not competition language).",
  },
  {
    id: "ev-berman-2011",
    study: "Berman et al. 2011 and replications",
    summary: "Reliable affective coupling marker.",
    highlight:
      "PCC↔sgACC hyperconnectivity repeatedly tracks brooding/ruminative burden and is one of the most reproducible depression-related DMN findings.",
  },
];

const FINDING_TO_PAPERS = {
  [findingEdgeKey("state", "hc", "PCC–aMPFC")]: ["chen2020", "andrews_hanna"],
  [findingEdgeKey("state", "hc", "PCC–HPC")]: ["chen2020"],
  [findingEdgeKey("state", "hc", "PCC–dMPFC")]: ["chen2020"],
  [findingEdgeKey("state", "hc", "HPC–PHC")]: ["chen2020"],
  [findingEdgeKey("state", "hc", "dMPFC–TPJ")]: ["andrews_hanna", "moran2013"],
  [findingEdgeKey("state", "mdd", "PCC–sgACC")]: ["berman2011", "hamilton2015"],
  [findingEdgeKey("state", "mdd", "PCC–HPC")]: ["chen2020", "chen2025"],
  [findingEdgeKey("state", "mdd", "PCC–dMPFC")]: ["chen2020", "zhu2017"],
  [findingEdgeKey("state", "mdd", "PCC–aMPFC")]: ["andrews_hanna"],
  [findingEdgeKey("state", "mdd", "dMPFC–TPJ")]: ["moran2013", "bora_berk2016", "nestor2022", "kim2023"],
  [findingEdgeKey("state", "mdd", "HPC–PHC")]: ["chen2020"],

  [findingEdgeKey("trait", "hc", "PCC–aMPFC")]: ["andrews_hanna"],
  [findingEdgeKey("trait", "hc", "PCC–dMPFC")]: ["andrews_hanna"],
  [findingEdgeKey("trait", "hc", "PCC–HPC")]: ["andrews_hanna"],
  [findingEdgeKey("trait", "hc", "dMPFC–TPJ")]: ["andrews_hanna", "moran2013"],
  [findingEdgeKey("trait", "hc", "HPC–PHC")]: ["andrews_hanna"],
  [findingEdgeKey("trait", "mdd", "PCC–aMPFC")]: ["zhu2017"],
  [findingEdgeKey("trait", "mdd", "PCC–dMPFC")]: ["zhu2017"],
  [findingEdgeKey("trait", "mdd", "PCC–sgACC")]: ["zhu2017", "berman2011", "hamilton2015"],
  [findingEdgeKey("trait", "mdd", "dMPFC–TempP")]: ["zhu2017"],
  [findingEdgeKey("trait", "mdd", "TPJ–LTC")]: ["zhu2017"],
  [findingEdgeKey("trait", "mdd", "LTC–PHC")]: ["zhu2017"],
  [findingEdgeKey("trait", "mdd", "TPJ–PHC")]: ["zhu2017"],
  [findingEdgeKey("trait", "mdd", "TempP–PHC")]: ["zhu2017"],
  [findingEdgeKey("trait", "mdd", "dMPFC–TPJ")]: ["zhu2017", "kim2023"],
  [findingEdgeKey("trait", "mdd", "HPC–PHC")]: ["zhu2017", "tozzi2021"],

  [findingActivationKey("state", "hc", "dMPFC")]: ["zhou2020"],
  [findingActivationKey("state", "hc", "HPC")]: ["zhou2020"],
  [findingActivationKey("state", "mdd", "dMPFC")]: ["zhou2020", "chen2025"],
  [findingActivationKey("state", "mdd", "HPC")]: ["zhou2020"],
  [findingActivationKey("state", "mdd", "PCC")]: ["chen2025"],
  [findingActivationKey("state", "mdd", "sgACC")]: ["berman2011", "hamilton2015"],

  [findingArchNodeKey("trait", "PCC–sgACC")]: ["zhu2017", "berman2011", "hamilton2015"],
  [findingArchNodeKey("trait", "PCC–dMPFC")]: ["zhu2017"],
  [findingArchNodeKey("trait", "dMPFC–TempP")]: ["zhu2017"],
  [findingArchNodeKey("trait", "TPJ–LTC")]: ["zhu2017"],
  [findingArchNodeKey("trait", "LTC–PHC")]: ["zhu2017"],
  [findingArchNodeKey("trait", "TPJ–PHC")]: ["zhu2017"],
  [findingArchNodeKey("trait", "TempP–PHC")]: ["zhu2017"],
  [findingArchNodeKey("trait", "PCC–aMPFC")]: ["andrews_hanna"],
  [findingArchNodeKey("state", "PCC–sgACC")]: ["berman2011", "hamilton2015"],
  [findingArchNodeKey("state", "PCC–HPC")]: ["chen2020"],
  [findingArchNodeKey("state", "PCC–dMPFC")]: ["chen2020"],
  [findingArchNodeKey("state", "HPC–PHC")]: ["chen2020"],
  [findingArchNodeKey("state", "PCC–aMPFC")]: ["andrews_hanna"],

  [findingArchSubKey("trait", "core↔dm")]: ["zhu2017"],
  [findingArchSubKey("trait", "dm↔mtl")]: ["zhu2017"],
  [findingArchSubKey("trait", "core↔mtl")]: ["andrews_hanna"],
  [findingArchSubKey("state", "core↔mtl")]: ["chen2020"],
  [findingArchSubKey("state", "core↔dm")]: ["chen2020"],
  [findingArchSubKey("state", "mtl↔mtl")]: ["chen2020"],

  "resource.flow-core-mtl": ["chen2020"],
  "resource.flow-pcc-sgacc": ["berman2011", "hamilton2015", "zhu2017"],
  "resource.flow-pcc-dmpfc": ["chen2020", "zhu2017"],
  "resource.flow-gap-subsystem": ["moran2013", "bora_berk2016", "nestor2022", "kim2023", "andrews_hanna"],

  "gap.convergence": ["chen2020", "zhu2017", "moran2013", "bora_berk2016", "nestor2022", "kim2023"],
  "framework.architecture": ["andrews_hanna", "moran2013"],
  "meta.tom": ["bora_berk2016", "nestor2022", "kim2023"],
};

const getRefsForFinding = (findingKey, ...fallbackTexts) => {
  const explicit = (FINDING_TO_PAPERS[findingKey] || []).map((paperId) => makePaperRef(paperId));
  const fallback = getStudyRefs(...fallbackTexts);
  return dedupePaperRefs([...explicit, ...fallback]);
};

const HierarchyTab = () => {
  const [hov, setHov] = useState(null);
  const [mode, setMode] = useState(null);
  const [overlayTop, setOverlayTop] = useState("trait"); // "trait" | "state"
  const [zoomedSub, setZoomedSub] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [spinTick, setSpinTick] = useState(0);
  const [spinningNode, setSpinningNode] = useState(null);
  const [showConvergenceLens, setShowConvergenceLens] = useState(false);
  const [focusedEvidenceId, setFocusedEvidenceId] = useState(null);
  const [focusedEvidenceKey, setFocusedEvidenceKey] = useState(0);
  const [showResourceFlow, setShowResourceFlow] = useState(false);

  const W = 800, H = 780;
  const cx = W / 2, cy = 380;
  const coreCx = cx + 18;
  const coreCy = cy + 20; 
  const coreR = 80;
  const subDist = 220;
  const dmR = 120, mtlR = 110, affR = 62;
  const outerR = 360;
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
  
  const isNodeId = (id) => !!nodePos[id];  // uses your nodePos map

  const subEdgePath = (from, to) => {
    const getSubCircle = (id) => {
      if (id === "core") {
        return { cx: coreCx, cy: coreCy, r: getSubsystemVisual("core").radius };
      }
      const s = subCenters[id];
      if (!s) return null;
      return { cx: s.cx, cy: s.cy, r: getSubsystemVisual(id).radius };
    };
  
    const pointOnCircle = (circle, angleDeg, pad = 4) => {
      const rad = (angleDeg * Math.PI) / 180;
      return {
        x: circle.cx + Math.cos(rad) * (circle.r + pad),
        y: circle.cy + Math.sin(rad) * (circle.r + pad),
      };
    };
  
    // core <-> subsystem
    if (from === "core" || to === "core") {
      const A = getSubCircle(from);
      const B = getSubCircle(to);
      if (!A || !B) return null;
  
      const dx = B.cx - A.cx;
      const dy = B.cy - A.cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
  
      const x1 = A.cx + ux * (A.r + 4);
      const y1 = A.cy + uy * (A.r + 4);
      const x2 = B.cx - ux * (B.r + 4);
      const y2 = B.cy - uy * (B.r + 4);
  
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
  
      const nx = -uy;
      const ny = ux;
      const bulge = Math.min(dist * 0.12, 34);
  
      return `M ${x1} ${y1} Q ${mx + nx * bulge} ${my + ny * bulge} ${x2} ${y2}`;
    }
  
    // self-loop
    if (from === to) {
      const S = getSubCircle(from);
      if (!S) return null;
  
      const startX = S.cx + S.r * 0.82;
      const startY = S.cy - S.r * 0.18;
  
      const loopW = Math.max(24, S.r * 0.22);
      const loopH = Math.max(34, S.r * 0.32);
  
      return `
        M ${startX} ${startY}
        C ${startX + loopW} ${startY - loopH},
          ${startX + loopW} ${startY + loopH},
          ${startX} ${startY + loopH * 1.18}
        C ${startX - loopW * 0.6} ${startY + loopH * 0.45},
          ${startX - loopW * 0.6} ${startY - loopH * 0.45},
          ${startX} ${startY}
      `;
    }
  
    // subsystem <-> subsystem
    const A = getSubCircle(from);
    const B = getSubCircle(to);
    if (!A || !B) return null;
  
    // Special anchor control for DM <-> MTL
    const isDmMtl =
      (from === "dm" && to === "mtl") ||
      (from === "mtl" && to === "dm");
  
    let x1, y1, x2, y2, mx, my, bulgeX = 0, bulgeY = 0;
  
    if (isDmMtl) {
      const dmCircle = getSubCircle("dm");
      const mtlCircle = getSubCircle("mtl");
  
      // DM starts at 9 o'clock, MTL ends at 12 o'clock
      const dmStart = pointOnCircle(dmCircle, 180);
      const mtlEnd  = pointOnCircle(mtlCircle, 270);
  
      // If direction is reversed, swap them properly
      const start = from === "dm" ? dmStart : mtlEnd;
      const end   = to === "mtl" ? mtlEnd : dmStart;
  
      x1 = start.x;
      y1 = start.y;
      x2 = end.x;
      y2 = end.y;
  
      mx = (x1 + x2) / 2;
      my = (y1 + y2) / 2;
  
      // Push outward a bit so the arc reads clearly
      bulgeX = -28;
      bulgeY = -10;
    } else {
      const dx = B.cx - A.cx;
      const dy = B.cy - A.cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
  
      x1 = A.cx + ux * (A.r + 4);
      y1 = A.cy + uy * (A.r + 4);
      x2 = B.cx - ux * (B.r + 4);
      y2 = B.cy - uy * (B.r + 4);
  
      mx = (x1 + x2) / 2;
      my = (y1 + y2) / 2;
  
      const nx = -uy;
      const ny = ux;
      const bulge = Math.min(dist * 0.16, 42);
      bulgeX = nx * bulge;
      bulgeY = ny * bulge;
    }
  
    return `M ${x1} ${y1} Q ${mx + bulgeX} ${my + bulgeY} ${x2} ${y2}`;
  };

  const nodePos = {
    PCC:   { cx: coreCx - 30, cy: coreCy - 16 },
    aMPFC: { cx: coreCx + 26, cy: coreCy + 20 },
    dMPFC: { cx: subCenters.dm.cx + 16,  cy: subCenters.dm.cy - 48 },
    TPJ:   { cx: subCenters.dm.cx - 30,  cy: subCenters.dm.cy + 0 },
    LTC:   { cx: subCenters.dm.cx + 48,  cy: subCenters.dm.cy + 24 },
    TempP: { cx: subCenters.dm.cx - 10,  cy: subCenters.dm.cy + 48 },
    HPC:   { cx: subCenters.mtl.cx + 10, cy: subCenters.mtl.cy - 32 },
    PHC:   { cx: subCenters.mtl.cx - 48, cy: subCenters.mtl.cy + 14 },
    Rsp:   { cx: subCenters.mtl.cx + 20, cy: subCenters.mtl.cy + 26 },
    sgACC: { cx: subCenters.aff.cx + 4,  cy: subCenters.aff.cy - 2 },
  };
  const displayNodePos = nodePos;
  const lensActive = showConvergenceLens && mode === "mdd";
  const resourceFlowActive = showResourceFlow && mode === "mdd" && !showConvergenceLens;
  const ruminationNodeSet = new Set(CONVERGENCE_LENS.ruminationNodes);
  const tomNodeSet = new Set(CONVERGENCE_LENS.tomNodes);
  const bridgeNode = CONVERGENCE_LENS.bridgeNode;
  const getLensRole = (id) => {
    if (id === bridgeNode) return "bridge";
    if (ruminationNodeSet.has(id) && tomNodeSet.has(id)) return "bridge";
    if (ruminationNodeSet.has(id)) return "rumination";
    if (tomNodeSet.has(id)) return "tom";
    return "other";
  };

  const bobVals = {
    PCC: "0,0; 2.5,1.8; 0,0; -2.5,-1.8; 0,0", aMPFC: "0,0; -2.0,2.2; 0,0; 2.0,-2.2; 0,0",
    dMPFC: "0,0; 1.8,-2.5; 0,0; -1.8,2.5; 0,0", TPJ: "0,0; -2.8,1.5; 0,0; 2.8,-1.5; 0,0",
    LTC: "0,0; 2.2,-1.8; 0,0; -2.2,1.8; 0,0", TempP: "0,0; -1.6,2.6; 0,0; 1.6,-2.6; 0,0",
    HPC: "0,0; -1.5,2.8; 0,0; 1.5,-2.8; 0,0", PHC: "0,0; 2.6,1.2; 0,0; -2.6,-1.2; 0,0",
    Rsp: "0,0; -2.2,-2.0; 0,0; 2.2,2.0; 0,0", sgACC: "0,0; 1.5,-2.4; 0,0; -1.5,2.4; 0,0",
    core: "0,0; 1.2,1.8; 0,0; -1.2,-1.8; 0,0", dm: "0,0; -1.8,1.0; 0,0; 1.8,-1.0; 0,0",
    mtl: "0,0; 1.4,-1.5; 0,0; -1.4,1.5; 0,0", aff: "0,0; -1.0,1.6; 0,0; 1.0,-1.6; 0,0",
  };
  const bobDur = {
    PCC: "5.2s", aMPFC: "6.1s", dMPFC: "5.8s", TPJ: "6.5s", LTC: "5.5s", TempP: "6.0s",
    HPC: "6.3s", PHC: "5.9s", Rsp: "6.7s", sgACC: "5.4s",
    core: "7.5s", dm: "8.2s", mtl: "7.8s", aff: "8.5s",
  };

  const isSubZoomed = !!zoomedSub;
  const isNodeFocus = !!selectedNode;
  const isZoomed = isSubZoomed || isNodeFocus;
  const getZoomTransform = () => {
    // no zoom
    if (!zoomedSub && !selectedNode) {
      return { transform: "translate(0px, 0px) scale(1)", transformOrigin: "0 0" };
    }
  
    // Node focus now animates the node itself into its subsystem ring.
    // Keep the global layout fixed so subsystem circles stay in place.
    if (selectedNode && displayNodePos[selectedNode]) {
      return { transform: "translate(0px, 0px) scale(1)", transformOrigin: "0 0" };
    }
  
    // Otherwise zoom to subsystem (your old behavior)
    let tcx, tcy, tr;
    if (zoomedSub === "core") { tcx = cx; tcy = cy; tr = coreR; }
    else { const sc = subCenters[zoomedSub]; tcx = sc.cx; tcy = sc.cy; tr = sc.r; }
  
    const targetX = W * 0.72;
    const targetY = H * 0.42;
    const S = Math.min((W * 0.52) / (tr * 2.2), (H * 0.7) / (tr * 2.2));
  
    const tx = targetX - tcx * S;
    const ty = targetY - tcy * S;
  
    return { transform: `translate(${tx}px, ${ty}px) scale(${S})`, transformOrigin: "0 0" };
  };

  const handleSubClick = (subId, e) => {
    if (e) e.stopPropagation();

  
    // if a node is selected inside this subsystem, clicking the subsystem exits node-focus only
    if (selectedNode && zoomedSub === subId) {
      setSelectedNode(null);
      setHov(null);
      return;
    }
  
    // normal subsystem toggle
    if (zoomedSub === subId) {
      setZoomedSub(null);
      setSelectedNode(null);
      setHov(null);
      return;
    }
  
    setZoomedSub(subId);
    setSelectedNode(null);
    setHov(null);
  };

  const handleBgClick = () => {
    setZoomedSub(null);
    setSelectedNode(null);
    setHov(null);
  };

  const jumpToEvidence = (id) => {
    if (!id) return;
    setFocusedEvidenceId(id);
    setFocusedEvidenceKey((k) => k + 1);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 60);
  };

  /* ── MODE EDGE DEFINITIONS ── */
  // 1) Trait overlay edges (your current set; keep as-is but rename)
const MODE_EDGES_TRAIT = {
  resting: [
    { from: "PCC", to: "aMPFC", status: "normal" },
    { from: "PCC", to: "dMPFC", status: "normal" },
    { from: "PCC", to: "HPC",   status: "normal" },
    { from: "dMPFC", to: "TPJ", status: "normal" },
    { from: "dMPFC", to: "LTC", status: "normal" },
    { from: "dMPFC", to: "TempP", status: "normal" },
    { from: "HPC", to: "PHC",   status: "normal" },
    { from: "TPJ", to: "LTC",   status: "normal" },
  ],
  mdd: [
    { from: "PCC", to: "aMPFC", status: "normal" },
    { from: "PCC", to: "dMPFC", status: "reduced" },
    { from: "PCC", to: "sgACC", status: "hyper" },
    { from: "dMPFC", to: "TempP", status: "hyper" },
    { from: "TPJ", to: "LTC",   status: "hyper" },
    { from: "LTC", to: "PHC",   status: "hyper" },
    { from: "TPJ", to: "PHC",   status: "hyper" },
    { from: "TempP", to: "PHC", status: "hyper" },
    { from: "dMPFC", to: "TPJ", status: "normal" },
    { from: "HPC", to: "PHC",   status: "normal" },
  ],
  hc: [
    { from: "PCC", to: "aMPFC", status: "normal" },
    { from: "PCC", to: "dMPFC", status: "normal" },
    { from: "PCC", to: "HPC",   status: "normal" },
    { from: "dMPFC", to: "TPJ", status: "normal" },
    { from: "HPC", to: "PHC",   status: "normal" },
  ],
};

// 2) State overlay edges
// IMPORTANT: Chen 2020 is subsystem-level → representational edges should be "inferred" (yellow) if you’re mapping to nodes.
const MODE_EDGES_STATE = {
  resting: [
    { from: "PCC", to: "aMPFC", status: "normal" },
  ],
  mdd: [
    // only keep verified node-level state connection
    { from: "PCC", to: "sgACC", status: "hyper" },
    { from: "PCC", to: "aMPFC", status: "normal" },
  ],
  hc: [
    { from: "PCC", to: "aMPFC", status: "normal" },
  ],
};

const MODE_SUBSYSTEM_EDGES = {
  trait: {
    resting: [
      { from: "core", to: "dm",  status: "normal" },
      { from: "core", to: "mtl", status: "normal" },
      { from: "dm",   to: "mtl", status: "normal" },
      { from: "core", to: "aff", status: "normal" },
    ],
    hc: [
      { from: "core", to: "dm",  status: "normal" },
      { from: "core", to: "mtl", status: "normal" },
      { from: "dm",   to: "mtl", status: "normal" },
      { from: "core", to: "aff", status: "normal" },
    ],
    mdd: [
      { from: "core", to: "dm",  status: "reduced" },
      { from: "dm",   to: "mtl", status: "hyper" },
      { from: "core", to: "mtl", status: "normal" },
      { from: "core", to: "aff", status: "inferred" }, // inferred from PCC–sgACC
    ],
  },

  state: {
    resting: [
      { from: "core", to: "dm",  status: "normal" },
      { from: "core", to: "mtl", status: "normal" },
      { from: "core", to: "aff", status: "normal" },
    ],
    hc: [
      { from: "core", to: "dm",  status: "reduced" },
      { from: "core", to: "mtl", status: "hyper" },
      { from: "core", to: "aff", status: "normal" },
    ],
    mdd: [
      { from: "core", to: "dm",  status: "reduced" },
      { from: "core", to: "mtl", status: "hyper" },
      { from: "core", to: "aff", status: "inferred" }, // inferred from PCC–sgACC
    ],
  },
};

const MODE_SUB_EDGES = MODE_SUBSYSTEM_EDGES[overlayTop] || {
  resting: [],
  hc: [],
  mdd: [],
};

// 3) Choose which edge set the architecture overlay uses
const MODE_EDGES = overlayTop === "state" ? MODE_EDGES_STATE : MODE_EDGES_TRAIT;

  const modeLabels = { resting: "Resting DMN", mdd: "MDD", hc: "HC" };
  const modeColors = { resting: "#4A90D9", mdd: "#E05555", hc: "#22C55E" };

  const activeNodes = (() => {
    if (!mode) return new Set();
    const s = new Set();
    (MODE_EDGES[mode] || []).forEach(e => { s.add(e.from); s.add(e.to); });
    return s;
  })();

  /* ── Node activity classification for sizing ── */
  const getNodeActivity = (id) => {
    if (!mode) return "none";
    const cfg = MODE_NODE_ACTIVITY[mode];
    if (!cfg) return "none";
    if (cfg.active.includes(id)) return "active";
    if (cfg.dormant.includes(id)) return "dormant";
    return "normal";
  };

  const getSubsystemActivity = (subId) => {
    if (!mode) return "normal";
  
    if (overlayTop === "state") {
      if (mode === "hc") {
        if (subId === "core") return "normal";
        if (subId === "mtl") return "active";    // core↔MTL increased
        if (subId === "dm")  return "reduced";   // core↔dm decreased
        if (subId === "aff") return "dormant";
      }
  
      if (mode === "mdd") {
        if (subId === "core") return "normal";
        if (subId === "mtl") return "active";    // represent subsystem-level increase
        if (subId === "dm")  return "reduced";   // represent subsystem-level decrease
        if (subId === "aff") return "active";    // because PCC↔sgACC verified
      }
  
      return "normal";
    }
  
    // trait overlay
    if (mode === "resting" || mode === "hc") {
      return "normal";
    }
  
    if (mode === "mdd") {
      if (subId === "dm")  return "active";   // dm↔MTL increased, within-dm increased
      if (subId === "mtl") return "active";   // dm↔MTL increased
      if (subId === "aff") return "active";   // PCC↔sgACC hyper
      if (subId === "core") return "reduced"; // core↔dm reduced
    }
  
    return "normal";
  };

  const getSubsystemVisual = (subId) => {
    const baseR =
      subId === "core" ? coreR :
      subId === "dm"   ? dmR :
      subId === "mtl"  ? mtlR :
      subId === "aff"  ? affR : 60;
  
    if (!mode) {
      return { scale: 1, opacity: 0.85, radius: baseR };
    }
  
    let scale = 1;
    let opacity = 0.85;
  
    // TRAIT overlay
    if (overlayTop === "trait") {
      if (mode === "mdd") {
        if (subId === "dm")  { scale = 1.06; opacity = 0.95; }
        else if (subId === "mtl") { scale = 1.06; opacity = 0.95; }
        else if (subId === "aff") { scale = 1.04; opacity = 0.95; }
        else if (subId === "core") { scale = 0.97; opacity = 0.80; }
      } else {
        scale = 1;
        opacity = 0.85;
      }
    }
  
    // STATE overlay
    if (overlayTop === "state") {
      if (mode === "mdd") {
        if (subId === "mtl") { scale = 1.05; opacity = 0.95; }
        else if (subId === "dm") { scale = 0.94; opacity = 0.70; }
        else if (subId === "aff") { scale = 1.04; opacity = 0.95; }
        else if (subId === "core") { scale = 1.02; opacity = 0.90; }
      } else if (mode === "hc") {
        if (subId === "mtl") { scale = 1.04; opacity = 0.92; }
        else if (subId === "dm") { scale = 0.95; opacity = 0.72; }
        else { scale = 1; opacity = 0.85; }
      } else {
        scale = 1;
        opacity = 0.85;
      }
    }
  
    return {
      scale,
      opacity,
      radius: baseR * scale,
    };
  };
  const coreVisual = getSubsystemVisual("core");

  const allNodes = [TREE, ...TREE.children, ...TREE.children.flatMap((c) => c.children)];
  const hovNode = hov ? allNodes.find((n) => n.id === hov) : null;

  const arcPath = (ocx, ocy, r, clockwise = true) => {
    const s = clockwise ? 1 : 0;
    return `M ${ocx - r} ${ocy} A ${r} ${r} 0 1 ${s} ${ocx + r} ${ocy} A ${r} ${r} 0 1 ${s} ${ocx - r} ${ocy}`;
  };

  const connPath = (subId) => {
    const sc = subCenters[subId];
    const dx = sc.cx - coreCx, dy = sc.cy - coreCy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist, uy = dy / dist;
    const x1 = coreCx + ux * (coreR + 3), y1 = coreCy + uy * (coreR + 3);
    const x2 = sc.cx - ux * (sc.r + 3), y2 = sc.cy - uy * (sc.r + 3);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const nx = -dy / dist * 0.025 * dist, ny = dx / dist * 0.025 * dist;
    return { d: `M ${x1} ${y1} Q ${mx + nx} ${my + ny} ${x2} ${y2}` };
  };

  const edgePath = (fromId, toId, positions = nodePos) => {
    const a = positions[fromId], b = positions[toId];
    if (!a || !b) return `M 0 0 L 0 0`;
  
    const ddx = b.cx - a.cx;
    const ddy = b.cy - a.cy;
    const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
    if (dist < 1) return `M ${a.cx} ${a.cy} L ${b.cx} ${b.cy}`;
  
    const mx = (a.cx + b.cx) / 2;
    const my = (a.cy + b.cy) / 2;
  
    const nx = -ddy / dist;
    const ny = ddx / dist;
  
    let bulge = Math.min(dist * 0.15, 25);
  
    // Force PCC–sgACC to arc upward instead of downward
    const isPccSgacc =
      (fromId === "PCC" && toId === "sgACC") ||
      (fromId === "sgACC" && toId === "PCC");
    const isPccDmpfc =
      (fromId === "PCC" && toId === "dMPFC") ||
      (fromId === "dMPFC" && toId === "PCC");

    if (isPccSgacc || isPccDmpfc) {
      bulge = -bulge;
    }
  
    return `M ${a.cx} ${a.cy} Q ${mx + nx * bulge} ${my + ny * bulge} ${b.cx} ${b.cy}`;
  };

  const edgeStyle = (status, scale = 1) => getSemanticEdgeStyle(status, scale);
  

  const modeDesc = {
    resting: "Resting-state DMN architecture. All subsystems show baseline functional connectivity \u2014 the network during quiet wakefulness with no task demand. Connections between core hubs and subsystems are balanced, with no pathological hyper- or hypo-connectivity.",
    mdd: "Major Depressive Disorder trait pattern (Zhu et al. 2017). PCC\u2013sgACC hyperconnectivity is the most replicated finding \u2014 a persistent bridge routing negative affect into the core. Cross-subsystem fusion between dorsomedial and MTL regions creates rigid over-integration. Core\u2013dMPFC decoupling disconnects the mentalizing subsystem from the integrative backbone. The dMPFC\u2013TempP and LTC\u2013PHC edges specifically correlate with RSQ-rumination scores.",
    hc: "Healthy control resting-state baseline. All connections at normal levels. This is the comparison condition against which MDD alterations are measured. The network maintains balanced, flexible coupling between subsystems.",
  };

  const parentSubOfNode = (id) =>
    SUB_NODES.core.has(id) ? "core" :
    SUB_NODES.dm.has(id) ? "dm" :
    SUB_NODES.mtl.has(id) ? "mtl" :
    SUB_NODES.aff.has(id) ? "aff" :
    null;

  /* ── FLOATING WORDS RENDERER ── */
  const renderSubWords = (subId, sCx, sCy) => {
    if (selectedNode) return null;
    const words = SUBSYSTEM_WORDS[subId] || [];
    const isThisZoomed = zoomedSub === subId && !selectedNode;
    const selectedParentSub = selectedNode ? parentSubOfNode(selectedNode) : null;
    const inFocusedSub = !selectedParentSub || selectedParentSub === subId;
  
    return words.map((w, i) => {
      const wx = sCx + w.dx;
      const wy = sCy + w.dy;
      const isHighlighted = lensActive
        ? hov === w.nearNode || selectedNode === w.nearNode
        : isThisZoomed && hov === w.nearNode;
      const wordRole = getLensRole(w.nearNode);
      const lensWordVisible = wordRole !== "other";
      const lensWordColor =
        wordRole === "rumination"
          ? UI.color.inferred
          : wordRole === "tom"
          ? "#65B6FF"
          : "#DCEFFF";
      // Deterministic light cull (~16.7%) to reduce lens clutter while
      // keeping every term accessible on hover/selection.
      const lensCulled = lensActive && !isHighlighted && ((i + subId.charCodeAt(0)) % 6 === 0);
      const lensWordOpacity = !inFocusedSub
        ? 0.08
        : isHighlighted
        ? 0.95
        : selectedNode
        ? 0.54
        : 0.36;
      const displayWordSize =
        lensActive && !isHighlighted
          ? Math.max(8.4, w.size * 0.92)
          : w.size;
  
      const bobAmt = 1.2 + (i % 3) * 0.5;
      const bobAngle = (i * 47) % 360;
      const bx = bobAmt * Math.cos(bobAngle * Math.PI / 180);
      const by = bobAmt * Math.sin(bobAngle * Math.PI / 180);
      const dur = 4.5 + (i * 0.7) % 3.5;
  
      return (
        <g key={`word-${subId}-${i}`}>
          {!lensActive && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${bx.toFixed(1)},${by.toFixed(1)}; 0,0; ${(-bx).toFixed(1)},${(-by).toFixed(1)}; 0,0`}
              dur={`${dur.toFixed(1)}s`}
              repeatCount="indefinite"
            />
          )}
          <text
            x={wx}
            y={wy}
            textAnchor="middle"
            dominantBaseline="central"
            fill={lensActive ? lensWordColor : isHighlighted ? SUB[subId].color : "#7A8A9A"}
            fontSize={displayWordSize}
            fontFamily="'IBM Plex Sans', sans-serif"
            fontWeight={isHighlighted ? 700 : w.size >= 13 ? 600 : lensActive ? 500 : 400}
            opacity={
              lensActive
                ? lensWordVisible
                  ? lensCulled
                    ? 0
                    : lensWordOpacity
                  : 0
                : isThisZoomed
                ? (isHighlighted ? 0.85 : 0.32)
                : 0
            }
            style={{
              transition: lensActive
                ? `opacity 0.35s ease ${0.05 + i * 0.016}s, fill 0.24s ease, font-weight 0.2s ease`
                : isThisZoomed
                ? `opacity 0.5s ease ${0.1 + i * 0.025}s, fill 0.2s ease, font-weight 0.2s ease`
                : "opacity 0.25s ease 0s",
              pointerEvents: "none",
            }}
          >
            {w.text}
          </text>
        </g>
      );
    });
  };

  /* ── RENDER: node helper with mode-based sizing ── */
  const renderNode = (id, np, color, isRsp = false) => {
    if (!np) return null;
    const isH = hov === id;
    const isModeActive = mode && activeNodes.has(id);
    const activity = getNodeActivity(id);
    const lensRole = getLensRole(id);
    const lensTone =
      lensRole === "rumination"
        ? UI.color.inferred
        : lensRole === "tom"
        ? "#65B6FF"
        : lensRole === "bridge"
        ? "#E5F1FF"
        : color;
    const inLensStream = lensRole !== "other";
    const selectedParentSub = selectedNode ? parentSubOfNode(selectedNode) : null;
    const isSelectedNode = selectedNode === id;
    const selectedTarget =
      isSelectedNode && selectedParentSub
        ? selectedParentSub === "core"
          ? { cx: coreCx, cy: coreCy, radius: getSubsystemVisual("core").radius }
          : {
              cx: subCenters[selectedParentSub].cx,
              cy: subCenters[selectedParentSub].cy,
              radius: getSubsystemVisual(selectedParentSub).radius,
            }
        : null;
  
    // only other nodes get hidden when one is selected
    const isMuted = !!selectedNode && id !== selectedNode;
  
    let baseR = nodeR;
    let nodeOpacity = 1;
  
    if (mode) {
      if (activity === "active") {
        baseR = nodeR + 5;
        nodeOpacity = 1;
      } else if (activity === "dormant") {
        baseR = nodeR - 6;
        nodeOpacity = 0.45;
      } else {
        baseR = nodeR;
        nodeOpacity = 0.75;
      }
    }

    if (lensActive) {
      if (!inLensStream || isRsp) {
        baseR = Math.max(nodeR - 8, 10);
        nodeOpacity = 0.04;
      } else if (lensRole === "bridge") {
        baseR = nodeR + 7;
        nodeOpacity = 1;
      } else {
        baseR = nodeR + 2;
        nodeOpacity = Math.max(nodeOpacity, 0.92);
      }
    }

    // ── RESOURCE FLOW visual treatment ──
    const rfRole = resourceFlowActive ? (RESOURCE_FLOW.nodeRoles[id] || "dormant") : null;
    if (resourceFlowActive) {
      if (rfRole === "gap-hub") {
        baseR = nodeR + 6;
        nodeOpacity = 1;
      } else if (rfRole === "gap-member") {
        baseR = nodeR + 2;
        nodeOpacity = 0.75;
      } else if (rfRole === "core-hub") {
        baseR = nodeR + 3;
        nodeOpacity = 0.85;
      } else if (rfRole === "receiving") {
        baseR = nodeR;
        nodeOpacity = 0.6;
      } else if (rfRole === "affective") {
        baseR = nodeR + 1;
        nodeOpacity = 0.7;
      } else {
        baseR = nodeR - 3;
        nodeOpacity = 0.25;
      }
    }
    const rfColor =
      rfRole === "gap-hub" ? "#A888D4" :
      rfRole === "gap-member" ? "#8B68B8" :
      rfRole === "core-hub" ? "#8BB8E8" :
      rfRole === "receiving" ? "#E8A838" :
      rfRole === "affective" ? "#E05555" :
      null;
  
    // when a node is selected:
    // - selected node stays fully visible
    // - all others disappear
    if (isMuted) {
      nodeOpacity = 0;
    }
    if (selectedTarget) {
      baseR = Math.max(baseR, selectedTarget.radius * 0.82);
      nodeOpacity = 1;
    }

    return (
      <g
        key={id}
        style={{
          transform: `translate(${selectedTarget ? selectedTarget.cx : np.cx}px, ${selectedTarget ? selectedTarget.cy : np.cy}px)`,
          transition: "transform 0.82s cubic-bezier(0.22, 0.78, 0.2, 1)",
        }}
      >
        <g>
          {!lensActive && !resourceFlowActive && !selectedNode && (
            <animateTransform attributeName="transform" type="translate" values={bobVals[id]} dur={bobDur[id]} repeatCount="indefinite" />
          )}
          {mode && activity === "active" && !isMuted && (
            <circle cx={0} cy={0} r={baseR + 3} fill="none"
              stroke={modeColors[mode]} strokeWidth={0.9} opacity={0}
              style={{ pointerEvents: "none" }}>
              <animate attributeName="r" values={`${baseR + 1};${baseR + 12}`} dur="3.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.28;0" dur="3.2s" repeatCount="indefinite" />
            </circle>
          )}
          {lensActive && id === bridgeNode && !isMuted && (
            <>
              <circle
                cx={0}
                cy={0}
                r={baseR + 9}
                fill="none"
                stroke={UI.color.inferred}
                strokeWidth="1.5"
                strokeDasharray={`${Math.PI * (baseR + 9)} ${Math.PI * (baseR + 9)}`}
                strokeDashoffset="0"
                opacity="0.52"
              >
                <animate attributeName="opacity" values="0.56;0.24;0.56" dur="2.3s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={0}
                cy={0}
                r={baseR + 9}
                fill="none"
                stroke="#65B6FF"
                strokeWidth="1.5"
                strokeDasharray={`${Math.PI * (baseR + 9)} ${Math.PI * (baseR + 9)}`}
                strokeDashoffset={`${Math.PI * (baseR + 9)}`}
                opacity="0.52"
              >
                <animate attributeName="opacity" values="0.24;0.56;0.24" dur="2.3s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          {/* ── RESOURCE FLOW: gap-hub node — pulsing purple ring ── */}
          {resourceFlowActive && rfRole === "gap-hub" && !isMuted && (
            <circle cx={0} cy={0} r={baseR + 6} fill="none"
              stroke="#A888D4" strokeWidth={1.5}
              strokeDasharray="6,3" opacity={0.4}>
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
              <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="6s" repeatCount="indefinite" />
            </circle>
          )}
          {/* ── RESOURCE FLOW: gap-member nodes — subtle purple ring ── */}
          {resourceFlowActive && rfRole === "gap-member" && !isMuted && (
            <circle cx={0} cy={0} r={baseR + 4} fill="none"
              stroke="#8B68B8" strokeWidth={0.8} opacity={0.3}>
              <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3.5s" repeatCount="indefinite" />
            </circle>
          )}
          <g
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHov(id)}
            onMouseLeave={() => setHov(null)}
            onClick={(e) => {
              e.stopPropagation();


              const parentSub = parentSubOfNode(id);

              // Keep overview layout stable on direct node clicks from the full map.
              // Only retarget zoomed subsystem if the user is already in a subsystem zoom context.
              if (zoomedSub && parentSub && zoomedSub !== parentSub) {
                setZoomedSub(parentSub);
              }

              setSpinningNode(id);
              setSpinTick((t) => t + 1);
              setSelectedNode(id);

              window.setTimeout(() => {
                setSpinningNode(null);
              }, 720);
            }}
          >
            <g
              key={`spinwrap-${id}-${spinTick}`}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: spinningNode === id ? "nodeSpin 0.72s cubic-bezier(0.22, 0.78, 0.2, 1) 1" : "none",
              }}
            >
              <circle
                cx={0}
                cy={0}
                r={baseR}
                fill={
                  resourceFlowActive
                    ? rfColor
                      ? isH ? rfColor + "55" : rfColor + "33"
                      : "transparent"
                    : lensActive
                    ? inLensStream
                      ? isH
                        ? lensTone + "55"
                        : lensTone + "33"
                      : "transparent"
                    : isModeActive
                    ? color + "55"
                    : isH
                    ? color + "44"
                    : isRsp
                    ? color + "22"
                    : "#0D1520"
                }
                stroke={isH ? "#fff" : (resourceFlowActive ? (rfColor ? rfColor + "CC" : "transparent") : (lensActive ? (inLensStream ? lensTone + (isRsp ? "55" : "CC") : "transparent") : color + (isRsp ? "88" : "77")))}
                strokeWidth={isH ? 2.2 : activity === "active" ? 1.8 : 1.2}
                strokeDasharray={isRsp ? "3,3" : "none"}
                opacity={nodeOpacity}
                style={{ transition: "all 0.25s ease" }}
              />
              <text
                x={0}
                y={1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isH ? "#fff" : resourceFlowActive ? (rfColor || "#445") : lensActive ? lensTone : color}
                fontSize={id === "TempP" ? (activity === "dormant" ? 6.5 : 8) : (activity === "dormant" ? 7.5 : 9.5)}
                fontWeight={700}
                opacity={nodeOpacity}
                fontFamily="'IBM Plex Mono', monospace"
                style={{ pointerEvents: "none" }}
              >
                {id}
              </text>
            </g>
          </g>
        </g>
      </g>
    );
  };

  /* ── ZOOMED INFO PANEL (left overlay) ── */
  const zoomedSubTree = zoomedSub ? (zoomedSub === "core" ? TREE.children[0] : TREE.children.find(c => c.id === zoomedSub)) : null;
  const zoomedColor = zoomedSub ? (SUB[zoomedSub]?.color || "#C0D0E0") : "#C0D0E0";

  const renderInfoPanel = () => {
    const hovNodeData = hov ? allNodes.find(n => n.id === hov) : null;
    const selectedNodeData = selectedNode ? allNodes.find(n => n.id === selectedNode) : null;
    const nodeData = selectedNodeData || hovNodeData || null;
    const sideKey = mode === "mdd" ? "mdd" : mode === "hc" ? "hc" : null;

    const renderRefs = (findingKey, ...fallbackTexts) => (
      <CitationLinks
        refs={getRefsForFinding(findingKey, ...fallbackTexts)}
        jumpToEvidence={jumpToEvidence}
        label="Source links:"
      />
    );

    const nodeEdgeRows = nodeData
      ? (ARCH_EVIDENCE.nodeEdges[overlayTop] || [])
          .filter((e) => e.from === nodeData.id || e.to === nodeData.id)
          .map((e) => {
            const key = `${e.from}–${e.to}`;
            const findingKey = findingArchNodeKey(overlayTop, key);
            return { ...e, key, findingKey, refs: getRefsForFinding(findingKey, e.cite) };
          })
      : [];

    const activationText =
      nodeData && overlayTop === "state" && sideKey
        ? ACT_INFO.state?.[sideKey]?.[nodeData.id] || null
        : null;
    const activationFindingKey =
      nodeData && overlayTop === "state" && sideKey
        ? findingActivationKey("state", sideKey, nodeData.id)
        : null;
    const activationRefs = activationText && activationFindingKey
      ? getRefsForFinding(activationFindingKey, activationText)
      : [];

    const subRows = !nodeData && zoomedSub
      ? (ARCH_EVIDENCE.subEdges[overlayTop] || [])
          .filter((e) => e.from === zoomedSub || e.to === zoomedSub)
          .map((e) => {
            const key = `${e.from}↔${e.to}`;
            const findingKey = findingArchSubKey(overlayTop, key);
            return { ...e, key, findingKey, refs: getRefsForFinding(findingKey, e.cite) };
          })
      : [];

    const toneFromStatus = (status) => {
      if (status === "hyper") return "hyper";
      if (status === "reduced") return "reduced";
      if (status === "inferred") return "inferred";
      return "neutral";
    };

    return (
      <div style={{
        position: "absolute", top: 0, left: 0, width: 320, height: "100%",
        padding: "16px 18px", background: "linear-gradient(145deg, rgba(12, 20, 33, 0.85) 0%, rgba(17, 28, 44, 0.78) 100%)",
        borderRadius: "12px 0 0 12px", border: `1px solid ${zoomedColor}44`,
        borderRight: `2px solid ${zoomedColor}28`,
        backdropFilter: "blur(12px)",
        opacity: isZoomed ? 1 : 0,
        transform: isZoomed
          ? "perspective(900px) translateX(0) rotateY(0deg)"
          : "perspective(900px) translateX(-34px) rotateY(8deg)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
        transformOrigin: "left center",
        pointerEvents: isZoomed ? "auto" : "none",
        zIndex: 10, overflowY: "auto",
        boxSizing: "border-box",
      }}>
        <button onClick={() => {setZoomedSub(null);setHov(null);setSelectedNode(null);}}
            style={{
            padding: "5px 14px", border: "1.5px solid #2A3F5A", borderRadius: 16,
            background: "transparent", color: "#8899AA", fontSize: 10.5,
            fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
            cursor: "pointer", marginBottom: 14, transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.target.style.borderColor = zoomedColor; e.target.style.color = "#D0E0F0"; }}
          onMouseLeave={(e) => { e.target.style.borderColor = "#2A3F5A"; e.target.style.color = "#8899AA"; }}
        >{"\u2190"} Back to overview</button>
        {nodeData ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: nodeData.color || zoomedColor, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: nodeData.color || "#D0E0F0", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {nodeData.full || nodeData.label}
              </span>
            </div>
            {nodeData.full && (
              <div style={{ fontSize: 10, color: "#7F94AB", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 8 }}>
                ({nodeData.label})
              </div>
            )}
            <GlassCard
              variant="soft"
              style={{
                marginTop: 8,
                padding: "10px 12px",
                borderLeft: `3px solid ${(nodeData.color || zoomedColor) + "66"}`,
              }}
            >
              <div style={{ marginBottom: 7, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <StatusChip label={selectedNodeData ? "Focused node" : "Hovered node"} tone="verified" />
                <StatusChip label={overlayTop === "state" ? "State overlay context" : "Trait overlay context"} tone="neutral" />
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.65, color: UI.color.textBase }}>
                {nodeData.desc}
              </div>
              {renderRefs(`node.arch.${nodeData.id}`, nodeData.desc)}
            </GlassCard>

            {!!nodeEdgeRows.length && (
              <GlassCard variant="soft" style={{ marginTop: 10, padding: "10px 12px" }}>
                <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <StatusChip label="Connection evidence" tone="neutral" />
                  <span style={{ fontSize: 9.5, color: UI.color.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
                    Edge-level mapping with verification status
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {nodeEdgeRows.map((row) => (
                    <div key={row.key} style={{ padding: "7px 8px", borderRadius: 8, border: "1px solid rgba(61, 88, 117, 0.45)", background: "rgba(9, 14, 24, 0.55)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <StatusChip label={row.key} tone={toneFromStatus(row.status)} />
                        <StatusChip label={row.v ? "✓ verified" : "⚠ inferred"} tone={row.v ? "verified" : "inferred"} />
                      </div>
                      <div style={{ marginTop: 5, fontSize: 10.5, lineHeight: 1.45, color: UI.color.textBase }}>{row.cite}</div>
                      {row.refs?.length ? <CitationLinks refs={row.refs} jumpToEvidence={jumpToEvidence} label="Source links:" /> : null}
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {activationText && (
              <GlassCard variant="soft" style={{ marginTop: 10, padding: "10px 12px", borderLeft: "3px solid rgba(239, 68, 68, 0.52)" }}>
                <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <StatusChip label="Activation evidence" tone="reduced" />
                  <StatusChip label={mode === "mdd" ? "MDD context" : "HC context"} tone="neutral" />
                </div>
                <div style={{ fontSize: 10.8, lineHeight: 1.55, color: UI.color.textStrong }}>{activationText}</div>
                {activationRefs?.length ? <CitationLinks refs={activationRefs} jumpToEvidence={jumpToEvidence} label="Source links:" /> : null}
              </GlassCard>
            )}

            {lensActive && nodeData.id === bridgeNode && (
              <GlassCard variant="soft" style={{ marginTop: 10, padding: "10px 12px", borderLeft: `3px solid ${UI.color.inferred}88` }}>
                <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <StatusChip label="Evidence Streams convergence" tone="inferred" />
                  <StatusChip label="Capstone integration focus" tone="verified" />
                </div>
                <div style={{ fontSize: 10.8, lineHeight: 1.55, color: UI.color.textBase }}>
                  dMPFC is rendered as the structural convergence node: rumination-stream evidence and ToM-stream evidence both implicate this region, but concurrent measurement (ToM performance during active rumination DMN reconfiguration) is still untested.
                </div>
                {renderRefs("gap.convergence", "Moran 2013", "Chen 2020", "Zhu 2017", "Bora 2016", "Nestor 2022")}
              </GlassCard>
            )}
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: zoomedColor, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: zoomedColor, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {zoomedSubTree?.label || "Core Hubs"}
              </span>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.7, color: "#8899AA" }}>{zoomedSubTree?.desc}</div>
            <div style={{ marginTop: 14, padding: "8px 10px", background: "#0A101844", borderRadius: 8, borderLeft: `3px solid ${zoomedColor}44` }}>
              <div style={{ fontSize: 10, color: "#5A7A9A", fontStyle: "italic" }}>
                Hover a node to see its description and highlight associated terms. Click outside the circle to zoom out.
              </div>
            </div>
            {!!subRows.length && (
              <GlassCard variant="soft" style={{ marginTop: 12, padding: "10px 12px" }}>
                <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <StatusChip label="Subsystem evidence" tone="neutral" />
                  <StatusChip label={`${overlayTop} overlay`} tone="neutral" />
                </div>
                {subRows.map((row) => (
                  <div key={row.key} style={{ marginBottom: 8, padding: "7px 8px", borderRadius: 8, border: "1px solid rgba(61, 88, 117, 0.45)", background: "rgba(9, 14, 24, 0.55)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <StatusChip label={row.key} tone={toneFromStatus(row.status)} />
                      <StatusChip label={row.v ? "✓ verified" : "⚠ inferred"} tone={row.v ? "verified" : "inferred"} />
                    </div>
                    <div style={{ marginTop: 5, fontSize: 10.5, lineHeight: 1.45, color: UI.color.textBase }}>{row.cite}</div>
                    {row.refs?.length ? <CitationLinks refs={row.refs} jumpToEvidence={jumpToEvidence} label="Source links:" /> : null}
                  </div>
                ))}
              </GlassCard>
            )}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 9.5, color: "#4A5A6A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Regions</div>
              {(zoomedSubTree?.children || []).map(child => (
                <div key={child.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: zoomedColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 10.5, color: "#8899AA", fontFamily: "monospace" }}>
                    <span style={{ fontWeight: 600, color: "#B0C4DE" }}>{child.label}</span> {"\u2014"} {child.full}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const zoomTransform = getZoomTransform();

  return (
    <div style={{ padding: "0 8px" }}>
      <GlassCard variant="elevated" style={{ textAlign: "center", marginBottom: 12, padding: "10px 12px" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#D0E0F0", margin: "0 0 4px" }}>DMN Architecture</h2>
        <p style={{ fontSize: 10.5, color: "#5A7A9A", margin: 0, fontFamily: "monospace" }}>
	          {isZoomed
	            ? "Hover nodes for details on the left \u00B7 Click outside the circle to return"
	            : lensActive
	            ? "Evidence Streams lens active: parallel rumination and ToM literatures converge on dMPFC"
	            : resourceFlowActive
	            ? "Convergence lens — state-induction subsystem coupling + untested gap: dMPFC subsystem mentalizing during active rumination"
	            : "Click any subsystem circle to zoom in \u00B7 Hover nodes for details"}
          &nbsp;&nbsp;|&nbsp;&nbsp;Toggle through any button to view trait-discriminating features of DMN within individuals with Resting State, MDD, & HC
          &nbsp;&nbsp;|&nbsp;&nbsp;| Architecture: Andrews-Hanna 2010/2012 · Overlays: Chen 2020 (state, subsystem-level) & Zhu 2017 (trait, edge-level) · sgACC coupling: replicated literature
        </p>
      </GlassCard>
      
      {!isZoomed && (
  <GlassCard variant="base" style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10, padding: "8px 10px", flexWrap: "wrap" }}>
    {["trait", "state"].map(k => {
      const active = overlayTop === k;
      const col = k === "trait" ? "#8BB8E8" : "#E8A838";
      return (
        <button
          key={k}
          onClick={() => setOverlayTop(k)}
          style={{
            padding: "6px 14px",
            border: `1.5px solid ${active ? col : "#1A2940"}`,
            borderRadius: 20,
            background: active ? col + "18" : "transparent",
            color: active ? col : "#D0E0F0",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'IBM Plex Mono', monospace",
            cursor: "pointer",
            transition: "all 0.25s",
          }}
        >
          {active ? "● " : "○ "}{k === "trait" ? "Trait overlay" : "State overlay"}
        </button>
      );
    })}
  </GlassCard>
)}
      {!isZoomed && (
        <GlassCard
          variant="soft"
          style={{
            margin: "0 auto 10px",
            maxWidth: 980,
            padding: "7px 10px",
            border: `1px solid ${overlayTop === "state" ? "rgba(232, 168, 56, 0.36)" : "rgba(139, 184, 232, 0.3)"}`,
          }}
        >
          <div
            style={{
              fontSize: 9.7,
              lineHeight: 1.56,
              color: "#9AB3CC",
              fontFamily: "'IBM Plex Mono', monospace",
              textAlign: "center",
            }}
          >
            {overlayTop === "state"
              ? "State overlay caveat: Chen 2020 verifies subsystem-level shifts (core↔MTL up, core↔dMPFC down, within-MTL down). Node edges are representative mappings, except PCC↔sgACC in MDD which is node-level verified."
              : "Trait overlay note: Zhu 2017 provides edge-level findings (plus RSQ-correlated edges), and this panel does not claim the same concurrent ToM-during-state-rumination interaction gap used in the state-convergence argument."}
          </div>
        </GlassCard>
      )}
      {/* MODE TOGGLE — hidden during zoom */}
      {!isZoomed && (
        <GlassCard variant="base" style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14, padding: "8px 10px", flexWrap: "wrap" }}>
          {["resting", "mdd", "hc"].map((m) => {
            const active = mode === m;
            return (
              <button key={m} onClick={() => setMode(active ? null : m)} style={{
                padding: "6px 14px", border: `1.5px solid ${active ? modeColors[m] : "#1A2940"}`,
                borderRadius: 20, background: active ? modeColors[m] + "18" : "transparent",
                color: active ? modeColors[m] : "#D0E0F0", fontSize: 11, fontWeight: 600,
                fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer",
                transition: "all 0.25s", letterSpacing: "0.02em",
              }}>
                {active ? "\u25CF " : "\u25CB "}{modeLabels[m]}
              </button>
            );
          })}
        </GlassCard>
      )}

      {/* ════ MAIN SVG + OVERLAY PANEL ════ */}
      <div style={{ display: "flex", gap: 12, alignItems: "stretch", flexWrap: "wrap", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ position: "relative", flex: "1 1 780px", minWidth: 320 }}>
          {renderInfoPanel()}

          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", overflow: "hidden", borderRadius: 12 }}
          onClick={handleBgClick}>
          <defs>            
            {/* Inner arc paths for text (counterclockwise = text faces inward) */}
            <path id="arc-core-txt" d={arcPath(coreCx, coreCy, coreR + 5, true)} fill="none" />
          {Object.entries(subCenters).map(([id, s]) => (
            <path key={`arc-${id}`} id={`arc-${id}-txt`} d={arcPath(s.cx, s.cy, s.r + 10, true)} fill="none" />
          ))}
           <path id="arc-dmn-txt" d={arcPath(cx, cy, outerR + 10, true)} fill="none" />
          <filter id="synGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="spotGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

          {/* ── ZOOM WRAPPER ── */}
          <g style={{
            ...zoomTransform,
            transition: "transform 0.78s cubic-bezier(0.22, 0.78, 0.2, 1)",
          }}>

            {/* ── OUTER DMN BOUNDARY ── */}
            <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#2A3F5A" strokeWidth={1.4}
              strokeDasharray="6,8"
              opacity={lensActive ? 0 : resourceFlowActive ? 0.15 : isZoomed ? 0.15 : 0.85}
              style={{ cursor: isZoomed ? "default" : "pointer", transition: "opacity 0.4s" }}
              onMouseEnter={() => !isZoomed && setHov("DMN")} onMouseLeave={() => setHov(null)} />
            <text fontSize={11.5} fontFamily="monospace" fontWeight={700} letterSpacing="0.24em"
              fill="#5A7A9A" opacity={lensActive ? 0 : resourceFlowActive ? 0 : isZoomed ? 0 : 1} style={{ pointerEvents: "none", transition: "opacity 0.3s" }}>
              <textPath href="#arc-dmn-txt" textAnchor="middle">
                <animate attributeName="startOffset" from="25%" to="125%" dur="55s" repeatCount="indefinite" />
                DEFAULT MODE NETWORK
              </textPath>
            </text>
            {!lensActive && !resourceFlowActive && mode &&
  Array.isArray(MODE_SUB_EDGES[mode]) &&
  MODE_SUB_EDGES[mode].map((e, i) => {
    if (!e || !e.from || !e.to) return null;

    const d = subEdgePath(e.from, e.to);
    if (typeof d !== "string" || !d.trim()) return null;

    // Subsystem arcs: background-level visual — quiet, thin, no dots
    const st =
    e.status === "hyper"
      ? edgeStyle(e.status, 0.9)
      : e.status === "reduced"
      ? edgeStyle(e.status, 0.8)
      : e.status === "inferred"
      ? edgeStyle(e.status, 0.85)
      : edgeStyle(e.status, 0.7);
    const dashValue = st.dash === "none" ? undefined : st.dash;

    return (
      <g key={`sub-${overlayTop}-${mode}-${e.from}-${e.to}-${i}`}>
        <path
          d={d}
          fill="none"
          stroke={st.color}
          strokeWidth={st.width}
          strokeDasharray={dashValue}
          strokeLinecap="round"
          opacity={
            e.status === "hyper" ? 0.38 :
            e.status === "reduced" ? 0.35 :
            e.status === "inferred" ? 0.32 :
            0.18
          }
          style={{
            animation: `edgeGrow 0.85s ease-out ${i * 0.08}s both`,
            transition: "all 0.25s ease",
          }}
        />
        {/* traveling dots removed from subsystem arcs — they compete with node-level edges */}
      </g>
    );
  })}
            {/* ── MODE EDGES ── */}
            {!lensActive && !resourceFlowActive && mode && (MODE_EDGES[mode] || [])
            .filter(e => isNodeId(e.from) && isNodeId(e.to))
            .map((e, i) => {
              const d = edgePath(e.from, e.to, displayNodePos);
              if (!d) return null;

              const st = edgeStyle(e.status);
              const isSignal = e.status !== "normal"; // only non-normal edges get a traveling dot

              return (
                <g key={`${mode}-${e.from}-${e.to}-${i}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke={st.color}
                    strokeWidth={st.width}
                    strokeDasharray={st.dash === "none" ? "400" : st.dash}
                    strokeLinecap="round"
                    opacity={isSignal ? 0.72 : 0.45}
                    style={{ animation: `edgeGrow 0.8s ease-out ${i * 0.08}s both` }}
                  />
                  {isSignal && (
                    <circle r="1.8" fill={st.color} opacity="0.75" filter="url(#synGlow)">
                      <animateMotion
                        dur={e.status === "hyper" ? "1.2s" : "1.8s"}
                        repeatCount="indefinite"
                        path={d}
                        begin={`${i * 0.12}s`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* ── CONNECTION WIRES ── */}
            {!lensActive && !resourceFlowActive && !mode && ["dm", "mtl", "aff"].map((subId) => {
              const conn = connPath(subId);
              const color = SUB[subId].color;
              const isActive = !isZoomed && (hov === subId || hov === "core" || hov === "DMN");
              const showSynapse = !isZoomed && (hov === subId || hov === "core");
              return (
                <g key={`conn-${subId}`} opacity={isZoomed ? 0.55 : 1} style={{ transition: "opacity 0.4s" }}>
                  <path d={conn.d} fill="none" stroke={color} strokeWidth={isActive ? 2.0 : 1.2}
                    opacity={isActive ? 0.5 : 0.16} strokeLinecap="round"
                    style={{ transition: "all 0.2s" }} />
                  {showSynapse && (
                    <circle r="1.8" fill={color} opacity="0.72" filter="url(#synGlow)">
                      <animateMotion dur="1.2s" repeatCount="indefinite" path={conn.d} />
                    </circle>
                  )}
                </g>
              );
            })}

            {lensActive && (
              <g>
                {CONVERGENCE_LENS.flows.filter(f => f.from && f.to).map((f, i) => {
                  const d = edgePath(f.from, f.to, displayNodePos);
                  const isGap = f.status === "gap";
                  const flowColor = f.track === "rumination" ? UI.color.inferred : "#65B6FF";
                  return (
                    <g key={`conv-${f.id}-${i}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={flowColor}
                        strokeWidth={isGap ? "1.9" : "2.2"}
                        strokeDasharray={isGap ? "4,4" : "8,5"}
                        opacity={isGap ? 0.56 : 0.7}
                        strokeLinecap="round"
                      />
                      {isGap && (
                        <text
                          x={(displayNodePos[f.from].cx + displayNodePos[f.to].cx) / 2}
                          y={(displayNodePos[f.from].cy + displayNodePos[f.to].cy) / 2 - 10}
                          textAnchor="middle"
                          fill={flowColor}
                          fontSize="8.8"
                          fontFamily="'IBM Plex Mono', monospace"
                          opacity="0.84"
                        >
                          ?
                        </text>
                      )}
                    </g>
                  );
                })}
                <g transform="translate(206 226)">
                  <rect
                    x={0}
                    y={0}
                    width={392}
                    height={44}
                    rx={10}
                    fill="rgba(7, 12, 19, 0.78)"
                    stroke="rgba(141, 189, 236, 0.52)"
                    strokeDasharray="6,5"
                  />
                  <text
                    x={196}
                    y={18}
                    textAnchor="middle"
                    fill="#E8A838"
                    fontSize="10.5"
                    fontFamily="'IBM Plex Mono', monospace"
                    fontWeight={700}
                    letterSpacing="0.05em"
                  >
                    UNTESTED GAP: ToM during active rumination
                  </text>
                  <text
                    x={196}
                    y={33}
                    textAnchor="middle"
                    fill="#9FC2E6"
                    fontSize="9.1"
                    fontFamily="'IBM Plex Mono', monospace"
                  >
                    No concurrent study has measured ToM performance while this state DMN reconfiguration is active
                  </text>
                </g>
                <g transform="translate(548 172)">
                  <rect x={0} y={0} width={214} height={48} rx={8} fill="rgba(7,12,19,0.72)" stroke="rgba(97,123,151,0.45)" />
                  <line x1={10} y1={16} x2={52} y2={16} stroke={UI.color.inferred} strokeWidth={2.2} strokeDasharray="8,5" />
                  <text x={58} y={19} fill="#D7B06A" fontSize="8.8" fontFamily="'IBM Plex Mono', monospace">established rumination findings</text>
                  <line x1={10} y1={33} x2={52} y2={33} stroke="#65B6FF" strokeWidth={2.0} strokeDasharray="4,4" />
                  <text x={58} y={36} fill="#8DCBFF" fontSize="8.8" fontFamily="'IBM Plex Mono', monospace">hypothesized ToM bridge (?)</text>
                </g>
              </g>
            )}

            {/* ── RESOURCE FLOW: subsystem-level coupling + gap ── */}
            {resourceFlowActive && (
              <g className="resource-flow-layer">
                {/* Subsystem coupling arrows — thick arcs between subsystem centers */}
                {RESOURCE_FLOW.subsystemEdges.map((edge, i) => {
                  const fromCenter = edge.fromSub === "core"
                    ? { cx: coreCx, cy: coreCy }
                    : subCenters[edge.fromSub];
                  const toCenter = edge.toSub === "core"
                    ? { cx: coreCx, cy: coreCy }
                    : subCenters[edge.toSub];
                  if (!fromCenter || !toCenter) return null;
                  const mx = (fromCenter.cx + toCenter.cx) / 2;
                  const my = (fromCenter.cy + toCenter.cy) / 2 - 30;
                  const d = `M ${fromCenter.cx} ${fromCenter.cy} Q ${mx} ${my} ${toCenter.cx} ${toCenter.cy}`;
                  const isTraitContext = edge.status === "trait-context";
                  return (
                    <g key={`rf-sub-${i}`} opacity={isTraitContext ? 0.45 : 0.7}>
                      <path d={d} fill="none" stroke={isTraitContext ? "#E8A838" : "#8BB8E8"}
                        strokeWidth={isTraitContext ? 2 : 2.8}
                        strokeDasharray={isTraitContext ? "6,4" : "none"}
                        strokeLinecap="round" />
                      {edge.label && (
                        <text
                          x={mx} y={my - 6}
                          textAnchor="middle" fill={isTraitContext ? "#E8A838" : "#8BB8E8"}
                          fontSize="8.5" fontWeight={700}
                          fontFamily="'IBM Plex Mono', monospace">
                          {edge.label}
                        </text>
                      )}
                      <text
                        x={mx} y={my + 6}
                        textAnchor="middle" fill="#6A8AAA"
                        fontSize="7" fontFamily="'IBM Plex Mono', monospace"
                        fontStyle="italic" opacity={0.7}>
                        {edge.cite}
                      </text>
                    </g>
                  );
                })}

                {/* dMPFC subsystem gap highlight — pulsing ring around the dm circle */}
                {(() => {
                  const dmC = subCenters.dm;
                  if (!dmC) return null;
                  return (
                    <g>
                      {/* Outer pulsing glow */}
                      <circle cx={dmC.cx} cy={dmC.cy} r={dmC.r + 8}
                        fill="none" stroke="#8B68B8" strokeWidth={3}
                        strokeDasharray="8,4" opacity={0.3}>
                        <animate attributeName="opacity" values="0.15;0.4;0.15" dur="3.5s" repeatCount="indefinite" />
                        <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="8s" repeatCount="indefinite" />
                      </circle>
                      {/* Question label */}
                      <text x={dmC.cx} y={dmC.cy - dmC.r - 18}
                        textAnchor="middle" fill="#A888D4" fontSize="9.5"
                        fontFamily="'IBM Plex Mono', monospace" fontWeight={600}
                        opacity={0.8}>
                        mentalizing subsystem — untested during active rumination
                      </text>
                      {/* ? mark */}
                      <text x={dmC.cx + dmC.r + 14} y={dmC.cy + 4}
                        textAnchor="middle" dominantBaseline="central"
                        fill="#8B68B8" fontSize="22" fontWeight={700}
                        fontFamily="'IBM Plex Mono', monospace" opacity={0.5}>
                        ?
                      </text>
                    </g>
                  );
                })()}

                {/* Compact legend — bottom right */}
                <g transform={`translate(${W - 260} ${H - 72})`}>
                  <rect x={0} y={0} width={248} height={64} rx={8}
                    fill="rgba(7,12,19,0.82)" stroke="rgba(97,123,151,0.3)" />
                  <line x1={10} y1={14} x2={46} y2={14} stroke="#8BB8E8" strokeWidth={2.8} strokeLinecap="round" />
                  <text x={52} y={17} fill="#8BB8E8" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                    established (state induction)
                  </text>
                  <line x1={10} y1={30} x2={46} y2={30} stroke="#E8A838" strokeWidth={2} strokeDasharray="6,4" strokeLinecap="round" />
                  <text x={52} y={33} fill="#E8A838" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                    trait MDD context (not gap-relevant)
                  </text>
                  <circle cx={18} cy={46} r={6} fill="none" stroke="#8B68B8" strokeWidth={2} strokeDasharray="6,3" opacity={0.5} />
                  <text x={52} y={49} fill="#A888D4" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                    gap: subsystem function untested
                  </text>
                  <text x={124} y={61} textAnchor="middle" fill="#546579" fontSize="6.5"
                    fontFamily="'IBM Plex Mono', monospace" fontStyle="italic">
                    author's synthesis — not a single-paper claim
                  </text>
                </g>
              </g>
            )}

            {/* ── CORE CIRCLE ── */}
            {(() => {
              const isCoreZoomed = zoomedSub === "core";
              const isOtherZoomed = isZoomed && !isCoreZoomed;
                            return (
                <g opacity={isOtherZoomed ? 0.12 : 1} style={{ transition: "opacity 0.4s" }}>
                  <g style={{ opacity: lensActive ? 0 : 1, transition: "opacity 0.55s ease", pointerEvents: "auto" }}>
                    {!resourceFlowActive && <animateTransform attributeName="transform" type="translate" values={bobVals.core} dur={bobDur.core} repeatCount="indefinite" />}
                    <g style={{ cursor: "pointer" }}
                      onClick={(e) => handleSubClick("core", e)}
                      onMouseEnter={() => setHov("core")} onMouseLeave={() => setHov(null)}>
                      <circle cx={coreCx} cy={coreCy} r={coreR * coreVisual.scale}
                        fill={resourceFlowActive ? "#E8A83808" : hov === "core" && !isZoomed ? SUB.core.color + "0C" : "transparent"}
                        stroke={resourceFlowActive ? "#D4845A" : SUB.core.color}
                        strokeWidth={resourceFlowActive ? 2.0 : isCoreZoomed ? 1.8 : 1.4}
                        strokeDasharray="5,5" opacity={lensActive ? 0.12 : resourceFlowActive ? 0.72 : 0.85}
                        style={{ transition: "all 0.35s" }} />
                    </g>
                    {!isZoomed && !lensActive && !resourceFlowActive && (hov === "core" ? (
                      <text x={coreCx} y={coreCy - coreR + 27}
                        textAnchor="middle"
                        fontSize={15} fontFamily="monospace" fontWeight={700} letterSpacing="0.14em"
                        fill={SUB.core.color}>Core Hub</text>
                    ) : (
                      <text fontSize={9.5} fontFamily="monospace" fontWeight={700} letterSpacing="0.1em"
                        fill={SUB.core.color + "BB"}>
                        <textPath href="#arc-core-txt" textAnchor="middle">
                          <animate attributeName="startOffset" from="25%" to="125%" dur="22s" repeatCount="indefinite" />
                          Core Hub
                        </textPath>
                      </text>
                    ))}
                  </g>
                  {!resourceFlowActive && renderSubWords("core", coreCx, coreCy)}
                  {["PCC", "aMPFC"].map(id => renderNode(id, displayNodePos[id], SUB.core.color))}
                </g>
              );
            })()}

            {/* ── SUBSYSTEM CIRCLES + NODES ── */}
            {Object.entries(subCenters).map(([subId, sc]) => {
              const color = SUB[subId].color;
              const subTree = TREE.children.find((c) => c.id === subId);
              const selectedParentSub =
              selectedNode && SUB_NODES.core.has(selectedNode) ? "core" :
              selectedNode && SUB_NODES.dm.has(selectedNode) ? "dm" :
              selectedNode && SUB_NODES.mtl.has(selectedNode) ? "mtl" :
              selectedNode && SUB_NODES.aff.has(selectedNode) ? "aff" :
              null;

              const isThisZoomed = zoomedSub === subId && !selectedNode;              
              const isNodeFocusHere = !!selectedNode && selectedParentSub === subId;
              const isHiddenByNodeFocus = !!selectedNode && !isNodeFocusHere;
              const isOtherZoomed = !selectedNode && isZoomed && !isThisZoomed;
              const subActivity = getSubsystemActivity(subId);
              const subVisual = getSubsystemVisual(subId);

              let displayR = sc.r * subVisual.scale;
              let subOpacity = subVisual.opacity;    
              if (lensActive) subOpacity = 0;
                            return (
                <g key={subId} opacity={isHiddenByNodeFocus ? 0 : (isOtherZoomed ? 0.12 : 1)} style={{ transition: "opacity 0.4s" }}>
                  <g style={{ opacity: lensActive ? 0 : 1, transition: "opacity 0.55s ease", pointerEvents: "auto" }}>
                    {!resourceFlowActive && <animateTransform attributeName="transform" type="translate" values={bobVals[subId]} dur={bobDur[subId]} repeatCount="indefinite" />}
                    <g style={{ cursor: "pointer" }}
                      onClick={(e) => handleSubClick(subId, e)}
                      onMouseEnter={() => setHov(subId)} onMouseLeave={() => setHov(null)}>
                      {(() => {
                        const isGapSub = resourceFlowActive && subId === RESOURCE_FLOW.gapSubsystem;
                        const rfStroke = isGapSub ? "#A888D4" : resourceFlowActive ? "#8BB8E8" : color;
                        const rfFill = isGapSub ? "#8B68B806" : resourceFlowActive ? "#8BB8E804" : "transparent";
                        const rfDash = isGapSub ? "6,4" : resourceFlowActive ? "5,5" : "5,5";
                        const rfSW = isGapSub ? 2.2 : resourceFlowActive ? 1.2 : 1.4;
                        return (
                      <circle
                        cx={sc.cx}
                        cy={sc.cy}
                        r={displayR}
                        fill={
                          resourceFlowActive
                            ? rfFill
                            : hov === subId && !isZoomed
                            ? color + "0A"
                            : subActivity === "active"
                            ? color + "08"
                            : "transparent"
                        }
                        stroke={resourceFlowActive ? rfStroke : color}
                        strokeWidth={
                          resourceFlowActive
                            ? rfSW
                            : isThisZoomed
                            ? 1.8
                            : subActivity === "active"
                            ? 2.2
                            : subActivity === "reduced"
                            ? 1.2
                            : 1.4
                        }
                        strokeDasharray={resourceFlowActive ? rfDash : "5,5"}
                        opacity={subOpacity}
                        style={{ transition: "all 0.35s ease" }}
                      />
                        );
                      })()}
                    </g>
                    {!isZoomed && !lensActive && !resourceFlowActive && (
                      <text
                        fontSize={subId === "aff" ? 8 : 9.5}
                        fontFamily="monospace"
                        fontWeight={700}
                        letterSpacing="0.08em"
                        fill={color + "BB"}
                        style={{ pointerEvents: "none" }}
                      >
                        <textPath
                          href={`#arc-${subId}-txt`}
                          textAnchor="middle"
                          startOffset="50%"
                        >
                          {hov === subId ? (
                            <animate
                              key={`${subId}-park`}
                              attributeName="startOffset"
                              from="10%"
                              to="25%"
                              dur="0.005s"
                              fill="freeze"
                            />
                          ) : (
                            <animate
                              key={`${subId}-spin`}
                              attributeName="startOffset"
                              from="50%"
                              to="-50%"
                              dur="26s"
                              repeatCount="indefinite"
                            />
                          )}

                          {subId === "mtl" ? "MTL Subsystem · Memory & Scenes" : sc.label}
                        </textPath>
                      </text>
                    )}
                  </g>
                  {!resourceFlowActive && renderSubWords(subId, sc.cx, sc.cy)}
                  {subTree.children.map(regionNode => {
                    const np = displayNodePos[regionNode.id];
                    return renderNode(regionNode.id, np, color, regionNode.id === "Rsp");
                  })}
                </g>
              );
            })}

          </g>{/* end zoom wrapper */}
          <style>{`
          @keyframes edgeGrow {
            from { stroke-dashoffset: 400; opacity: 0; }
            to { stroke-dashoffset: 0; opacity: 0.55; }
          }

          @keyframes nodeSpin {
            0% { transform: rotate(0deg) scale(1); }
            42% { transform: rotate(190deg) scale(1.08); }
            100% { transform: rotate(360deg) scale(1); }
          }
        `}</style>
          </svg>
        </div>
        {!isZoomed && (
          <GlassCard variant="soft" style={{ width: 248, minWidth: 220, padding: "10px 10px 12px" }}>
            <CardHeader title="Architecture Controls" subtitle="Convergence + resource flow lenses" accent="#AFC7E3" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => { setShowConvergenceLens((v) => !v); if (!showConvergenceLens) setShowResourceFlow(false); }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `1px solid ${showConvergenceLens ? "rgba(232, 168, 56, 0.42)" : "#2B4160"}`,
                  background: showConvergenceLens ? "rgba(232, 168, 56, 0.18)" : "rgba(43, 65, 96, 0.16)",
                  color: showConvergenceLens ? "#F1CB7A" : "#AFC7E3",
                  fontSize: 10.5,
                  fontFamily: "'IBM Plex Mono', monospace",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {showConvergenceLens ? "Evidence Streams Lens: On" : "Evidence Streams Lens: Off"}
              </button>
              <button
                onClick={() => { setShowResourceFlow((v) => !v); if (!showResourceFlow) setShowConvergenceLens(false); }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `1px solid ${showResourceFlow ? "rgba(193, 122, 224, 0.42)" : "#2B4160"}`,
                  background: showResourceFlow ? "rgba(193, 122, 224, 0.18)" : "rgba(43, 65, 96, 0.16)",
                  color: showResourceFlow ? "#D4A8F0" : "#AFC7E3",
                  fontSize: 10.5,
                  fontFamily: "'IBM Plex Mono', monospace",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {showResourceFlow ? "Resource Flow Lens: On" : "Resource Flow Lens: Off"}
              </button>
              <div style={{ fontSize: 9.5, color: UI.color.textMuted, lineHeight: 1.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                Evidence Streams Lens maps established rumination findings and ToM findings as parallel streams, with dMPFC as the shared node and the untested bridge explicitly marked.
              </div>
              <div style={{ fontSize: 9.5, color: UI.color.textMuted, lineHeight: 1.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                Resource Flow Lens visualizes the convergence gap at the subsystem level: established coupling shifts (core↔MTL up, core↔dMPFC down) are shown between subsystem centers, while the entire dMPFC subsystem is highlighted as the untested mentalizing question. PMC-hosted citation links attempt to highlight specific passages via text fragments.
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* ── ZOOM MINI LEGEND ── */}
      {isZoomed && (
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="#0D1520" stroke={zoomedColor + "77"} strokeWidth="1.2" /></svg>
            <span style={{ fontSize: 10, color: "#6A7A8A", fontFamily: "monospace" }}>Region node</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 10, color: zoomedColor, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, opacity: 0.7 }}>Term</span>
            <span style={{ fontSize: 10, color: "#6A7A8A", fontFamily: "monospace" }}>Highlighted (near hovered node)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 10, color: "#7A8A9A", fontFamily: "'IBM Plex Sans', sans-serif", opacity: 0.32 }}>term</span>
            <span style={{ fontSize: 10, color: "#6A7A8A", fontFamily: "monospace" }}>Background word</span>
          </div>
        </div>
      )}

      {/* ── INFO PANEL (overview only) ── */}
      {!isZoomed && (
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
              <div style={{ fontSize: 13, lineHeight: 1.7, color: "#8899AA" }}>{modeDesc[mode]}</div>
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
          ) : lensActive ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 12.5, color: "#D9E8F7", lineHeight: 1.6 }}>
                Evidence Streams lens is active: rumination and ToM literatures are shown as parallel streams converging on <span style={{ color: "#D8ECFF", fontWeight: 700 }}>dMPFC</span>.
              </div>
              <div style={{ fontSize: 11.2, color: "#9AB3CC", lineHeight: 1.6 }}>
                Established stream: core/affective/memory findings from state and trait rumination studies. Gap stream: predicted ToM-route disruption during active rumination, not directly tested in any concurrent design.
              </div>
              <div style={{ fontSize: 10.1, color: "#7F98B2", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.5 }}>
                Key gap marker: no paper in your source set measures ToM performance while the rumination-induced DMN subsystem reconfiguration is active.
              </div>
            </div>
          ) : resourceFlowActive ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12.5, color: "#D4A8F0", lineHeight: 1.6 }}>
                Convergence lens: rumination reconfigures DMN <em>subsystem</em> coupling. The dMPFC subsystem normally supports mentalizing — but no study has tested whether that capacity degrades when coupling shifts.
              </div>
              <div style={{ fontSize: 11, color: "#8A9AB0", lineHeight: 1.6, borderLeft: "2px solid #5A7A9A44", paddingLeft: 10 }}>
                <span style={{ color: "#AFC7E3", fontWeight: 600 }}>What's established:</span> During rumination, core↔MTL coupling increases while core↔dMPFC coupling decreases (Chen 2020, subsystem-level). In trait MDD, dMPFC↔MTL fusion increases (Zhu 2017). The dMPFC subsystem (dMPFC, TPJ, LTC, TempP) supports social-reflective processing (Andrews-Hanna 2014).
              </div>
              <div style={{ fontSize: 11, color: "#8A9AB0", lineHeight: 1.6, borderLeft: "2px solid #8B68B844", paddingLeft: 10 }}>
                <span style={{ color: "#A888D4", fontWeight: 600 }}>What's untested:</span> When the dMPFC subsystem decouples from core during rumination, does the <em>entire subsystem's</em> mentalizing function degrade? No study has administered a ToM task during active rumination while tracking these network shifts. That's the subsystem-level gap a concurrent design would fill.
              </div>
              <div style={{ fontSize: 10, color: "#6A7A8A", lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: "#7A8A9A" }}>Source evidence (click DOIs for highlighted passages):</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 4 }}>
                {Object.values(RESOURCE_FLOW.citations).map((c) => {
                  const ref = c.paperId ? makePaperRef(c.paperId) : null;
                  const stableUrl = ref?.stableUrl || null;
                  const tryHighlightUrl =
                    ref?.hostPolicy === PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT &&
                    ref?.highlightUrl &&
                    ref.highlightUrl !== ref.stableUrl
                      ? ref.highlightUrl
                      : null;
                  return (
                    <div key={c.doi} style={{ fontSize: 9.5, lineHeight: 1.5, color: "#7F98B2", fontFamily: "'IBM Plex Mono', monospace" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ color: "#9FC2E6", fontWeight: 700 }}>{c.label}</span>
                        {ref && <StatusChip label={hostPolicyLabel(ref.hostPolicy)} tone={hostPolicyTone(ref.hostPolicy)} />}
                        {stableUrl && (
                          <a
                            href={stableUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#7AACCC", textDecoration: "underline", textUnderlineOffset: 2 }}
                          >
                            open study ↗
                          </a>
                        )}
                        {tryHighlightUrl && (
                          <a
                            href={tryHighlightUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: UI.color.inferred, textDecoration: "underline", textUnderlineOffset: 2 }}
                          >
                            try highlight ↗
                          </a>
                        )}
                      </span>
                      {" — "}{c.passage}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 17, color: "#4A5A6A", lineHeight: 1.7 }}>
              <span style={{ color: "#5A7A9A", fontWeight: 600 }}>Click any subsystem circle to zoom in.</span> The DMN has hierarchical structure. The <span style={{ color: SUB.core.color }}>core hubs</span> (PCC, aMPFC) sit at the center and integrate signals from specialized subsystems: the <span style={{ color: SUB.dm.color }}>dorsomedial subsystem</span> handles social cognition, the <span style={{ color: SUB.mtl.color }}>MTL subsystem</span> handles memory and scene construction, and the <span style={{ color: SUB.aff.color }}>affective node</span> (sgACC) interfaces during emotional states. Rumination reconfigures the connections between these layers {"\u2014"} that{"\u2019"}s what the State and Trait tabs show.
            </div>
          )}
        </div>
      )}

      {!isZoomed && lensActive && (
        <GlassCard
          variant="base"
          style={{
            margin: "12px auto 0",
            maxWidth: 740,
            padding: "10px 12px",
            borderLeft: `3px solid ${UI.color.inferred}`,
          }}
        >
          <CardHeader title="Convergence Evidence Summary" subtitle="Established streams + explicit bridge gap" accent="#B9D0E8" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONVERGENCE_LENS.pillars.map((p) => (
              <div key={p.title} style={{ padding: "8px 9px", borderRadius: 8, border: "1px solid rgba(58, 83, 110, 0.5)", background: "rgba(8, 13, 22, 0.56)" }}>
                <div style={{ fontSize: 10.8, color: "#D7E7F8", fontWeight: 700 }}>{p.title}</div>
                <div style={{ marginTop: 4, fontSize: 10.2, lineHeight: 1.52, color: "#96AFCA" }}>{p.text}</div>
                <div style={{ marginTop: 4, fontSize: 9.3, lineHeight: 1.45, color: "#6E89A5", fontFamily: "'IBM Plex Mono', monospace" }}>{p.cite}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── LEGEND (overview only) ── */}
      {!isZoomed && (
        <div style={{ margin: "14px auto 0", maxWidth: 740, padding: "12px 16px", background: "#0A1018", borderRadius: 10, border: "1px solid #141E2E" }}>
          <div style={{ fontSize: 12.5, color: "#4A5A6A", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Visual Guide</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8, justifyContent: "center" }}>
            {Object.values(SUB).map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill={s.color + "CC"} stroke={s.color} strokeWidth="1" /></svg>
                <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="#0D1520" stroke="#4A90D977" strokeWidth="1.2" /></svg>
                <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Region node</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="#7B68EE22" stroke="#7B68EE88" strokeWidth="1" strokeDasharray="3,2" /></svg>
                <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>No edge data</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="16" height="16"><circle cx="8" cy="8" r="7" fill="transparent" stroke="#E8A83866" strokeWidth="1.4" strokeDasharray="4,4" /></svg>
                <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Subsystem (click to zoom)</span>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#22C55E" strokeWidth="2.4" /></svg>
                <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Hyperconnected</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,3" /></svg>
                <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Decoupled</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#ffffff88" strokeWidth="1.4" strokeDasharray="5,4" /></svg>
                <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Normal</span>
              </div>
            </div>
            {/* Mode-specific node sizing legend */}
            {mode && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", paddingTop: 4, borderTop: "1px solid #141E2E" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="#0D1520" stroke={modeColors[mode] + "AA"} strokeWidth="1.6" /></svg>
                  <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>More active</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="#0D1520" stroke="#ffffff55" strokeWidth="1.2" /></svg>
                  <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Unchanged</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12"><circle cx="6" cy="6" r="4" fill="#0D1520" stroke="#ffffff33" strokeWidth="1" opacity="0.5" /></svg>
                  <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Less active / uninvolved</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", paddingTop: 4 }}>
  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <svg width="18" height="18">
      <circle cx="9" cy="9" r="5.5" fill="#4A90D955" stroke="#4A90D9AA" strokeWidth="1.2" />
    </svg>
    <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>
      Filled = directly shown in overlay
    </span>
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <svg width="22" height="22">
      <circle cx="11" cy="11" r="7.5" fill="#E0555515" stroke="#E0555533" strokeWidth="1" />
      <circle cx="11" cy="11" r="5.5" fill="#0D1520" stroke="#E05555AA" strokeWidth="1.2" />
    </svg>
    <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>
      Halo = altered connectivity
    </span>
  </div>
</div>
              </div>
            )}
          </div>
        </div>
      )}
      <GlassCard variant="base" style={{ margin: "14px auto 0", maxWidth: 920, padding: "12px 14px" }}>
        <CardHeader
          title="Evidence Highlights"
          subtitle="Study-name links above jump to these exact justification snippets (highlight = last clicked citation)"
          accent="#9FC2E6"
          centered
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {EVIDENCE_HIGHLIGHTS.map((ev) => (
            (() => {
              const paperId = PAPER_ID_BY_ANCHOR[ev.id];
              const paperRef = paperId ? makePaperRef(paperId) : null;
              const stableUrl = paperRef?.stableUrl || null;
              const tryHighlightUrl =
                paperRef?.hostPolicy === PAPER_LINK_POLICY.HIGHLIGHT_ATTEMPT &&
                paperRef?.highlightUrl &&
                paperRef.highlightUrl !== paperRef.stableUrl
                  ? paperRef.highlightUrl
                  : null;
              return (
            <div
              key={focusedEvidenceId === ev.id ? `${ev.id}-${focusedEvidenceKey}` : ev.id}
              id={ev.id}
              style={{
                padding: "9px 10px",
                borderRadius: 10,
                border: `1px solid ${focusedEvidenceId === ev.id ? "rgba(139, 184, 232, 0.62)" : "rgba(53, 75, 100, 0.45)"}`,
                background: focusedEvidenceId === ev.id ? "rgba(26, 44, 68, 0.35)" : "rgba(9, 15, 24, 0.55)",
                boxShadow: focusedEvidenceId === ev.id ? "0 0 0 1px rgba(139, 184, 232, 0.25) inset" : "none",
                animation: focusedEvidenceId === ev.id ? "evidenceFlash 1.2s ease-out" : "none",
                transition: "border-color 0.3s ease, background-color 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontSize: 11.5, color: "#C5D7EA", fontWeight: 700 }}>{ev.study}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {paperRef && <StatusChip label={hostPolicyLabel(paperRef.hostPolicy)} tone={hostPolicyTone(paperRef.hostPolicy)} />}
                  {stableUrl && (
                    <a
                      href={stableUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => { setFocusedEvidenceId(ev.id); setFocusedEvidenceKey((k) => k + 1); }}
                      style={{ fontSize: 9.5, color: "#7EA7D2", fontFamily: "'IBM Plex Mono', monospace", textDecoration: "none" }}
                    >
                      open study ↗
                    </a>
                  )}
                  {tryHighlightUrl && (
                    <a
                      href={tryHighlightUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => { setFocusedEvidenceId(ev.id); setFocusedEvidenceKey((k) => k + 1); }}
                      style={{ fontSize: 9.5, color: UI.color.inferred, fontFamily: "'IBM Plex Mono', monospace", textDecoration: "none" }}
                    >
                      try highlight ↗
                    </a>
                  )}
                </span>
              </div>
              <div style={{ marginTop: 4, fontSize: 10.2, color: "#89A4C2", fontFamily: "'IBM Plex Mono', monospace" }}>{ev.summary}</div>
              <div style={{ marginTop: 5, fontSize: 10.8, color: "#B4C8DE", lineHeight: 1.52 }}>{ev.highlight}</div>
            </div>
              );
            })()
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default function DMNBrainMap() {
  const [tab, setTab] = useState("hierarchy");
  const d = DATA[tab] || {};
  const n = NOTES[tab] || {};

  return (
    <div
      style={{
        background: `radial-gradient(1400px 700px at 18% 0%, rgba(74, 144, 217, 0.14) 0%, transparent 52%), radial-gradient(1200px 700px at 92% 8%, rgba(123, 104, 238, 0.12) 0%, transparent 48%), linear-gradient(170deg, ${UI.color.bgA} 0%, ${UI.color.bgB} 100%)`,
        color: "#C0D0E0",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
        padding: "20px 16px",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap');
@keyframes evidenceFlash {
  0% { box-shadow: 0 0 0 2px rgba(139, 184, 232, 0.7), 0 0 16px rgba(139, 184, 232, 0.35); }
  50% { box-shadow: 0 0 0 3px rgba(139, 184, 232, 0.5), 0 0 24px rgba(139, 184, 232, 0.2); }
  100% { box-shadow: 0 0 0 1px rgba(139, 184, 232, 0.25) inset; }
}`}</style>
      <GlassCard variant="elevated" style={{ textAlign: "center", marginBottom: 10, padding: "12px 14px" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#D0E0F0", margin: 0 }}>DMN Subsystem Connectivity & Activation During Rumination</h1>
        <p style={{ fontSize: 10.5, color: "#5A7A9A", marginTop: 4, fontFamily: "monospace" }}>
          Medial sagittal view {"\u2014"} hover regions and connections for sourced details&nbsp;&nbsp;|&nbsp;&nbsp;
          <span style={{ color: UI.color.inferred }}>{"\u26A0"}</span> Inferred&nbsp;&nbsp;
          <span style={{ color: "#5A7A9A" }}>{"\u25CC"}</span> No Edge Data
        </p>
      </GlassCard>
      <GlassCard variant="base" style={{ display: "flex", textAlign: "center", justifyContent: "center" , gap: 4, padding: 4, maxWidth: 560, margin: "12px auto" }}>
        {[{ key: "hierarchy", label: "DMN Architecture" }, { key: "state", label: "State Rumination" }, { key: "trait", label: "Trait Rumination" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "9px 14px", border: "none", borderRadius: 8,
            background: tab === t.key ? "#1A2940" : "transparent",
            color: tab === t.key ? "#D0E0F0" : "#5A7A9A",
            fontWeight: tab === t.key ? 700 : 500, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </GlassCard>
      {tab === "hierarchy" ? (
        <HierarchyTab />
      ) : (
      <>
      <GlassCard variant="base" style={{ textAlign: "center", marginBottom: 12, padding: "10px 12px" }}>
        <div style={{ fontSize: 12.5, color: "#8899AA", fontWeight: 600 }}>{d.subtitle}</div>
        <div style={{ fontSize: 10, color: "#4A5A6A", marginTop: 3, fontFamily: "monospace" }}>Sources: {d.sources}</div>
      </GlassCard>
     {/* LEGEND (State/Trait tabs) */}
<GlassCard
  variant="base"
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    padding: "14px 14px",
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "flex-start",
  }}
>
  {/* Subsystems */}
  <div style={{ minWidth: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div
      style={{
        fontSize: 12,
        color: "#4A5A6A",
        fontWeight: 600,
        marginBottom: 5,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textAlign: "center",
      }}
    >
      Subsystems
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      {Object.values(SUB).map((s) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: s.color }} />
          <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>{s.label}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Connections */}
  <div style={{ minWidth: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div
      style={{
        fontSize: 12,
        color: "#4A5A6A",
        fontWeight: 600,
        marginBottom: 5,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textAlign: "center",
      }}
    >
      Connections
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      {Object.entries(CS).map(([k, c]) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="22" height="10">
            <path
              d={`M 0 5 Q 11 ${k === "normal" ? 3 : 1} 22 5`}
              fill="none"
              stroke={c.color}
              strokeWidth={c.width}
              strokeDasharray={c.dash}
            />
          </svg>
          <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>{c.label}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Markers */}
  <div style={{ minWidth: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div
      style={{
        fontSize: 12,
        color: "#4A5A6A",
        fontWeight: 600,
        marginBottom: 5,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textAlign: "center",
      }}
    >
      Markers
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="14" height="14">
          <circle cx="7" cy="7" r="6" fill="#EF4444" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </svg>
        <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Activation pulse</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="14" height="14">
          <circle cx="7" cy="7" r="6" fill="#E8A838" opacity="0.35">
            <animate attributeName="opacity" values="0;0.35;0" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
        <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Tonically altered</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="14" height="14">
          <circle cx="7" cy="7" r="5" fill="#7B68EE55" stroke="#7B68EE66" strokeWidth="1" strokeDasharray="3,2" />
        </svg>
        <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>No edge data</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="14" height="14">
          <circle cx="7" cy="7" r="5" fill="none" stroke="#ffffff44" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
        <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Lateral projection</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="14" height="14">
          <circle cx="7" cy="7" r="5" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" strokeDasharray="3,2" />
        </svg>
        <span style={{ fontSize: 12, color: "#8899AA", fontFamily: "monospace" }}>Pinned (click to toggle)</span>
      </div>
    </div>
  </div>
</GlassCard>
      <div style={{ display: "flex", gap: 12, alignItems: "stretch", flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: "1 1 600px" }}>
      <BrainPanelSingle data={d.hc} side="hc" tab={tab} />
      <BrainPanelSingle data={d.mdd} side="mdd" tab={tab} />
      </div>
      </div>
      {tab === "state" ? (
        <>
          <Tbl title="Regional Activation Changes" headers={["Region", "HC", "MDD"]} rows={STATE_ACT} />
          <Tbl title="Functional Connectivity Changes" headers={["Edge", "HC", "MDD"]} rows={STATE_FC_DERIVED} />
        </>
      ) : (
        <Tbl title="Functional Connectivity Changes (Resting State)" headers={["Edge", "HC", "MDD"]} rows={TRAIT_FC_DERIVED} />
      )}
      <GlassCard variant="base" style={{ marginTop: 22, padding: "14px 16px", borderLeft: `4px solid ${UI.color.inferred}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#E8A838", marginBottom: 6 }}>{n.title}</div>
        <div style={{ fontSize: 11.5, lineHeight: 1.65, color: "#8899AA", whiteSpace: "pre-line" }}>{n.text}</div>
      </GlassCard>
      <GlassCard variant="soft" style={{ textAlign: "center", marginTop: 20, padding: "10px 12px", fontSize: 9.5, color: "#3A4A5C", fontFamily: "monospace" }}>
        Data sourced from verified papers in convergence evidence document. {"\u2713"} = verified from named source. {"\u26A0"} = Inferred from HC pattern, subsystem-level finding, or untested prediction.
        <br />Midsagittal view {"\u2014"} medial surface of left hemisphere. TPJ, LTC, and TempP are lateral structures projected onto this view (dashed ring). Rsp is rendered as a subsystem member without individual edge data.
      </GlassCard>
      </>
      )}
    </div>
  );
}