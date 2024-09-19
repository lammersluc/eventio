import { Elysia, t } from 'elysia';
import { zxcvbn } from '@zxcvbn-ts/core';

import { generateTokens } from '@/services/tokens';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/register' })
    .post('', async ({ body, set, error }) => {

        if (zxcvbn(body.password).score < 3) return error(400, '');

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: body.username },
                    { email: body.email }
                ]
            },
            select: {
                username: true,
                email: true
            }
        });

        let conflicts: string[] = [];

        users.forEach(({ username, email }) => {
            if (username === body.username) conflicts.push('username');
            if (email === body.email) conflicts.push('email');
        });


        if (conflicts.length) return error(409, conflicts);

        const created = await prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: await Bun.password.hash(body.password)
            },
            select: {
                id: true
            }
        });

        set.status = 201;
        return generateTokens(created.id);
    }, {
        body: t.Object({
            username: t.String({ pattern: '^[a-z0-9_]{3,16}$' }),
            email: t.String({ format: 'email' }),
            password: t.String({  })
        }),
        response: {
            201: t.Object({
                accessToken: t.String(),
                refreshToken: t.String()
            }),
            400: t.String(),
            409: t.Array(t.String())
        }
    })