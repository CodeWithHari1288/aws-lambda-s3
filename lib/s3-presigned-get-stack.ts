import { Stack, StackProps, Duration, RemovalPolicy, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class S3PresignedGetStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = s3.Bucket.fromBucketArn(this,'s3frombucketname',  
        Fn.importValue('bucketArnGet') 
       );

    const presignLambda = new lambda.Function(this, 'S3PresignLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'presigned-get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../s3-presigned')),
      environment: {
        BUCKET_NAME: 's3presign-test',
        BUCKET_ARN: Fn.importValue('bucketArnGet')
      },
      timeout: Duration.seconds(10),
    });

    bucket.grantRead(presignLambda);
    // bucket.grantReadWrite(presignLambda);

    presignLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [Fn.importValue('bucketArnGet')],
    }));

    // 🔗 API Gateway Integration
    const api = new apigw.RestApi(this, 's3getPresignApi', {
      restApiName: 'S3 get Presign API',
    });

    const presignResource = api.root.addResource('presign');
    presignResource.addMethod('GET', new apigw.LambdaIntegration(presignLambda));
  }
}
