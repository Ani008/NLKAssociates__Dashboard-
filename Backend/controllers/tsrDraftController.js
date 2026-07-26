/**
 * tsrDraftController.js
 * ---------------------
 * Handles the "Generate Draft" action in TSR Drafting.
 * Fetches the saved TSR Initiation record by ID and returns all fields
 * required by the frontend template engine (tsrTemplateEngine.js) to
 * compile the final PDF document.
 *
 * Route:  GET /api/tsr-draft/generate/:id
 * Access: Protected (requires valid JWT token)
 */

const TSRInitiation = require("../models/TSRInitiation");

/**
 * generateDraft
 * -------------
 * Looks up the TSRInitiation document by its MongoDB _id.
 * Returns the full record so the frontend template engine can
 * substitute Part I–IV descriptions directly into the PDF template.
 */
const generateDraft = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await TSRInitiation.findById(id).lean();

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "TSR Initiation record not found. Please check the selected case.",
      });
    }

    // Build the payload the template engine expects.
    // part1Desc → PART I  (Property Details)
    // part2Desc → PART II (List of Documents Scrutinised)
    // part3Desc → PART III (Flow of Title)
    // part4Desc → PART IV (Evidence of Title)
    const draftPayload = {
      // ── Identity fields ──────────────────────────────────────────────
      _id:             record._id,
      refNo:           record.refNo           || "",
      appId:           record.appId           || "",
      applicant:       record.applicant       || "",
      coApplicant:     record.coApplicant     || "",
      author:          record.author          || "",
      bank:            record.bank            || "",
      transactionType: record.transactionType || "",
      branchOffice:    record.branchOffice    || "",
      village:         record.village         || "",
      district:        record.district        || "",
      propertyNo:      record.propertyNo      || "",

      // ── Part descriptions (Staff 3 entries) ──────────────────────────
      // These are used by tsrTemplateEngine.js to populate PART I–IV.
      part1Desc: record.part1Desc || "", // → PART I  : Property Details
      part2Desc: record.part2Desc || "", // → PART II : List of Documents
      part3Desc: record.part3Desc || "", // → PART III: Flow of Title
      part4Desc: record.part4Desc || "", // → PART IV : Evidence of Title

      // ── Additional custom parts (Part V, VI, VII…) ───────────────────
      // Each item: { partLabel, partTitle, content }
      // Appended after PART IV in the generated PDF.
      additionalParts: record.additionalParts || [],

      // ── Uploaded documents (Staff 1 attachments) ─────────────────────
      bulkFiles: record.bulkFiles || [],

      // ── Timestamps ───────────────────────────────────────────────────
      initiationDate: record.createdAt,
      createdAt:      record.createdAt,
      updatedAt:      record.updatedAt,

      // ── Legacy sub-model stubs (kept for backward compatibility with
      //    older records that used the complex sub-model approach).
      //    The template engine checks part1Desc first; these only fire
      //    when the description is empty. ─────────────────────────────
      documentList:   [],
      titleFlow:      [],
      titleEvidence:  [],
      otherProvision: null,
      waitingReportId: null,
    };

    return res.status(200).json({
      success: true,
      data: draftPayload,
    });
  } catch (error) {
    console.error("generateDraft error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate draft. Please try again.",
    });
  }
};

module.exports = { generateDraft };
