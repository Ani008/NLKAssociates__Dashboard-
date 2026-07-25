const express = require("express");
const router = express.Router();
const {
  uploadBulkFiles,
  createTSRInitiation,
  getTSRInitiations,
  getTSRInitiationById,
  updateTSRInitiation,
  deleteTSRInitiation,
} = require("../controllers/tsrInitiationController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// POST: Bulk drag-and-drop file upload (does not save to DB — returns file info
// for the frontend to attach to `bulkFiles` on create/update)
router.post("/upload-bulk", protect, upload.array("files", 30), uploadBulkFiles);

// CRUD operations
router.post("/create", protect, createTSRInitiation);
router.get("/list", protect, getTSRInitiations);
router.get("/:id", protect, getTSRInitiationById);
router.put("/:id", protect, updateTSRInitiation);
router.delete("/:id", protect, deleteTSRInitiation);

module.exports = router;
