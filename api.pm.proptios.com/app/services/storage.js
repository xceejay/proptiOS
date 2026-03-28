const AWS = require("aws-sdk");
const path = require("path");
const { customAlphabet } = require("nanoid");

const objectId = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  12
);

const trimTrailingSlash = (value) => (value || "").replace(/\/+$/, "");

const normalizeBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const readStorageConfig = () => ({
  bucket: process.env.S3_BUCKET || process.env.BUCKET,
  region: process.env.S3_REGION || process.env.REGION || "auto",
  endpoint: trimTrailingSlash(process.env.S3_ENDPOINT || process.env.ENDPOINT),
  accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID,
  secretAccessKey:
    process.env.S3_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY,
  publicBaseUrl: trimTrailingSlash(process.env.S3_PUBLIC_BASE_URL),
  forcePathStyle: normalizeBoolean(process.env.S3_FORCE_PATH_STYLE, false),
});

const getStorageClient = () => {
  const config = readStorageConfig();

  if (
    !config.bucket ||
    !config.endpoint ||
    !config.accessKeyId ||
    !config.secretAccessKey
  ) {
    throw new Error(
      "S3 storage is not configured. Expected bucket, endpoint, access key and secret."
    );
  }

  const s3 = new AWS.S3({
    endpoint: config.endpoint,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
    s3ForcePathStyle: config.forcePathStyle,
    signatureVersion: "v4",
  });

  return { s3, config };
};

const sanitizeSegment = (value, fallback) => {
  const normalized = String(value || fallback || "uploads")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/*|\/*$/g, "")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/\/{2,}/g, "/");

  return normalized || fallback || "uploads";
};

const sanitizeFileName = (name) => {
  const parsed = path.parse(name || "file");
  const baseName = (parsed.name || "file")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const extension = (parsed.ext || "").toLowerCase().replace(/[^a-z0-9.]/g, "");

  return `${baseName || "file"}${extension}`;
};

const buildObjectKey = (folder, originalName) => {
  const safeFolder = sanitizeSegment(folder, "uploads");
  const safeFileName = sanitizeFileName(originalName);
  return `${safeFolder}/${Date.now()}-${objectId()}-${safeFileName}`;
};

const buildObjectUrl = (config, key, location) => {
  if (config.publicBaseUrl) {
    return `${config.publicBaseUrl}/${key}`;
  }

  if (location) {
    return location;
  }

  if (config.forcePathStyle) {
    return `${config.endpoint}/${config.bucket}/${key}`;
  }

  const endpointHost = config.endpoint.replace(/^https?:\/\//, "");
  return `https://${config.bucket}.${endpointHost}/${key}`;
};

const isStorageConfigured = () => {
  const config = readStorageConfig();
  return Boolean(
    config.bucket &&
      config.endpoint &&
      config.accessKeyId &&
      config.secretAccessKey
  );
};

const uploadBuffer = async ({
  buffer,
  originalName,
  contentType,
  folder,
  metadata,
  cacheControl,
}) => {
  if (!buffer) {
    throw new Error("Cannot upload an empty file.");
  }

  const { s3, config } = getStorageClient();
  const key = buildObjectKey(folder, originalName);

  const result = await s3
    .upload({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
      Metadata: metadata || {},
      CacheControl: cacheControl,
    })
    .promise();

  return {
    bucket: config.bucket,
    key,
    url: buildObjectUrl(config, key, result.Location),
  };
};

const deleteObject = async (key) => {
  if (!key) return;
  const { s3, config } = getStorageClient();
  await s3
    .deleteObject({
      Bucket: config.bucket,
      Key: key,
    })
    .promise();
};

module.exports = {
  deleteObject,
  isStorageConfigured,
  uploadBuffer,
};
