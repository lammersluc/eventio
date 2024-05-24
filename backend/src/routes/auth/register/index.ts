import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';

import { generateTokens } from '@/services/tokens';

export default new Elysia({ prefix: '/register' })
    .post('/', async ({ body, set }) => {
        const prisma = new PrismaClient();

        const username = body.email.split('@')[0].toLowerCase().replace(/[^a-z]/g, '');
        let newUsername = username;

        let count = 1;
        let range = 100;
        let userExists = true;

        while (userExists) {
            const digits = Math.floor(range + (Math.random() * range * 9));
            newUsername = username + digits;

            userExists = await prisma.user.findUnique({
                where: {
                    username: newUsername
                }
            }) ? true : false;

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

        if (!user) {
            set.status = 409;
            return;
        }
    
        return generateTokens(user.id);
    }, {
        body: t.Object({
            email: t.String({ pattern: "^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|.('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$", default: ''}),
            password: t.String({ pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', default: ''})
        }),
        response: {
            200: t.Object({
                accessToken: t.String(),
                refreshToken: t.String()
            }),
            409: t.Void()
        }
    })