import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/event/:id/management', tags: ['Management'] })
    .state('role', -1)
    .guard({
        async beforeHandle({ params, store }) {
            const { uid } = store as { role: number, uid: number };

            prisma.eventMember.findUnique

        },
        params: t.Object({
            id: t.String()
        })
    })