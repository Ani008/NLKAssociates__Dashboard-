const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadMasterExcel,
  getMasterDB,
  getMasterDBById,
  deleteMasterRecord,
  downloadTemplate,
} = require("../controllers/masterDBController");

router.post(
  "/upload",
  upload.single("file"),
  uploadMasterExcel
);

router.get("/template", downloadTemplate);
router.get("/:id", getMasterDBById);
router.delete("/:id", deleteMasterRecord);
router.get("/", getMasterDB);

module.exports = router;