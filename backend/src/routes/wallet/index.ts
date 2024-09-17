import { Elysia, t } from 'elysia';

import { generateData } from '@/services/qrcode';
import prisma from '@/services/database';

import ticketsRouter from './tickets';
import coinsRouter from './coins';

export default new Elysia({ prefix: '/wallets/:walletId', tags: ['Wallet'] })
    .guard({
        async beforeHandle({ params, error, store }) {
            const { id } = store as { id: string };

            const wallet = await prisma.wallet.findUnique({
                where: {
                    id: params.walletId,
                    user_id: id
                }
            });

            if (!wallet) return error(403, '');
        },
        params: t.Object({
            walletId: t.String()
        }),
        response: {
            403: t.String()
        }
    }, app => app
        .use(ticketsRouter)
        .use(coinsRouter)

        .get('/qr', async ({ error, params, store }) => {
            const { id } = store as { id: string };

            const wallet = await prisma.wallet.findUnique({
                where: {
                    id: params.walletId,
                    user_id: id
                }
            });

            if (!wallet) return error(404, '');

            return generateData(wallet.id, 'wallet');
        }, {
            params: t.Object({
                walletId: t.String()
            }),
            response: {
                200: t.String(),
                404: t.String()
            }
        })

        .get('/transactions', async ({ error, params, query }) => {
            const walletId = params.walletId;

            const transactions = await prisma.transaction.findMany({
                where: {
                    OR: [
                        { sender_id: walletId },
                        { receiver_id: walletId }
                    ]
                },
                select: {
                    sender_id: true,
                    receiver_id: true,
                    amount: true,
                    created_at: true
                },
                orderBy: {
                    id: 'desc'
                },
                skip: (+query.page - 1) * +query.size,
                take: +query.size
            });

            return transactions.map(transaction => ({
                type: transaction.sender_id === walletId ? (transaction.receiver_id ? 'transfer' : 'purchase') : 'receive',
                amount: transaction.amount,
                createdAt: transaction.created_at
            }));
        }, {
            params: t.Object({
                walletId: t.String()
            }),
            query: t.Object({
                page: t.String({ pattern: '^([1-9]\d*)$' }),
                size: t.String({ pattern: '^([1-9]|1[0-5])$' })
            }),
            response: {
                200: t.Array(t.Object({
                    type: t.String(),
                    amount: t.Number(),
                    createdAt: t.Date()
                })),
                404: t.String()
            }
        })
    )