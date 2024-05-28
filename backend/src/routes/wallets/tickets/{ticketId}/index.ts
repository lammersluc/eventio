import { Elysia } from 'elysia';

import transferRouter from './transfer';
import qrRouter from './qr';

export default new Elysia({ prefix: '/:ticketId' })
    .use(transferRouter)
    .use(qrRouter)