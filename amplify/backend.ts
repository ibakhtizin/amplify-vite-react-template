import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { stripeWebhook } from './functions/stripe/resource';
import { Stack } from "aws-cdk-lib";
import {
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";

const backend = defineBackend({
  auth,
  data,
  stripeWebhook,
});

// create a new API stack
const apiStack = backend.createStack("api-stack");

// create a new REST API
const myRestApi = new RestApi(apiStack, "RestApi", {
  restApiName: "myRestApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});

// create a new Lambda integration
const lambdaIntegration = new LambdaIntegration(
    backend.stripeWebhook.resources.lambda
);

// create a new resource path with IAM authorization
const stripePath = myRestApi.root.addResource("stripe", {});

// add methods you would like to create to the resource path
stripePath.addMethod("GET", lambdaIntegration);
stripePath.addMethod("POST", lambdaIntegration);

// add a proxy resource path to the API
stripePath.addProxy({
  anyMethod: true,
  defaultIntegration: lambdaIntegration,
});

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: Stack.of(myRestApi).region,
        apiName: myRestApi.restApiName,
      },
    },
  },
});