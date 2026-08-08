const mongoose = require("mongoose");

// The 4 supported banks. Ref No prefix is derived from this list (see
// controllers/tsrInitiationController.js -> BANK_CODE_MAP). Keep this list
// and BANK_CODE_MAP in sync if a bank is ever added/renamed.
const SUPPORTED_BANKS = ["ICICI Bank", "IHFC", "Aditya Birla Finance", "Bajaj Finance"];

const TSRInitiationSchema = new mongoose.Schema(
  {
    // ---------- Basic Info ----------
    author: { type: String, default: "" },
    bank: { type: String, enum: [...SUPPORTED_BANKS, ""], default: "" },

    // Auto-generated server-side from `bank` (e.g. "ICICI01"). Never set
    // directly by the client — see createTSRInitiation/updateTSRInitiation.
    refNo: { type: String, default: "", index: true },

    appId: { type: String, default: "", index: true },
    applicant: { type: String, default: "", index: true },
    coApplicant: { type: String, default: "" },
    transactionType: { type: String, default: "", index: true },
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

    // ---------- TSR Initiation — 4 legal description fields ----------
    // Staff 3 fills these. Each maps directly to one Part in the final PDF:
    //   part1Desc → PART I  : Property Details
    //   part2Desc → PART II : List of Documents Scrutinised
    //   part3Desc → PART III: Flow of Title / Chain of Ownership
    //   part4Desc → PART IV : Evidence of Title
    part1Desc: { type: String, default: "" },
    part2Desc: { type: String, default: "" },
    part3Desc: { type: String, default: "" },
    part4Desc: { type: String, default: "" },

    // ---------- Additional Custom Parts (Part V, VI, VII …) ----------
    // Staff 3 can add unlimited extra parts beyond the standard 4.
    // Each part appears as its own section in the final generated PDF.
    additionalParts: [
      {
        partLabel: { type: String, default: "" }, // e.g. "PART V", "PART VI"
        partTitle: { type: String, default: "" }, // e.g. "Certificate", "Search Report"
        content:   { type: String, default: "" }, // the actual legal text
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TSRInitiation", TSRInitiationSchema);
module.exports.SUPPORTED_BANKS = SUPPORTED_BANKS;