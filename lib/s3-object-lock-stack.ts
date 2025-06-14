import { aws_lambda, CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { ReadWriteType, Trail } from 'aws-cdk-lib/aws-cloudtrail';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import path = require('path');

export class S3ObjectLockStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

        const kmsKey = new Key(this, 's3kmsobjlock', {
        enableKeyRotation: true,
        });

        const bucket = new s3.Bucket(this, 's3objlockencrp', {
        encryption: s3.BucketEncryption.KMS,
        encryptionKey: kmsKey,
        bucketName: "s3objectlock-1",
        removalPolicy : RemovalPolicy.DESTROY,
        objectLockEnabled: true,
        versioned: true        
        });

            
       const lambdaS3= new aws_lambda.Function(this,"s3kmslambda" , {
                runtime : aws_lambda.Runtime.NODEJS_20_X,
                code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../s3objectlock')),
                handler : 's3objlock-handler.handler',
                allowPublicSubnet: true,
                timeout : Duration.seconds(10),
                environment: {
                    KMS_KEY_ID: kmsKey.keyId,
                    KMS_KEY_ARN: kmsKey.keyArn, // optional
                },
               }
          );
          
           lambdaS3.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
            's3:GetObjectLegalHold',
            's3:ListBucket'
            ],
            resources: [
            'arn:aws:s3:::s3objectlock-1',
            'arn:aws:s3:::s3objectlock-1/*',
            ],
            }));

            // Grant KMS permissions
            kmsKey.grantEncryptDecrypt(lambdaS3); // grants kms:Encrypt, Decrypt, etc.

            const logBucket = new s3.Bucket(this, 'CloudTrialLoggingS3', {
                removalPolicy: RemovalPolicy.DESTROY,
                autoDeleteObjects: true,
                });

            const trail = new Trail(this, 'S3CloudTrial', {
                bucket: logBucket,
                });

                trail.addS3EventSelector(
                [{ bucket: bucket }],
                { readWriteType: ReadWriteType.ALL,
                 }
                );

  }
}
