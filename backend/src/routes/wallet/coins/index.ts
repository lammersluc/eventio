import { Elysia, t } from 'elysia';

import buyRouter from './buy';
import transferRouter from './transfer';

export default new Elysia({ prefix: '/coins' })
    .use(buyRouter)
    .use(transferRouter)