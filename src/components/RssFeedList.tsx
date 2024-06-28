// RssFeedList.tsx
import { useRssFeeds } from '../useRssFeeds';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RssFeed } from '../types';
import { ExternalLink, Trash2 } from 'lucide-react';

function parseUrl(url: string): RssFeed['parsedQuery'] {
    const parsedUrl = new URL(url);
    const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
    return {
        q: queryParams.q || 'Untitled Feed',
        ...queryParams
    };
}

export function RssFeedList() {
    const { rssFeeds, deleteRssFeed, isLoading, isError } = useRssFeeds();

    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (isError) return <div className="text-center py-4 text-red-500">Error fetching RSS feeds</div>;

    return (
        <ul className="space-y-4">
            {rssFeeds?.map((feed) => {
                const parsedQuery = parseUrl(feed.url);
                return (
                    <Card key={feed.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span className="truncate">{parsedQuery.q}</span>
                                <Button variant="ghost" size="icon" onClick={() => deleteRssFeed(feed.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                Last updated: {new Date(feed.lastUpdated).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {Object.entries(parsedQuery).map(([key, value]) => (
                                    key !== 'q' && (
                                        <Badge key={key} variant="secondary">
                                            {key}: {value}
                                        </Badge>
                                    )
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <Button variant="outline" size="sm" asChild>
                                    <a href={feed.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        View Feed <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </ul>
    );
}