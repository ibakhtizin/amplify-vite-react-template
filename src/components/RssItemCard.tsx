import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RssFeed } from '../types';
import { Trash2, Copy, Check, Link } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface RssItemCardProps {
    feed: RssFeed;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<RssFeed>) => void;
}

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

export function RssItemCard({ feed, onDelete, onUpdate }: RssItemCardProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const parsedQuery = parseUrl(feed.url);

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

    const handleForwardingUrlChange = (url: string) => {
        onUpdate(feed.id, { forwardingUrl: url });
    };

    const handleActiveToggle = (isActive: boolean) => {
        onUpdate(feed.id, { isActive });
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                    <span className="truncate leading-normal" title={parsedQuery?.q}>{parsedQuery?.q}</span>
                    <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                        <Switch
                            checked={feed.isActive ?? false}
                            onCheckedChange={(checked) => handleActiveToggle(checked)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => onDelete(feed.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardTitle>
                <CardDescription>
                    Last updated: {formatDate(feed.feedLastUpdated)}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-2 overflow-hidden">
                    {parsedQuery && Object.entries(parsedQuery).map(([key, value]) => (
                        key !== 'q' && (
                            <Badge key={key} variant="secondary" className="max-w-full truncate">
                                <span className="truncate">{key}: {value}</span>
                            </Badge>
                        )
                    ))}
                </div>
                <div className="flex items-center space-x-2 mb-2">
                    <Link className="h-4 w-4 flex-shrink-0" />
                    {isEditing ? (
                        <Input
                            value={feed.forwardingUrl || ''}
                            onChange={(e) => handleForwardingUrlChange(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            placeholder="Enter forwarding URL"
                            className="flex-grow"
                        />
                    ) : (
                        <span
                            className="flex-grow cursor-pointer hover:underline truncate"
                            onClick={() => setIsEditing(true)}
                            title={feed.forwardingUrl || 'Click to add forwarding URL'}
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
                        {copiedId === feed.id ? (
                            <>Copied <Check className="h-4 w-4" /></>
                        ) : (
                            <>Copy Feed URL <Copy className="h-4 w-4" /></>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}