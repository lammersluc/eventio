import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/buy' })
    .post('', async ({ body, params, error }) => {
        const wallet = await prisma.wallet.findUnique({
            where: {
                id: params.walletId
            },
            select: {
                id: true
            }
        });

        if (!wallet) return error(404, '');

        //Check stripe payment

        const updated = await prisma.wallet.update({
            where: {
                id: wallet.id
            },
            data: {
                coins: {
                    increment: body.amount
                }
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Object({
            eventId: t.Number(),
            amount: t.Number({ minimum: 1 }),
        }),
        params: t.Object({
            walletId: t.String()
        }),
        response: {
            200: t.String(),
            402: t.String(),
            404: t.String(),
            500: t.String()
        }
    })