import { Elysia, t } from 'elysia';

import { generateTokens } from '@/services/tokens';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/register' })
    .post('/', async ({ body, error }) => {
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
            userExists = (await prisma.user.findUnique({
                where: {
                    username: newUsername
                }
            })) ? true : false;

            if (count % 10 === 0) range *= 10;
            count++;
        }

        const user = await prisma.user.create({
            data: {
                username: newUsername,
                email: body.email,
                password: await Bun.password.hash(body.password)
            }
        }).catch(() => null);

        if (!user) return error(409, '');

        return generateTokens(user.id);
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String({ pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,128}$', default: '' })
        }),
        response: {
            200: t.Object({
                accessToken: t.String(),
                refreshToken: t.String()
            }),
            409: t.String()
        }
    })