import { defineFunction } from '@aws-amplify/backend';

// Define the function
export const stripeCheckoutHandler = defineFunction({
    entry: './handler.ts'
})

