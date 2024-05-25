import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/wallet', detail: { tags: ['Wallet'] }})
    .get('', async ({ error, params, store }) => {
        const { uid } = store as { uid: number };

        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: uid,
                    event_id: +params.id
                }
            }
        });

        if (!wallet) return error(404, '');

        return {
            id: wallet.id,
            coins: wallet.coins
        };
    }, {
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Object({
                id: t.Number(),
                coins: t.Number()
            }),
            404: t.String()
        }
    })