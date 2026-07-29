/**
 * TSRInitiationModel.jsx
 * ----------------------
 * Section II of the TSR Initiation form ("TSR Initiation") — filled by Staff 3.
 *
 * Five plain description boxes total:
 *   - Description 1–4 map to part1Desc–part4Desc (unchanged — same fields the
 *     drafting/template engine already reads).
 *   - Description 5 maps to additionalParts[0].content (unchanged shape —
 *     the drafting/template engine already reads this array generically),
 *     always present, not addable/removable.
 *
 * No titles, hints, or placeholder text — just a label and a textarea, so
 * whatever is typed is exactly what appears in the generated report.
 */

import { inp, lbl } from "../components/TSRShared";

// ── Styles ───────────────────────────────────────────────────────────────────

const textareaStyle = {
  ...inp,
  minHeight: 160,
  resize: "vertical",
  lineHeight: 1.7,
  paddingTop: 14,
  fontFamily: "inherit",
};

const sectionWrapStyle = {
  background: "#fafafa",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: "22px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const partLabelStyle = {
  ...lbl,
  fontSize: 13,
  color: "#111827",
  marginBottom: 4,
};

// ── Component ────────────────────────────────────────────────────────────────

export default function TSRInitiationModel({
  form,
  handleChange,
  additionalParts,
  onUpdatePart,
}) {
  const fifthValue = additionalParts?.[0]?.content || "";

  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Heading */}
      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--black)" }}>
          TSR Initiation
        </h2>
        <p style={{ marginTop: 6, color: "var(--muted)", fontSize: 14 }}>
          Fill in each description box below. The content you enter here will
          appear directly in the final generated report.
        </p>
      </div>

      {/* ── Description 1–4 (part1Desc–part4Desc) ───────────────────── */}
      {["part1Desc", "part2Desc", "part3Desc", "part4Desc"].map((name, i) => (
        <div key={name} style={sectionWrapStyle}>
          <label style={partLabelStyle}>{`Description ${i + 1}`}</label>
          <textarea
            name={name}
            value={form[name] || ""}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
      ))}

      {/* ── Description 5 (additionalParts[0].content) ──────────────── */}
      <div style={sectionWrapStyle}>
        <label style={partLabelStyle}>Description 5</label>
        <textarea
          value={fifthValue}
          onChange={(e) => onUpdatePart(0, "content", e.target.value)}
          style={textareaStyle}
        />
      </div>
    </div>
  );
}