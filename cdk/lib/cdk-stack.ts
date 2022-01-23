import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  CfnOutput,
  aws_s3 as s3,
  aws_s3_deployment as s3Deployment,
  aws_cloudfront as cloudfront,
  aws_lambda as lambda,
  aws_apigateway as apigw,
  aws_secretsmanager as secretsManager,
  aws_route53 as route53,
  aws_route53_targets as targets,
  aws_route53_patterns as patterns,
  aws_certificatemanager as certificateManager,
  aws_iam as iam,
  aws_logs as logs,
  aws_cloudwatch as cloudwatch,
} from 'aws-cdk-lib';

import {SES_EMAIL_FROM, SES_REGION} from '../../env';

const SITE_URL = 'stephandmattswedding.co.uk'

export class WeddingTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3
    const weddingTestBucket = new s3.Bucket(this, 'WeddingTestBucket', {
      // publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    new CfnOutput(this, 'WeddingTestBucketDomainName', {
      value: weddingTestBucket.bucketDomainName,
    });

    new CfnOutput(this, 'WeddingTestBucketWebsiteUrl', {
      value: weddingTestBucket.bucketWebsiteUrl,
    });

    // Route 53 Hosted Zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'WeddingTestHostedZone', {
      domainName: SITE_URL,
    });

    // Certificate Manager
    const certificate = new certificateManager.DnsValidatedCertificate(this, 'WeddingTestCertificate', {
      region: 'us-east-1',
      hostedZone,
      domainName: SITE_URL,
      validation: certificateManager.CertificateValidation.fromDns(hostedZone),
    });

    // CloudFront
    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'OAI');

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'WeddingTestDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: weddingTestBucket,
            originAccessIdentity: cloudFrontOAI
          },
          behaviors: [ {isDefaultBehavior: true} ]
        }
      ],
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [SITE_URL],
        securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
        sslMethod: cloudfront.SSLMethod.SNI
      })
    })

    weddingTestBucket.grantRead(cloudFrontOAI.grantPrincipal);

    // S3 Deployment
    new s3Deployment.BucketDeployment(this, 'WeddingTestBucketDeployment', {
      sources: [s3Deployment.Source.asset('../build')],
      destinationBucket: weddingTestBucket,
      distribution,
      distributionPaths: ['/*'],
    })

    // Route 53 A Record
    new route53.ARecord(this, 'Alias', {
      zone: hostedZone,
      recordName: SITE_URL,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });

    new patterns.HttpsRedirect(this, 'wwwToNonWww', {
      recordNames: [`www.${SITE_URL}`],
      targetDomain: SITE_URL,
      zone: hostedZone
    })

    // Create an Output
    new CfnOutput(this, 'CloudFrontUrl', {
      value: distribution.distributionDomainName,
    });

    // Secrets Manager
    const testingGoogleJson2Secrets = secretsManager.Secret.fromSecretNameV2(
      this,
      'MyTestSecret',
      'testingGoogleJson2',
    );

    //
    //
    //
    //
    //
    //
    // Lambda
    const testHandler = new lambda.Function(this, 'TestingHandler', {
      environment: {
        CLIENT_EMAIL: testingGoogleJson2Secrets.secretValueFromJson('client_email').toString(),
        PRIVATE_KEY: testingGoogleJson2Secrets.secretValueFromJson('private_key').toString(),
      },
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'testing.handler',
      logRetention: logs.RetentionDays.ONE_DAY
    })

    
    // Cloudwatch Alarms
    const TestingHandlerErrors = testHandler.metricErrors({
      period: Duration.minutes(1)
    });

    new cloudwatch.Alarm(this, 'TestingHandler-errors-alarm', {
      metric: TestingHandlerErrors,
      threshold: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      alarmDescription: 'Alarm if the SUM of Errors is greater than or equal to the threshold (1) for 1 evaluation period',
    });

    const TestingHandlerInvocation = testHandler.metricInvocations({
      period: Duration.minutes(5),
    });

    new cloudwatch.Alarm(this, 'TestingHandler-invocations-alarm', {
      metric: TestingHandlerInvocation,
      threshold: 10,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      alarmDescription: 'Alarm if the SUM of Lambda invocations is greater than or equal to the threshold (10) for 1 evaluation period',
    });
    


    //
    //
    //
    //
    //
    //

    /*
    const rsvpHandler = new lambda.Function(this, 'WeddingTestRsvpHandler', {
      environment: {
        CLIENT_EMAIL: testingGoogleJson2Secrets.secretValueFromJson('client_email').toString(),
        PRIVATE_KEY: testingGoogleJson2Secrets.secretValueFromJson('private_key').toString(),
      },
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'rsvp.handler',
      logRetention: logs.RetentionDays.FIVE_DAYS,
    })

    const contactHandler = new lambda.Function(this, 'WeddingTestContactHandler', {
      environment: {
        // SES data??
      },
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'contact.handler',
      logRetention: logs.RetentionDays.FIVE_DAYS,
    })


    contactHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ses:SendEmail',
          'ses:SendRawEmail',
        ],
        resources: ['*'],
        // Try this again:
        // resources: [
        //   `arn:aws:ses:${SES_REGION}:${
        //     cdk.Stack.of(this).account
        //   }:identity/${SES_EMAIL_FROM}`,
        // ],
      }),
    );
    */

    // API Gateway
    const api = new apigw.RestApi(this, 'WeddingTestEndpoint', {
      description: 'Wedding test api gateway',
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST'],
        allowCredentials: true,
        allowOrigins: [
          'http://localhost:3000',
          'https://d15bylhfejzrvc.cloudfront.net',
          'https://stephandmattswedding.co.uk'
        ],
      },
    })


    //
    //
    //
    //
    //
    //
    // test
    api.root.addMethod('POST', new apigw.LambdaIntegration(testHandler));
    //
    //
    //
    //
    //
    //

    // rsvp
    /*
    const rsvp = api.root.addResource('rsvp');
    rsvp.addMethod('POST', new apigw.LambdaIntegration(rsvpHandler));

    //contact
    const contact = api.root.addResource('contact');
    contact.addMethod('POST', new apigw.LambdaIntegration(contactHandler));
    */

    new CfnOutput(this, 'apiUrl', {value: api.url});
  }
}
