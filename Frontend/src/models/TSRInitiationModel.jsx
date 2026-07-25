import { inp, lbl } from "../components/TSRShared";

const textareaStyle = {
  ...inp,
  minHeight: 140,
  resize: "vertical",
  lineHeight: 1.6,
  paddingTop: 14,
  fontFamily: "inherit",
};

const FIELDS = [
  { name: "part1Desc", label: "Description 1" },
  { name: "part2Desc", label: "Description 2" },
  { name: "part3Desc", label: "Description 3" },
  { name: "part4Desc", label: "Description 4" },
  { name: "part5Desc", label: "Description 5" },
];

export default function TSRInitiationModel({ form, handleChange }) {
  return (
    <div
      className="animate-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Heading */}
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: "var(--black)",
          }}
        >
          TSR Initiation
        </h2>

        <p
          style={{
            marginTop: 6,
            color: "var(--muted)",
            fontSize: 14,
          }}
        >
          Enter the legal observations and initiation details below.
        </p>
      </div>

      {FIELDS.map((f) => (
        <div key={f.name}>
          <label style={lbl}>{f.label}</label>
          <textarea
            name={f.name}
            value={form[f.name]}
            onChange={handleChange}
            placeholder={`Enter ${f.label}...`}
            style={textareaStyle}
          />
        </div>
      ))}
    </div>
  );
}
