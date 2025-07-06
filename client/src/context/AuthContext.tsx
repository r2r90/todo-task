import {createContext, useContext, useState, useEffect} from "react";
import {api} from "@/lib/api";

interface AuthContextValue {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider wraps your app and gives access to:
 * - accessToken (state)
 * - login/logout helpers
 * - setAccessToken directly
 */
export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(() =>
        localStorage.getItem("accessToken")
    );

    // Keep localStorage in sync with state
    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        } else {
            localStorage.removeItem("accessToken");
        }
    }, [accessToken]);

    /**
     * Login
     * calls /auth/login and saves the accessToken
     */
    const login = async (email: string, password: string) => {
        const {data} = await api.post("/auth/login", {email, password});
        setAccessToken(data.accessToken);
    };

    /**·
     * Logout
     * calls /auth/logout and clears token + redirects
     */
    const logout = async () => {
        await api.post("/auth/logout");
        setAccessToken(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth hook
 * get access to token + login/logout + setAccessToken globally
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
