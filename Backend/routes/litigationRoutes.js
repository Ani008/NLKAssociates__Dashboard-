const express = require("express");
const router = express.Router();

const {
  createLitigation,
  getLitigations,
  getLitigationById,
  updateLitigation,
  deleteLitigation,
} = require("../controllers/litigationController");

// Reuse the exact same upload handler + multer middleware as the
// Non-Litigation (TSR Initiation) bulk upload.
const { uploadBulkFiles } = require("../controllers/tsrInitiationController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");

// POST: drag-and-drop upload. Does not write to the DB — returns file info
// which the form attaches to `bulkFiles` on create/update.
// NOTE: must be declared before "/:id" routes.
router.post("/upload-bulk", protect, upload.array("files", 30), uploadBulkFiles);

router.post("/", createLitigation);
router.get("/", getLitigations);
router.get("/:id", getLitigationById);
router.put("/:id", updateLitigation);
router.delete("/:id", deleteLitigation);

module.exports = router;
