import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import dateIdRouter from './{dateId}';

export default new Elysia({ prefix: '/dates' })
    .use(dateIdRouter)
    .get('', async ({ params }) => {
                    
        const ticketDates = await prisma.ticketDate.findMany({
            where: {
                event_id: +params.eventId
            },
            select: {
                id: true,
                name: true,
                valid_from: true,
                valid_until: true,
                tickets_max: true,
                tickets_sold: true
            }
        });

        return ticketDates;
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                valid_from: t.Nullable(t.Date()),
                valid_until: t.Nullable(t.Date()),
                tickets_max: t.Nullable(t.Number()),
                tickets_sold: t.Number()
            }))
        }
    })

    .put('', async ({ body, params, error, set }) => {

        const created = await prisma.ticketDate.create({
            data: {
                event_id: +params.eventId,
                name: body.name,
            }
        });

        if (!created) return error(404, '');

        set.status = 201;
        return '';
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        body: t.Object({
            name: t.String()
        }),
        response: {
            201: t.String(),
            404: t.String()
        }
    })
    
    .patch('/:dateId', async ({ body, params, error }) => {

        const data = {
            name: body.name,
            valid_from: body.validFrom,
            valid_until: body.validUntil,
            tickets_max: body.ticketsMax
        }
            
        const updated = await prisma.ticketDate.update({
            where: {
                id: +params.dateId
            },
            data
        });

        if (!updated) return error(404, '');

        return '';
    }, {
        params: t.Object({
            dateId: t.String()
        }),
        body: t.Partial(t.Object({
            name: t.String(),
            validFrom: t.Nullable(t.Date()),
            validUntil: t.Nullable(t.Date()),
            ticketsMax: t.Nullable(t.Number())
        })),
        response: {
            200: t.String(),
            404: t.String()
        }
    })

    .delete('/:dateId', async ({ params, error }) => {
            
        const deleted = await prisma.ticketDate.delete({
            where: {
                id: +params.dateId
            }
        });

        if (!deleted) return error(404, '');

        return '';
    }, {
        params: t.Object({
            dateId: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String()
        }
    })