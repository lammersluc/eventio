import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/email' })
    .patch('', async ({ body, error, store }) => {
        const { id } = store as { id: string };

        const updated = await prisma.user.update({
            where: {
                id
            },
            data: {
                email: body.email
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(409, '');

        return '';
    }, {
        body: t.Object({
            email: t.String({ format: 'email' })
        }),
        response: {
            200: t.String(),
            409: t.String()
        }
    })