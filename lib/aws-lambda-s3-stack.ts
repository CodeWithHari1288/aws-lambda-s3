import * as cdk from 'aws-cdk-lib';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsLambdaS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaS3= new cdk.aws_lambda.Function(this,"S3LambdaHandler" , {
      runtime : cdk.aws_lambda.Runtime.NODEJS_20_X,
      code :  cdk.aws_lambda.Code.fromAsset(path.join(__dirname,'/../s3')),
      handler : "lambda_handler_s3.handler",
      allowPublicSubnet: true,
      timeout : cdk.Duration.seconds(10)
     }
    );
    
    
      //Change this if desired
      const BUCKET_NAME = 's3-bucket-dummy'

      // S3 bucket
      const bucket = new Bucket(this, BUCKET_NAME, {
        bucketName: "test"+Math.random().toString(12),
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      const dynamoDBTable = new Table(this, "DummyDynamoDB", {
      tableName: "s3putstreeam",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      }
    });

        lambdaS3.addToRolePolicy(
           new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['dynamodb:PutItem'],
            resources: [
              dynamoDBTable.tableArn,
              ],
            }),
         );

    
    // Event Source Mapping S3 -> Lambda
    const s3PutEventSource = new S3EventSource(bucket, {
      events: [
        EventType.OBJECT_CREATED_PUT
      ]
    });
    lambdaS3.addEventSource(s3PutEventSource);  
    
  }
}
