import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/buy' })
    .post('', async ({ body, error, store}) => {
        const { uid } = store as { uid: number };
        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: uid,
                    event_id: body.eventId
                }
            },
            select: {
                id: true
            }
        });

        if (!wallet) return error(404, '');

        //Check ideal payment
        const payed = true;
        if (!payed) return error(402, '');

        const updated = await prisma.wallet.update({
            where: {
                user_id_event_id: {
                    user_id: uid,
                    event_id: body.eventId
                }
            },
            data: {
                coins: {
                    increment: body.amount
                }
            },
            select: {
                id: true
            }
        });

        if (!updated) return error(404, '');

        return '';
    }, {
        body: t.Object({
            eventId: t.Number(),
            amount: t.Number({ minimum: 1 }),
        }),
        response: {
            200: t.String(),
            402: t.String(),
            404: t.String()
        }
    })