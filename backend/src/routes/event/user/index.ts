import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/user' })
    .get('', async ({ query, error, store }) => {
        const { uid } = store as { uid: number };
        
        const events = await prisma.event.findMany({
            where: {
                is_private: false,
                wallets: {
                    some: {
                        user_id: uid
                    }
                },
                name: {
                    startsWith: query.search
                },
                end_at: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            },
            select: {
                id: true,
                name: true,
                has_image: true,
                start_at: true,
                _count: true
            }
        });

        return {
            events: events.map(event => {
                const image = event.has_image ? fs.readFileSync(`./images/events/${event.id}.png`, { encoding: 'base64' }) : null;

                return {
                    id: event.id,
                    name: event.name,
                    image,
                    startAt: event.start_at
                }
            }),
            pages: Math.ceil(events.length / 10)
        }
    }, {
        query: t.Object({
            search: t.Optional(t.String()),
            page: t.String({ pattern: '^([1-9]\d*)$' }),
            size: t.String({ pattern: '^([1-9]|1[0-5])$' })
        }),
        response: {
            200: t.Object({
                events: t.Array(t.Object({
                    id: t.Number(),
                    name: t.String(),
                    image: t.Nullable(t.String()),
                    startAt: t.Nullable(t.Date())
                })),
                pages: t.Number()
            }),
            400: t.String()
        }
    })