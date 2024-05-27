import { Elysia, t } from 'elysia';

import { generateTokens } from '@/services/tokens';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/register' })
    .post('', async ({ body, set, error }) => {
        const username = body.email
            .split('@')[0]
            .toLowerCase()
            .replace(/[^a-z]/g, '');

        let newUsername = username;
        let count = 1;
        let range = 100;
        let userExists = true;

        while (userExists) {
            const digits = Math.floor(range + Math.random() * range * 9);

            newUsername = username + digits;
            userExists = await prisma.user.findUnique({
                where: {
                    username: newUsername
                },
                select: {
                    id: true
                }
            }) ? true : false;

            if (count % 10 === 0) range *= 10;
            count++;
        }

        const created = await prisma.user.create({
            data: {
                username: newUsername,
                email: body.email,
                password: await Bun.password.hash(body.password)
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!created) return error(409, '');

        set.status = 201;
        return generateTokens(created.id);
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String({ pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,128}$', default: '' })
        }),
        response: {
            201: t.Object({
                accessToken: t.String(),
                refreshToken: t.String()
            }),
            409: t.String()
        }
    })