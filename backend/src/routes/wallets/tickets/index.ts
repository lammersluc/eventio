import { Elysia } from 'elysia';

import idRouter from './{ticketId}';
import buyRouter from './buy';

export default new Elysia({ prefix: '/tickets' })
    .use(idRouter)
    .use(buyRouter)