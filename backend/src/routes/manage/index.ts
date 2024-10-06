import { Elysia, error, t } from 'elysia';

import prisma from '@/services/database';
import { getImage } from '@/services/image';

import eventIdRouter from './{eventId}';

export default new Elysia({ prefix: '/manage/events' })
    .use(eventIdRouter)

    .get('', async ({ store }) => {
        const { id } = store as unknown as { id: string };

        const events = await prisma.event.findMany({
            where: {
                event_members: {
                    some: {
                        user_id: id
                    }
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                banner_hash: true
            }
        });

        return events.map(event => {
            const banner = getImage(event.id, event.banner_hash, 'events', 'banner');

            return {
                id: event.id,
                name: event.name,
                description: event.description,
                banner
            }
        });
    }, {
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                name: t.String(),
                description: t.String(),
                banner: t.String()
            }))
        },
        tags: ['Manage']
    })