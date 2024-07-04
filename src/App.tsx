// App.tsx
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { RssFeedList } from './components/RssFeedList';
import { AddRssFeedForm } from './components/AddRssFeedForm';
import { ProfileMenu } from './components/ProfileMenu';
import { Toaster } from "react-hot-toast";
import SubscriptionSuccess from './components/SubscriptionSuccess';
import CheckoutCancelled from './components/CheckoutCancelled';
import { AuthUser } from "aws-amplify/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface AuthenticatedAppProps {
    user: AuthUser | undefined;
    signOut: () => void;
}

function Logo() {
    return (
        <Link to="/" className="text-2xl font-bold">
            Upwork RSS Feeds
        </Link>
    );
}

function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <Logo />
                </div>
                <nav className="flex flex-col space-y-4">
                    <Link to="/" className="text-lg font-medium">RSS Feed</Link>
                    <Link to="/" className="text-lg font-medium">Tasks</Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}

function DesktopNav() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link to="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            RSS Feeds
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link to="/" >
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Tasks
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function AuthenticatedApp({ user, signOut }: AuthenticatedAppProps) {
    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <MobileNav />
                    <div className="hidden md:flex items-center space-x-4">
                        <Logo />
                        <DesktopNav />
                    </div>
                </div>
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