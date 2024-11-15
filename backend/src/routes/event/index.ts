import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import userRouter from './user';
import eventIdRouter from './{eventId}';
import { getImage } from '@/services/image';

export default new Elysia({ prefix: '/events', tags: ['Event'] })
    .use(userRouter)
    .use(eventIdRouter)
    
    .get('', async ({ query }) => {    
            
        const events = await prisma.event.findMany({
            where: {
                is_private: false,
                name: {
                    mode: 'insensitive',
                    contains: query.search
                },
                end_at: {
                    gte: new Date
                },
            },
            select: {
                id: true,
                name: true,
                banner_hash: true,
                start_at: true,
                wallets: {
                    select: {
                        _count: {
                            select: {
                                tickets: true
                            }
                        }
                    }
                },
                ticket_dates: {
                    select: {
                        amount: true
                    }
                }
            },
            take: +query.limit
        });

        return events.map(event => {
            const banner = getImage(event.id, event.banner_hash, 'events', 'banner');

            return {
                id: event.id,
                name: event.name,
                banner,
                startAt: event.start_at,
                available: event.ticket_dates.reduce((amount, date) => amount + date.amount, 0) - event.wallets.reduce((amount, wallet) => amount + wallet._count.tickets, 0)
            }
        });
    }, {
        query: t.Object({
            search: t.Optional(t.String()),
            limit: t.String({ pattern: '^([1]?[0-9]|20)$', default: '5' })
        }),
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                name: t.String(),
                banner: t.String(),
                startAt: t.Nullable(t.Date()),
                available: t.Number()
            }))
        }
    })