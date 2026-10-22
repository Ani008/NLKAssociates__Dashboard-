const mongoose = require("mongoose");

// Litigation register — tracks ongoing court cases handled by the firm.
// Sr. No. is NOT stored on the document; it is derived from row position
// (page/index) when the list is rendered, same convention as MasterDB.
const LitigationSchema = new mongoose.Schema(
  {
    author: { type: String, default: "" }, // staff member who created the entry

    nlkFileNo: { type: String, default: "", trim: true, index: true },
    clientName: { type: String, default: "", trim: true, index: true },
    caseType: { type: String, default: "", trim: true },
    caseNo: { type: String, default: "", trim: true, index: true },
    courtName: { type: String, default: "", trim: true },
    plaintiff: { type: String, default: "", trim: true },
    defendant: { type: String, default: "", trim: true },

    // Stored as a real Date so it can be sorted/filtered ("upcoming hearings"
    // etc.). Frontend sends an ISO date string (yyyy-mm-dd) from <input type="date">.
    nextDate: { type: Date, default: null },

    // ---------- Supporting documents (drag & drop) ----------
    // Same shape as TSRInitiation.bulkFiles. Files are uploaded first via
    // POST /api/litigation/upload-bulk, then the returned file info is sent
    // back here on create/update.
    bulkFiles: [
      {
        originalName: { type: String, default: "" },
        filePath: { type: String, default: "" },
        fileSize: { type: Number, default: 0 },
        mimeType: { type: String, default: "" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Litigation", LitigationSchema);
