import { Fn, Stack, StackProps } from "aws-cdk-lib";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { aws_s3express as s3express } from 'aws-cdk-lib';
import { CfnDirectoryBucket } from "aws-cdk-lib/aws-s3express";



export class DirectoryBucketStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
     
     const directoryBucket = new CfnDirectoryBucket(this, 'S3DirBucket', {
        bucketName: 's3dirbucket12988--use1-az4--x-s3', // replace with your unique name
        dataRedundancy: 'SingleAvailabilityZone',
        locationName: 'use1-az4'
    });

  }
  
}