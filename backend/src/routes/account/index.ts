import { Elysia } from 'elysia';

import meRouter from './me';
import usernameRouter from './username';
import passwordRouter from './password';

export default new Elysia({ prefix: '/account', detail: { tags: ['Account'] } })
    .use(meRouter)
    .use(usernameRouter)
    .use(passwordRouter)