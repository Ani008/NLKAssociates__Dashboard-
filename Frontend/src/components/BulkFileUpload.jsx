import { useRef, useState } from "react";

// Reusable drag & drop upload box (same look & behaviour as the one in
// TSRBasicInfo). Purely presentational: the parent owns the upload call
// and the list of files.
//
// Props:
//   files            – [{ originalName, filePath, fileSize, ... }]
//   onFilesSelected  – (File[]) => void
//   onRemoveFile     – (index) => void
//   uploadProgress   – { percent, status } | null
function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function BulkFileUpload({
  files = [],
  onFilesSelected,
  onRemoveFile,
  uploadProgress,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const isUploading = uploadProgress?.status === "uploading";

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    if (e.dataTransfer.files?.length) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleBrowse = (e) => {
    if (e.target.files?.length) onFilesSelected(Array.from(e.target.files));
    e.target.value = "";
  };

  return (
    <div style={{ marginTop: 22 }}>
      <label
        style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}
      >
        Supporting Documents
      </label>

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? "#2563eb" : "#cbd5e1"}`,
          borderRadius: 14,
          background: isDragging ? "#eff6ff" : "#f8fafc",
          minHeight: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all .25s ease",
          cursor: isUploading ? "not-allowed" : "pointer",
          padding: 16,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
          style={{ display: "none" }}
          onChange={handleBrowse}
        />

        {isUploading ? (
          <>
            <div
              style={{
                width: 32,
                height: 32,
                border: "3px solid #bfdbfe",
                borderTopColor: "#2563eb",
                borderRadius: "50%",
                animation: "lit-bulk-spin 0.8s linear infinite",
              }}
            />
            <div style={{ fontSize: 14, fontWeight: 600, color: "#2563eb" }}>
              Uploading files… {uploadProgress.percent}%
            </div>
            <div style={{ width: 220, height: 6, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  width: `${uploadProgress.percent}%`,
                  height: "100%",
                  background: "#2563eb",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
            <style>{`@keyframes lit-bulk-spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
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
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
              Drag &amp; Drop Supporting Documents
            </div>
            <div style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>
              or click to browse your files
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              PDF, DOC/DOCX, XLS/XLSX, JPG, PNG, WEBP
            </div>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
            Uploaded Files ({files.length})
          </div>
          {files.map((f, idx) => (
            <div
              key={`${f.filePath}-${idx}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span style={{ fontSize: 15 }}>📎</span>
                <span
                  title={f.originalName}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#0f172a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.originalName}
                </span>
                <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>
                  {formatFileSize(f.fileSize)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile(idx)}
                title="Remove from this record"
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
