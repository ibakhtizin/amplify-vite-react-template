import { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { styles } from './styles/styles.ts';

const client = generateClient<Schema>();

function App() {
    const [newRssFeedUrl, setNewRssFeedUrl] = useState("");
    const [inputError, setInputError] = useState("");
    const queryClient = useQueryClient();

    const { data: rssFeeds, isLoading, isError } = useQuery({
        queryKey: ["rssFeeds"],
        queryFn: async () => {
            const response = await client.models.RssFeed.list();
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (url: string) => {
            const { data: newRssFeed } = await client.models.RssFeed.create({
                url,
                title: url, // Using URL as title initially, you might want to fetch the actual title later
                lastUpdated: new Date().toISOString()
            });
            return newRssFeed;
        },
        onMutate: async (newUrl) => {
            await queryClient.cancelQueries({ queryKey: ["rssFeeds"] });
            const previousRssFeeds = queryClient.getQueryData<Schema["RssFeed"]["type"][]>(["rssFeeds"]);
            if (previousRssFeeds) {
                queryClient.setQueryData<Schema["RssFeed"]["type"][]>(["rssFeeds"], [
                    ...previousRssFeeds,
                    { id: Date.now().toString(), url: newUrl, title: newUrl, lastUpdated: new Date().toISOString() } as Schema["RssFeed"]["type"],
                ]);
            }
            return { previousRssFeeds };
        },
        onError: (_err, _newRssFeed, context) => {
            if (context?.previousRssFeeds) {
                queryClient.setQueryData(["rssFeeds"], context.previousRssFeeds);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["rssFeeds"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { data: deletedRssFeed } = await client.models.RssFeed.delete({ id });
            return deletedRssFeed;
        },
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: ["rssFeeds"] });
            const previousRssFeeds = queryClient.getQueryData<Schema["RssFeed"]["type"][]>(["rssFeeds"]);
            if (previousRssFeeds) {
                queryClient.setQueryData<Schema["RssFeed"]["type"][]>(
                    ["rssFeeds"],
                    previousRssFeeds.filter((feed) => feed.id !== deletedId)
                );
            }
            return { previousRssFeeds };
        },
        onError: (_err, _deletedId, context) => {
            if (context?.previousRssFeeds) {
                queryClient.setQueryData(["rssFeeds"], context.previousRssFeeds);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["rssFeeds"] });
        },
    });

    function deleteRssFeed(id: string) {
        deleteMutation.mutate(id);
    }

    function validateAndAddRssFeed() {
        const url = newRssFeedUrl.trim();
        if (url) {
            if (url.startsWith("https://www.upwork.com/ab/feed/jobs")) {
                try {
                    new URL(url);
                    setInputError("");
                    createMutation.mutate(url);
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
    }

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching RSS feeds</div>;

    return (
        <Authenticator>
            {({ signOut, user }) => (
                <main>
                    <h1> Upwork RSS Feeds </h1>
                    <input
                        type="text"
                        value={newRssFeedUrl}
                        onChange={(e) => {
                            setNewRssFeedUrl(e.target.value);
                            setInputError(""); // Clear error when input changes
                        }}
                        placeholder="Enter new RSS feed URL"
                    />
                    <button onClick={validateAndAddRssFeed}>+ Add Feed</button>
                    <ul>
                        {rssFeeds?.map((feed) => (
                            <li key={feed.id}>
                                <a href={feed.url} target="_blank"
                                   rel="noopener noreferrer">{feed.title || feed.url}</a>
                                <button onClick={() => deleteRssFeed(feed.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        🥳 RSS Feed Manager successfully hosted with optimistic UI. Try adding or deleting an RSS feed.
                        <br/>
                        <br/>
                    </div>
                    <div>
                        Logged in as {user?.signInDetails?.loginId}.
                        <br/>
                        <br/>
                    </div>
                    <button onClick={signOut}>Sign out</button>
                </main>
            )}
        </Authenticator>
    );
}

export default App;