import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/username' })
    .patch('', async ({ body, error, store }) => {
        const { uid } = store as { uid: number };

        const updated = await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                username: body.username
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(409, '');

        return '';
    }, {
        body: t.Object({
            username: t.String({ pattern: '^[a-z0-9]{3,16}$', default: '' }),
        }),
        response: {
            200: t.String(),
            409: t.String()
        }
    })