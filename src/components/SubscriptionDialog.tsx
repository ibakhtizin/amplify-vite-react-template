// SubscriptionDialog.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

interface SubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SubscriptionDialog({ isOpen, onClose }: SubscriptionDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            // const checkoutUrl = await createCheckoutSession();
            window.location.href = 'https://google.com';
        } catch (error) {
            console.error('Error initiating upgrade:', error);
            toast.error('Failed to start upgrade process. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upgrade to Pro</DialogTitle>
                    <DialogDescription>
                        Unlock unlimited RSS feeds and more features with our Pro plan.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h3 className="font-bold text-lg">Pro Plan Features:</h3>
                    <ul className="list-disc list-inside mt-2">
                        <li>Unlimited RSS feeds</li>
                        <li>Priority support</li>
                        <li>Advanced analytics</li>
                    </ul>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleUpgrade} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Upgrade Now'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}