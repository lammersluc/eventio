import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import bearer from '@elysiajs/bearer';

import { checkTokens } from '@/services/tokens';

import authRouter from './auth';
import accountRouter from './account';
import walletRouter from './wallet';
import eventRouter from './event';
import manageRouter from './manage';

export default new Elysia()
    .use(bearer())
    .state({
        id: '',
    })

    .use(authRouter)
    .guard({
        async beforeHandle({ error, bearer, store }) {
            
            if (!bearer) return error(401, '');

            const id = await checkTokens(bearer);

            if (!id) return error(401, '');

            store.id = id;
        },
        response: {
            200: t.Any(),
            401: t.String()
        }
    }, app => app
        .use(accountRouter)
        .use(walletRouter)
        .use(eventRouter)
        .use(manageRouter)
    )

    .use(swagger({
        path: '/docs',
        exclude: ['/docs', '/docs/json'],
        documentation: {
            info: {
                title: 'Eventio API',
                version: '0.1.0',
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    },
                },
            },
            security: [
                { bearerAuth: [] }
            ]
        }
    }))