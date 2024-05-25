import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/username' })
    .patch('/', async ({ body, error, store }) => {
        const user = await prisma.user.update({
            where: {
                id: (store as { uid: number }).uid
            },
            data: {
                username: body.username
            }
        }).catch(() => null);

        if (!user) return error(409, '');

        return '';
    }, {
        body: t.Object({
            username: t.String({ pattern: '^[a-z0-9]{3,16}$', default: '' })
        }),
        response: {
            200: t.String(),
            409: t.String()
        }
    })