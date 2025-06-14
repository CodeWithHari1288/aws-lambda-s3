import { S3Client, PutObjectCommand, PutObjectCommandInput, GetObjectLegalHoldCommand } from "@aws-sdk/client-s3";


export const handler = async () => {
    const s3 = new S3Client({
        useDualstackEndpoint: true
    });

    const hold = await s3.send(new GetObjectLegalHoldCommand({ 
        Bucket: "s3objectlock-1", 
        Key: "objlock456.txt" }));

      
        console.log("Object Lock  : " + JSON.stringify(hold) );
};

