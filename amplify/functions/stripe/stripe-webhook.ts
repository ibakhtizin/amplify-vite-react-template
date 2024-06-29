import Stripe from 'stripe';
import type { APIGatewayProxyHandler } from "aws-lambda";
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../data/resource';

const client = generateClient<Schema>();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: '2024-06-20'});

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log("event", event);

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not set');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Webhook secret is not configured' })
        };
    }

    const sig = event.headers['Stripe-Signature']!;
    const stripeEvent = stripe.webhooks.constructEvent(event.body!, sig, webhookSecret);

    console.log(stripeEvent.type)
    const { data: subscriptions, errors } = await client.models.UserSubscription.list();
    console.log('subscriptions:', subscriptions);
    console.log('errors:', errors);

    switch (stripeEvent.type) {
        case 'checkout.session.completed':
            console.log(stripeEvent.type)

            // await handleCheckoutSessionCompleted(stripeEvent.data.object as Stripe.Checkout.Session);
            break;
        case 'customer.subscription.updated':
            console.log(stripeEvent.type)
            // await handleSubscriptionChange(stripeEvent.data.object as Stripe.Subscription);
            break;
        default:
            console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return {
        statusCode: 200,
        // Modify the CORS settings below to match your specific requirements
        headers: {
            "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
            "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
        },
        body: JSON.stringify(`Hello from myFunction! ${subscriptions.length}`),
    };
};