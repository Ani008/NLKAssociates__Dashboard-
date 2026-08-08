const XLSX = require("xlsx");
const MasterDB = require("../models/MasterDB");

exports.uploadMasterExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }

    console.log(`[MasterDB Upload] Received file: ${req.file.originalname} (${req.file.path})`);

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      console.error("[MasterDB Upload] Workbook has no sheets");
      return res.status(400).json({
        success: false,
        message: "The uploaded file has no sheets",
      });
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`[MasterDB Upload] Parsed ${rows.length} row(s) from sheet "${sheetName}"`);

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No data rows found in the sheet. Make sure the header row matches the template and at least one row of data is filled in below it.",
      });
    }

    // No restrictions on any field's value - whatever the user has typed in the
    // sheet is accepted and stored as-is (just trimmed to a plain string).
    const formattedData = rows.map((row) => ({
      author: String(row["Author"] ?? "").trim(),
      applicationNo: String(row["Application No"] ?? "").trim(),
      branch: String(row["Branch"] ?? "").trim(),

      applicant: row["Applicant"]
        ? String(row["Applicant"]).split(",").map((item) => item.trim()).filter(Boolean)
        : [],

      coApplicant: row["Co-Applicants"]
        ? String(row["Co-Applicants"]).split(",").map((item) => item.trim()).filter(Boolean)
        : [],

      transactionType: String(row["Transaction Type"] ?? "").trim(),
      propertyDetails: String(row["Property Details"] ?? "").trim(),
      vetAndCTC: String(row["Vet + CTC"] ?? "").trim(),
      ctc: String(row["CTC"] ?? "").trim(),
    }));

    try {
      const inserted = await MasterDB.insertMany(formattedData, { ordered: false });

      console.log(`[MasterDB Upload] Successfully inserted ${inserted.length} record(s)`);

      res.status(200).json({
        success: true,
        message: `${inserted.length} record(s) uploaded successfully`,
      });
    } catch (dbError) {
      // Mongoose bulk-write errors carry per-document details in writeErrors.
      console.error("[MasterDB Upload] Database insert error:", dbError);

      const details =
        dbError.writeErrors?.map((e) => e.errmsg || e.message).join(" | ") ||
        dbError.message;

      res.status(400).json({
        success: false,
        message: `Failed to save records to the database: ${details}`,
      });
    }
  } catch (error) {
    console.error("[MasterDB Upload] Unexpected error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMasterDB = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {};

    if (search.trim()) {
      query.$or = [
        { branch: { $regex: search, $options: "i" } },
        { applicant: { $regex: search, $options: "i" } },
        { coApplicant: { $regex: search, $options: "i" } },
        { transactionType: { $regex: search, $options: "i" } },
        { propertyDetails: { $regex: search, $options: "i" } },
      ];
    }

    const total = await MasterDB.countDocuments(query);

    const data = await MasterDB.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMasterDBById = async (req, res) => {
  try {
    const record = await MasterDB.findById(req.params.id);

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
    console.error("[MasterDB] Fetch by id error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMasterRecord = async (req, res) => {
  try {
    const record = await MasterDB.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    console.log(`[MasterDB] Deleted record ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("[MasterDB] Delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downloadTemplate = async (req, res) => {
  try {
    const headers = [
      "Author",
      "Application No",
      "Branch",
      "Applicant",
      "Co-Applicants",
      "Transaction Type",
      "Property Details",
      "Vet + CTC",
      "CTC"
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    // Set column widths to prevent truncation
    worksheet["!cols"] = [
      { wch: 15 }, // Author
      { wch: 20 }, // Application No
      { wch: 15 }, // Branch
      { wch: 25 }, // Applicant
      { wch: 25 }, // Co-Applicants
      { wch: 20 }, // Transaction Type
      { wch: 40 }, // Property Details
      { wch: 15 }, // Vet + CTC
      { wch: 10 }  // CTC
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=MasterDB_Template.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    console.error("Template download error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};