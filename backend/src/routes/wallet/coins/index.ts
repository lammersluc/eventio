import { Elysia, t } from 'elysia';

import { checkQR } from '@/services/qrcode';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/coins' })
    .patch('/transfer', async ({ body, error, store}) => {
        const { uid } = store as { uid: number };
        const token = await checkQR(body.to);

        if (!token || token.type !== 'wallet') return error(404, '');

        const receiver = await prisma.wallet.findUnique({
            where: {
                id: token.id
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
                    user_id: uid,
                    event_id: receiver.event_id
                }
            },
            select: {
                id: true,
                coins: true
            }
        });

        if (!sender || sender.coins < body.amount) return error(402, '');

        const updated = await prisma.wallet.update({
            where: {
                id: sender.id
            },
            data: {
                coins: {
                    decrement: body.amount
                }
            },
        });

        if (!updated) return error(500, '');

        await prisma.wallet.update({
            where: {
                id: receiver.id
            },
            data: {
                coins: {
                    increment: body.amount
                }
            }
        });
        
        return '';
    }, {
        body: t.Object({
            amount: t.Number(),
            to: t.String()
        }),
        response: {
            200: t.String(),
            402: t.String(),
            404: t.String(),
            500: t.String()
        }
    })