// useSubscription.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export function useSubscription() {
    const queryClient = useQueryClient();

    const { data: userSubscription, isLoading, isError } = useQuery({
        queryKey: ["userSubscription"],
        queryFn: async () => {
            const { userId } = await getCurrentUser();
            const response = await client.models.UserSubscription.list({
                filter: { userId: { eq: userId } }
            });
            return response.data[0] || { userId, isPro: false, expiresAt: null };
        },
    });

    const updateSubscription = useMutation({
        mutationFn: async ({ isPro, expiresAt }: { isPro: boolean; expiresAt?: string }) => {
            const { userId } = await getCurrentUser();
            if (userSubscription?.id) {
                // Update existing subscription
                const { data: updatedSubscription } = await client.models.UserSubscription.update({
                    id: userSubscription.id,
                    isPro,
                    expiresAt,
                });
                return updatedSubscription;
            } else {
                // Create new subscription
                const { data: newSubscription } = await client.models.UserSubscription.create({
                    userId,
                    isPro,
                    expiresAt,
                });
                return newSubscription;
            }
        },
        onSuccess: (updatedSubscription) => {
            queryClient.setQueryData(["userSubscription"], updatedSubscription);
        },
    });

    const upgradeToProAction = async () => {
        // This is where you'd integrate with your payment processor (e.g., Stripe)
        // For now, we'll just simulate an upgrade
        const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await updateSubscription.mutateAsync({ isPro: true, expiresAt: oneMonthFromNow });
    };

    const cancelSubscriptionAction = async () => {
        await updateSubscription.mutateAsync({ isPro: false, expiresAt: undefined });
    };

    return {
        userSubscription,
        isLoading,
        isError,
        upgradeToProAction,
        cancelSubscriptionAction,
        isPro: userSubscription?.isPro || false,
    };
}