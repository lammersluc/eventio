import { Elysia } from 'elysia';

import datesRouter from './dates';
import optionsRouter from './options';

export default new Elysia({ tags: ['Manager'] })
    .onBeforeHandle(({ error, store }) => {
        const { eventMember } = store as { eventMember: { role: number } };

        if (eventMember.role < 3) return error(403, '');
    })
    .use(datesRouter)
    .use(optionsRouter)