import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import findRouter from './find';
import imageRouter from './image';

export default new Elysia({ prefix: '/account', tags: ['Account'] })
    .use(findRouter)
    .use(imageRouter)

    .get('', async ({ error, store }) => {
        const { uid } = store as { uid: number };
        
        const user = await prisma.user.findUnique({
            where: {
                id: uid
            },
            select: {
                username: true,
                email: true,
                created_at: true
            }
        });

        if (!user) return error(404, '');

        return {
            username: user.username,
            email: user.email,
            createdAt: user.created_at
        };
    }, {
        response: {
            200: t.Object({
                username: t.String(),
                email: t.String(),
                createdAt: t.Date(),
            }),
            404: t.String()
        }
    })

    .patch('', async ({ body, error, store }) => {
        const { uid } = store as { uid: number };

        let password = undefined;

        if (body.password) {
            const user = await prisma.user.findUnique({
                where: {
                    id: uid
                },
                select: {
                    password: true
                }
            });

            if (!user) return error(500, '');
            if (!await Bun.password.verify(body.password.current, user.password)) return error(401, '');

            password = await Bun.password.hash(body.password.new);
        }

        const data = {
            username: body.username,
            password
        }

        const user = await prisma.user.update({
            where: {
                id: uid
            },
            data,
            select: {
                id: true
            }
        }).catch(() => null);

        if (!user) return error(409, '');

        return '';
    }, {
        body: t.Partial(t.Object({
            username: t.String({ pattern: '^[a-z0-9]{3,16}$', default: '' }),
            password: t.Object({
                current: t.String(),
                new: t.String()
            })
        })),
        response: {
            200: t.String(),
            401: t.String(),
            409: t.String(),
            500: t.String()
        }
    })

    .delete('', async ({ body, error, store }) => {
        const { uid } = store as { uid: number };

        const user = await prisma.user.findUnique({
            where: {
                id: uid
            },
            select: {
                password: true
            }
        }).catch(() => null);

        if (!user) return error(500, '');

        if (await Bun.password.verify(body.password, user.password)) return error(401, '');

        const deleted = await prisma.user.delete({
            where: {
                id: uid
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!deleted) return error(500, '');

        return '';
    }, {
        body: t.Object({
            password: t.String()
        }),
        response: {
            200: t.String(),
            401: t.String(),
            500: t.String()
        }
    })