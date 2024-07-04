import { useState } from 'react';
import { useRssFeeds } from '../hooks/useRssFeeds';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubscriptionDialog } from './SubscriptionDialog';
// import { useSubscription } from '../hooks/useSubscription';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

export function AddRssFeedForm() {
    const [newRssFeedUrl, setNewRssFeedUrl] = useState("");
    const [inputError, setInputError] = useState("");
    const { addRssFeed, rssFeeds } = useRssFeeds();
    // const { isPro } = useSubscription();
    const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
    const { enforceSubscription } = useFeatureFlags();

    // const feedLimit = isPro || !enforceSubscription ? Infinity : 2;
    const feedLimit = !enforceSubscription ? Infinity : 2;
    const canAddMoreFeeds = (rssFeeds?.length || 0) < feedLimit;

    const validateAndAddRssFeed = () => {
        if (!canAddMoreFeeds && enforceSubscription) {
            setIsSubscriptionDialogOpen(true);
            return;
        }

        const url = newRssFeedUrl.trim();

        if (!url) {
            setInputError("Please enter a URL");
            return;
        }

        if (!url.startsWith("https://www.upwork.com/ab/feed/jobs")) {
            setInputError("URL must start with https://www.upwork.com/ab/feed/jobs");
            return;
        }

        try {
            new URL(url);
            setInputError("");
            addRssFeed(url);
            setNewRssFeedUrl("");
        } catch (e) {
            setInputError("Invalid URL format");
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
                    {canAddMoreFeeds || !enforceSubscription ? "+ Add Feed" : "Upgrade to Add More"}
                </Button>
            </div>
            {inputError && (
                <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{inputError}</AlertDescription>
                </Alert>
            )}
            {!canAddMoreFeeds && enforceSubscription && (
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