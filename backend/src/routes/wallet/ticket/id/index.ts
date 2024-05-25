import { Elysia, t } from 'elysia';

import { generateQR } from '@/services/qrcode';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/:id' })
    .get('', async ({ error, params, store }) => {
        const { uid } = store as { uid: number };

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: +params.id,
                wallet: {
                    user_id: uid
                }
            },
            select: {
                id: true
            }
        });

        if (!ticket) return error(404, '');

        const qrCode = await generateQR(ticket.id);

        return { qrCode };
    }, {
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Object({
                qrCode: t.String(),
            }),
            404: t.String()
        }
    })