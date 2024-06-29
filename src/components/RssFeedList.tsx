import { useState } from 'react';
import { useRssFeeds } from '../hooks/useRssFeeds';
import { SubscriptionDialog } from "@/components/SubscriptionDialog.tsx";
import { RssItemCard } from './RssItemCard';
import { RssFeed } from '../types';

export function RssFeedList() {
    const { rssFeeds, deleteRssFeed, updateRssFeed, isLoading, isError } = useRssFeeds();
    const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);

    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (isError) return <div className="text-center py-4 text-red-500">Error fetching RSS feeds</div>;

    return (
        <>
            {rssFeeds?.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-lg text-gray-600">No RSS feeds added yet. Add your first feed to get started!</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {rssFeeds?.map((feed) => (
                        <RssItemCard
                            key={feed.id}
                            feed={feed as RssFeed}
                            onDelete={deleteRssFeed}
                            onUpdate={(id, updates) => updateRssFeed({ id, updates })}
                        />
                    ))}
                </ul>
            )}
            <SubscriptionDialog
                isOpen={isSubscriptionDialogOpen}
                onClose={() => setIsSubscriptionDialogOpen(false)}
            />
        </>
    );
}