import { Elysia } from 'elysia';

import idRouter from './id';
import buyRouter from './buy';

export default new Elysia({ prefix: '/ticket' })
    .use(idRouter)
    .use(buyRouter)