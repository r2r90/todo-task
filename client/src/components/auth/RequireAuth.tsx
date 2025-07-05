import {type JSX, useEffect, useState} from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api } from '@/lib/api'
import {useAuth} from "@/hooks/use-auth.hook.ts";


export function RequireAuth({ children }: { children: JSX.Element }) {
    const { accessToken, setAccessToken } = useAuth()
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        if (!accessToken) {
            api.post('/auth/refresh')
                .then(({ data }) => {
                    localStorage.setItem('accessToken', data.accessToken)
                    setAccessToken(data.accessToken)
                })
                .catch(() => {
                    localStorage.removeItem('accessToken')
                    setAccessToken(null)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [accessToken, setAccessToken])

    if (loading) {
        return <div>Loading...</div>
    }
    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children
}
