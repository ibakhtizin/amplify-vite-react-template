// components/SubscriptionSuccess.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useSubscription } from '../hooks/useSubscription';

function SubscriptionSuccess() {
    const [message, setMessage] = useState('Confirming your subscription...');
    const location = useLocation();
    const navigate = useNavigate();
    // const { confirmSubscription } = useSubscription();

    useEffect(() => {
        // const searchParams = new URLSearchParams(location.search);
        // const sessionId = searchParams.get('session_id');

        setMessage('Subscription confirmed! Redirecting...');
        setTimeout(() => navigate('/'), 3000); // Redirect to home after 3 seconds
        //
        // if (sessionId) {
        //     confirmSubscription(sessionId)
        //         .then(() => {
        //             setMessage('Subscription confirmed! Redirecting...');
        //             setTimeout(() => navigate('/'), 3000); // Redirect to home after 3 seconds
        //         })
        //         .catch((error) => {
        //             console.error('Error confirming subscription:', error);
        //             setMessage('There was an error confirming your subscription. Please contact support.');
        //         });
        // } else {
        //     setMessage('Invalid session. Please try subscribing again.');
        // }
    // }, [location, navigate, confirmSubscription]);
        }, [location, navigate ]);

    return (
        <div>
            <h1>Subscription Status</h1>
            <p>{message}</p>
        </div>
    );
}

export default SubscriptionSuccess;