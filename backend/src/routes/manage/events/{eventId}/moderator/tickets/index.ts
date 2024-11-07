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
            walletId: t.String(),
            optionId: t.String(),
            scannedAt: t.Optional(t.Date())
        }),
        response: {
            201: t.String(),
            404: t.String()
        }
    })

    .patch('/:ticketId', async ({ body, params: { ticketId }, error }) => {

        const data = {
            ticket_option_id: body.optionId,
            scanned_at: body.scannedAt
        }

        const updated = await prisma.ticket.update({
            where: {
                id: ticketId
            },
            data
        });

        if (!updated) return error(404, '');

        return '';
    }, {
        body: t.Partial(t.Object({
            optionId: t.String(),
            scannedAt: t.Nullable(t.Date())
        })),
        response: {
            200: t.String(),
            404: t.String()
        }
    })

    .delete('/:ticketId', async ({ params: { ticketId }, error }) => {
            
        const deleted = await prisma.ticket.delete({
            where: {
                id: ticketId
            }
        });

        if (!deleted) return error(404, '');

        return '';
    }, {
        response: {
            200: t.String(),
            404: t.String()
        }
    })