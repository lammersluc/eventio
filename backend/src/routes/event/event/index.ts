import { Elysia } from "elysia";

import idRouter from './id';
import dateRouter from './date';

export default new Elysia({ prefix: '/event' })
    .use(idRouter)
    .use(dateRouter)