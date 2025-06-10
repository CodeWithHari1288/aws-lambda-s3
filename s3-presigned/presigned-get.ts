import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: 'us-east-1' });

export const handler = async (event: any) => {
  const key = event.queryStringParameters?.key || 'test-presigned-s3.txt';

  if (!key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'key' parameter" }),
    };
  }

  const command = new GetObjectCommand({
    Bucket: 's3presign-test',
    Key: 'test-presigned-s3.txt',
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 600 });
    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err }),
    };
  }
};
