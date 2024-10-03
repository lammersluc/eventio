import { Elysia, t } from 'elysia';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/image', detail: { description: 'base64 360x900' } })
    .post('', async ({ body, params, error }) => {  
        const eventId = params.eventId;

        const image = await sharp(Buffer.from(body.image, 'base64'))
            .resize(360, 900)
            .png()
            .toFile(`./images/events/${eventId}.png`)
            .catch(() => null);

        if (!image) return error(500, '');

        const imageHash = require('crypto').createHash('sha1').update(body.image).digest('hex');

        const updated = await prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                image_hash: imageHash
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Object({
            image: t.String()
        }),
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.String(),
            500: t.String()
        }
    })

    .delete('', async ({ params, error }) => {
        const eventId = params.eventId;

        if (fs.existsSync('./images/events/' + eventId + '.png'))
            fs.unlinkSync('./images/events/' + eventId + '.png');

        const updated = await prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                image_hash: null
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.String(),
            500: t.String()
        }
    })