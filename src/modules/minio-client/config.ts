export const config = {
  MINIO_ENDPOINT: 'localhost',
  MINIO_PORT: 9000,
  MINIO_ACCESSKEY: process.env.S3_ACCESS_KEY,
  MINIO_SECRETKEY: process.env.S3_SECRET_KEY,
  MINIO_BUCKET: 'recipes',
};
