// components/CheckoutCancelled.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckoutCancelled() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => navigate('/'), 5000); // Redirect to home after 5 seconds
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
            <h1>Checkout Cancelled</h1>
            <p>Your subscription process was cancelled. You'll be redirected to the home page shortly.</p>
        </div>
    );
}

export default CheckoutCancelled;
