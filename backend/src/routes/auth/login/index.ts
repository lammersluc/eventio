import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';
import { generateTokens } from '../../../services/tokens';

export default new Elysia({ prefix: '/login' })
    .post('/', async ({ body, set }) => {
        const prisma = new PrismaClient();

        const user = await prisma.user.findFirst({
            where: {
                email: body.email
            }
        }).catch(() => null);

        if (
            !user ||
            !await Bun.password.verify(body.password, user.password)
        ) {
             set.status = 401;
            return;
        }
    
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
            401: t.Void()
        }
    })