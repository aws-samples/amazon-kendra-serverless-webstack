import core = require("@aws-cdk/core");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import s3 = require("@aws-cdk/aws-s3");
import iam = require("@aws-cdk/aws-iam");

export class KendraQueryApiStack extends core.Stack {
  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "KendraQueryAPIStore");

    const handler = new lambda.Function(this, "KendraQueryAPIHandler", {
      runtime: lambda.Runtime.NODEJS_10_X, 
      code: lambda.Code.asset("lambda"),
      handler: "kendraQuery.main"
    });

    const statement = new iam.PolicyStatement();
    statement.addActions('kendra:Query');
    statement.addResources(`arn:aws:kendra:${this.region}:${this.account}:index/*`);

    handler.addToRolePolicy(statement);

    bucket.grantReadWrite(handler); 

    const api = new apigateway.RestApi(this, "kendra-query-api", {
      restApiName: "Kendra Query API",
      description: "This service serves kendra query.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS 
      }
    });

    const getIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json":  JSON.stringify({ queryText: "$util.escapeJavaScript($input.params('queryTExt'))", pageNumber: "$util.escapeJavaScript($input.params('pageNumber'))" })
      }
    });

    api.root.addMethod("GET", getIntegration); 
  }
}
