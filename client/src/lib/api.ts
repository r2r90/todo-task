import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
})

// tester@tester.com
// Tester-123