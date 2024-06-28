// AddRssFeedForm.tsx
import { useState } from 'react';
import { useRssFeeds } from '../useRssFeeds.ts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AddRssFeedForm() {
    const [newRssFeedUrl, setNewRssFeedUrl] = useState("");
    const [inputError, setInputError] = useState("");
    const { addRssFeed } = useRssFeeds();

    const validateAndAddRssFeed = () => {
        const url = newRssFeedUrl.trim();
        if (url) {
            if (url.startsWith("https://www.upwork.com/ab/feed/jobs")) {
                try {
                    new URL(url);
                    setInputError("");
                    addRssFeed(url);
                    setNewRssFeedUrl("");
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
                <Button onClick={validateAndAddRssFeed}>+ Add Feed</Button>
            </div>
            {inputError && (
                <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{inputError}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}