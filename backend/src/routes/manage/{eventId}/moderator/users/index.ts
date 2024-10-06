import { Elysia, t } from 'elysia';

import prisma from '@/services/database';
import { getImage } from '@/services/image';

export default new Elysia({ prefix: '/users' })    
    .get('', async ({ params, query }) => {        
        const users = await prisma.user.findMany({
            where: {
                username: {
                    startsWith: query.search
                },
                wallets: {
                    some: {
                        event_id: params.eventId
                    }
                }
            },
            orderBy: {
                username: 'asc'
            },
            take: +query.limit,
            select: {
                id: true,
                username: true,
                avatar_hash: true
            }
        });

        return users.map(user => {
            const avatar = getImage(user.id, user.avatar_hash, 'users');
            return {
                id: user.id,
                username: user.username,
                avatar
            };
        });
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        query: t.Object({
            search: t.String(),
            limit: t.String({ pattern: '^(10|[1-9])$', default: '1' })
        }),
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                username: t.String(),
                avatar: t.String()
            })),
            404: t.String()
        }
    })

    .get('/:userId/wallet', async ({ params, error }) => {        
        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: params.userId,
                    event_id: params.eventId
                }
            },
            select: {
                id: true,
                coins: true,
                tickets: {
                    select: {
                        id: true,
                        purchased_at: true,
                        scanned_at: true,
                        ticket_option: {
                            select: {
                                name: true,
                                ticket_date: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!wallet) return error(404, '');

        return {
            id: wallet.id,
            coins: wallet.coins,
            tickets: wallet.tickets.map(ticket => ({
                id: ticket.id,
                option: ticket.ticket_option.name,
                date: ticket.ticket_option.ticket_date.name,
                purchasedAt: ticket.purchased_at,
                scannedAt: ticket.scanned_at
            }))
        };
    }, {
        params: t.Object({
            eventId: t.String(),
            userId: t.String()
        }),
        response: {
            200: t.Object({
                id: t.String(),
                coins: t.Number(),
                tickets: t.Array(t.Object({
                    id: t.String(),
                    option: t.String(),
                    date: t.String(),
                    purchasedAt: t.Date(),
                    scannedAt: t.Nullable(t.Date())
                }))
            }),
            404: t.String()
        }
    })