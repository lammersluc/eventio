import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/transfer' })
    .patch('', async ({ body, params, error, store }) => {
        const ticketId = +params.ticketId;

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: ticketId
            },
            select: {
                wallet_id: true,
                wallet: {
                    select: {
                        id: true,
                        event_id: true
                    }
                }
            }
        });

        if (!ticket) return error(404, '');

        const newWallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: body.userId,
                    event_id: ticket.wallet.event_id
                }
            },
            select: {
                id: true
            }
        });

        if (!newWallet) return error(404, '');

        const updated = await prisma.ticket.update({
            where: {
                id: ticketId
            },
            data: {
                wallet_id: newWallet.id
            },
            select: {
                id: true
            }
        });

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Object({
            userId: t.Number()
        }),
        params: t.Object({
            ticketId: t.String()
        }),
        response: {
            200: t.String(),
            402: t.String(),
            404: t.String(),
            500: t.String()
        }
    })