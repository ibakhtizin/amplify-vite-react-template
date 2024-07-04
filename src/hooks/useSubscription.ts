// // useSubscription.ts
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { generateClient } from "aws-amplify/data";
// import { getCurrentUser } from "aws-amplify/auth";
// import type { Schema } from "../../amplify/data/resource";
//
// const client = generateClient<Schema>();
//
// export function useSubscription() {
//     const queryClient = useQueryClient();
//
//     const { data: userSubscription, isLoading, isError } = useQuery({
//         queryKey: ["userSubscription"],
//         queryFn: async () => {
//             console.log('START userSubscriptionuserSubscriptionuserSubscription')
//             const { userId } = await getCurrentUser();
//             const response = await client.models.UserSubscription.list({
//                 filter: { userId: { eq: userId } }
//             });
//             console.log('END userSubscriptionuserSubscriptionuserSubscription')
//             return response.data[0] || { userId, isPro: false, expiresAt: null };
//         },
//     });
//
//     const createStripeCheckoutSession = useMutation({
//         mutationFn: async () => {
//             const user = await getCurrentUser();
//             const email = user?.signInDetails?.loginId ?? '';
//             const host = window.location.host;
//             const response = await client.mutations.stripeCreateCheckoutSession({host, email});
//             return response.data;
//         },
//     });
//
//     const updateSubscription = useMutation({
//         mutationFn: async ({ isPro, expiresAt }: { isPro: boolean; expiresAt?: string }) => {
//             const { userId } = await getCurrentUser();
//             if (userSubscription?.id) {
//                 // Update existing subscription
//                 const { data: updatedSubscription } = await client.models.UserSubscription.update({
//                     id: userSubscription.id,
//                     isPro,
//                     expiresAt,
//                 });
//                 return updatedSubscription;
//             } else {
//                 // Create new subscription
//                 const { data: newSubscription } = await client.models.UserSubscription.create({
//                     userId,
//                     isPro,
//                     expiresAt,
//                 });
//                 return newSubscription;
//             }
//         },
//         onSuccess: (updatedSubscription) => {
//             queryClient.setQueryData(["userSubscription"], updatedSubscription);
//         },
//     });
//
//     const upgradeToProAction = async () => {
//         try {
//             const checkoutSession = await createStripeCheckoutSession.mutateAsync();
//
//             // Redirect to Stripe Checkout
//             if (checkoutSession?.url) {
//                 window.location.href = checkoutSession.url;
//                 return;
//             }
//         } catch (error) {
//             console.error("Error creating Stripe checkout session:", error);
//             throw error;
//         }
//
//         throw new Error("Failed to create checkout session");
//     };
//
//     const cancelSubscriptionAction = async () => {
//         await updateSubscription.mutateAsync({ isPro: false, expiresAt: undefined });
//     };
//
//     return {
//         userSubscription,
//         isLoading,
//         isError,
//         upgradeToProAction,
//         cancelSubscriptionAction,
//         isPro: userSubscription?.isPro || false,
//     };
// }