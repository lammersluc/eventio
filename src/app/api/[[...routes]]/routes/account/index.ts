import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '#/services/database';

import usernameRouter from './username';
import passwordRouter from './password';
import imageRouter from './image';
import findRouter from './find';

export default new Elysia({ prefix: '/account', tags: ['Account'] })
    .use(usernameRouter)
    .use(passwordRouter)
    .use(imageRouter)
    .use(findRouter)

    .get('', async ({ error, store }) => {
        const { uid } = store as { uid: number };
        
        const user = await prisma.user.findUnique({
            where: {
                id: uid
            },
            select: {
                username: true,
                email: true,
                has_image: true,
                created_at: true
            }
        });

        if (!user) return error(404, '');

        const image = user.has_image ? fs.readFileSync(`./images/users/${uid}.png`, { encoding: 'base64' }) : null;

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

    .delete('', async ({ body, error, store }) => {
        const { uid } = store as { uid: number };

        const user = await prisma.user.findUnique({
            where: {
                id: uid
            },
            select: {
                password: true
            }
        });

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