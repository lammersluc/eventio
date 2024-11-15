import { Elysia, t } from 'elysia';

import { checkData } from '@/services/qrcode';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/wallets/:walletQR/transactions' })
    .get('', async ({ params: { walletQR }, error, store }) => {
        const { eventMember } = store as { eventMember: { id: string } };

        const data = await checkData(walletQR);

        if (!data || data.type !== 'wallet') return error(404, '');

        const purchase = await prisma.transaction.findFirst({
            where: {
                sender_id: data.id,
                receiver_id: null,
                event_member_id: eventMember.id
            },
            select: {
                id: true,
                amount: true,
                created_at: true
            },
            orderBy: {
                id: 'desc'
            }
        });

        if (!purchase) return error(404, '');
    
        return {
            id: purchase.id,
            amount: purchase.amount,
            createdAt: purchase.created_at
        };
    }, {
        response: {
            200: t.Object({
                id: t.String(),
                amount: t.Number(),
                createdAt: t.Date()
            }),
            404: t.String()
        }
    })

    .put('', async ({ body, params: { walletQR }, error }) => {

        const data = await checkData(walletQR);

        if (!data || data.type !== 'wallet') return error(404, '');

        const result = await prisma.$transaction([
            prisma.transaction.create({
                data: {
                    sender_id: data.id,
                    receiver_id: null,
                    amount: body.amount
                },
                select: {
                    id: true
                }
            }),
            prisma.wallet.update({
                where: {
                    id: data.id
                },
                data: {
                    coins: {
                        decrement: body.amount
                    }
                },
                select: {
                    id: true
                }
            }),
        ]).catch(() => null);

        if (!result) return error(500, '');

        return '';
    }, {
        body: t.Object({
            amount: t.Number({ minimum: 1 })
        }),
        response: {
            200: t.String(),
            404: t.String(),
            500: t.String()
        }
    })