import { Elysia, t } from 'elysia';

import prisma from '@/services/database';
import { createImage, deleteImage } from '@/services/image';

export default new Elysia({ prefix: '/avatar', detail: { description: 'base64 128x128' } })
    .post('', async ({ body, error, store }) => {  
        const { id } = store as { id: string };

        if (!body.avatar) {

            deleteImage('users', id, 'avatar');
    
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

        const avatarHash = await createImage(body.avatar, 'users', id, 'avatar');

        if (!avatarHash) return error(400, '');

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
            avatar: t.Nullable(t.File())
        }),
        response: {
            200: t.String(),
            400: t.String(),
            500: t.String()
        }
    })