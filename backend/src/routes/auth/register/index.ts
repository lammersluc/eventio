import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';
import jwt from '@elysiajs/jwt';

export default new Elysia({ prefix: "/register" })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
        exp: process.env.JWT_EXP
    }))
    .post('/', async ({ body, error, cookie: { auth }, jwt }) => {

        const usernameRegex = /^[a-z0-9]{3,16}/
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (
            !usernameRegex.test(body.username) ||
            !emailRegex.test(body.email) ||
            !passwordRegex.test(body.password)
        ) return error(400, undefined);

        const prisma = new PrismaClient();

        const hash = await Bun.password.hash(body.password)

        const user = await prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: hash
            }
        }).catch(() => null);

        if (!user) return error(409, undefined);
    
        auth.set({
            value: await jwt.sign({
                id: user.id
            }),
        });
    }, {
        body: t.Object({
            username: t.String(),
            email: t.String(),
            password: t.String()
        }),
        cookie: t.Cookie({
            auth: t.Optional(t.String())
        }),
        response: {
            200: t.Void(),
            400: t.Void(),
            409: t.Void()
        }
    }
)