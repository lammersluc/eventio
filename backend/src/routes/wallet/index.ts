import { Elysia } from "elysia";

import tickets from './tickets'
import coinsRouter from './coins'
import walletRouter from './wallet'

export default new Elysia({ tags: ['Wallet'] })
    .use(walletRouter)
    .use(tickets)
    .use(coinsRouter)