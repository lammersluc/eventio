import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import userRouter from './user';

export default new Elysia({ prefix: '/events' })
    .use(userRouter)
    .get('', async ({ params }) => {
        const events = await prisma.event.findMany({
            orderBy: {
                tickets_sold: 'desc',
                start_at: 'asc'
            },
            select: {
                id: true,
                name: true,
                location: true,
                start_at: true,
                end_at: true
            },
            take: params.limit
        });

        return {
            events: events.map(event => ({
                id: event.id,
                name: event.name,
                location: event.location,
                startAt: event.start_at,
                endAt: event.end_at
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