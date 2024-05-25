import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/transfer' })
    .post('', async ({ body, error, store }) => {
        const { uid } = store as { uid: number };

        const sender = await prisma.wallet.findFirst({
            where: {
                user_id: uid,
                event_id: body.event
            },
            select: {
                id: true,
                coins: true
            }
        });

        if (!sender || sender.coins < body.amount) return error(402, '');

        const receiver = await prisma.wallet.findFirst({
            where: {
                id: body.to,
                event_id: body.event
            },
            select: {
                id: true
            }
        });

        if (!receiver) return error(404, '');

        const updated = await prisma.wallet.update({
            where: {
                id: sender.id
            },
            data: {
                coins: {
                    decrement: body.amount
                }
            },
            select: {
                id: true
            }
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
            event: t.Number(),
            to: t.Number(),
            amount: t.Number({ minimum: 1 })
        }),
        response: {
            200: t.String(),
            402: t.String(),
            404: t.String(),
            500: t.String()
        }
    })