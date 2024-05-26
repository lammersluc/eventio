import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import userRouter from './user';
import idRouter from './id';

export default new Elysia({ prefix: '/events', tags: ['Event'] })
    .use(userRouter)
    .use(idRouter)
    
    .get('', async ({ query }) => {        
        const events = await prisma.event.findMany({
            where: {
                name: {
                    contains: query.search
                },
                end_at: {
                    gte: new Date
                },
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
            endAt: event.end_at
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

    .post('', async ({ body, store }) => {
        const { uid } = store as { uid: number };

        const event = await prisma.event.create({
            data: {
                name: body.name,
                event_members: {
                    create: {
                        user_id: uid,
                        role: 'creator'
                    }
                }
            },
            select: {
                id: true
            }
        });

        return {
            id: event.id
        };
    }, {
        body: t.Object({
            name: t.String()
        }),
        response: {
            201: t.Object({
                id: t.Number()
            })
        },
        tags: ['Creator']
    })