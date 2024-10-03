import { Elysia, t } from 'elysia';
import cors from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';

import apiRouter from './routes';

const app = new Elysia()
    .use(cors())
    .use(staticPlugin())
    .use(apiRouter)
    .listen(3000);

export const origin = app.server ? `http${app.server.port === 443 ? 's' : ''}://${app.server.hostname}:${app.server.port}` : '';

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;