import { Elysia } from 'elysia';

import datesRouter from './dates';
import walletRouter from './wallet';

export default new Elysia({ prefix: '/:id'})
   .use(datesRouter)
   .use(walletRouter)