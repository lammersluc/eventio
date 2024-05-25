import { Elysia } from 'elysia';

import loginRouter from './login';
import registerRouter from './register';
import refreshRouter from './refresh';

export default new Elysia({ prefix: '/auth', detail: { tags: ['Auth'] } })
    .use(loginRouter)
    .use(registerRouter)
    .use(refreshRouter);