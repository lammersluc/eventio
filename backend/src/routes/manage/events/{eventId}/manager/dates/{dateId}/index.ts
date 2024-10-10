import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import optionsRouter from './options';

export default new Elysia({ prefix: '/:dateId' })
    .use(optionsRouter)
   
    .patch('', async ({ body, params, error }) => {

        const data = {
            name: body.name,
            valid_from: body.validFrom,
            valid_until: body.validUntil,
            amount: body.amount
        }
            
        const updated = await prisma.ticketDate.update({
            where: {
                id: params.dateId
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
            amount: t.Number()
        })),
        response: {
            200: t.String(),
            404: t.String()
        }
    })

    .delete('', async ({ params, error }) => {
            
        const deleted = await prisma.ticketDate.delete({
            where: {
                id: params.dateId,
                ticket_options: {
                    every: {
                        tickets: {
                            none: {}
                        }
                    }
                }
            }
        });

        if (!deleted) return error(409, '');

        return '';
    }, {
        params: t.Object({
            dateId: t.String()
        }),
        response: {
            200: t.String(),
            409: t.String()
        }
    })