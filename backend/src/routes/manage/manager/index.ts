import { Elysia } from 'elysia';

import datesRouter from './dates';
import optionsRouter from './options';

export default new Elysia({ tags: ['Manager'] })
    .onBeforeHandle(({ error, store }) => {
        const { role } = store as { role: number };

        if (role < 3) return error(403, '');
    })
    .use(datesRouter)
    .use(optionsRouter)