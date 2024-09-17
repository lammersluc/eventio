import { Elysia, error, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ tags: ['Creator'] })
    .onBeforeHandle(({ error, store }) => {
        const { eventMember } = store as { eventMember: { role: number } };

        if (eventMember.role < 5) return error(403, '');
    })
    
    .delete('', async ({ params }) => {
        const eventId = params.eventId;

        const wallets = await prisma.wallet.findFirst({
            where: {
                id: eventId
            }
        });

        if (wallets) return error(409, '');

        const result = await prisma.$transaction([
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

        if (!result) return error(500, '');

        return '';
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.String(),
            409: t.String(),
            500: t.String()
        }
    })