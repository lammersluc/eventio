import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/tickets' })
    .put('', async ({ body, error, set }) => {

        let data = {
            wallet_id: body.walletId,
            ticket_option_id: body.optionId,
            scanned_at: body.scannedAt
        };
        
        const created = await prisma.ticket.create({ data });

        if (!created) return error(404, '');

        set.status = 201;
        return '';
    }, {
        body: t.Object({
            walletId: t.Number(),
            optionId: t.Number(),
            scannedAt: t.Optional(t.Date())
        }),
        response: {
            201: t.String(),
            404: t.String()
        }
    })

    .patch('/:ticketId', async ({ body, params, error }) => {

        const data = {
            ticket_option_id: body.optionId,
            scanned_at: body.scannedAt
        }

        const updated = await prisma.ticket.update({
            where: {
                id: +params.ticketId
            },
            data
        });

        if (!updated) return error(404, '');

        return '';
    }, {
        body: t.Partial(t.Object({
            optionId: t.Number(),
            scannedAt: t.Nullable(t.Date())
        })),
        params: t.Object({
            ticketId: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String()
        }
    })

    .delete('/:ticketId', async ({ params, error }) => {
            
        const deleted = await prisma.ticket.delete({
            where: {
                id: +params.ticketId
            }
        });

        if (!deleted) return error(404, '');

        return '';
    }, {
        params: t.Object({
            ticketId: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String()
        }
    })