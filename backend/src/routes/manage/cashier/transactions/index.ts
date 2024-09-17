import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/transactions/:transactionId' })
    .patch('', async ({ params, body, error, store }) => {
        const { eventMember } = store as { eventMember: { id: string } };
        const transactionId = params.transactionId;

        const transaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                receiver_id: null,
                event_member_id: eventMember.id
            },
            select: {
                sender: {
                    select: {
                        id: true,
                        coins: true
                    }
                },
                amount: true
            }
        });

        if (!transaction || !transaction.sender) return error(404, '');

        const change = body.amount - transaction.amount;

        if (transaction.sender.coins + change < 0) return error(402, '');

        const result = await prisma.$transaction([
            prisma.wallet.update({
                where: {
                    id: transactionId,
                },
                data: {
                    coins: {
                        increment: change
                    }
                },
                select: {
                    id: true
                }
            }),
            prisma.transaction.update({
                where: {
                    id: transactionId
                },
                data: {
                    amount: body.amount
                },
                select: {
                    id: true
                }
            })
        ]);

        if (!result) return error(500, '');

        return '';
    }, {
        params: t.Object({
            transactionId: t.String()
        }),
        body: t.Object({
            amount: t.Number({ minimum: 1 })
        }),
        response: {
            200: t.String(),
            402: t.String(),
            404: t.String(),
            500: t.String()
        }
    })