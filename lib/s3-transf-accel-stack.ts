// Example using JavaScript:
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { ReadWriteType, Trail } from 'aws-cdk-lib/aws-cloudtrail';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path = require('path');
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';


export class S3TransfAccelStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket with Transfer Acceleration enabled
    const bucket = new s3.Bucket(this, 's3transferacceleration', {
      bucketName: 's3transferaccel-1', // Replace with your desired bucket name
      transferAcceleration: true,
      enforceSSL: true,  // Recommended: Enforce SSL for secure communication
      removalPolicy: RemovalPolicy.DESTROY // For testing, remove bucket on deletion. For production, use RetentionPeriod
    });

       const s3transAccellLambda = new lambda.Function(this, 'S3TransferAccelLambda', {
          runtime: lambda.Runtime.NODEJS_20_X,
          handler: 's3-transfer-accel-handler.handler',
          code: lambda.Code.fromAsset(path.join(__dirname, '../s3transferaccel')),
          timeout: Duration.seconds(10),
        });

         s3transAccellLambda.addToRolePolicy(new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                    's3:PutObject',
                    's3:ListBucket'
                    ],
                    resources: [
                    'arn:aws:s3:::s3transferaccel-1/*',
                    ],
                    }));

    const logBucket = new s3.Bucket(this, 'CloudTrialAccelLogging', {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        });

    const trail = new Trail(this, 'S3TransAccel', {
        bucket: logBucket,
        });

        trail.addS3EventSelector(
        [{ bucket: bucket }],
        { readWriteType: ReadWriteType.ALL,
        }
        );


    }
}