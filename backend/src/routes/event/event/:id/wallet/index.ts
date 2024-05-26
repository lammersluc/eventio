import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/wallet' })
    .get('', async ({ error, params, store }) => {
        const { uid } = store as { uid: number };

        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: uid,
                    event_id: +params.id
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
                                        name: true,
                                        event: {
                                            select: {
                                                name: true
                                            }
                                        }
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
                name: ticket.ticket_option.name,
                event: ticket.ticket_option.ticket_date.event.name,
                purchasedAt: ticket.purchased_at,
                scannedAt: ticket.scanned_at
            }))
        };
    }, {
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Object({
                id: t.Number(),
                coins: t.Number(),
                tickets: t.Array(t.Object({
                    id: t.Number(),
                    name: t.String(),
                    event: t.String(),
                    purchasedAt: t.Date(),
                    scannedAt: t.Nullable(t.Date())
                }))
            }),
            404: t.String()
        }
    })