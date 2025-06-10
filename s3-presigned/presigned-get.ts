import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event: any) => {
  const bucket = process.env.BUCKET_NAME!;
  const key = event.queryStringParameters?.key || 'test-presigned-s3.txt';

  const command = new PutObjectCommand({
    Bucket: 's3presign-test',
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: signedUrl }),
  };
};
