import Elysia from "elysia";

import idRouter from './id';

export default new Elysia({ prefix: '/date' })
    .use(idRouter)