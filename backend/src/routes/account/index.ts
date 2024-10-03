import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

import passwordRouter from './password';
import imageRouter from './image';
import findRouter from './find';
import { getImage } from '@/services/image';

export default new Elysia({ prefix: '/account', tags: ['Account'] })
    .use(passwordRouter)
    .use(imageRouter)
    .use(findRouter)

    .get('', async ({ error, store }) => {
        const { id } = store as { id: string };
        
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                username: true,
                email: true,
                image_hash: true,
                created_at: true
            }
        });

        if (!user) return error(404, '');

        const image = getImage(id, user.image_hash, 'users');

        return {
            username: user.username,
            email: user.email,
            image,
            createdAt: user.created_at
        };
    }, {
        response: {
            200: t.Object({
                username: t.String(),
                email: t.String(),
                image: t.Nullable(t.String()),
                createdAt: t.Date(),
            }),
            404: t.String()
        }
    })

    .patch('', async ({ body, error, store }) => {
        const { id } = store as { id: string };

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: body.username },
                    { email: body.email }
                ]
            },
            select: {
                username: true,
                email: true
            }
        });

        let conflicts: string[] = [];

        users.forEach(({ username, email }) => {
            if (username === body.username) conflicts.push('username');
            if (email === body.email) conflicts.push('email');
        });

        if (conflicts.length) return error(409, conflicts);

        const updated = await prisma.user.update({
            where: {
                id
            },
            data: {
                username: body.username,
                email: body.email
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Partial(t.Object({
            username: t.String(),
            email: t.String()
        })),
        response: {
            200: t.String(),
            409: t.Array(t.String()),
            500: t.String()
        }
    })

    .delete('', async ({ body, error, store }) => {
        const { id } = store as { id: string };

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                password: true,
                image_hash: true
            }
        });

        if (!user) return error(500, '');

        if (await Bun.password.verify(body.password, user.password)) return error(401, '');

        if (user.image_hash && fs.existsSync(`./public/images/users/${id}.png`))
            fs.rmSync(`./public/images/users/${id}.png`);

        const deleted = await prisma.user.delete({
            where: {
                id
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