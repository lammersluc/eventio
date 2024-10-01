import { Elysia, t } from 'elysia';
import { zxcvbn } from '@zxcvbn-ts/core';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/password' })
    .patch('', async ({ body, error, store }) => {
        const { id } = store as { id: string };

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                password: true
            }
        });

        if (!user) return error(500, '');
        if (!await Bun.password.verify(body.oldPassword, user.password)) return error(401, '');

        if (zxcvbn(body.newPassword).score < 3) return error(400, '');

        const updated = await prisma.user.update({
            where: {
                id
            },
            data: {
                password: await Bun.password.hash(body.newPassword)
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Object({
            oldPassword: t.String(),
            newPassword: t.String()
        }),
        response: {
            200: t.String(),
            400: t.String(),
            401: t.String(),
            500: t.String()
        }
    })