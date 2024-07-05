import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import {stripeCheckoutHandler} from "../functions/stripe-create-checkout-session/resource";
import RssFeed from "./models/rss-feed";
import RssFeedItem from "./models/rss-feed-item";

const schema = a.schema({
    RssFeed,
    RssFeedItem,
    StripeCheckoutSessionResponse: a.customType({
        sessionId: a.string(),
        url: a.string()
    }),
    // Define new model Named RssFeedItemAIResponse

    // Define your mutation
    stripeCreateCheckoutSession: a
        .mutation()
        .arguments({
            host: a.string().required(),
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