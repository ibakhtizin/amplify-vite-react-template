import { defineFunction } from '@aws-amplify/backend';

export const stripeWebhook = defineFunction({
    // optionally specify a name for the Function (defaults to directory name)
    name: 'stripe-webhook',
    // optionally specify a path to your handler (defaults to "./handler.ts")
    entry: './stripe-webhook.ts',
    environment: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    }
});