import { Elysia, t } from 'elysia';

import { generateTokens } from '@/services/tokens';
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

        if (
            !user || 
            !(await Bun.password.verify(body.oldPassword, user.password))
        ) return error(401, '');

        const updatedUser = await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                password: await Bun.password.hash(body.newPassword),
                updated_at: new Date
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updatedUser) return error(500, '');

        return generateTokens(updatedUser.id);
    }, {
        body: t.Object({
            oldPassword: t.String(),
            newPassword: t.String({ pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,128}$', default: '' })
        }),
        response: {
            200: t.Object({
                accessToken: t.String(),
                refreshToken: t.String(),
            }),
            401: t.String(),
            500: t.String()
        }
    })