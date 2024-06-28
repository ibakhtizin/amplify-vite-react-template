import { defineBackend } from '@aws-amplify/backend';
import {
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { stripeWebhook } from './functions/stripe/resource';

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
const stripeWebhookPath = myRestApi.root.addResource("stripe-webhook", {});

// add methods you would like to create to the resource path
stripeWebhookPath.addMethod("GET", lambdaIntegration);
stripeWebhookPath.addMethod("POST", lambdaIntegration);

// add a proxy resource path to the API
stripeWebhookPath.addProxy({
  anyMethod: true,
  defaultIntegration: lambdaIntegration,
});