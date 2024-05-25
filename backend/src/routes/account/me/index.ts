import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/me' })
    .get('/', async ({ error, store }) => {
        const user = await prisma.user.findUnique({
            where: {
                id: (store as { uid: number }).uid
            }
        });

        if (!user) return error(404, '');

        return {
            username: user.username,
            email: user.email,
            createdAt: user.created_at
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
    })