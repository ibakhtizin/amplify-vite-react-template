import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    Todo: a
        .model({
            content: a.string(),
        })
        .authorization((allow) => [allow.owner()]),

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
            allow.owner(),
        ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
        // API Key is used for a.allow.public() rules
        apiKeyAuthorizationMode: {
            expiresInDays: 30    },
    },
});