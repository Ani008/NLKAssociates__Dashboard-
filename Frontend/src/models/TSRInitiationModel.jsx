/**
 * TSRInitiationModel.jsx
 * ----------------------
 * Section II of the TSR Initiation form — filled by Staff 3.
 *
 * Fixed Parts (Part I–IV): standard legal sections mapped directly to the PDF.
 * Additional Parts (Part V+): user can add unlimited custom sections dynamically.
 *   Each custom part has a title and content textarea.
 *   They appear after Part IV in the final generated PDF.
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

const partBadgeStyle = {
  display: "inline-block",
  background: "#000",
  color: "#fff",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
  padding: "3px 10px",
  borderRadius: 20,
  textTransform: "uppercase",
  marginBottom: 4,
};

const partLabelStyle = {
  ...lbl,
  fontSize: 13,
  color: "#111827",
  marginBottom: 4,
};

const partHintStyle = {
  fontSize: 12,
  color: "#6b7280",
  lineHeight: 1.5,
  marginBottom: 2,
};

// ── Fixed Part definitions (Part I–IV) ──────────────────────────────────────

const FIXED_PARTS = [
  {
    name: "part1Desc",
    badge: "Part I",
    label: "Property Details",
    hint:
      "Describe the complete property: Survey No., Hissa No., area, village, taluka, district, municipal limits, RCC construction details, property number, and all four boundary directions. End with: 'Hereinafter referred to as the \"Subject Property\".'",
    placeholder:
      "All that piece and parcel of property bearing land situated at Village – ..., Survey No. ..., Hissa No. ..., admeasuring ... Hectare.\n\nTogether with R.C.C. construction standing thereon admeasuring about ... Sq.Ft. on ground floor, bearing Property No. ..., and bounded as follows:\n\nOn or towards East  : ...\nOn or towards West  : ...\nOn or towards South : ...\nOn or towards North : ...\n\nHereinafter, referred to as the \"Subject Property\".",
  },
  {
    name: "part2Desc",
    badge: "Part II",
    label: "List of Documents Submitted for Scrutiny",
    hint:
      "List each document submitted before you for legal scrutiny: document type, date of execution, name of executant (from), name of claimant (in favour of), and registration number/office. Number each entry.",
    placeholder:
      "1. Sale Deed dated DD/MM/YYYY, executed by [Seller Name] in favour of [Buyer Name], registered under Registration No. XXXX/YYYY in the office of Sub-Registrar, [Location].\n\n2. Property Tax Receipt dated ...\n\n3. ...",
  },
  {
    name: "part3Desc",
    badge: "Part III",
    label: "Flow of Title / Chain of Ownership",
    hint:
      "Trace the chain of title from the earliest known owner to the current owner chronologically. Each step should mention: previous owner → document type → date → registration number → new owner.",
    placeholder:
      "Upon perusal of the documents placed on record and on the basis of the search conducted on the official IGR website, the chain of title in respect of the subject property is traced as follows:\n\n1. Thereafter, [Original Owner] has executed a [Document Type] dated DD/MM/YYYY, thereby sold, transferred and conveyed [Property] to and in favour of [New Owner]. The said document is duly registered under Registration No. XXXX/YYYY in the office of [SRO]. Remarks: ...\n\n2. ...",
  },
  {
    name: "part4Desc",
    badge: "Part IV",
    label: "Evidence of Title",
    hint:
      "List all supporting evidence documents: search reports, encumbrance certificates, 7/12 extracts, mutation entries, tax receipts, etc. These are the documents that prove and confirm the owner's title.",
    placeholder:
      "1. Search Report dated DD/MM/YYYY issued by [Authority], confirming clear title for a period of 30 years.\n\n2. Encumbrance Certificate dated DD/MM/YYYY.\n\n3. 7/12 Extract (Satbara) for Survey No. ...\n\n4. ...",
  },
];

// Converts a number to a Roman numeral (used for auto-labelling Part V, VI, VII…)
function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TSRInitiationModel({
  form,
  handleChange,
  additionalParts,
  onAddPart,
  onUpdatePart,
  onRemovePart,
}) {
  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Heading */}
      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--black)" }}>
          Legal Descriptions — Part I to {additionalParts.length > 0 ? toRoman(4 + additionalParts.length) : "IV"}
        </h2>
        <p style={{ marginTop: 6, color: "var(--muted)", fontSize: 14 }}>
          Fill in each section below. The content you enter here will appear
          directly as the corresponding Part in the final generated PDF report.
        </p>
      </div>

      {/* ── Fixed Part I–IV ─────────────────────────────────────────── */}
      {FIXED_PARTS.map((part) => (
        <div key={part.name} style={sectionWrapStyle}>
          <span style={partBadgeStyle}>{part.badge}</span>
          <label style={partLabelStyle}>{part.label}</label>
          <p style={partHintStyle}>{part.hint}</p>
          <textarea
            name={part.name}
            value={form[part.name] || ""}
            onChange={handleChange}
            placeholder={part.placeholder}
            style={textareaStyle}
          />
        </div>
      ))}

      {/* ── Additional Custom Parts (Part V, VI, VII…) ──────────────── */}
      {additionalParts.map((part, index) => {
        const partNumber = 5 + index;
        const autoLabel = `PART ${toRoman(partNumber)}`;
        return (
          <div
            key={index}
            style={{
              ...sectionWrapStyle,
              border: "1.5px dashed #9ca3af",
              background: "#f9fafb",
              position: "relative",
            }}
          >
            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemovePart(index)}
              title="Remove this section"
              style={{
                position: "absolute",
                top: 14,
                right: 16,
                background: "white",
                color: "#dc2626",
                border: "1px solid #fecaca",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ✕ Remove
            </button>

            {/* Auto Part label badge */}
            <span style={{ ...partBadgeStyle, background: "#374151" }}>
              {autoLabel}
            </span>

            {/* Editable Part Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ ...lbl, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Section Title
              </label>
              <input
                type="text"
                value={part.partTitle || ""}
                onChange={(e) => onUpdatePart(index, "partTitle", e.target.value)}
                placeholder={`e.g. Certificate, Search Report, Observations…`}
                style={{
                  ...inp,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              />
            </div>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ ...lbl, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Content
              </label>
              <textarea
                value={part.content || ""}
                onChange={(e) => onUpdatePart(index, "content", e.target.value)}
                placeholder={`Enter the legal content for ${autoLabel}…`}
                style={{ ...textareaStyle, minHeight: 140 }}
              />
            </div>
          </div>
        );
      })}

      {/* ── Add New Part Button ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={onAddPart}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "white",
          color: "var(--black)",
          border: "2px dashed #d1d5db",
          borderRadius: 10,
          padding: "16px 24px",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#000";
          e.currentTarget.style.background = "#f9fafb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.background = "white";
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>＋</span>
        Add New Part Section ({toRoman(5 + additionalParts.length)})
      </button>
    </div>
  );
}
