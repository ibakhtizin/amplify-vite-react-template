import { defineFunction } from '@aws-amplify/backend';

export const stripeWebhook = defineFunction({
    // optionally specify a name for the Function (defaults to directory name)
    name: 'stripe-webhook',
    // optionally specify a path to your handler (defaults to "./handler.ts")
    entry: './stripe-webhook.ts'
});