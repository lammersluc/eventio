import { treaty } from '@elysiajs/eden';
import type { API } from '#/route';

const client = treaty<API>(typeof window === 'undefined' ? '' : window.location.origin, {
    async onRequest(path, options) {
        if (!path.startsWith('/auth')) {
            const tokens = await refreshTokens();

            if (!tokens) {
                window.location.href = '/auth';
                return;
            }

            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${tokens.accessToken}`
            };
        }
    }
}).api;

const decryptJWT = async (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

type Auth = {
    accessToken: string;
    refreshToken: string;
};

const refreshTokens = async () => {
    const tokens = localStorage.getItem('auth');

    if (!tokens) return false;

    const json = JSON.parse(tokens) as Auth;

    if ((await decryptJWT(json.accessToken)).exp - 5 > Date.now() / 1000) return json;
    if ((await decryptJWT(json.refreshToken)).exp - 5 < Date.now() / 1000) return false;

    const result = await client.auth.refresh.post({
        refreshToken: json.refreshToken
    }, {
        headers: {
            Authorization: `Bearer ${json.accessToken}`
        }
    });

    if (result.error) {
        localStorage.removeItem('auth');
        return false;
    }

    localStorage.setItem('auth', JSON.stringify(result.data));
    return result.data;
}

export default client;