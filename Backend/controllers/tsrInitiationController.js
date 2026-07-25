const TSRInitiation = require("../models/TSRInitiation");
const Counter = require("../models/Counter");

const { SUPPORTED_BANKS } = TSRInitiation;

// Maps a full bank name (as stored/selected on the frontend) to the short
// prefix used in the auto-generated Ref No. Keep in sync with
// models/TSRInitiation.js -> SUPPORTED_BANKS.
const BANK_CODE_MAP = {
  "ICICI Bank": "ICICI",
  "IHFC Bank": "IHFC",
  "AHFC Bank": "AHFC",
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
    { new: true, upsert: true }
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
      return res.status(400).json({ success: false, message: "No files uploaded" });
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

// 3. GET ALL
const getTSRInitiations = async (req, res) => {
  try {
    const records = await TSRInitiation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. GET BY ID
const getTSRInitiationById = async (req, res) => {
  try {
    const record = await TSRInitiation.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
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
      return res.status(404).json({ success: false, message: "Record not found" });
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

    const updated = await TSRInitiation.findByIdAndUpdate(req.params.id, data, { new: true });
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
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  uploadBulkFiles,
  createTSRInitiation,
  getTSRInitiations,
  getTSRInitiationById,
  updateTSRInitiation,
  deleteTSRInitiation,
};
