const Litigation = require("../models/Litigation");

// Keep only well-formed file entries coming from the client.
const sanitizeBulkFiles = (files) =>
  (Array.isArray(files) ? files : [])
    .filter((f) => f && f.filePath)
    .map((f) => ({
      originalName: f.originalName || "",
      filePath: f.filePath,
      fileSize: Number(f.fileSize) || 0,
      mimeType: f.mimeType || "",
      ...(f.uploadedAt && { uploadedAt: f.uploadedAt }),
    }));

// ---------- CREATE ----------
// POST /api/litigation
exports.createLitigation = async (req, res) => {
  try {
    const {
      nlkFileNo,
      clientName,
      caseType,
      caseNo,
      courtName,
      plaintiff,
      defendant,
      nextDate,
      bulkFiles,
    } = req.body;

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client Name is required",
      });
    }

    const record = await Litigation.create({
      author: req.user?.name || req.body.author || "",
      nlkFileNo: (nlkFileNo || "").trim(),
      clientName: (clientName || "").trim(),
      caseType: (caseType || "").trim(),
      caseNo: (caseNo || "").trim(),
      courtName: (courtName || "").trim(),
      plaintiff: (plaintiff || "").trim(),
      defendant: (defendant || "").trim(),
      nextDate: nextDate ? new Date(nextDate) : null,
      bulkFiles: sanitizeBulkFiles(bulkFiles),
    });

    console.log(`[Litigation] Created record ${record._id}`);

    res.status(201).json({
      success: true,
      message: "Litigation record saved successfully",
      data: record,
    });
  } catch (error) {
    console.error("[Litigation] Create error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- READ (list, paginated + searchable) ----------
// GET /api/litigation?page=1&limit=10&search=xxx
exports.getLitigations = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {};

    if (search.trim()) {
      query.$or = [
        { nlkFileNo: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
        { caseType: { $regex: search, $options: "i" } },
        { caseNo: { $regex: search, $options: "i" } },
        { courtName: { $regex: search, $options: "i" } },
        { plaintiff: { $regex: search, $options: "i" } },
        { defendant: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Litigation.countDocuments(query);

    const data = await Litigation.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        pages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    console.error("[Litigation] Fetch list error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- READ (single) ----------
// GET /api/litigation/:id
exports.getLitigationById = async (req, res) => {
  try {
    const record = await Litigation.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("[Litigation] Fetch by id error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- UPDATE ----------
// PUT /api/litigation/:id
exports.updateLitigation = async (req, res) => {
  try {
    const {
      nlkFileNo,
      clientName,
      caseType,
      caseNo,
      courtName,
      plaintiff,
      defendant,
      nextDate,
      bulkFiles,
    } = req.body;

    const update = {
      ...(nlkFileNo !== undefined && { nlkFileNo: nlkFileNo.trim() }),
      ...(clientName !== undefined && { clientName: clientName.trim() }),
      ...(caseType !== undefined && { caseType: caseType.trim() }),
      ...(caseNo !== undefined && { caseNo: caseNo.trim() }),
      ...(courtName !== undefined && { courtName: courtName.trim() }),
      ...(plaintiff !== undefined && { plaintiff: plaintiff.trim() }),
      ...(defendant !== undefined && { defendant: defendant.trim() }),
      ...(nextDate !== undefined && {
        nextDate: nextDate ? new Date(nextDate) : null,
      }),
      ...(bulkFiles !== undefined && { bulkFiles: sanitizeBulkFiles(bulkFiles) }),
    };

    const record = await Litigation.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    console.log(`[Litigation] Updated record ${record._id}`);

    res.status(200).json({
      success: true,
      message: "Litigation record updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("[Litigation] Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- DELETE ----------
// DELETE /api/litigation/:id
exports.deleteLitigation = async (req, res) => {
  try {
    const record = await Litigation.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    console.log(`[Litigation] Deleted record ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("[Litigation] Delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
