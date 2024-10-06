import { Elysia, t } from 'elysia';

import prisma from '@/services/database';
import { getImage } from '@/services/image';

export default new Elysia({ prefix: '/user' })
    .get('', async ({ query, store }) => {
        const { id } = store as { id: string };
        
        const events = await prisma.event.findMany({
            where: {
                is_private: false,
                wallets: {
                    some: {
                        user_id: id
                    }
                },
                name: {
                    startsWith: query.search
                },
                end_at: {
                    gte: new Date()
                }
            },
            select: {
                id: true,
                name: true,
                banner_hash: true,
                start_at: true,
                _count: true
            }
        });

        return events.map(event => {
            const banner = getImage(event.id, event.banner_hash, 'events', 'banner');

            return {
                id: event.id,
                name: event.name,
                banner,
                startAt: event.start_at
            }
        })
    }, {
        query: t.Object({
            search: t.Optional(t.String()),
            page: t.String({ pattern: '^([1-9]\d*)$' }),
            size: t.String({ pattern: '^([1-9]|1[0-5])$' })
        }),
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                name: t.String(),
                banner: t.String(),
                startAt: t.Nullable(t.Date())
            }))
        }
    })

    .get('/history', async ({ query, store }) => {
        const { id } = store as { id: string };
        
        const events = await prisma.event.findMany({
            where: {
                is_private: false,
                wallets: {
                    some: {
                        user_id: id
                    }
                },
                name: {
                    startsWith: query.search
                },
                end_at: {
                    lt: new Date()
                }
            },
            select: {
                id: true,
                name: true,
                banner_hash: true,
                start_at: true,
                _count: true
            }
        });

        return events.map(event => {
            const banner = getImage(event.id, event.banner_hash, 'events', 'banner');

            return {
                id: event.id,
                name: event.name,
                banner,
                startAt: event.start_at
            }
        })
    }, {
        query: t.Object({
            search: t.Optional(t.String()),
            page: t.String({ pattern: '^([1-9]\d*)$' }),
            size: t.String({ pattern: '^([1-9]|1[0-5])$' })
        }),
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                name: t.String(),
                banner: t.String(),
                startAt: t.Nullable(t.Date())
            }))
        }
    })