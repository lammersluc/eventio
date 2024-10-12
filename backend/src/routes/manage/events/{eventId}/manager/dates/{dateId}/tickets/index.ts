import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/tickets' })
    .get('', async ({ params: { dateId } }) => {
                    
        const ticketOptions = await prisma.ticketOption.findMany({
            where: {
                ticket_date_id: dateId
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
            }
        });

        return ticketOptions.map(option => ({
            id: option.id,
            name: option.name,
            price: option.price,
            tickets_max: option.amount,
            tickets_sold: option._count.tickets
        }));
    }, {
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                name: t.String(),
                price: t.Nullable(t.Number()),
                tickets_max: t.Nullable(t.Number()),
                tickets_sold: t.Number()
            }))
        }
    })

    .put('', async ({ body, params: { dateId }, error, set }) => {

        const created = await prisma.ticketOption.create({
            data: {
                ticket_date_id: dateId,
                name: body.name,
            }
        });

        if (!created) return error(404, '');

        set.status = 201;
        return '';
    }, {
        body: t.Object({
            name: t.String()
        }),
        response: {
            201: t.String(),
            404: t.String()
        }
    })