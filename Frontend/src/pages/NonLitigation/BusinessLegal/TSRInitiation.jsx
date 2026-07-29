import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import API from "../../../api/axios";
import TSRBasicInfo from "../../../models/TSRBasicInfo";
import TSRInitiationModel from "../../../models/TSRInitiationModel";

const INITIAL_BASIC = {
  author: "Adv Narayan",
  bank: "",
  refNo: "",
  appId: "",
  applicant: "",
  coApplicant: "",
  transactionType: "",
  branchOffice: "",
  village: "",
  propertyNo: "",
  district: "",
};

const INITIAL_INITIATION = {
  part1Desc: "",
  part2Desc: "",
  part3Desc: "",
  part4Desc: "",
};

// These labels appear in the View Details modal to identify each part clearly.
const PART_LABELS = {
  part1Desc: "PART I — Property Details",
  part2Desc: "PART II — List of Documents Scrutinised",
  part3Desc: "PART III — Flow of Title / Chain of Ownership",
  part4Desc: "PART IV — Evidence of Title",
};

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function TSRInitiation() {
  const [activeTab, setActiveTab] = useState("basic");

  const [basicInfo, setBasicInfo] = useState({ ...INITIAL_BASIC });
  const [initiationData, setInitiationData] = useState({
    ...INITIAL_INITIATION,
  });
  const [bulkFiles, setBulkFiles] = useState([]);
  // Additional custom parts (Part V, VI, VII…) added dynamically by Staff 3
  const [additionalParts, setAdditionalParts] = useState([]); // [{ partTitle, content }]
  const [uploadProgress, setUploadProgress] = useState(null); // { percent, status }
  const [refNoLoading, setRefNoLoading] = useState(false);

  const [editingRecordId, setEditingRecordId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }
  const [saveFeedback, setSaveFeedback] = useState(null); // 'progress' | 'final' | null — which button just succeeded

  // ---------- Records table ----------
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const showToast = (message, type = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4200);
  };

  // ---------- FETCH RECORDS ----------
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoadingRecords(true);
    try {
      const { data } = await API.get("/tsr-initiation/list", {
        headers: authHeader(),
      });
      setRecords(data.data || []);
    } catch (err) {
      console.error("Failed to fetch records", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  // ---------- FIELD CHANGE HANDLERS ----------
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));

    // Bank selected — immediately commit it so the server can generate the
    // real Ref No right away, instead of the user only finding out on Save.
    if (name === "bank" && value) {
      commitBankSelection(value);
    }
  };

  const commitBankSelection = async (bank) => {
    setRefNoLoading(true);
    try {
      let response;
      if (editingRecordId) {
        response = await API.put(
          `/tsr-initiation/${editingRecordId}`,
          { bank },
          { headers: authHeader() },
        );
      } else {
        response = await API.post(
          "/tsr-initiation/create",
          { bank },
          { headers: authHeader() },
        );
      }
      const saved = response.data.data;
      setEditingRecordId(saved._id);
      setBasicInfo((prev) => ({ ...prev, refNo: saved.refNo || "" }));
      fetchRecords(); // a real record now exists (or was updated) — keep the table in sync
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "Failed to generate Ref No.",
        "error",
      );
    } finally {
      setRefNoLoading(false);
    }
  };

  const handleInitiationChange = (e) => {
    const { name, value } = e.target;
    setInitiationData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- BULK FILE UPLOAD (drag & drop) ----------
  const handleFilesSelected = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file));

    setUploadProgress({ percent: 0, status: "uploading" });

    try {
      const response = await API.post("/tsr-initiation/upload-bulk", formData, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress({ percent, status: "uploading" });
        },
      });

      if (response.data.success) {
        setBulkFiles((prev) => [...prev, ...response.data.files]);
        showToast(
          `${response.data.files.length} file(s) uploaded successfully.`,
        );
      }
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "File upload failed.",
        "error",
      );
    } finally {
      setUploadProgress(null);
    }
  };

  const handleRemoveFile = (index) => {
    setBulkFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleViewDocument = (filePath) => {
    if (!filePath) return;

    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;

    window.open(cleanPath, "_blank", "noopener,noreferrer");
  };

  // ---------- SAVE (shared by "Save Progress" and "Save TSR Initiation") ----------
  const handleSave = async ({ isFinal } = {}) => {
    setSubmitting(true);
    try {
      const payload = { ...basicInfo, ...initiationData, bulkFiles, additionalParts };
      delete payload.refNo; // server-generated — never send it back

      let response;
      if (editingRecordId) {
        response = await API.put(
          `/tsr-initiation/${editingRecordId}`,
          payload,
          {
            headers: authHeader(),
          },
        );
      } else {
        response = await API.post("/tsr-initiation/create", payload, {
          headers: authHeader(),
        });
      }

      const saved = response.data.data;
      setEditingRecordId(saved._id);
      setBasicInfo((prev) => ({ ...prev, refNo: saved.refNo || "" }));
      fetchRecords();

      // Flash "✓ Saved!" directly on the button the user clicked — this is
      // the feedback that's hardest to miss, since it appears right under
      // their cursor, not just in a corner toast.
      setSaveFeedback(isFinal ? "final" : "progress");
      setTimeout(() => setSaveFeedback(null), 2000);

      if (isFinal) {
        showToast(
          `✅ TSR Initiation saved successfully. Ref No: ${saved.refNo || "—"}`,
        );
      } else {
        showToast("✅ Progress saved successfully.");
      }
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "⚠️ Failed to save. Please try again.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelUpload = () => {
    if (
      !window.confirm(
        "Discard this entry and start over? Unsaved changes will be lost.",
      )
    )
      return;
    setBasicInfo({ ...INITIAL_BASIC });
    setInitiationData({ ...INITIAL_INITIATION });
    setBulkFiles([]);
    setAdditionalParts([]);
    setEditingRecordId(null);
    setActiveTab("basic");
    showToast("Entry discarded.");
  };

  // ---------- RECORDS TABLE: VIEW / EDIT / DELETE ----------
  const handleViewRecord = (record) => setViewingRecord(record);

  const handleEditRecord = (record) => {
    setBasicInfo({
      author: record.author || INITIAL_BASIC.author,
      bank: record.bank || "",
      refNo: record.refNo || "",
      appId: record.appId || "",
      applicant: record.applicant || "",
      coApplicant: record.coApplicant || "",
      transactionType: record.transactionType || "",
      branchOffice: record.branchOffice || "",
      village: record.village || "",
      propertyNo: record.propertyNo || "",
      district: record.district || "",
    });
    setInitiationData({
      part1Desc: record.part1Desc || "",
      part2Desc: record.part2Desc || "",
      part3Desc: record.part3Desc || "",
      part4Desc: record.part4Desc || "",
    });
    setBulkFiles(record.bulkFiles || []);
    // Load additional custom parts if this record has any
    setAdditionalParts(
      (record.additionalParts || []).map((p) => ({
        partTitle: p.partTitle || "",
        content:   p.content   || "",
      }))
    );
    setEditingRecordId(record._id);
    setActiveTab("basic");
    setViewingRecord(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(
      "Record loaded — edit and Save Progress / Save TSR Initiation to update it.",
    );
  };

  const handleDeleteRecord = async (id) => {
    if (
      !window.confirm(
        "Delete this TSR Initiation record permanently? This cannot be undone.",
      )
    )
      return;
    setDeletingId(id);
    try {
      await API.delete(`/tsr-initiation/${id}`, { headers: authHeader() });

      if (editingRecordId === id) {
        setBasicInfo({ ...INITIAL_BASIC });
        setInitiationData({ ...INITIAL_INITIATION });
        setBulkFiles([]);
        setAdditionalParts([]);
        setEditingRecordId(null);
      }
      if (viewingRecord?._id === id) setViewingRecord(null);

      await fetchRecords();
      showToast("✅ Record deleted.");
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "⚠️ Failed to delete record.",
        "error",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="animate-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* ================= TOAST ================= */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 28,
            zIndex: 99999,
            background: toast.type === "success" ? "#000000" : "#dc2626",
            color: "white",
            padding: "16px 24px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 260,
            animation: "tsr-toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            borderLeft: `4px solid ${toast.type === "success" ? "#22c55e" : "#fca5a5"}`,
          }}
        >
          {toast.message}
        </div>
      )}
      <style>{`
        @keyframes tsr-toast-in {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* ================= HEADER ================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "var(--black)",
            }}
          >
            TSR Scrutiny & Initiation
          </h1>

          <p
            style={{
              marginTop: 6,
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            {editingRecordId
              ? `Editing record — Ref No: ${basicInfo.refNo || "—"}`
              : "Create a new TSR Initiation Report"}
          </p>
        </div>

        <span
          style={{
            background: "var(--black)",
            color: "white",
            padding: "7px 18px",
            borderRadius: 30,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          BUSINESS LEGAL
        </span>
      </div>

      {/* ================= MAIN CARD ================= */}

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* ================= TAB HEADER ================= */}

        <div
          style={{
            background: "var(--black)",
            padding: "18px 30px",
            display: "flex",
            gap: 24,
          }}
        >
          {[
            {
              key: "basic",
              label: "I. Basic Information",
            },
            {
              key: "initiation",
              label: "II. Legal Descriptions (Part I–IV)",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              type="button"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: activeTab === tab.key ? "#fff" : "rgba(255,255,255,.5)",

                fontWeight: activeTab === tab.key ? 700 : 500,

                fontSize: 14,

                borderBottom:
                  activeTab === tab.key
                    ? "2px solid white"
                    : "2px solid transparent",

                paddingBottom: 6,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= CONTENT ================= */}

        <div
          style={{
            padding: 30,
          }}
        >
          {activeTab === "basic" && (
            <TSRBasicInfo
              form={basicInfo}
              handleChange={handleBasicChange}
              bulkFiles={bulkFiles}
              onFilesSelected={handleFilesSelected}
              onRemoveFile={handleRemoveFile}
              uploadProgress={uploadProgress}
              refNoLoading={refNoLoading}
            />
          )}

          {activeTab === "initiation" && (
            <TSRInitiationModel
              form={initiationData}
              handleChange={handleInitiationChange}
              additionalParts={additionalParts}
              onAddPart={() =>
                setAdditionalParts((prev) => [
                  ...prev,
                  { partTitle: "", content: "" },
                ])
              }
              onUpdatePart={(index, field, value) =>
                setAdditionalParts((prev) =>
                  prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
                )
              }
              onRemovePart={(index) =>
                setAdditionalParts((prev) => prev.filter((_, i) => i !== index))
              }
            />
          )}
          {/* ================= BOTTOM BUTTONS ================= */}

          <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* LEFT BUTTON */}

            <button
              type="button"
              onClick={handleCancelUpload}
              disabled={submitting}
              style={{
                background: "white",
                color: "#dc2626",
                border: "1px solid #dc2626",
                borderRadius: 8,
                padding: "12px 26px",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: ".2s",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              Cancel / Discard
            </button>

            {/* RIGHT BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSave({ isFinal: false })}
                style={{
                  background: saveFeedback === "progress" ? "#059669" : "white",
                  color: saveFeedback === "progress" ? "white" : "#059669",
                  border: "1px solid #059669",
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontWeight: 600,
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: ".2s",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting
                  ? "Saving..."
                  : saveFeedback === "progress"
                    ? "✓ Saved!"
                    : "Save Progress"}
              </button>

              {activeTab === "basic" ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("initiation")}
                  style={{
                    background: "var(--black)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 32px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Next Section →
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSave({ isFinal: true })}
                    style={{
                      background:
                        saveFeedback === "final" ? "#059669" : "var(--black)",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      padding: "12px 28px",
                      fontWeight: 700,
                      cursor: submitting ? "not-allowed" : "pointer",
                      opacity: submitting ? 0.6 : 1,
                      transition: ".2s",
                    }}
                  >
                    {submitting
                      ? "Saving..."
                      : saveFeedback === "final"
                        ? "✓ Saved!"
                        : "Save TSR Initiation"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("basic")}
                    style={{
                      background: "white",
                      color: "var(--black)",
                      border: "1px solid var(--black)",
                      borderRadius: 8,
                      padding: "12px 26px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ← Previous
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECORDS TABLE ================= */}

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 30px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "var(--black)",
            }}
          >
            TSR Initiation Records
          </h2>
          <span
            style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}
          >
            {records.length} record{records.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loadingRecords ? (
          <div
            style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}
          >
            Loading records…
          </div>
        ) : records.length === 0 ? (
          <div
            style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}
          >
            No TSR Initiation records yet. Fill the form above and click Save
            Progress or Save TSR Initiation.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#fafafa",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "var(--muted)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Application ID
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "var(--muted)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Applicant Name
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "var(--muted)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Transaction Type
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                      fontWeight: 700,
                      color: "var(--muted)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      width: 260,
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        fontWeight: 600,
                        color: "var(--black)",
                      }}
                    >
                      {record.appId || (
                        <span style={{ color: "#cbd5e1", fontWeight: 400 }}>
                          —
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--black)" }}>
                      {record.applicant || (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--black)" }}>
                      {record.transactionType || (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => handleViewRecord(record)}
                          style={{
                            background: "white",
                            color: "var(--black)",
                            border: "1px solid #cbd5e1",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditRecord(record)}
                          style={{
                            background: "white",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === record._id}
                          onClick={() => handleDeleteRecord(record._id)}
                          style={{
                            background: "white",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor:
                              deletingId === record._id
                                ? "not-allowed"
                                : "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                            opacity: deletingId === record._id ? 0.6 : 1,
                          }}
                        >
                          {deletingId === record._id
                            ? "Deleting…"
                            : "🗑 Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= VIEW MODAL (full detail) ================= */}

      {viewingRecord &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(15, 23, 42, 0.45)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              boxSizing: "border-box",
            }}
            onClick={() => setViewingRecord(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                width: "100%",
                maxWidth: 820,
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: "var(--black)",
                  padding: "20px 28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: 18 }}>
                    {viewingRecord.applicant || "TSR Initiation Record"}
                  </h2>
                  <span style={{ fontSize: 12, opacity: 0.8 }}>
                    Ref No: {viewingRecord.refNo || "—"} · Application ID:{" "}
                    {viewingRecord.appId || "—"}
                  </span>
                </div>
                <button
                  onClick={() => setViewingRecord(null)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: 28,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 28,
                }}
              >
                {/* Basic Info */}
                <div>
                  <h3
                    style={{
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: 8,
                      color: "var(--black)",
                      margin: "0 0 16px 0",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Basic Info
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "14px 24px",
                      fontSize: 13,
                    }}
                  >
                    <div>
                      <strong>Author:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.author || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Bank:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.bank || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Ref No:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.refNo || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Application ID:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.appId || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Applicant:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.applicant || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Co-Applicant:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.coApplicant || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Transaction Type:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.transactionType || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Branch Office:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.branchOffice || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Village:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.village || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Property No:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.propertyNo || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>District:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.district || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TSR Initiation descriptions */}
                <div>
                  <h3
                    style={{
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: 8,
                      color: "var(--black)",
                      margin: "0 0 16px 0",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    TSR Initiation
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {Object.keys(PART_LABELS).map((key) =>
                      viewingRecord[key] ? (
                        <div key={key} style={{ fontSize: 13 }}>
                          <strong>{PART_LABELS[key]}:</strong>
                          <div
                            style={{
                              color: "#475569",
                              marginTop: 4,
                              whiteSpace: "pre-wrap",
                              lineHeight: 1.6,
                            }}
                          >
                            {viewingRecord[key]}
                          </div>
                        </div>
                      ) : null,
                    )}
                    {Object.keys(PART_LABELS).every(
                      (key) => !viewingRecord[key],
                    ) && (
                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: 13,
                          fontStyle: "italic",
                        }}
                      >
                        No description entered.
                      </span>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3
                    style={{
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: 8,
                      color: "var(--black)",
                      margin: "0 0 16px 0",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Uploaded Documents ({(viewingRecord.bulkFiles || []).length}
                    )
                  </h3>
                  {(viewingRecord.bulkFiles || []).length === 0 ? (
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>
                      No documents uploaded.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {viewingRecord.bulkFiles.map((f, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "10px 14px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              minWidth: 0,
                            }}
                          >
                            <span
                              style={{
                                color: "#64748b",
                                fontSize: 12,
                                width: 20,
                                flexShrink: 0,
                              }}
                            >
                              {idx + 1}.
                            </span>
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
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                flexShrink: 0,
                              }}
                            >
                              {formatFileSize(f.fileSize)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleViewDocument(f.filePath)}
                            style={{
                              background: "#eff6ff",
                              color: "#1d4ed8",
                              border: "1px solid #bfdbfe",
                              padding: "6px 14px",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: 11,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            View Document
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "16px 28px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  background: "#fafafa",
                }}
              >
                <button
                  onClick={() => handleEditRecord(viewingRecord)}
                  style={{
                    background: "white",
                    color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                    padding: "10px 22px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ✎ Edit This Record
                </button>
                <button
                  onClick={() => setViewingRecord(null)}
                  style={{
                    background: "var(--black)",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
