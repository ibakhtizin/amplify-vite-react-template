// App.tsx
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { RssFeedList } from './components/RssFeedList';
import { AddRssFeedForm } from './components/AddRssFeedForm';
import { ProfileMenu } from './components/ProfileMenu';
import { Toaster } from "react-hot-toast";
import SubscriptionSuccess from './components/SubscriptionSuccess';
import CheckoutCancelled from './components/CheckoutCancelled';
import {AuthUser} from "aws-amplify/auth";


interface AuthenticatedAppProps {
    user: AuthUser | undefined;
    signOut: () => void;
}


function AuthenticatedApp({ user, signOut }: AuthenticatedAppProps) {
    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Upwork RSS Feeds</h1>
                <ProfileMenu user={user} signOut={() => signOut?.()} />
            </header>
            <main>
                <Routes>
                    <Route path="/" element={
                        <>
                            <AddRssFeedForm />
                            <RssFeedList />
                        </>
                    } />
                    <Route path="/subscription-success" element={<SubscriptionSuccess />} />
                    <Route path="/checkout-cancelled" element={<CheckoutCancelled />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <footer className="mt-8 text-center text-gray-500">
                <p className="text-sm text-muted-foreground leading-none text-center">Made with ❤️ by IB</p>
            </footer>
        </div>
    );
}

export function App() {
    return (
        <Router>
            <Authenticator>
                {({ signOut, user }) => (<AuthenticatedApp user={user} signOut={() => signOut?.()} />)}
            </Authenticator>
            <Toaster position="bottom-right" />
        </Router>
    );
}

export default App;
