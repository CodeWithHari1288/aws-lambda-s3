import { Stack, StackProps, Duration, RemovalPolicy } from "aws-cdk-lib";
import { InterfaceVpcEndpointAwsService, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Bucket, CfnAccessPoint } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import path = require("path");

export class S3AccessPtLambdaStack extends Stack {
constructor(scope: Construct, id: string, props?: StackProps) {
super(scope, id, props);


        const bucket = new Bucket(this, 'S3AccessPt', {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        bucketName: "s3access-point",
    
        });

        const accessPoint = new CfnAccessPoint(this, 'S3AccessPoint', {
        bucket: bucket.bucketName,
        name: 'lambda-access',
        });

        // const vpc = Vpc.fromLookup(this, 'ImportedVpc', {
        //     vpcName: 'defaultVpc',
        //     isDefault: true
        //     });
        //  vpc.addInterfaceEndpoint('S3InterfaceEndpoint', {
        //     service: InterfaceVpcEndpointAwsService.S3,
        //     subnets: {
        //         subnetType: SubnetType.PRIVATE_ISOLATED,
        //     },
        //     });

        const lambdaAccessPoint = new Function(this, 'S3AccessPointLambda', {
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset(path.join(__dirname, '../accesspoint')),
            handler: 's3-accesspoint-handler.handler',
            environment: {
                ACCESS_POINT_ARN: `arn:aws:s3:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:accesspoint/lambda-access`,
            },
            timeout: Duration.seconds(20),
        
        });


        // Grant Lambda permission to access the access point
        lambdaAccessPoint.addToRolePolicy(new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: ['*'],
        }));


}
}