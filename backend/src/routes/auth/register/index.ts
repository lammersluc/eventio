import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';
import jwt from '@elysiajs/jwt';

export default new Elysia({ prefix: '/register' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
        exp: process.env.JWT_EXP
    }))
    .post('/', async ({ body, set, jwt }) => {

        const emailRegex = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|.('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (
            !emailRegex.test(body.email) ||
            !passwordRegex.test(body.password)
        ) {
            set.status = 400;
            return;
        }

        const prisma = new PrismaClient();

        let username = body.email.split('@')[0].toLowerCase().replace(/[^a-z]/g, '');
        const count = await prisma.user.count({
            where: {
                username: { startsWith: username }
            }
        });

        username += count ? count : '';

        const user = await prisma.user.create({
            data: {
                username,
                email: body.email,
                password: await Bun.password.hash(body.password)
            }
        }).catch(() => null);

        if (!user) {
            set.status = 409;
            return;
        }
    
        set.headers['Authorization'] = await jwt.sign({ id: user.id });
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        }),
        response: {
            200: t.Void(),
            400: t.Void(),
            409: t.Void()
        }
    }
)