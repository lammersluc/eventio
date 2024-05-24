import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import bearer from '@elysiajs/bearer'
import jwt from '@elysiajs/jwt'

import authRouter from './auth'
import accountRouter from './account'

export default new Elysia()
    .use(bearer())
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
        exp: process.env.JWT_EXP
    }))
    .guard({
        response: {
            401: t.String()
        }
    }, app => app
        .onBeforeHandle(async ({ error, bearer, set, jwt }) => {
            const token = await jwt.verify(bearer);

            if (!token) return error(401);

            if ((token.exp || 0) - (Date.now() / 1000) < parseInt(process.env.JWT_REFRESH || '')) {
                const newToken = await jwt.sign({
                    id: token.id
                });
                
                set.headers['Authorization'] = `Bearer ${newToken}`
            }

            id = token.id as number;
        })
        .use(accountRouter)
    )
    .use(authRouter)
    .use(swagger({
        documentation: {
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