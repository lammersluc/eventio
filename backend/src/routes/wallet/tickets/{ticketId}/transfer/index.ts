import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/transfer' })
    .patch('', async ({ body, params, error, store }) => {
        const { uid } = store as { uid: number };
        const ticketId = +params.ticketId;

        const wallet = await prisma.wallet.findFirst({
            where: {
                user: {
                    id: uid
                },
                tickets: {
                    some: {
                        id: ticketId
                    }
                }
            },
            select: {
                id: true
            }
        });

        if (!wallet) return error(402, '');

        const newWallet = await prisma.wallet.findFirst({
            where: {
                user_id: body.walletId
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
            walletId: t.Number()
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