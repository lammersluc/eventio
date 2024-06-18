import { Elysia } from 'elysia';

import walletsRouter from './wallets';
import transactionsRouter from './transactions';

export default new Elysia({ tags: ['Cashier'] })
    .onBeforeHandle(({ error, store }) => {
        const { eventMember } = store as { eventMember: { role: number } };

        if (eventMember.role < 1) return error(403, '');
    })
    .use(walletsRouter)
    .use(transactionsRouter)