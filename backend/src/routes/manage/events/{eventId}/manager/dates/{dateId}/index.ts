import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import optionsRouter from './options';

export default new Elysia({ prefix: '/:dateId' })
    .use(optionsRouter)

    .get('', async ({ params: { dateId }, error }) => {
                    
        const date = await prisma.ticketDate.findUnique({
            where: {
                id: dateId
            },
            select: {
                id: true,
                name: true,
                amount: true,
                valid_from: true,
                valid_until: true,
                ticket_options: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        amount: true,
                        _count: {
                            select: {
                                tickets: true
                            }
                        }
                    }
                }
            }
        });

        if (!date) return error(404, '');

        return {
            name: date.name,
            amount: date.amount,
            sold: date.ticket_options.reduce((acc, option) => acc + option._count.tickets, 0),
            validFrom: date.valid_from,
            validUntil: date.valid_until,
            options: date.ticket_options.map(option => ({
                id: option.id,
                name: option.name,
                price: option.price,
                amount: option.amount,
                sold: option._count.tickets
            }))
        };
    }, {
        response: {
            200: t.Object({
                name: t.String(),
                amount: t.Nullable(t.Number()),
                sold: t.Number(),
                validFrom: t.Nullable(t.Date()),
                validUntil: t.Nullable(t.Date()),
                options: t.Array(t.Object({
                    id: t.String(),
                    name: t.String(),
                    price: t.Number(),
                    amount: t.Nullable(t.Number()),
                    sold: t.Number()
                }))
            }),
            404: t.String()
        }
    })
   
    .patch('', async ({ body, params: { dateId }, error }) => {

        const data = {
            name: body.name,
            valid_from: body.validFrom,
            valid_until: body.validUntil,
            amount: body.amount
        }
            
        const updated = await prisma.ticketDate.update({
            where: {
                id: dateId
            },
            data
        });

        if (!updated) return error(404, '');

        return '';
    }, {
        body: t.Partial(t.Object({
            name: t.String(),
            validFrom: t.Nullable(t.Date()),
            validUntil: t.Nullable(t.Date()),
            amount: t.Nullable(t.Number())
        })),
        response: {
            200: t.String(),
            404: t.String()
        }
    })

    .delete('', async ({ params: { dateId }, error }) => {

        const tickets = await prisma.ticketOption.findFirst({
            where: {
                ticket_date_id: dateId,
                tickets: {
                    some: {}
                }
            }
        });

        if (tickets) return error(409, '');
            
        const deleted = await prisma.$transaction([
            prisma.ticketOption.deleteMany({
                where: {
                    ticket_date_id: dateId
                }
            }),
            prisma.ticketDate.delete({
                where: {
                    id: dateId
                }
            })
        ]);

        if (!deleted) return error(500, '');

        return '';
    }, {
        response: {
            200: t.String(),
            409: t.String(),
            500: t.String()
        }
    })