import { Elysia } from 'elysia';

import walletsRouter from './wallets';
import transactionsRouter from './transactions';

export default new Elysia({ tags: ['Cashier'] })
    .onBeforeHandle(({ error, store }) => {
        const { role } = store as { role: number };

        if (role < 1) return error(403, '');
    })
    .use(walletsRouter)
    .use(transactionsRouter)