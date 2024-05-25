import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/tickets' })
    .get('', async ({ store }) => {
        const { uid } = store as { uid: number };

        const tickets = await prisma.ticket.findMany({
            where: {
                wallet: {
                    user_id: uid
                },
                ticket_option: {
                    ticket_date: {
                        valid_until: {
                            gte: new Date()
                        }
                    }
                }
            },
            include: {
                ticket_option: {
                    include: {
                        ticket_date: {
                            include: {
                                event: true
                            }
                        
                        }
                    }
                }
            }
        });

        return {
            tickets: tickets.map(ticket => ({
                id: ticket.id,
                name: ticket.ticket_option.name,
                event: ticket.ticket_option.ticket_date.event.name,
                purchasedAt: ticket.purchased_at,
                scannedAt: ticket.scanned_at
            }))
        };
    }, {
        response: {
            200: t.Object({
                tickets: t.Array(t.Object({
                    id: t.Number(),
                    name: t.String(),
                    event: t.String(),
                    purchasedAt: t.Date(),
                    scannedAt: t.Nullable(t.Date())
                }))
            })
        }
    })