import { useState, useCallback } from 'react'
import { api } from '@/lib/api'

export function useAuth() {
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem('accessToken')
    )

    const login = useCallback(async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password })
        localStorage.setItem('accessToken', data.accessToken)
        setAccessToken(data.accessToken)
        return data.accessToken
    }, [])

    const logout = useCallback(async () => {
        await api.post('/auth/logout')
        localStorage.removeItem('accessToken')
        setAccessToken(null)
    }, [])

    return { accessToken, login, logout, setAccessToken }
}