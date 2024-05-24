import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';

export default new Elysia({ prefix: '/me' })
    .get('/', async ({ set, store }) => {
        const prisma = new PrismaClient();

        const user = await prisma.user.findUnique({
            where: {
                id: (store as { uid: number }).uid
            }
        });

        if (!user) {
            set.status = 404;
            return;
        }

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
            404: t.Void()
        }
    })