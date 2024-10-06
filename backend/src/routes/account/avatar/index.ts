import { Elysia, t } from 'elysia';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '@/services/database';
import { createHash } from '@/services/image';

export default new Elysia({ prefix: '/avatar', detail: { description: 'base64 128x128' } })
    .post('', async ({ body, error, store }) => {  
        const { id } = store as { id: string };
        const userDir = `public/users/${id}`;

        if (!body.avatar) {

            if (fs.existsSync(`${userDir}/avatar.png`))
                fs.unlinkSync(`${userDir}/avatar.png`);

            if (fs.readdirSync(userDir).length === 0)
                fs.rmdirSync(userDir);
    
            const updated = await prisma.user.update({
                where: {
                    id
                },
                data: {
                    avatar_hash: null
                },
                select: {
                    id: true
                }
            }).catch(() => null);
    
            if (!updated) return error(500, '');

            return '';
        }

        const avatar = await sharp(Buffer.from(body.avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64'))
            .resize(256, 256)
            .png()
            .toFile(`${userDir}/avatar.png`)
            .catch(() => null);

        if (!avatar) return error(500, '');

        const avatarHash = createHash(body.avatar);

        const updated = await prisma.user.update({
            where: {
                id
            },
            data: {
                avatar_hash: avatarHash
            },
            select: {
                id: true
            }
        }).catch(() => null);

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Object({
            avatar: t.Nullable(t.String())
        }),
        response: {
            200: t.String(),
            500: t.String()
        }
    })