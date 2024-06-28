// useRssFeeds.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export function useRssFeeds() {
    const queryClient = useQueryClient();

    const { data: rssFeeds, isLoading, isError } = useQuery({
        queryKey: ["rssFeeds"],
        queryFn: async () => {
            const response = await client.models.RssFeed.list();
            return response.data;
        },
    });

    const updateRssFeed = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Schema["RssFeed"]["type"]> }) => {
            const { data: updatedFeed } = await client.models.RssFeed.update({
                id,
                ...updates,
            });
            return updatedFeed;
        },
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["rssFeeds"] });
            const previousRssFeeds = queryClient.getQueryData<Schema["RssFeed"]["type"][]>(["rssFeeds"]);
            if (previousRssFeeds) {
                queryClient.setQueryData<Schema["RssFeed"]["type"][]>(
                    ["rssFeeds"],
                    previousRssFeeds.map(feed =>
                        feed.id === id ? { ...feed, ...updates } : feed
                    )
                );
            }
            return { previousRssFeeds };
        },
        onError: (_err, _newFeed, context) => {
            if (context?.previousRssFeeds) {
                queryClient.setQueryData(["rssFeeds"], context.previousRssFeeds);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["rssFeeds"] });
        },
    });

    const addRssFeed = useMutation({
        mutationFn: async (url: string) => {
            const { data: newRssFeed } = await client.models.RssFeed.create({
                url,
                title: url,
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

    const deleteRssFeed = useMutation({
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

    return {
        rssFeeds,
        isLoading,
        isError,
        addRssFeed: addRssFeed.mutate,
        updateRssFeed: updateRssFeed.mutate,
        deleteRssFeed: deleteRssFeed.mutate,
    };
}