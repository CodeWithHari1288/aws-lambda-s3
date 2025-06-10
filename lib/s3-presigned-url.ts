import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';

export class S3PresignedUrlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const bucket = new s3.Bucket(this, 'S3PresignedBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: 's3presign-test'
    });

    // Lambda Function
    const generateUrlFn = new lambda.Function(this, 'S3GeneratePresignedUrlLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'presigned-url.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../s3-presigned')),
      environment: {
        BUCKET_NAME: 's3presign-test',
      },
      timeout: Duration.seconds(10),
    });

    // Grant permissions
    bucket.grantPut(generateUrlFn);

    // API Gateway to trigger Lambda
    const api = new apigateway.RestApi(this, 's3presignedrest', {
      restApiName: 's3 Presigned Rest URL Service'
    });
    const urlResource = api.root.addResource('get-url');
    urlResource.addMethod('GET', new apigateway.LambdaIntegration(generateUrlFn));
  }
}
