/**
 * tsrDraftRoutes.js
 * -----------------
 * Routes for the TSR Draft generation feature (TSR Drafting page).
 *
 * Base URL: /api/tsr-draft
 *
 * GET /generate/:id
 *   Fetches the saved TSRInitiation record by ID and returns all data
 *   needed by the frontend template engine to compile the final PDF.
 */

const express = require("express");
const router = express.Router();
const { generateDraft } = require("../controllers/tsrDraftController");
const { protect } = require("../middleware/authMiddleware");

// GET: Fetch compiled TSR data for draft generation
router.get("/generate/:id", protect, generateDraft);

module.exports = router;
