import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import { generateData } from '@/services/qrcode';

export default new Elysia({ prefix: '/:ticketId' })
    .patch('/transfer', async ({ body, params: { ticketId }, error }) => {

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
            userId: t.String()
        }),
        response: {
            200: t.String(),
            402: t.String(),
            404: t.String(),
            500: t.String()
        }
    })

    .get('/qr', async ({ error, params: { ticketId }, store }) => {
        const { id } = store as { id: string };

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: ticketId,
                wallet: {
                    user_id: id
                }
            }
        });

        if (!ticket) return error(404, '');

        return generateData(ticket.id, 'ticket');
    }, {
        response: {
            200: t.String(),
            404: t.String()
        }
    })