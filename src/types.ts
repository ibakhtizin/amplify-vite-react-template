// types.ts

export interface RssFeed {
  id: string;
  url: string;
  title: string;
  lastUpdated: string;
  feedLastUpdated: string;
  forwardingUrl: string;
  isActive: boolean;
  ownerId: string;
  parsedQuery?: {
    q: string;
    [key: string]: string;
  };
}

export interface User {
  signInDetails?: {
    loginId: string;
  };
}
