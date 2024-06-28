import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { stripeWebhook } from './functions/stripe/resource';

defineBackend({
  auth,
  data,
  stripeWebhook,
});