import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client';

export default new Elysia({ prefix: '/username' })
    .patch('/', async ({ body, set, store }) => {
        const prisma = new PrismaClient();

        const user = await prisma.user.update({
            where: {
                id: (store as { uid: number }).uid
            },
            data: {
                username: body.username
            }
        }).catch(() => null);
        
        if (!user) {
            set.status = 409;
            return;
        }

        return;
    }, {
        body: t.Object({
            username: t.String({ pattern: '^[a-z0-9]{3,16}$', default: '' }),
        }),
        response: {
            200: t.Void(),
            409: t.Void()
        }
    })