import { Elysia } from 'elysia';

import idRouter from './id';
import buyRouter from './buy';
import transferRouter from './transfer';

export default new Elysia({ prefix: '/ticket' })
    .use(idRouter)
    .use(buyRouter)
    .use(transferRouter)