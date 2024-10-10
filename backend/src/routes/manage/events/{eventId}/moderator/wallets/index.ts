import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/wallets/:walletId' })
    .patch('/coins', async ({ body, params, error }) => {

        const updated = await prisma.wallet.update({
            where: {
                id: params.walletId
            },
            data: {
                coins: body.amount
            }
        });

        if (!updated) return error(404, '');

        return '';
    }, {
        body: t.Object({
            amount: t.Number({ minimum: 0 })
        }),
        params: t.Object({
            walletId: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String()
        }
    })