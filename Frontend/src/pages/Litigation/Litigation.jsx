import { useEffect, useState } from "react";
import {
  Gavel,
  Search,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import API from "../../api/axios";

const EMPTY_FORM = {
  nlkFileNo: "",
  clientName: "",
  caseType: "",
  caseNo: "",
  courtName: "",
  plaintiff: "",
  defendant: "",
  nextDate: "",
};

export default function Litigation() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [viewRecord, setViewRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const limit = 10;

  const fetchRecords = async (currentPage = page, searchText = search) => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/litigation?page=${currentPage}&limit=${limit}&search=${searchText}`,
      );

      setRecords(data.data || []);
      setPages(data.pagination?.pages || 1);
      setTotalRecords(data.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchRecords(1, search);
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (row) => {
    setEditingId(row._id);
    setForm({
      nlkFileNo: row.nlkFileNo || "",
      clientName: row.clientName || "",
      caseType: row.caseType || "",
      caseNo: row.caseNo || "",
      courtName: row.courtName || "",
      plaintiff: row.plaintiff || "",
      defendant: row.defendant || "",
      nextDate: row.nextDate ? row.nextDate.slice(0, 10) : "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.clientName.trim()) {
      alert("Client Name is required");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const { data } = await API.put(`/litigation/${editingId}`, form);
        alert(data.message || "Record updated successfully");
      } else {
        const { data } = await API.post("/litigation", form);
        alert(data.message || "Record saved successfully");
      }

      closeForm();
      setPage(1);
      fetchRecords(1, search);
    } catch (error) {
      console.error(error);
      const backendMessage = error?.response?.data?.message;
      alert(backendMessage || error.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  const handleView = (row) => {
    setViewRecord(row);
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(
      `Delete litigation record for "${row.clientName || "this entry"}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setDeletingId(row._id);

      const { data } = await API.delete(`/litigation/${row._id}`);

      alert(data.message || "Record deleted successfully");

      const isLastRecordOnPage = records.length === 1 && page > 1;
      const nextPage = isLastRecordOnPage ? page - 1 : page;

      setPage(nextPage);
      fetchRecords(nextPage, search);
    } catch (error) {
      console.error(error);
      const backendMessage = error?.response?.data?.message;
      alert(backendMessage || error.message || "Failed to delete record");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    { key: "srNo", label: "Sr. No." },
    { key: "nlkFileNo", label: "NLK File No." },
    { key: "clientName", label: "Client Name" },
    { key: "caseType", label: "Case Type" },
    { key: "caseNo", label: "Case No." },
    { key: "courtName", label: "Court Name" },
    { key: "plaintiff", label: "Plaintiff" },
    { key: "defendant", label: "Defendant" },
    { key: "nextDate", label: "Next Date" },
  ];

  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "-";
    return dt.toLocaleDateString("en-IN");
  };

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "var(--navy)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gavel size={24} color="white" />
          </div>

          <div>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Litigation</h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Track and manage all litigation case entries
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              fontWeight: 600,
            }}
          >
            Total Records : {totalRecords}
          </div>

          <button
            onClick={openAddForm}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--navy)",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <Plus size={16} /> Add Litigation Case
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "350px", position: "relative" }}>
            <Search
              size={18}
              style={{ position: "absolute", left: "12px", top: "12px", color: "#94a3b8" }}
            />
            <input
              type="text"
              placeholder="Search NLK File No, Client, Case No, Court, Plaintiff, Defendant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                borderRadius: "10px",
                border: "1px solid #dbe2ea",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            style={{
              background: "var(--navy)",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              {columns.map((c) => (
                <col key={c.key} style={{ width: c.key === "srNo" ? "70px" : "auto" }} />
              ))}
              <col style={{ width: "110px" }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {c.label}
                  </th>
                ))}
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                    <Loader2 size={20} className="animate-spin" style={{ marginRight: 8 }} />
                    Loading records...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                    No litigation records found
                  </td>
                </tr>
              ) : (
                records.map((row, index) => (
                  <tr key={row._id}>
                    <td style={cellStyle}>{(page - 1) * limit + index + 1}</td>
                    <td style={cellStyle} title={row.nlkFileNo}>{row.nlkFileNo || "-"}</td>
                    <td style={cellStyle} title={row.clientName}>{row.clientName || "-"}</td>
                    <td style={cellStyle} title={row.caseType}>{row.caseType || "-"}</td>
                    <td style={cellStyle} title={row.caseNo}>{row.caseNo || "-"}</td>
                    <td style={cellStyle} title={row.courtName}>{row.courtName || "-"}</td>
                    <td style={cellStyle} title={row.plaintiff}>{row.plaintiff || "-"}</td>
                    <td style={cellStyle} title={row.defendant}>{row.defendant || "-"}</td>
                    <td style={cellStyle}>{formatDate(row.nextDate)}</td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        <button onClick={() => handleView(row)} title="View record" style={actionButton("#eff6ff", "#2563eb")}>
                          <Eye size={15} />
                        </button>
                        <button onClick={() => openEditForm(row)} title="Edit record" style={actionButton("#f0fdf4", "#16a34a")}>
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          disabled={deletingId === row._id}
                          title="Delete record"
                          style={actionButton("#fef2f2", "#dc2626")}
                        >
                          {deletingId === row._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div>Page {page} of {pages}</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} style={paginationButton}>
              <ChevronLeft size={16} />
            </button>
            <button disabled={page === pages} onClick={() => setPage((prev) => prev + 1)} style={paginationButton}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT FORM MODAL */}
      {showForm && (
        <div onClick={closeForm} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...modalStyle, maxWidth: 640 }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>
                {editingId ? "Edit Litigation Case" : "Add Litigation Case"}
              </h3>
              <button onClick={closeForm} style={closeButtonStyle}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Field label="NLK File No.">
                  <input
                    type="text"
                    value={form.nlkFileNo}
                    onChange={handleChange("nlkFileNo")}
                    style={inputStyle}
                    placeholder="e.g. NLK/2026/014"
                  />
                </Field>

                <Field label="Client Name" required>
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={handleChange("clientName")}
                    style={inputStyle}
                    required
                  />
                </Field>

                <Field label="Case Type">
                  <input
                    type="text"
                    value={form.caseType}
                    onChange={handleChange("caseType")}
                    style={inputStyle}
                    placeholder="e.g. Civil, Recovery Suit"
                  />
                </Field>

                <Field label="Case No.">
                  <input
                    type="text"
                    value={form.caseNo}
                    onChange={handleChange("caseNo")}
                    style={inputStyle}
                  />
                </Field>

                <Field label="Court Name">
                  <input
                    type="text"
                    value={form.courtName}
                    onChange={handleChange("courtName")}
                    style={inputStyle}
                  />
                </Field>

                <Field label="Next Date">
                  <input
                    type="date"
                    value={form.nextDate}
                    onChange={handleChange("nextDate")}
                    style={inputStyle}
                  />
                </Field>

                <Field label="Plaintiff">
                  <input
                    type="text"
                    value={form.plaintiff}
                    onChange={handleChange("plaintiff")}
                    style={inputStyle}
                  />
                </Field>

                <Field label="Defendant">
                  <input
                    type="text"
                    value={form.defendant}
                    onChange={handleChange("defendant")}
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                <button type="button" onClick={closeForm} style={secondaryButtonStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={primaryButtonStyle}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : (editingId ? "Update" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW RECORD MODAL */}
      {viewRecord && (
        <div onClick={() => setViewRecord(null)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...modalStyle, maxWidth: 600 }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Litigation Record Details</h3>
              <button onClick={() => setViewRecord(null)} style={closeButtonStyle}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "22px" }}>
              {[
                ["NLK File No.", viewRecord.nlkFileNo],
                ["Client Name", viewRecord.clientName],
                ["Case Type", viewRecord.caseType],
                ["Case No.", viewRecord.caseNo],
                ["Court Name", viewRecord.courtName],
                ["Plaintiff", viewRecord.plaintiff],
                ["Defendant", viewRecord.defendant],
                ["Next Date", formatDate(viewRecord.nextDate)],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ width: "160px", flexShrink: 0, color: "#64748b", fontSize: "13px", fontWeight: 600 }}>
                    {label}
                  </div>
                  <div style={{ color: "#0f172a", fontSize: "14px", wordBreak: "break-word" }}>
                    {value || "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const cellStyle = {
  padding: "10px 8px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  fontSize: "13px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const paginationButton = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  border: "1px solid #dbe2ea",
  background: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const actionButton = (bg, color) => ({
  width: "28px",
  height: "28px",
  borderRadius: "6px",
  border: "none",
  background: bg,
  color,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #dbe2ea",
  outline: "none",
  fontSize: 14,
  boxSizing: "border-box",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalStyle = {
  background: "#fff",
  borderRadius: "16px",
  width: "100%",
  maxHeight: "85vh",
  overflowY: "auto",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
};

const modalHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "18px 22px",
  borderBottom: "1px solid #e2e8f0",
  position: "sticky",
  top: 0,
  background: "#fff",
  borderRadius: "16px 16px 0 0",
};

const closeButtonStyle = {
  border: "none",
  background: "#f1f5f9",
  borderRadius: "8px",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const primaryButtonStyle = {
  background: "var(--navy)",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const secondaryButtonStyle = {
  background: "#fff",
  color: "#334155",
  border: "1px solid #dbe2ea",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
};
