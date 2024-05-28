import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/password' })
    .patch('', async ({ body, error, store }) => {
        const { uid } = store as { uid: number };

        const user = await prisma.user.findUnique({
            where: {
                id: uid
            },
            select: {
                password: true
            }
        });

        if (!user) return error(500, '');
        if (!await Bun.password.verify(body.password.current, user.password)) return error(401, '');

        const password = await Bun.password.hash(body.password.new);

        const updated = await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                password
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Object({
            password: t.Object({
                current: t.String(),
                new: t.String({ pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,128}$' })
            })
        }),
        response: {
            200: t.String(),
            401: t.String(),
            409: t.String(),
            500: t.String()
        }
    })