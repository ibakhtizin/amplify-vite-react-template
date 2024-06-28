// styles.ts

import { CSSProperties } from 'react';

interface Styles {
    [key: string]: CSSProperties;
}

export const styles: Styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        fontSize: '24px',
        margin: 0,
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputContainer: {
        display: 'flex',
        marginBottom: '10px',
    },
    input: {
        flex: 1,
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    addButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    feedList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    feedItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #eee',
    },
    feedLink: {
        color: '#0066cc',
        textDecoration: 'none',
        wordBreak: 'break-all',
        flex: 1,
        marginRight: '10px',
    },
    deleteButton: {
        padding: '5px 10px',
        fontSize: '14px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    footer: {
        marginTop: '20px',
        textAlign: 'center',
        color: '#666',
    },
    signOutButton: {
        padding: '5px 10px',
        fontSize: '14px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};