import { Elysia, t } from 'elysia';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '#/services/database';

export default new Elysia({ prefix: '/image', detail: { description: 'base64 128x128' } })
    .post('', async ({ body, error, store }) => {  
        const { uid } = store as { uid: number };

        const image = await sharp(Buffer.from(body.image, 'base64'))
            .resize(128, 128)
            .png()
            .toFile(`./images/users/${uid}.png`)
            .catch(() => null);

        if (!image) return error(500, '');

        const updated = await prisma.user.update({
            where: {
                id: uid
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
        const { uid } = store as { uid: number };

        if (fs.existsSync(`./images/users/${uid}.png`))
            fs.rmSync(`./images/users/${uid}.png`);

        const deleted = await prisma.user.update({
            where: {
                id: uid
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