import { Elysia, t } from 'elysia';

import { generateQR } from '@/services/qrcode';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/wallet/:id' })
    .get('/qr', async ({ error, params, store }) => {
        const { uid } = store as { uid: number };

        const wallet = await prisma.wallet.findUnique({
            where: {
                id: +params.id,
                user_id: uid
            }
        });

        if (!wallet) return error(404, '');

        return await generateQR(wallet.id, 'wallet');
    }, {
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String()
        }
    })