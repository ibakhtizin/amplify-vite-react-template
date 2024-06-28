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

    const createStripeCheckoutSession = useMutation({
        mutationFn: async () => {
            const response = await client.mutations.stripeCreateCheckoutSession();
            return response.data;
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
        try {
            const checkoutSession = await createStripeCheckoutSession.mutateAsync();

            // Redirect to Stripe Checkout
            if (checkoutSession?.url) {
                window.location.href = checkoutSession.url;
            } else {
                throw new Error("Failed to create checkout session");
            }
        } catch (error) {
            console.error("Error creating Stripe checkout session:", error);
            throw error;
        }
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