import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/user' })
    .get('', async ({ params, store }) => {
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
            take: params.limit,
            orderBy: {
                start_at: 'asc'
            }
        });

        return {
            events: events.map(event => ({
                id: event.id,
                name: event.name,
                location: event.location,
                startAt: event.start_at,
                endAt: event.end_at,
            }))
        };
    }, {
        params: t.Object({
            limit: t.Number()
        }),
        response: {
            200: t.Object({
                events: t.Array(t.Object({
                    id: t.Number(),
                    name: t.String(),
                    location: t.String(),
                    startAt: t.Date(),
                    endAt: t.Date()
                }))
            })
        }
    })