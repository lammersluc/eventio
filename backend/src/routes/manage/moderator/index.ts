import { Elysia } from 'elysia';

import usersRouter from './users';
import walletsRouter from './wallets';
import ticketsRouter from './tickets';

export default new Elysia({ tags: ['Moderator'] })
    .onBeforeHandle(({ error, store }) => {
        const { eventMember } = store as { eventMember: { role: number } };

        if (eventMember.role < 2) return error(403, '');
    })
    .use(usersRouter)
    .use(walletsRouter)
    .use(ticketsRouter)