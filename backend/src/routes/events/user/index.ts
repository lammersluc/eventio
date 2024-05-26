import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/user' })
    .get('', async ({ query, store }) => {
        const { uid } = store as { uid: number };
        
        const events = await prisma.event.findMany({
            where: {
                wallets: {
                    some: {
                        user_id: uid
                    }
                },
                end_at: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            },
            select: {
                id: true,
                name: true,
                location: true,
                start_at: true,
                end_at: true
            },
            take: query.limit ? +query.limit : 10
        });

        return events.map(event => ({
            id: event.id,
            name: event.name,
            location: event.location,
            startAt: event.start_at,
            endAt: event.end_at,
        }));
    }, {
        query: t.Partial(t.Object({
            search: t.String(),
            limit: t.String()
        })),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                location: t.Nullable(t.String()),
                startAt: t.Nullable(t.Date()),
                endAt: t.Nullable(t.Date())
            }))
        }
    })