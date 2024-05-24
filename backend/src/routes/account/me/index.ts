import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';

export default new Elysia({ prefix: '/me' })
    .get('/', async ({ error, store }) => {
        const prisma = new PrismaClient();

        let id = 0;

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!user) return error(404, 'Not Found');

        return {
            username: user.username,
            email: user.email,
            createdAt: user.created_at,
        };
    }, {
        response: {
            200: t.Object({
                username: t.String(),
                email: t.String(),
                createdAt: t.Date(),
            }),
            404: t.String()
        }
    }
)