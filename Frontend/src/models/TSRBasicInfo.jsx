import { useRef, useState } from "react";
import { inp, lbl, grid3 } from "../components/TSRShared";

const BANKS = ["ICICI Bank", "IHFC Bank", "AHFC Bank", "Bajaj Finance"];

const AUTHORS = [
  "Adv Narayan",
  "Adv Shreyash",
  "Mrs, Deepali Khamkar",
  "Miss Pooja Pakhare",
  "Mr, Chetan Kawade",
  "Mr. Nishant Phatak",
];

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function TSRBasicInfo({
  form,
  handleChange,
  bulkFiles = [],
  onFilesSelected,
  onRemoveFile,
  uploadProgress, // { percent, status: 'uploading' | 'error' } | null
  refNoLoading = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const isUploading = uploadProgress?.status === "uploading";

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return; // ignore drops while a batch is already in flight
    if (e.dataTransfer.files?.length) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleBrowseChange = (e) => {
    if (e.target.files?.length) {
      onFilesSelected(Array.from(e.target.files));
    }
    e.target.value = ""; // allow re-selecting the same file later
  };

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
            {AUTHORS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={lbl}>Bank</label>
          <select
            name="bank"
            value={form.bank}
            onChange={handleChange}
            style={inp}
          >
            <option value="">Select Bank...</option>
            {BANKS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={lbl}>Ref. No. <span style={{ color: "#94a3b8", textTransform: "none", fontWeight: 500 }}>(auto-generated)</span></label>
          <div style={{ position: "relative" }}>
            <input
              name="refNo"
              value={refNoLoading ? "" : form.refNo || ""}
              readOnly
              placeholder={refNoLoading ? "Generating…" : "Select a Bank to generate"}
              style={{
                ...inp,
                background: form.refNo && !refNoLoading ? "#ecfdf5" : "#f1f5f9",
                color: form.refNo && !refNoLoading ? "#047857" : "#475569",
                fontWeight: form.refNo && !refNoLoading ? 700 : 400,
                cursor: "not-allowed",
                paddingRight: refNoLoading ? 38 : 14,
              }}
            />
            {refNoLoading && (
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 16,
                  border: "2px solid #cbd5e1",
                  borderTopColor: "#2563eb",
                  borderRadius: "50%",
                  animation: "tsr-refno-spin 0.7s linear infinite",
                }}
              />
            )}
          </div>
          <style>{`@keyframes tsr-refno-spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>Application ID</label>
          <input
            name="appId"
            value={form.appId}
            onChange={handleChange}
            placeholder="e.g. 77000244168"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Applicant</label>
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
            name="branchOffice"
            value={form.branchOffice}
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
            name="propertyNo"
            value={form.propertyNo}
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
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          marginTop: 28,
          border: `2px dashed ${isDragging ? "var(--primary, #2563eb)" : "var(--border)"}`,
          borderRadius: 18,
          background: isDragging ? "#eff6ff" : "var(--surface)",
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          transition: "all .25s ease",
          cursor: isUploading ? "not-allowed" : "pointer",
          padding: 20,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
          style={{ display: "none" }}
          onChange={handleBrowseChange}
        />

        {isUploading ? (
          <>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #bfdbfe",
                borderTopColor: "#2563eb",
                borderRadius: "50%",
                animation: "tsr-bulk-spin 0.8s linear infinite",
              }}
            />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#2563eb" }}>
              Uploading files… {uploadProgress.percent}%
            </h3>
            <div style={{ width: 240, height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  width: `${uploadProgress.percent}%`,
                  height: "100%",
                  background: "#2563eb",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Please wait, do not close this tab</span>
            <style>{`@keyframes tsr-bulk-spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <>
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
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              PDF, DOC/DOCX, XLS/XLSX, JPG, PNG, WEBP
            </span>
          </>
        )}
      </div>

      {/* Uploaded files list */}
      {bulkFiles.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={lbl}>Uploaded Files ({bulkFiles.length})</label>
          {bulkFiles.map((f, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span style={{ fontSize: 16 }}>📎</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--black)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={f.originalName}
                >
                  {f.originalName}
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)", flexShrink: 0 }}>
                  {formatFileSize(f.fileSize)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile(idx)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: 14,
                  padding: "2px 8px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                title="Remove from this record"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
