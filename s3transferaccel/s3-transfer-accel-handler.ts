import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const handler = async () => {

    const s3 = new S3Client({
        region: process.env.region,
        useAccelerateEndpoint: true, // ✅ enables s3-accelerate.amazonaws.com
    });

    const bucket = 's3transferaccel-1';
    const key = 'transaccel.txt';
    const body = 'Hello from Lambda with Transfer Acceleration!';

    await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    }));

    console.log('Transfer Acceleration done..');
    return { statusCode: 200, body: 'Successfully Put COmmand Done check CLoud Trial Logs' };
}