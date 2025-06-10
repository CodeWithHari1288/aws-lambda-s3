import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";


export const handler = async () => {
    const s3 = new S3Client({});


      const file = "1006/testingKMS.txt";

  const command : PutObjectCommandInput ={
    Bucket: "s3kms06",
    Key: file,
    Body: "KMS encrypted file",
    SSEKMSKeyId: process.env.KMS_KEY_ID,
    ServerSideEncryption : "aws:kms"
  };

  try {
    await s3.send(new PutObjectCommand(command));
    return { statusCode: 200, body: "Upload success" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Upload failed" };
  }
};

