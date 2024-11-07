import { Elysia } from 'elysia';

import eventsRouter from './events';

export default new Elysia({ prefix: '/manage' })
    .use(eventsRouter)