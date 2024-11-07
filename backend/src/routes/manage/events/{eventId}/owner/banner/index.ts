import { Elysia, t } from 'elysia';

import prisma from '@/services/database';
import { createImage, deleteImage } from '@/services/image';

export default new Elysia({ prefix: '/banner', detail: { description: 'base64 384x256' } })
    .post('/banner', async ({ body, params: { eventId }, error }) => {

        if (!body.banner) {

            deleteImage('events', eventId, 'banner');
    
            const updated = await prisma.event.update({
                where: {
                    id: eventId
                },
                data: {
                    banner_hash: null
                },
                select: {
                    id: true
                }
            }).catch(() => null);
    
            if (!updated) return error(500, '');

            return '';
        }

        const bannerHash = await createImage(body.banner, 'events', eventId, 'banner');

        if (!bannerHash) return error(400, '');

        const updated = await prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                banner_hash: bannerHash
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Object({
            banner: t.Nullable(t.File()),
        }),
        response: {
            200: t.String(),
            400: t.String(),
            500: t.String()
        }
    })