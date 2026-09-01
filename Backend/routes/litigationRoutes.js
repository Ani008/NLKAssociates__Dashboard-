const express = require("express");
const router = express.Router();

const {
  createLitigation,
  getLitigations,
  getLitigationById,
  updateLitigation,
  deleteLitigation,
} = require("../controllers/litigationController");

router.post("/", createLitigation);
router.get("/", getLitigations);
router.get("/:id", getLitigationById);
router.put("/:id", updateLitigation);
router.delete("/:id", deleteLitigation);

module.exports = router;
