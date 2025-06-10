#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsLambdaS3Stack } from '../lib/aws-lambda-s3-stack';
import { S3LifecycleCdkStack } from '../lib/s3-lifecycle';
import { S3LifecycleStack } from '../lib/s3-lifecycle-stack';
import { S3KmsEncryptionStack } from '../lib/s3-kms-stack';
import { S3TableStack } from '../lib/s3-table-stack';
import { S3PresignedUrlStack } from '../lib/s3-presigned-url';

const app = new cdk.App();
new AwsLambdaS3Stack(app, 'AwsLambdaS3Stack', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});

new S3LifecycleStack(app, 'S3LifeCycleCheck', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});


new S3KmsEncryptionStack(app, 'S3KMS', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});

// new S3TableStack(app, 'S3Tables', {
//   env: {
//     account : process.env.CDK_DEFAULT_ACCOUNT,
//     region : 'us-east-1'
// }
// });

new S3PresignedUrlStack(app, 'S3Presigned', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});

// S3TableStack

// new NextjsLambdaCdkStack(app, 'NextjsLambdaCdkStack',{
//   env: {
//       account : process.env.CDK_DEFAULT_ACCOUNT,
//       region : 'us-east-1'
//   }
// });