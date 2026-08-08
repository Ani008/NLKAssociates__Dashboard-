import { useEffect, useState } from "react";
import {
  Database,
  Search,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Eye,
  Trash2,
  X,
} from "lucide-react";

import API from "../api/axios";

export default function MasterDB() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [viewRecord, setViewRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const limit = 10;

  const fetchRecords = async (currentPage = page, searchText = search) => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/masterdb?page=${currentPage}&limit=${limit}&search=${searchText}`,
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
  }, [page]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an excel file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await API.post("/masterdb/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(data.message);

      setFile(null);
      setPage(1);

      fetchRecords(1, search);
    } catch (error) {
      console.error(error);
      const backendMessage = error?.response?.data?.message;
      alert(backendMessage || error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchRecords(1, search);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await API.get("/masterdb/template", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "MasterDB_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Failed to download template:", error);
      alert("Failed to download template");
    }
  };

  const handleView = (row) => {
    setViewRecord(row);
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(
      `Delete record for "${row.applicant?.join?.(", ") || row.applicant || "this entry"}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setDeletingId(row._id);

      const { data } = await API.delete(`/masterdb/${row._id}`);

      alert(data.message || "Record deleted successfully");

      // If we deleted the last record on this page (and it's not page 1), go back a page.
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

  return (
    <div
      style={{
        padding: "24px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
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
            <Database size={24} color="white" />
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
              }}
            >
              Master Database
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Manage all uploaded master records
            </p>
          </div>
        </div>

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
      </div>

      {/* SEARCH + UPLOAD */}

      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: "350px",
              position: "relative",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "12px",
                color: "#94a3b8",
              }}
            />

            <input
              type="text"
              placeholder="Search Branch, Applicant, Co Applicant, Property..."
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

          <button
            onClick={handleDownloadTemplate}
            style={{
              background: "#fff",
              border: "1px solid var(--navy)",
              color: "var(--navy)",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FileSpreadsheet size={18} />
            Download Template
          </button>

          <label
            style={{
              cursor: "pointer",
              border: "1px solid #dbe2ea",
              borderRadius: "10px",
              padding: "12px 16px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FileSpreadsheet size={18} />

            {file ? file.name : "Choose Excel"}

            <input
              hidden
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <colgroup>
              <col style={{ width: "4%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>

            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                }}
              >
                {[
                  "Sr No",
                  "Author",
                  "Application No",
                  "Branch",
                  "Applicant",
                  "Co Applicant",
                  "Transaction Type",
                  "Property Details",
                  "Vet + CTC",
                  "CTC",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    title={header}
                    style={{
                      padding: "10px 8px",
                      textAlign: header === "Actions" ? "center" : "left",
                      borderBottom: "1px solid #e2e8f0",
                      color: "#334155",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                    }}
                  >
                    <Loader2 size={24} className="animate-spin" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                    }}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((row, index) => {
                  const applicantText = Array.isArray(row.applicant)
                    ? row.applicant.join(", ")
                    : row.applicant || "-";

                  const coApplicantText = Array.isArray(row.coApplicant)
                    ? row.coApplicant.join(", ")
                    : row.coApplicant || "-";

                  return (
                    <tr key={row._id}>
                      <td style={cellStyle}>
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td style={cellStyle} title={row.author}>
                        {row.author || "-"}
                      </td>

                      <td style={cellStyle} title={row.applicationNo}>
                        {row.applicationNo || "-"}
                      </td>

                      <td style={cellStyle} title={row.branch}>
                        {row.branch || "-"}
                      </td>

                      <td style={cellStyle} title={applicantText}>
                        {applicantText}
                      </td>

                      <td style={cellStyle} title={coApplicantText}>
                        {coApplicantText}
                      </td>

                      <td style={cellStyle} title={row.transactionType}>
                        {row.transactionType || "-"}
                      </td>

                      <td style={cellStyle} title={row.propertyDetails}>
                        {row.propertyDetails || "-"}
                      </td>

                      <td style={cellStyle} title={row.vetAndCTC}>
                        {row.vetAndCTC || "-"}
                      </td>

                      <td style={cellStyle}>{row.ctc || "-"}</td>

                      <td style={{ ...cellStyle, textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => handleView(row)}
                            title="View record"
                            style={actionButton("#eff6ff", "#2563eb")}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(row)}
                            disabled={deletingId === row._id}
                            title="Delete record"
                            style={actionButton("#fef2f2", "#dc2626")}
                          >
                            {deletingId === row._id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
          <div>
            Page {page} of {pages}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              style={paginationButton}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={page === pages}
              onClick={() => setPage((prev) => prev + 1)}
              style={paginationButton}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW RECORD MODAL */}

      {viewRecord && (
        <div
          onClick={() => setViewRecord(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 22px",
                borderBottom: "1px solid #e2e8f0",
                position: "sticky",
                top: 0,
                background: "#fff",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <h3 style={{ margin: 0, color: "#0f172a" }}>Record Details</h3>

              <button
                onClick={() => setViewRecord(null)}
                style={{
                  border: "none",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "22px" }}>
              {[
                ["Author", viewRecord.author],
                ["Application No", viewRecord.applicationNo],
                ["Branch", viewRecord.branch],
                [
                  "Applicant",
                  Array.isArray(viewRecord.applicant)
                    ? viewRecord.applicant.join(", ")
                    : viewRecord.applicant,
                ],
                [
                  "Co Applicant",
                  Array.isArray(viewRecord.coApplicant)
                    ? viewRecord.coApplicant.join(", ")
                    : viewRecord.coApplicant,
                ],
                ["Transaction Type", viewRecord.transactionType],
                ["Property Details", viewRecord.propertyDetails],
                ["Vet + CTC", viewRecord.vetAndCTC],
                ["CTC", viewRecord.ctc],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    padding: "10px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      width: "160px",
                      flexShrink: 0,
                      color: "#64748b",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </div>

                  <div
                    style={{
                      color: "#0f172a",
                      fontSize: "14px",
                      wordBreak: "break-word",
                    }}
                  >
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

const cellStyle = {
  padding: "10px 8px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  fontSize: "13px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 0, // forces overflow/ellipsis to respect the colgroup % width in a table-layout:fixed table
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