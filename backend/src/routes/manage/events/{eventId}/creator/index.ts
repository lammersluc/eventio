import { Elysia, error, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ tags: ['Creator'] })
    .onBeforeHandle(({ error, store }) => {
        const { eventMember } = store as { eventMember: { role: number } };

        if (eventMember.role < 5) return error(403, '');
    })
    
    .delete('', async ({ params: { eventId } }) => {

        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                wallets: {
                    some: {
                        OR: [
                            { coins: { not: 0 } },
                            { tickets: { none: {} } }
                        ]
                    }
                }
            }
        });

        if (event) return error(409, '');

        const deleted = await prisma.$transaction([
            prisma.ticketOption.deleteMany({
                where: {
                    ticket_date: {
                        event_id: eventId
                    }
                }
            }),
            prisma.ticketDate.deleteMany({
                where: {
                    event_id: eventId
                }
            }),
            prisma.eventMember.deleteMany({
                where: {
                    event_id: eventId
                }
            }),
            prisma.event.delete({
                where: {
                    id: eventId
                }
            })
        ]).catch(() => null);

        if (!deleted) return error(500, '');

        return '';
    }, {
        response: {
            200: t.String(),
            409: t.String(),
            500: t.String()
        }
    })