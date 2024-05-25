import { Elysia } from 'elysia';

import eventsRouter from './events';
import eventRouter from './event';
import dateRouter from './date';

export default new Elysia({ detail: { tags: ['Event'] } })
    .use(eventsRouter)
    .use(eventRouter)
    .use(dateRouter)