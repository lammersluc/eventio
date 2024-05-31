import { treaty } from '@elysiajs/eden';
import type { App } from '#';
import { useRouter } from 'next/navigation';

export default treaty<App>('192.168.0.177:3000', {
    async onRequest(path, options) {
        if (path.startsWith('/auth')) return;

        const auth = localStorage.getItem('auth');
        if (!auth) return useRouter().push('/auth/login');
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${JSON.parse(auth).token}`
        };
    },

    async onResponse(response) {
        if (response.status !== 401) return response;
        
        const tokens = JSON.parse(localStorage.getItem('auth') ?? '');
        const result = await treaty<App>('localhost:3000').auth.refresh.post({
            refreshToken: tokens.refreshToken
        }, {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });

        if (result.error) return useRouter().push('/auth');

        localStorage.setItem('auth', JSON.stringify(result.data));
    }
});