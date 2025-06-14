#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsLambdaS3Stack } from '../lib/aws-lambda-s3-stack';
import { S3LifecycleCdkStack } from '../lib/s3-lifecycle';
import { S3LifecycleStack } from '../lib/s3-lifecycle-stack';
import { S3KmsEncryptionStack } from '../lib/s3-kms-stack';
import { S3TableStack } from '../lib/s3-table-stack';
import { S3PresignedUrlStack } from '../lib/s3-presigned-url';
import { S3PresignedGetStack } from '../lib/s3-presigned-get-stack';
import { DirectoryBucketStack } from '../lib/s3-directory-buckets-stack';
import { S3ObjectLockStack } from '../lib/s3-object-lock-stack';
import { S3TransfAccelStack } from '../lib/s3-transf-accel-stack';
import { S3AccessPtLambdaStack } from '../lib/s3-access-point-stack';

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

new S3ObjectLockStack(app, 'S3ObjectLockStack', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});

new S3TransfAccelStack(app, 'S3TransAcceleration', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});


new S3AccessPtLambdaStack(app, 'S3AccessPtLambdaStack', {
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

new DirectoryBucketStack(app, 'DirectoryBucketStack', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});


const stackPut = new S3PresignedUrlStack(app, 'S3Presigned', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});


const stackGet = new S3PresignedGetStack(app, 'S3PresignedGetStack', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});

stackGet.addDependency(stackPut);

// S3TableStack

// new NextjsLambdaCdkStack(app, 'NextjsLambdaCdkStack',{
//   env: {
//       account : process.env.CDK_DEFAULT_ACCOUNT,
//       region : 'us-east-1'
//   }
// });

// 

