import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class S3PresignedGetStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = s3.Bucket.fromBucketName(this,'s3frombucketname',
        
         's3-get-presign'
       );

    const presignLambda = new lambda.Function(this, 'S3PresignLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'presigned-get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../s3-presigned')),
      environment: {
        BUCKET_NAME: 's3-get-presign',
      },
      timeout: Duration.seconds(10),
    });

    bucket.grantRead(presignLambda);

    presignLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [bucket.arnForObjects('*')],
    }));

    // 🔗 API Gateway Integration
    const api = new apigw.RestApi(this, 's3getPresignApi', {
      restApiName: 'S3 get Presign API',
    });

    const presignResource = api.root.addResource('presign');
    presignResource.addMethod('GET', new apigw.LambdaIntegration(presignLambda));
  }
}
