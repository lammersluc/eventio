import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/options/:optionId' })
    .patch('', async ({ body, params: { optionId }, error }) => {
            
        const updated = await prisma.ticketOption.update({
            where: {
                id: optionId
            },
            data: body
        });

        if (!updated) return error(404, '');

        return '';
    }, {
        body: t.Partial(t.Object({
            name: t.String(),
            price: t.Number(),
            amount: t.Nullable(t.Number())
        })),
        response: {
            200: t.String(),
            404: t.String()
        }
    })

    .delete('', async ({ params: { optionId }, error }) => {
            
        const deleted = await prisma.ticketOption.delete({
            where: {
                id: optionId,
                tickets: {
                    none: {}
                }
            }
        });

        if (!deleted) return error(409, '');

        return '';
    }, {
        response: {
            200: t.String(),
            409: t.String()
        }
    })