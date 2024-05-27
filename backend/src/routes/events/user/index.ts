import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/user' })
    .get('', async ({ query, store }) => {
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
            orderBy: {
                start_at: 'asc'
            },
            select: {
                id: true,
                name: true,
                has_image: true,
                start_at: true
            }
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
        query: (t.Object({
            search: t.Optional(t.String())
        })),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                image: t.Nullable(t.String()),
                startAt: t.Nullable(t.Date())
            }))
        }
    })