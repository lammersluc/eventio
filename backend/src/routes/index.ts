import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import accountRouter from './account'

export default new Elysia()
    .use(accountRouter)
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