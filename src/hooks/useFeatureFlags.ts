import { useState } from 'react';

export function useFeatureFlags() {
    const [ flags ] = useState({
        enforceSubscription: false,
    });

    return flags;
}