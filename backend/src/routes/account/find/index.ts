import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/find' })
    .get('', async ({ query }) => {   
             
        const users = await prisma.user.findMany({
            where: {
                username: {
                    startsWith: query.search
                }
            },
            orderBy: {
                username: 'asc'
            },
            take: +query.limit,
            select: {
                id: true,
                username: true,
                has_image: true
            }
        });

        return users.map(user => {
            const image = user.has_image ? fs.readFileSync(`./images/users/${user.id}.png`, { encoding: 'base64' }) : null;
            return {
                id: user.id,
                username: user.username,
                image
            };
        });
    }, {
        query: t.Object({
            search: t.String(),
            limit: t.String({ pattern: '^(10|[1-9])$', default: '1' })
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                username: t.String(),
                image: t.Nullable(t.String())
            })),
            404: t.String()
        }
    })