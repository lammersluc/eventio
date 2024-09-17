import { Elysia, t } from 'elysia';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/image', detail: { description: 'base64 128x128' } })
    .post('', async ({ body, error, store }) => {  
        const { id } = store as { id: string };

        const image = await sharp(Buffer.from(body.image, 'base64'))
            .resize(128, 128)
            .png()
            .toFile(`./images/users/${id}.png`)
            .catch(() => null);

        if (!image) return error(500, '');

        const updated = await prisma.user.update({
            where: {
                id
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
            image: t.String()
        }),
        response: {
            200: t.String(),
            500: t.String()
        }
    })

    .delete('', async ({ error, store }) => {
        const { id } = store as { id: string };

        if (fs.existsSync(`./images/users/${id}.png`))
            fs.rmSync(`./images/users/${id}.png`);

        const deleted = await prisma.user.update({
            where: {
                id
            },
            data: {
                has_image: false
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!deleted) return error(500, '');

        return '';
    }, {
        response: {
            200: t.String(),
            500: t.String()
        }
    })