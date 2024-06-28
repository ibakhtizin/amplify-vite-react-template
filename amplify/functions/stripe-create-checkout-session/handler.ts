// amplify/data/stripe-checkout-handler/handler.ts
import type { Schema } from '../../data/resource'
import Stripe from 'stripe';
import {AppSyncIdentityCognito} from "aws-lambda/trigger/appsync-resolver";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20' // Use the latest API version
});

export const handler: Schema["stripeCreateCheckoutSession"]["functionHandler"] = async (event, context) => {
    console.log('Stripe Create Checkout Session Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));

    const frontendUrl = process.env.FRONTEND_URL ?? 'https://google.com';

    try {
        const identity = event?.identity as AppSyncIdentityCognito;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID!,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${frontendUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/subscription-cancelled`,
            client_reference_id: identity.username, // Assuming you're passing userId in the context
        });

        return {
            sessionId: session.id,
            url: session.url!
        };
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        throw new Error('Failed to create checkout session');
    }
};
