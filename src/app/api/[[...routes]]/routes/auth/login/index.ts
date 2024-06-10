import { Elysia, t } from 'elysia';

import { generateTokens } from '#/services/tokens';
import prisma from '#/services/database';

export default new Elysia({ prefix: '/login' })
    .post('', async ({ body, error }) => {

        const user = await prisma.user.findFirst({
            where: {
                email: body.email
            },
            select: {
                id: true,
                password: true
            }
        });

        if (
            !user ||
            !(await Bun.password.verify(body.password, user.password))
        ) return error(401, '');

        return generateTokens(user.id);
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        }),
        response: {
            200: t.Object({
                accessToken: t.String(),
                refreshToken: t.String()
            }),
            401: t.String()
        }
    })