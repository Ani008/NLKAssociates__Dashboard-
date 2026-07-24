import { inp, lbl, errTxt, grid3, sectionBox } from "../components/TSRShared";

export default function TSRBasicInfo({
  form,
  errors,
  handleChange,
  addParcel,
  removeParcel,
  handleParcelChange,
}) {
  return (
    <div
      className="animate-in"
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div style={grid3}>
        <div>
          <label style={lbl}>Author</label>
          <select
            name="author"
            value={form.author}
            onChange={handleChange}
            style={inp}
          >
            {[
              "Adv Narayan",
              "Adv Shreyash",
              "Mrs, Deepali Khamkar",
              "Miss Pooja Pakhare",
              "Mr, Chetan Kawade",
              "Mr. Nishant Phatak",
            ].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={lbl}>Bnak</label>
          <select
            name="author"
            value={form.author}
            onChange={handleChange}
            style={inp}
          >
            {[
              "ICICI Bank",
              "HDFC Bank",
            ].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={lbl}>Ref. No.</label>
          <input
            name="refNo"
            value={form.refNo}
            onChange={handleChange}
            style={inp}
          />
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>
            Application ID <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            name="appId"
            value={form.appId}
            onChange={handleChange}
            placeholder="e.g. 77000244168"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>
            Applicant <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            name="applicant"
            value={form.applicant}
            onChange={handleChange}
            placeholder="Primary applicant name"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Co-Applicant</label>
          <input
            name="coApplicant"
            value={form.coApplicant}
            onChange={handleChange}
            placeholder="e.g. Mr. Subhash Ganpat Sarak"
            style={inp}
          />
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>Transaction Type</label>
          <input
            name="transactionType"
            value={form.transactionType}
            onChange={handleChange}
            placeholder="e.g. LAP or Home Loan"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Bank Branch Office</label>
          <input
            name="bankBranch"
            value={form.bankBranch}
            onChange={handleChange}
            placeholder=""
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Village</label>
          <input
            name="village"
            value={form.village}
            onChange={handleChange}
            placeholder="e.g. Uruli Devachi"
            style={inp}
          />
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>Property No.</label>
          <input
            name="municipalPropertyNo"
            value={form.municipalPropertyNo}
            onChange={handleChange}
            placeholder="e.g. P/M/83/01239000"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>District</label>
          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="e.g. Pune"
            style={inp}
          />
        </div>
      </div>

      {/* Upload Section */}
      <div
        style={{
          marginTop: 28,
          border: "2px dashed var(--border)",
          borderRadius: 18,
          background: "var(--surface)",
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          transition: "all .25s ease",
          cursor: "pointer",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="56"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: "#94a3b8" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
          />
        </svg>

        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          Drag & Drop Supporting Documents
        </h3>

      

        <span style={{ color: "var(--primary)", fontWeight: 500 }}>
          or click to browse your files
        </span>
      </div>

      </div>
  );
}
