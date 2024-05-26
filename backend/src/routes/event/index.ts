import { Elysia } from 'elysia';

import eventsRouter from './events';
import eventRouter from './event';

export default new Elysia({ tags: ['Event'] })
    .use(eventsRouter)
    .use(eventRouter)