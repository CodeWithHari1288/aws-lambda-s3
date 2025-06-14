import { aws_lambda, CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import path = require('path');

export class S3KmsEncryptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

        const kmsKey = new Key(this, 's3kms', {
        enableKeyRotation: true,
        });

        const bucket = new s3.Bucket(this, 's3encryptedbucket', {
        encryption: s3.BucketEncryption.KMS,
        encryptionKey: kmsKey,
        bucketName: "s3kms06",
        removalPolicy : RemovalPolicy.DESTROY
        });

        // new CfnOutput(this, 'KmsKeyOutput', {
        // value: kmsKey.keyId,
        // exportName: 'kmskeyid',
        // });
        
       const lambdaS3= new aws_lambda.Function(this,"s3kmslambda" , {
                runtime : aws_lambda.Runtime.NODEJS_20_X,
                code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../s3kms')),
                handler : 's3kms-handler.handler',
                allowPublicSubnet: true,
                timeout : Duration.seconds(10),
                environment: {
                    KMS_KEY_ID: kmsKey.keyId,
                    KMS_KEY_ARN: kmsKey.keyArn, // optional
                },
               }
          );
          
            // Grant bucket permissions
            bucket.grantReadWrite(lambdaS3); // grants s3:GetObject, s3:PutObject

            // Grant KMS permissions
            kmsKey.grantEncryptDecrypt(lambdaS3); // grants kms:Encrypt, Decrypt, etc.

  }
}
