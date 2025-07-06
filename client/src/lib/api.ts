// src/lib/api.ts
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

/* 1) Flags & queue to manage concurrent refresh calls */
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

/**
 * 2) Once the refresh call completes, either resolve or reject
 *    all requests that were queued up during the refresh.
 */
function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
}

/* 3) Create your Axios instance with withCredentials for cookies */
export const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true,
});

/* 4) REQUEST INTERCEPTOR: automatically add Authorization header */
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* 5) RESPONSE INTERCEPTOR: catch 401 Unauthorized and refresh token */
api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        const originalRequest: any = error.config;

        // Only do this once per request
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If a refresh is already in flight, queue up this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            // Mark that we're retrying this request
            originalRequest._retry = true;
            isRefreshing = true;

            // Kick off the refresh call
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await axios.post<{ accessToken: string }>(
                        'http://localhost:4000/api/auth/refresh',
                        {},
                        { withCredentials: true }
                    );

                    // 6) On success, save new token and replay queued requests
                    localStorage.setItem('accessToken', data.accessToken);
                    api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    processQueue(null, data.accessToken);

                    // Retry the original request
                    resolve(api(originalRequest));
                } catch (refreshError) {
                    // 7) On failure, reject queued and force logout
                    processQueue(refreshError, null);
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                    toast.error('Session expired, please log in again.');
                    reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        // If it wasn’t a 401 or we’ve already retried, just reject
        return Promise.reject(error);
    }
);
