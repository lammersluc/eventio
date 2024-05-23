import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';

export default new Elysia({ prefix: "/me" })
    .get('/', async ({  }) => {
        return {
            username: 'username',
            email: 'email',
            createdAt: 'createdAt',
        };
    }, {
        response: {
            200: t.Object({
                username: t.String(),
                email: t.String(),
                createdAt: t.String(),
            }),
        }
    }
)