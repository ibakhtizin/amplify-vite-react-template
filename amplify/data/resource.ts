import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import {stripeCheckoutHandler} from "../functions/stripe-create-checkout-session/resource";

const schema = a.schema({
    RssFeed: a
        .model({
            url: a.string().required(),
            title: a.string(),
            description: a.string(),
            lastUpdated: a.datetime(),
            feedLastUpdated: a.datetime(),
            forwardingUrl: a.string(),
            isActive: a.boolean().default(true),
            ownerId: a.string(),
        })
        .authorization((allow) => [
            allow.owner()
        ]),

    UserSubscription: a
        .model({
            userId: a.string().required(),
            isPro: a.boolean().required(),
            expiresAt: a.datetime(),
            stripeCustomerId: a.string(),
        })
        .authorization((allow) => [
            allow.owner()
        ]),



    StripeCheckoutSessionResponse: a.customType({
        sessionId: a.string(),
        url: a.string()
    }),

    // Define your mutation
    stripeCreateCheckoutSession: a
        .mutation()
        .arguments({
            email: a.string().required(),
        })
        .returns(a.ref('StripeCheckoutSessionResponse'))
        .authorization(allow => [allow.authenticated()])
        .handler(a.handler.function(stripeCheckoutHandler))
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
        // API Key is used for a.allow.public() rules
        apiKeyAuthorizationMode: {
            expiresInDays: 30
        },
    },
});