import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/transactions/:transactionId' })
    .patch('', async ({ params, body, error }) => {

        const updated = await prisma.transaction.update({
            where: {
                id: +params.transactionId,
                created_at: {
                    gte: new Date(new Date().getTime() - 5 * 60 * 1000)
                }
            },
            data: {
                amount: +body.amount
            },
            select: {
                id: true
            }
        });

        if (!updated) return error(404, '');

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
            404: t.String()
        }
    })

    .delete('', async ({ params, error }) => {

        const transaction = await prisma.transaction.findUnique({
            where: {
                id: +params.transactionId
            },
            select: {
                amount: true
            }
        });

        if (!transaction) return error(404, '');

        const result = await prisma.$transaction([
           
            prisma.transaction.delete({
                where: {
                    id: +params.transactionId
                },
                select: {
                    id: true
                }
            }),
            prisma.wallet.update({
                where: {
                    id: 1
                },
                data: {
                    coins: {
                        decrement: transaction.amount
                    }
                },
                select: {
                    id: true
                }
            })
        ]).catch(() => null);

        if (!result) return error(500, '');

        return '';
    }, {
        params: t.Object({
            transactionId: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String(),
            500: t.String()
        }
    })