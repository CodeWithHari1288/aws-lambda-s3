import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from 'stream';



export const handler = async () => {
   
        const s3 = new S3Client({ region: process.env.region });

        const streamToString = async (stream: Readable): Promise<string> =>
        new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        stream.on('error', reject);
        });

        const accessPointArn = process.env.ACCESS_POINT_ARN!;
        const key = 's3test.txt'; 

        const response = await s3.send(new GetObjectCommand({
        Bucket: accessPointArn,
        Key: key,
        }));

        const content = await streamToString(response.Body as Readable);
        console.log('File content:', content);

        return {
        statusCode: 200,
        body: content,
        };

}

