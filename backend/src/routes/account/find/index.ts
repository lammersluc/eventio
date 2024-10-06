import { Elysia, t } from 'elysia';

import prisma from '@/services/database';
import { getImage } from '@/services/image';

export default new Elysia({ prefix: '/find' })
    .get('', async ({ query }) => {   
             
        const users = await prisma.user.findMany({
            where: {
                username: {
                    startsWith: query.search,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                username: true,
                avatar_hash: true
            },
            orderBy: {
                username: 'asc'
            },
            skip: (+query.page - 1) * +query.size,
            take: +query.size
        });

        return users.map(user => {
            const avatar = getImage(user.id, user.avatar_hash, 'users');
            
            return {
                id: user.id,
                username: user.username,
                avatar
            };
        });
    }, {
        query: t.Object({
            search: t.String(),
            page: t.String({ pattern: '^([1-9]\d*)$' }),
            size: t.String({ pattern: '^([1-9]|1[0-5])$' })
        }),
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                username: t.String(),
                avatar: t.String()
            })),
            404: t.String()
        }
    })