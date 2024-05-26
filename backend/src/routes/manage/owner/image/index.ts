import { Elysia, t } from 'elysia';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/image', detail: { description: 'base64 360x900' } })
    .post('', async ({ body, params, error, store }) => {  
        const eventId = +params.id;

        if (!body.image) {
            const event = await prisma.event.findUnique({
                where: {
                    id: eventId
                },
                select: {
                    has_image: true
                }
            });
    
            if (!event?.has_image) return error(404, '');
    
            fs.unlinkSync('./images/events/' + eventId + '.png');
    
            const updated = await prisma.event.update({
                where: {
                    id: eventId
                },
                data: {
                    has_image: false
                },
                select: {
                    id: true
                }
            }).catch(() => null);
    
            if (!updated) return error(500, '');
    
            return '';
        }

        const image = await sharp(Buffer.from(body.image, 'base64'))
            .resize(360, 900)
            .toFile(`./images/events/${eventId}.png`)
            .catch(() => null);

        if (!image) return error(500, '');

        const updated = await prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                has_image: true
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Object({
            image: t.Optional(t.String())
        }),
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.String(),
            404: t.String(),
            500: t.String()
        }
    })