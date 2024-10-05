import { Elysia, t } from 'elysia';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '@/services/database';
import { createHash } from '@/services/image';

export default new Elysia({ prefix: '/banner', detail: { description: 'base64 384x256' } })
    .post('/banner', async ({ body, params, error }) => {
        const eventId = params.eventId;
        const eventDir = `./events/${eventId}`;

        if (!body.banner) {

            if (fs.existsSync(`${eventDir}/banner.png`))
                fs.unlinkSync(`${eventDir}/banner.png`);

            if (fs.readdirSync(eventDir).length === 0)
                fs.rmdirSync(eventDir);
    
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

        if (!fs.existsSync(eventDir))
            fs.mkdirSync(eventDir);

        const banner = await sharp(Buffer.from(body.banner, 'base64'))
            .resize(384, 256)
            .png()
            .toFile(`${eventDir}/banner.png`)
            .catch(() => null);

        if (!banner) return error(500, '');

        const bannerHash = createHash(body.banner);

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
            banner: t.Nullable(t.String()),
        }),
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.String(),
            500: t.String()
        }
    })