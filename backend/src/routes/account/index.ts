import { Elysia, t } from 'elysia';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '@/services/database';

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
        const { id } = store as { id: string };
        
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                username: true,
                email: true,
                has_image: true,
                created_at: true
            }
        });

        if (!user) return error(404, '');

        const image = (typeof window !== 'undefined' ? window.location.host : 'http://localhost:3000') +
                '/public/images/users/' + (user.has_image ? id : 'default') + '.png';

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
        const { id } = store as { id: string };

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                password: true,
                has_image: true
            }
        });

        if (!user) return error(500, '');

        if (await Bun.password.verify(body.password, user.password)) return error(401, '');

        if (user.has_image && fs.existsSync(`./public/images/users/${id}.png`))
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