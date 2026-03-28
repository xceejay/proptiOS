const multer = require("multer");

const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");
const { uploadBuffer, isStorageConfigured } = require("../../services/storage");

const PREFIX = "/uploads";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const sanitizeFolder = (value) =>
  String(value || "uploads")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/*|\/*$/g, "");

const routes = (app) => {
  app.post(
    PREFIX,
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),
    upload.single("file"),
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({
          status: "FAILED",
          description: "No file was provided",
        });
      }

      if (!isStorageConfigured()) {
        return res.status(503).json({
          status: "FAILED",
          description: "S3 storage is not configured",
        });
      }

      try {
        const folder = req.body.folder
          ? sanitizeFolder(req.body.folder)
          : `sites/${req.user.site_id}/uploads`;

        const uploadResult = await uploadBuffer({
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          contentType: req.file.mimetype,
          folder,
        });

        return res.status(201).json({
          status: "SUCCESS",
          description: "File uploaded successfully",
          data: {
            key: uploadResult.key,
            url: uploadResult.url,
            size: req.file.size,
            content_type: req.file.mimetype,
            original_name: req.file.originalname,
          },
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to upload file",
        });
      }
    }
  );
};

module.exports = {
  routes,
};
