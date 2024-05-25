import Elysia from "elysia";

import idRouter from './id';

export default new Elysia({ prefix: '/event' })
    .use(idRouter)