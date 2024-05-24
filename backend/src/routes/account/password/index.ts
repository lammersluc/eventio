import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';

export default new Elysia({ prefix: '/password' })
    .patch('/', async ({ body, set, store }) => {
        const prisma = new PrismaClient();

        let user = await prisma.user.findUnique({
            where: {
                id: (store as { uid: number }).uid
            }
        });

        if (!user || !await Bun.password.verify(body.oldPassword, user.password)) {
            set.status = 401;
            return;
        }

        user = await prisma.user.update({
            where: {
                id: (store as { uid: number }).uid
            },
            data: {
                password: await Bun.password.hash(body.newPassword)
            }
        }).catch(() => null);
        
        if (!user) {
            set.status = 500;
            return;
        }

        return;
    }, {
        body: t.Object({
            oldPassword: t.String(),
            newPassword: t.String({ pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', default: '' }),
        }),
        response: {
            200: t.Void(),
            401: t.Void(),
            500: t.Void()
        }
    })