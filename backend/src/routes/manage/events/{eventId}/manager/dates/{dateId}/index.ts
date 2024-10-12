import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import optionsRouter from './options';

export default new Elysia({ prefix: '/:dateId' })
    .use(optionsRouter)
   
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
                ticket_date_id: dateId
            }
        });

        if (tickets) return error(409, '');
            
        const deleted = await prisma.$transaction([
            prisma.ticketDate.delete({
                where: {
                    id: dateId
                },
                select: {
                    id: true
                }
            }),
            prisma.ticketOption.deleteMany({
                where: {
                    ticket_date_id: dateId
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