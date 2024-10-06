import { Elysia, error, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ tags: ['Creator'] })
    .onBeforeHandle(({ error, store }) => {
        const { eventMember } = store as { eventMember: { role: number } };

        if (eventMember.role < 5) return error(403, '');
    })

    .post('', async ({ body, store }) => {
        const { id } = store as unknown as { id: string };

        const event = await prisma.event.create({
            data: {
                name: body.name,
                event_members: {
                    create: {
                        user_id: id,
                        role: 'creator'
                    }
                }
            },
            select: {
                id: true
            }
        });

        if (!event) return error(500, '');

        return {
            id: event.id
        };
    }, {
        body: t.Object({
            name: t.String()
        }),
        response: {
            201: t.Object({
                id: t.String()
            }),
            500: t.String()
        }
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