// src/hooks/useAuth.ts
import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

export function useAuth() {
    // Keep track of the access token in React state
    const [accessToken, setAccessToken] = useState<string | null>(
        () => localStorage.getItem('accessToken')
    );

    /**
     * Perform login by calling the API,
     * then save the returned tokens to localStorage + state.
     */
    const login = useCallback(async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        setAccessToken(data.accessToken);
    }, []);

    /**
     * Perform logout by calling the API,
     * then clear tokens and redirect to the login page.
     */
    const logout = useCallback(async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        // Redirect user to login screen
        window.location.href = '/login';
    }, []);

    /**
     * Listen for changes to localStorage in other tabs/windows,
     * so that logout in one tab also logs out in the current tab.
     */
    useEffect(() => {
        const onStorage = () => {
            setAccessToken(localStorage.getItem('accessToken'));
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    return { accessToken, login, logout };
}
