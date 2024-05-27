import { Elysia } from 'elysia';

import ticketIdRouter from './{ticketId}';
import buyRouter from './buy';

export default new Elysia({ prefix: '/tickets' })
    .use(ticketIdRouter)
    .use(buyRouter)