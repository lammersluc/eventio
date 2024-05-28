import { Elysia, t } from 'elysia';

import { generateQR } from '@/services/qrcode';
import prisma from '@/services/database';

export default new Elysia({ prefix: '/qr' })
    .get('', async ({ error, params, store }) => {
        const { uid } = store as { uid: number };

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: +params.ticketId,
                wallet: {
                    user_id: uid
                }
            }
        });

        if (!ticket) return error(404, '');

        return await generateQR(ticket.id, 'ticket');
    }, {
        params: t.Object({
            ticketId: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String()
        }
    })