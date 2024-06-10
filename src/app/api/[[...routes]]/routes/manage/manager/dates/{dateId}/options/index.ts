import { Elysia, t } from 'elysia';

import prisma from '#/services/database';

export default new Elysia({ prefix: '/options' })
    .get('', async ({ params }) => {
                    
        const ticketOptions = await prisma.ticketOption.findMany({
            where: {
                ticket_date_id: +params.dateId
            },
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
            },
        });

        return ticketOptions.map(option => ({
            id: option.id,
            name: option.name,
            price: option.price,
            amount: option.amount,
            sold: option._count.tickets
        }));
    }, {
        params: t.Object({
            dateId: t.String()
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                price: t.Nullable(t.Number()),
                amount: t.Nullable(t.Number()),
                sold: t.Number()
            }))
        }
    })

    .put('', async ({ body, params, error, set }) => {

        const created = await prisma.ticketOption.create({
            data: {
                ticket_date_id: +params.dateId,
                name: body.name,
            }
        });

        if (!created) return error(404, '');

        set.status = 201;
        return '';
    }, {
        params: t.Object({
            dateId: t.String()
        }),
        body: t.Object({
            name: t.String()
        }),
        response: {
            201: t.String(),
            404: t.String()
        }
    })