import { aws_lambda, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import path = require('path');

export class S3LifecycleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaS3= new aws_lambda.Function(this,"S3LambdaHandler" , {
          runtime : aws_lambda.Runtime.NODEJS_20_X,
          code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../s3lifecycle')),
          handler : "life-handler.handler",
          allowPublicSubnet: true,
          timeout : Duration.seconds(10)
         }
    );

    const bucket = new s3.Bucket(this, 's3life06', {
       bucketName: "s3life06",
       autoDeleteObjects: true, // for dev/test only
       lifecycleRules: [
        // 1. Transition to STANDARD_IA after 30 days
        {
          id: 'move_to_IA',
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: Duration.days(30),
            },
          ],
        },

        // 2. Transition to GLACIER after 60 days
        {
          id: 'move_to_glacier',
          transitions: [
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: Duration.days(60),
            },
          ],
        },

        // 3. Expire objects after 365 days
        {
          id: 'expire_objects',
          expiration: Duration.days(3),
        },

        // 4. Clean up incomplete multipart uploads after 7 days
        {
          id: 'abort_multi_upload',
          abortIncompleteMultipartUploadAfter: Duration.days(30),
        },

        // 5. Noncurrent version transitions (versioning must be enabled)
        {
          id: 'non_current_version',
          noncurrentVersionTransitions: [
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: Duration.days(30),
            },
          ],
          noncurrentVersionExpiration: Duration.days(60),
        },

        // 6. Expire objects with a specific prefix
        {
          id: 'prefix_life',
          expiration: Duration.days(30),
          prefix: 'logs/',
        },

        // 7. Intelligent Tiering example (auto done by S3 after enabled)
        // Note: Lifecycle rules do not directly apply; this is for setup
      ],
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    bucket.grantPut(lambdaS3);
  }
}
