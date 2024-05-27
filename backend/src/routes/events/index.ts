import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

import userRouter from './user';
import eventIdRouter from './{eventId}';

export default new Elysia({ prefix: '/events', tags: ['Event'] })
    .use(userRouter)
    .use(eventIdRouter)
    
    .get('', async ({ query }) => {    
            
        const events = await prisma.event.findMany({
            where: {
                is_private: false,
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
                has_image: true,
                start_at: true
            },
            take: +query.limit
        });

        return events.map(event => {
            const image = event.has_image ? fs.readFileSync(`./images/events/${event.id}.png`, { encoding: 'base64' }) : null;
            
            return {
                id: event.id,
                name: event.name,
                image,
                startAt: event.start_at
            }
        });
    }, {
        query: t.Object({
            search: t.Optional(t.String()),
            limit: t.String({ pattern: '^([1]?[0-9]|20)$', default: '5' })
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                image: t.Nullable(t.String()),
                startAt: t.Nullable(t.Date())
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