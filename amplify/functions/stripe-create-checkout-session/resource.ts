import { defineFunction, secret } from '@aws-amplify/backend';

// Define the function
export const stripeCheckoutHandler = defineFunction({
    entry: './handler.ts',
    environment: {
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
        STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
    },
})