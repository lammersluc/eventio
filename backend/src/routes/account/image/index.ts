import { Elysia, t } from 'elysia';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/image', detail: { description: 'base64 128x128' } })
    .post('', async ({ body, error, store }) => {  
        const { id } = store as { id: string };

        if (!body.image) {

            if (fs.existsSync(`./public/images/users/${id}.png`))
                fs.unlinkSync(`./public/images/users/${id}.png`);
    
            const updated = await prisma.user.update({
                where: {
                    id
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
        }

        const image = await sharp(Buffer.from(body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64'))
            .resize(256, 256)
            .png()
            .toFile(`public/images/users/${id}.png`)
            .catch(() => null);

        if (!image) return error(500, '');

        const imageHash = require('crypto').createHash('sha1').update(body.image).digest('hex');

        const updated = await prisma.user.update({
            where: {
                id
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
            image: t.Nullable(t.String())
        }),
        response: {
            200: t.String(),
            500: t.String()
        }
    })