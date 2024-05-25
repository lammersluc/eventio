import { Elysia } from 'elysia';

import ticketsRouter from './tickets';
import ticketRouter from './ticket'
import coinsrouter from './coins'

export default new Elysia({ detail: { tags: ['Wallet'] } })
    .use(ticketsRouter)
    .use(ticketRouter)
    .use(coinsrouter)