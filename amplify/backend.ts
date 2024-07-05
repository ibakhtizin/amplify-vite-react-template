import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
// // import { stripeWebhook } from './functions/stripe/resource';
// import { Stack } from "aws-cdk-lib";
// import {
//   Cors,
//   LambdaIntegration,
//   RestApi,
// } from "aws-cdk-lib/aws-apigateway";

defineBackend({
  auth,
  data,
});
