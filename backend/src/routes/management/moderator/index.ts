import { Elysia } from 'elysia';

export default new Elysia()
    .onBeforeHandle(({ error, store }) => {
        const { role } = store as { role: number };

        if (role < 2) return error(403, '');
    })