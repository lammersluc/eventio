import { Elysia, t } from 'elysia';
import { zxcvbn } from '@zxcvbn-ts/core';

import { generateTokens } from '@/services/tokens';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/register' })
    .post('', async ({ body, set, error }) => {

        if (zxcvbn(body.password).score < 3) return error(400, '');

        const user = await prisma.user.findUnique({
            where: {
                    username: body.username
            },
            select: {
                id: true
            }
        });

        if (user) return error(409, 'username');

        const created = await prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: await Bun.password.hash(body.password)
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!created) return error(409, 'email');

        set.status = 201;
        return generateTokens(created.id);
    }, {
        body: t.Object({
            username: t.String({ pattern: '^[a-z0-9_]{3,16}$' }),
            email: t.String({ format: 'email' }),
            password: t.String()
        }),
        response: {
            201: t.Object({
                accessToken: t.String(),
                refreshToken: t.String()
            }),
            400: t.String(),
            409: t.String()
        }
    })