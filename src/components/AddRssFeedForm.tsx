// AddRssFeedForm.tsx
import { useState } from 'react';
import { useRssFeeds } from '../hooks/useRssFeeds';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubscriptionDialog } from './SubscriptionDialog';
import { useSubscription } from '../hooks/useSubscription';

export function AddRssFeedForm() {
    const [newRssFeedUrl, setNewRssFeedUrl] = useState("");
    const [inputError, setInputError] = useState("");
    const { addRssFeed, rssFeeds } = useRssFeeds();
    const { isPro } = useSubscription();
    const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);

    const feedLimit = isPro ? Infinity : 2;
    const canAddMoreFeeds = (rssFeeds?.length || 0) < feedLimit;

    const validateAndAddRssFeed = () => {
        const url = newRssFeedUrl.trim();
        if (url) {
            if (url.startsWith("https://www.upwork.com/ab/feed/jobs")) {
                try {
                    new URL(url);
                    setInputError("");
                    if (canAddMoreFeeds) {
                        addRssFeed(url);
                        setNewRssFeedUrl("");
                    } else {
                        setIsSubscriptionDialogOpen(true);
                    }
                } catch (e) {
                    setInputError("Invalid URL format");
                }
            } else {
                setInputError("URL must start with https://www.upwork.com/ab/feed/jobs");
            }
        } else {
            setInputError("Please enter a URL");
        }
    };

    return (
        <div className="mb-8">
            <div className="flex space-x-2">
                <Input
                    type="text"
                    value={newRssFeedUrl}
                    onChange={(e) => {
                        setNewRssFeedUrl(e.target.value);
                        setInputError("");
                    }}
                    placeholder="Enter new RSS feed URL"
                />
                <Button onClick={validateAndAddRssFeed}>
                    {canAddMoreFeeds ? "+ Add Feed" : "Upgrade to Add More"}
                </Button>
            </div>
            {inputError && (
                <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{inputError}</AlertDescription>
                </Alert>
            )}
            {!canAddMoreFeeds && (
                <Alert className="mt-2">
                    <AlertDescription>
                        You've reached the limit of {feedLimit} feeds. Upgrade to add more!
                    </AlertDescription>
                </Alert>
            )}
            <SubscriptionDialog
                isOpen={isSubscriptionDialogOpen}
                onClose={() => setIsSubscriptionDialogOpen(false)}
            />
        </div>
    );
}