// RssFeedList.tsx
import { useState } from 'react';
import { useRssFeeds } from '../useRssFeeds';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RssFeed } from '../types';
import {Trash2, Copy, Check, Link} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";



function parseUrl(url: string): RssFeed['parsedQuery'] {
    const parsedUrl = new URL(url);
    const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
    return {
        q: queryParams.q || 'Untitled Feed',
        ...queryParams
    };
}

function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
}

export function RssFeedList() {
    const { rssFeeds, deleteRssFeed, updateRssFeed, isLoading, isError } = useRssFeeds();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            toast.success('URL copied to clipboard!');
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            toast.error('Failed to copy URL');
        }
    };

    const handleForwardingUrlChange = (id: string, url: string) => {
        updateRssFeed({ id, updates: { forwardingUrl: url } });
    };

    const handleActiveToggle = (id: string, isActive: boolean) => {
        updateRssFeed({ id, updates: { isActive } });
    };

    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (isError) return <div className="text-center py-4 text-red-500">Error fetching RSS feeds</div>;

    return (
        <ul className="space-y-4">
            {rssFeeds?.map((feed) => {
                const parsedQuery = parseUrl(feed.url);
                const isCopied = copiedId === feed.id;
                const isEditing = editingId === feed.id;
                return (
                    <Card key={feed.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span className="truncate">{parsedQuery.q}</span>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={feed.isActive ?? false}
                                        onCheckedChange={(checked) => handleActiveToggle(feed.id, checked)}
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => deleteRssFeed(feed.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardTitle>
                            <CardDescription>
                                Last updated: {formatDate(feed.feedLastUpdated)}
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
                            <div className="flex items-center space-x-2 mb-2">
                                <Link className="h-4 w-4" />
                                {isEditing ? (
                                    <Input
                                        value={feed.forwardingUrl || ''}
                                        onChange={(e) => handleForwardingUrlChange(feed.id, e.target.value)}
                                        onBlur={() => setEditingId(null)}
                                        placeholder="Enter forwarding URL"
                                        className="flex-grow"
                                    />
                                ) : (
                                    <span
                                        className="flex-grow cursor-pointer hover:underline"
                                        onClick={() => setEditingId(feed.id)}
                                    >
                                        {feed.forwardingUrl || 'Click to add forwarding URL'}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(feed.url, feed.id)}
                                    className="flex items-center gap-2"
                                >
                                    {isCopied ? (
                                        <>Copied <Check className="h-4 w-4" /></>
                                    ) : (
                                        <>Copy Feed URL <Copy className="h-4 w-4" /></>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </ul>
    );
}