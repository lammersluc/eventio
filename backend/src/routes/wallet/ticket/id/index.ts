import { Elysia } from 'elysia';

import transferRouter from './transfer';
import qrRouter from './qr';

export default new Elysia({ prefix: '/:id' })
    .use(transferRouter)
    .use(qrRouter)