import { Elysia, t } from 'elysia';

import { checkData } from '@/services/qrcode';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/transfer' })
    .patch('', async ({ body, error, store}) => {
        const { id } = store as { id: string };

        const data = await checkData(body.walletQR);

        if (!data || data.type !== 'wallet') return error(404, '');

        const receiver = await prisma.wallet.findUnique({
            where: {
                id: data.id
            },
            select: {
                id: true,
                event_id: true
            }
        });

        if (!receiver) return error(404, '');

        const sender = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: id,
                    event_id: receiver.event_id
                }
            },
            select: {
                id: true,
                coins: true
            }
        });

        if (!sender || sender.coins < body.amount) return error(402, '');

        const result = await prisma.$transaction([
            prisma.wallet.update({
                where: {
                    id: sender.id
                },
                data: {
                    coins: {
                        decrement: body.amount
                    }
                },
            }),
            prisma.wallet.update({
                where: {
                    id: receiver.id
                },
                data: {
                    coins: {
                        increment: body.amount
                    }
                }
            })
        ])

        if (!result) return error(500, '');
        
        return '';
    }, {
        body: t.Object({
            amount: t.Number({ minimum: 1 }),
            walletQR: t.String()
        }),
        response: {
            200: t.String(),
            402: t.String(),
            404: t.String(),
            500: t.String()
        }
    })