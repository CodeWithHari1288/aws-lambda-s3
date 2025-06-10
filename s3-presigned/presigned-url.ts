import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({ region: 'us-east-1' });

export const handler = async (event: any) => {
  const bucket = process.env.BUCKET_NAME!;
  const key = 'testing/test-presigned-s3.txt';

  const command = new PutObjectCommand({
    Bucket: 's3presign-test',
    Key: key,
    // Body: "ABC",
    ContentType: 'text/plain'
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: signedUrl }),
  };
};
