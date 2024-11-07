import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import dateIdRouter from './{dateId}';

export default new Elysia({ prefix: '/dates' })
    .use(dateIdRouter)

    .get('', async ({ params: { eventId } }) => {
                    
        const ticketDates = await prisma.ticketDate.findMany({
            where: {
                event_id: eventId
            },
            select: {
                id: true,
                name: true,
                valid_from: true,
                valid_until: true,
                amount: true,
                ticket_options: {
                    select: {
                        _count: {
                            select: {
                                tickets: true
                            }
                        }
                    }
                }
            }
        });

        return ticketDates.map(date => ({
            id: date.id,
            name: date.name,
            validFrom: date.valid_from,
            validUntil: date.valid_until,
            amount: date.amount,
            sold: date.ticket_options.reduce((sold, option) => sold + option._count.tickets, 0)
        }));
    }, {
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                name: t.String(),
                validFrom: t.Nullable(t.Date()),
                validUntil: t.Nullable(t.Date()),
                amount: t.Nullable(t.Number()),
                sold: t.Number()
            }))
        }
    })

    .put('', async ({ body, params: { eventId }, error, set }) => {

        const created = await prisma.ticketDate.create({
            data: {
                event_id: eventId,
                name: body.name,
                valid_from: body.validFrom,
                valid_until: body.validUntil,
                amount: body.amount
            }
        });

        if (!created) return error(404, '');

        set.status = 201;
        return '';
    }, {
        body: t.Object({
            name: t.String(),
            validFrom: t.Optional(t.Date()),
            validUntil: t.Optional(t.Date()),
            amount: t.Optional(t.Number())
        }),
        response: {
            201: t.String(),
            404: t.String()
        }
    })