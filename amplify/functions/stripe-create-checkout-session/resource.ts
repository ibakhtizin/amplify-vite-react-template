import { defineFunction } from '@aws-amplify/backend';

// Define the function
export const stripeCheckoutHandler = defineFunction({
    entry: './handler.ts',
    environment: {
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
        STRIPE_PRICE_ID: 'price_1PWo9dBKw8nx4YDv3XhF8tOC',
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    },
})