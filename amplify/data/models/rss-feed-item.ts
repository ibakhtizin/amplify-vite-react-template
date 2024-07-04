import {a} from "@aws-amplify/backend";

const RssFeedItem = a
    .model({
        title: a.string(),
        link: a.url(),
        summary: a.string(),
        content: a.string(),
        pubDate: a.string(),
        rssFeed: a.belongsTo('RssFeed', 'rssFeedId'),
        rssFeedUrl: a.url(),
        rssFeedId: a.id()
    })
    .authorization((allow) => [
        allow.owner()])

export default RssFeedItem
