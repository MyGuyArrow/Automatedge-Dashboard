import 'server-only';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { allowedFileTypes, maxUploadBytes } from '@/lib/constants';

const s3Client = () =>
  new S3Client({
    region: process.env.AWS_REGION || 'eu-west-2',
  });

export const sanitizeFileName = (fileName: string) =>
  fileName
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 160);

export const buildAssetStorageKey = (clientRecordId: string, assetRecordId: string, fileName: string) =>
  `client-assets/${clientRecordId}/${assetRecordId}/${sanitizeFileName(fileName)}`;

export const publicUrlForKey = (key: string) => {
  const base = process.env.S3_PUBLIC_BASE_URL;
  if (!base) return undefined;
  return `${base.replace(/\/$/, '')}/${key.split('/').map(encodeURIComponent).join('/')}`;
};

export const createS3PresignedUploadUrl = async (input: {
  key: string;
  fileType: (typeof allowedFileTypes)[number];
  fileSize: number;
}) => {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) throw new Error('Missing S3_BUCKET_NAME.');
  if (!allowedFileTypes.includes(input.fileType)) throw new Error('File type is not allowed.');
  if (input.fileSize > maxUploadBytes) throw new Error('File is too large.');

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: input.key,
    ContentType: input.fileType,
    ContentLength: input.fileSize,
  });

  return {
    uploadUrl: await getSignedUrl(s3Client(), command, { expiresIn: 15 * 60 }),
    bucket,
    key: input.key,
    publicUrl: publicUrlForKey(input.key),
  };
};
