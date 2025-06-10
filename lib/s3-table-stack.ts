import { aws_lambda, aws_s3tables, Duration, RemovalPolicy, Stack, StackProps,aws_glue as glue } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3tables as s3tables } from 'aws-cdk-lib';
import path = require('path');
import { CfnTableBucketProps } from 'aws-cdk-lib/aws-s3tables';



export class S3TableStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaS3= new aws_lambda.Function(this,"S3TablesHandler" , {
          runtime : aws_lambda.Runtime.NODEJS_20_X,
          code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../s3tables')),
          handler : "s3table-handler.handler",
          allowPublicSubnet: true,
          timeout : Duration.seconds(10)
         }
    );



    // Glue Database
    const database: glue.CfnDatabase = new glue.CfnDatabase(this, 's3gluedb', {
             catalogId: process.env.CDK_DEFAULT_ACCOUNT!,
             databaseName: "s3tablesglue",
             databaseInput: {
                name: "s3tablesglue",

             }

    });

    // Glue Table
    new glue.CfnTable(this, 's3tablesglue', {
     catalogId :process.env.CDK_DEFAULT_ACCOUNT!,
     databaseName: "s3tablesglue",
     tableInput : {
       name : "s3tablesglue",
       tableType: "EXTERNAL_TABLE",
     },
    });

        // The code below shows an example of how to instantiate this type.
        // The values are placeholders you should change.
        const cfnTableBucket: CfnTableBucketProps = new s3tables.CfnTableBucket(this, 's3tablestesting', {
        tableBucketName: 's3tabletesting',
        // the properties below are optional
        // encryptionConfiguration: {
        //     kmsKeyArn: 'kmsKeyArn',
        //     sseAlgorithm: 'sseAlgorithm',
        // },
       
        unreferencedFileRemoval: {
            noncurrentDays: 2,
            status: 'Enabled',
            unreferencedDays: 3,
        },
        });  }
}
