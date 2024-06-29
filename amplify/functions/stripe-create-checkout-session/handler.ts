// amplify/data/stripe-checkout-handler/handler.ts
import type { Schema } from '../../data/resource'
import Stripe from 'stripe';
// import { getCurrentUser } from 'aws-amplify/auth';
import {AppSyncIdentityCognito} from "aws-lambda/trigger/appsync-resolver";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: '2024-06-20'});

export const handler: Schema["stripeCreateCheckoutSession"]["functionHandler"] = async (event, context) => {
    console.log('Stripe Create Checkout Session Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));

    const frontendUrl = process.env.FRONTEND_URL;

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
            cancel_url: `${frontendUrl}/checkout-cancelled`,
            client_reference_id: identity.username,
            customer_email: event.arguments.email,
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
