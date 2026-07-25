const mongoose = require("mongoose");

// The 4 supported banks. Ref No prefix is derived from this list (see
// controllers/tsrInitiationController.js -> BANK_CODE_MAP). Keep this list
// and BANK_CODE_MAP in sync if a bank is ever added/renamed.
const SUPPORTED_BANKS = ["ICICI Bank", "IHFC Bank", "AHFC Bank", "Bajaj Finance"];

const TSRInitiationSchema = new mongoose.Schema(
  {
    // ---------- Basic Info ----------
    author: { type: String, default: "" },
    bank: { type: String, enum: [...SUPPORTED_BANKS, ""], default: "" },

    // Auto-generated server-side from `bank` (e.g. "ICICI01"). Never set
    // directly by the client — see createTSRInitiation/updateTSRInitiation.
    refNo: { type: String, default: "", index: true },

    appId: { type: String, default: "" },
    applicant: { type: String, default: "" },
    coApplicant: { type: String, default: "" },
    transactionType: { type: String, default: "" },
    branchOffice: { type: String, default: "" },
    village: { type: String, default: "" },
    propertyNo: { type: String, default: "" },
    district: { type: String, default: "" },

    // ---------- Bulk Files (drag & drop) ----------
    bulkFiles: [
      {
        originalName: { type: String, default: "" },
        filePath: { type: String, default: "" },
        fileSize: { type: Number, default: 0 },
        mimeType: { type: String, default: "" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ---------- TSR Initiation — 5 large description fields ----------
    part1Desc: { type: String, default: "" },
    part2Desc: { type: String, default: "" },
    part3Desc: { type: String, default: "" },
    part4Desc: { type: String, default: "" },
    part5Desc: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TSRInitiation", TSRInitiationSchema);
module.exports.SUPPORTED_BANKS = SUPPORTED_BANKS;
