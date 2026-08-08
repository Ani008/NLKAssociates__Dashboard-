const TSRInitiation = require("../models/TSRInitiation");
const Counter = require("../models/Counter");

const { SUPPORTED_BANKS } = TSRInitiation;

// Maps a full bank name (as stored/selected on the frontend) to the short
// prefix used in the auto-generated Ref No. Keep in sync with
// models/TSRInitiation.js -> SUPPORTED_BANKS.
const BANK_CODE_MAP = {
  "ICICI Bank": "ICICI",
  IHFC: "IHFC",
  "Aditya Birla Finance": "ABFL",
  "Bajaj Finance": "BAJAJ",
};

// Atomically gets the next sequence number for a bank and returns the
// formatted Ref No, e.g. "ICICI01", "ICICI02", ... "ICICI10", "ICICI11".
// Uses findOneAndUpdate with $inc + upsert so it's safe under concurrent
// requests, and the sequence NEVER resets or gets reused — deleting a
// record does not free up its number, per requirement.
const generateRefNo = async (bank) => {
  const code = BANK_CODE_MAP[bank];
  if (!code) return ""; // no bank selected yet — refNo stays blank until one is chosen

  const counter = await Counter.findOneAndUpdate(
    { _id: code },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const padded = String(counter.seq).padStart(2, "0");
  return `${code}${padded}`;
};

// 1. BULK FILE UPLOAD (drag & drop) — accepts multiple files, returns their
// info so the frontend can attach them to `bulkFiles` on create/update.
// Does NOT save anything to the DB itself.
const uploadBulkFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const files = req.files.map((f) => ({
      originalName: f.originalname,
      filePath: f.path,
      fileSize: f.size,
      mimeType: f.mimetype,
    }));

    return res.json({ success: true, files });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. CREATE
const createTSRInitiation = async (req, res) => {
  try {
    const data = { ...req.body };

    // Validate bank if one was sent (not required — allowed to be blank/null)
    if (data.bank && !SUPPORTED_BANKS.includes(data.bank)) {
      return res.status(400).json({
        success: false,
        message: `Invalid bank. Must be one of: ${SUPPORTED_BANKS.join(", ")}`,
      });
    }

    // Ref No is always server-generated — never trust a client-supplied value
    delete data.refNo;
    data.refNo = await generateRefNo(data.bank);

    const newRecord = await TSRInitiation.create(data);
    res.status(201).json({ success: true, data: newRecord });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. GET ALL — supports server-side search + pagination.
// Query params:
//   page   (1-indexed, default 1)
//   limit  (records per page, default 25)
//   search (matched against appId, applicant, coApplicant, transactionType,
//           refNo, bank, branchOffice, district — case-insensitive substring)
const getTSRInitiations = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 25);
    const search = (req.query.search || "").trim();

    const query = {};

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { appId: regex },
        { applicant: regex },
        { coApplicant: regex },
        { transactionType: regex },
        { refNo: regex },
        { bank: regex },
        { branchOffice: regex },
        { district: regex },
        { village: regex },
        { propertyNo: regex },
      ];
    }

    const total = await TSRInitiation.countDocuments(query);

    const records = await TSRInitiation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: records,
      pagination: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. GET BY ID
const getTSRInitiationById = async (req, res) => {
  try {
    const record = await TSRInitiation.findById(req.params.id);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. UPDATE
const updateTSRInitiation = async (req, res) => {
  try {
    const data = { ...req.body };

    const existing = await TSRInitiation.findById(req.params.id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    if (data.bank && !SUPPORTED_BANKS.includes(data.bank)) {
      return res.status(400).json({
        success: false,
        message: `Invalid bank. Must be one of: ${SUPPORTED_BANKS.join(", ")}`,
      });
    }

    // Ref No is never directly editable by the client.
    // Only regenerate it if the bank is actually changing (and a bank is set) —
    // otherwise leave the existing Ref No untouched.
    delete data.refNo;
    if (data.bank && data.bank !== existing.bank) {
      data.refNo = await generateRefNo(data.bank);
    }

    const updated = await TSRInitiation.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. DELETE
// Note: report/draft generation and the other TSR sections are on hold, so
// there is nothing else linked to a TSRInitiation record right now — a
// plain delete is sufficient. The Ref No counter is intentionally NOT
// touched here — numbers are never reused, per requirement.
const deleteTSRInitiation = async (req, res) => {
  try {
    const record = await TSRInitiation.findByIdAndDelete(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const previewRefNo = async (req, res) => {
  try {
    const bank = req.params.bank;

    const code = BANK_CODE_MAP[bank];

    if (!code) {
      return res.json({
        success: true,
        refNo: "",
      });
    }

    const counter = await Counter.findById(code);

    const nextSeq = (counter?.seq || 0) + 1;

    const refNo = `${code}${String(nextSeq).padStart(2, "0")}`;

    res.json({
      success: true,
      refNo,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  uploadBulkFiles,
  previewRefNo, // <-- ADD
  createTSRInitiation,
  getTSRInitiations,
  getTSRInitiationById,
  updateTSRInitiation,
  deleteTSRInitiation,
};