import { useState } from 'react';

export function useFeatureFlags() {
    const [ flags ] = useState({
        enforceSubscription: true,
    });

    return flags;
}