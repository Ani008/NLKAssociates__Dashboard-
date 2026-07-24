import { inp, lbl } from "../components/TSRShared";

const textareaStyle = {
  ...inp,
  minHeight: 140,
  resize: "vertical",
  lineHeight: 1.6,
  paddingTop: 14,
  fontFamily: "inherit",
};

export default function TSRInitiationModel({
  form,
  handleChange,
}) {
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

      {/* Description 1 */}

      <div>
        <label style={lbl}>
          Description 1
        </label>

        <textarea
          name="description1"
          value={form.description1}
          onChange={handleChange}
          placeholder="Enter Description 1..."
          style={textareaStyle}
        />
      </div>

      {/* Description 2 */}

      <div>
        <label style={lbl}>
          Description 2
        </label>

        <textarea
          name="description2"
          value={form.description2}
          onChange={handleChange}
          placeholder="Enter Description 2..."
          style={textareaStyle}
        />
      </div>

      {/* Description 3 */}

      <div>
        <label style={lbl}>
          Description 3
        </label>

        <textarea
          name="description3"
          value={form.description3}
          onChange={handleChange}
          placeholder="Enter Description 3..."
          style={textareaStyle}
        />
      </div>

      {/* Description 4 */}

      <div>
        <label style={lbl}>
          Description 4
        </label>

        <textarea
          name="description4"
          value={form.description4}
          onChange={handleChange}
          placeholder="Enter Description 4..."
          style={textareaStyle}
        />
      </div>

      {/* Description 5 */}

      <div>
        <label style={lbl}>
          Description 5
        </label>

        <textarea
          name="description5"
          value={form.description5}
          onChange={handleChange}
          placeholder="Enter Description 5..."
          style={textareaStyle}
        />
      </div>
    </div>
  );
}