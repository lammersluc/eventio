import { Elysia, error, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ tags: ['Creator'] })
    .onBeforeHandle(({ error, store }) => {
        const { role } = store as { role: number };

        if (role < 5) return error(403, '');
    })
    .delete('', async ({ params }) => {
        const deleted = await prisma.event.delete({
            where: {
                id: +params.id
            }
        }).catch(() => null);

        if (!deleted) return error(500, '');

        return '';
    }, {
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.String(),
            500: t.String()
        }
    })