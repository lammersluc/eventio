import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import jwt from '@elysiajs/jwt'

import authRouter from './auth'
import accountRouter from './account'

export default new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
        exp: process.env.JWT_EXP
    }))
    .guard({
        async beforeHandle({ error, cookie: { auth }, jwt }) {
            const token = await jwt.verify(auth.value);
            if (!token) return error(401, undefined)

            if ((Date.now() / 1000) - (token.iat || 0) > parseInt(process.env.JWT_REFRESH!))
                auth.set({
                    value: await jwt.sign({
                        id: token.id
                    })
                })
        }
    }, app => app
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