import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import bearer from '@elysiajs/bearer'

import authRouter from './auth'
import accountRouter from './account'
import { checkTokens } from '@/services/tokens'

export default new Elysia()
    .use(bearer())
    .state({
        uid: 0
    })
    .guard({
        async beforeHandle({ set, bearer, store }) {
            if (!bearer) {
                set.status = 401;
                return;
            }

            const uid = checkTokens(bearer);

            if (!uid) {
                set.status = 401;
                return;
            }
            
            store.uid = uid as number;
        },
        response: {
            401: t.String()
        }
    }, app => app
        .use(accountRouter)
    )
    .use(authRouter)
    .use(swagger({
        path: '/docs',
        exclude: ['/docs', '/docs/json'],
        documentation: {
            info: {
                title: 'Eventio API',
                version: '0.0.1'
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [
                {
                    bearerAuth: []
                }
            ]
        }
    }))