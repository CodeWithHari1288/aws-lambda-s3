import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

const s3 = new S3Client({});

export const handler = async (event : any) => {
  const bucketName = "s3life06";
  const key = "/1006/testinglifecycle.txt";
  const body = "This is the content of the file";

  const params : PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: "text/plain"
  };

  try {
    await s3.send(new PutObjectCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "File uploaded successfully" }),
    };
  } catch (err) {
    console.error("Error uploading file:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to upload file" }),
    };
  }
};
