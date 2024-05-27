import { Elysia } from 'elysia';

import usersRouter from './users';
import walletsRouter from './wallets';
import ticketsRouter from './tickets';

export default new Elysia({ tags: ['Moderator'] })
    .onBeforeHandle(({ error, store }) => {
        const { role } = store as { role: number };

        if (role < 2) return error(403, '');
    })
    .use(usersRouter)
    .use(walletsRouter)
    .use(ticketsRouter)