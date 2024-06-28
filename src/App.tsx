// App.tsx
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { RssFeedList } from './components/RssFeedList.tsx';
import { AddRssFeedForm } from './components/AddRssFeedForm.tsx';
import { ProfileMenu } from './components/ProfileMenu.tsx';

export function App() {
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <div className="container mx-auto p-4">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Upwork RSS Feeds</h1>
                        <ProfileMenu user={user} signOut={signOut} />
                    </header>
                    <main>
                        <AddRssFeedForm/>
                        <RssFeedList/>

                        <footer className="mt-8 text-center text-gray-500">
                            <p className="text-sm text-muted-foreground leading-none text-center">My with ❤️ by IB</p>
                        </footer>
                    </main>
                </div>
            )}
        </Authenticator>
    );
}

export default App;