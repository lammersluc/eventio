import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/users' })    
    .get('', async ({ params, query }) => {        
        const users = await prisma.user.findMany({
            where: {
                username: {
                    startsWith: query.search
                },
                wallets: {
                    some: {
                        event_id: +params.eventId
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
                has_image: true
            }
        });

        return users.map(user => {
            const image = user.has_image ? fs.readFileSync(`./images/users/${user.id}.png`, { encoding: 'base64' }) : null;
            return {
                id: user.id,
                username: user.username,
                image
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
                id: t.Number(),
                username: t.String(),
                image: t.Nullable(t.String())
            })),
            404: t.String()
        }
    })

    .get('/:userId/wallet', async ({ params, error }) => {        
        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: +params.userId,
                    event_id: +params.eventId
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
                id: t.Number(),
                coins: t.Number(),
                tickets: t.Array(t.Object({
                    id: t.Number(),
                    option: t.String(),
                    date: t.String(),
                    purchasedAt: t.Date(),
                    scannedAt: t.Nullable(t.Date())
                }))
            }),
            404: t.String()
        }
    })