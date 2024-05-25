import { Elysia, t } from 'elysia';

import { generateTokens } from '@/services/tokens';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/password' })
    .patch('/', async ({ body, error, store }) => {
        let user = await prisma.user.findUnique({
            where: {
                id: (store as { uid: number }).uid
            }
        });

        if (
            !user || 
            !(await Bun.password.verify(body.oldPassword, user.password))
        ) return error(401, '');

        user = await prisma.user.update({
            where: {
                id: (store as { uid: number }).uid
            },
            data: {
                password: await Bun.password.hash(body.newPassword),
                updated_at: new Date
            }
        }).catch(() => null);

        if (!user) return error(500, '');

        return generateTokens(user.id);
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