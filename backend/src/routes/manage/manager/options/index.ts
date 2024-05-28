import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/options/:optionId' })
    .patch('', async ({ body, params, error }) => {

        const data = {
            name: body.name,
            price: body.price,
            amount: body.amount
        }
            
        const updated = await prisma.ticketOption.update({
            where: {
                id: +params.optionId
            },
            data
        });

        if (!updated) return error(404, '');

        return '';
    }, {
        params: t.Object({
            optionId: t.String()
        }),
        body: t.Partial(t.Object({
            name: t.String(),
            price: t.Number(),
            amount: t.Number()
        })),
        response: {
            200: t.String(),
            404: t.String()
        }
    })

    .delete('', async ({ params, error }) => {
            
        const deleted = await prisma.ticketOption.delete({
            where: {
                id: +params.optionId,
                tickets: {
                    none: {}
                }
            }
        });

        if (!deleted) return error(409, '');

        return '';
    }, {
        params: t.Object({
            optionId: t.String()
        }),
        response: {
            200: t.String(),
            409: t.String()
        }
    })