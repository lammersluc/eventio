import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/options/:optionId' })
    .patch('', async ({ body, params, error }) => {

        const data = {
            name: body.name,
            price: body.price,
            tickets_max: body.ticketsMax
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
            price: t.Nullable(t.Number()),
            ticketsMax: t.Nullable(t.Number())
        })),
        response: {
            200: t.String(),
            404: t.String()
        }
    })

    .delete('', async ({ params, error }) => {
            
        const deleted = await prisma.ticketOption.delete({
            where: {
                id: +params.optionId
            }
        });

        if (!deleted) return error(404, '');

        return '';
    }, {
        params: t.Object({
            optionId: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String()
        }
    })