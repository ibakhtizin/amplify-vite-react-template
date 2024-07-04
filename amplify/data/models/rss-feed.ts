import {a} from "@aws-amplify/backend";

const RssFeed = a
    .model({
        url: a.string().required(),
        title: a.string(),
        description: a.string(),
        lastUpdated: a.datetime(),
        feedLastUpdated: a.datetime(),
        forwardingUrl: a.string(),
        isActive: a.boolean().default(true),
        ownerId: a.string(),
        rssFeedItem: a.hasMany('RssFeedItem', 'rssFeedId'),
    })
    .authorization((allow) => [
        allow.owner()])

export default RssFeed
