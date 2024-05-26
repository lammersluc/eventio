import { Elysia } from "elysia";

import ticketRouter from './ticket'
import coinsRouter from './coins'
import walletRouter from './wallet'

export default new Elysia({ tags: ['Wallet'] })
    .use(ticketRouter)
    .use(coinsRouter)
    .use(walletRouter)