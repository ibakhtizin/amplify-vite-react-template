// amplify/data/stripe-checkout-handler/handler.ts
import type { Schema } from '../../data/resource'

export const handler: Schema["stripeCreateCheckoutSession"]["functionHandler"] = async (event, context) => {
    console.log('Stripe Create Checkout Session Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));

    // For now, return a dummy response
    return {
        sessionId: 'dummy-session-id',
        url: 'https://apple.com'
    };
};