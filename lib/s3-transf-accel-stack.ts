// Example using JavaScript:
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';

class S3TransfAccelStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket with Transfer Acceleration enabled
    const bucket = new s3.Bucket(this, 's3transferacceleration', {
      bucketName: 's3transferaccel', // Replace with your desired bucket name
      transferAcceleration: true,
      enforceSSL: true,  // Recommended: Enforce SSL for secure communication
      removalPolicy: RemovalPolicy.DESTROY // For testing, remove bucket on deletion. For production, use RetentionPeriod
    });
  }
}