import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';
import jwt from '@elysiajs/jwt';

export default new Elysia({ prefix: '/login' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
        exp: process.env.JWT_EXP
    }))
    .post('/', async ({ body, error, set, jwt }) => {
        const prisma = new PrismaClient();

        const user = await prisma.user.findFirst({
            where: {
                email: body.email
            }
        }).catch(() => null);

        if (
            !user ||
            !await Bun.password.verify(body.password, user.password)
        ) return error(401, undefined);
    
        set.headers['Authorization'] = await jwt.sign({ id: user.id });
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        }),
        cookie: t.Cookie({
            auth: t.Optional(t.String())
        }),
        response: {
            200: t.Void(),
            401: t.Void()
        }
    }
)