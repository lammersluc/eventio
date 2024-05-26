import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import memberRouter from './member';
import imageRouter from './image';

export default new Elysia({ tags: ['Owner'] })
    .onBeforeHandle(({ error, store }) => {
        const { role } = store as { role: number };

        if (role < 4) return error(403, '');
    })
    
    .use(memberRouter)
    .use(imageRouter)

    .patch('', async ({ body, params, error }) => {
        const data = {
            name: body.name,
            description: body.description,
            location: body.location,
            startAt: body.startAt,
            endAt: body.endAt,
            ticketsUserMax: body.ticketsUserMax,
            isPrivate: body.isPrivate
        }

        const event = await prisma.event.update({
            where: {
                id: +params.id
            },
            data,
            select: {
                id: true
            }
        });

        if (!event) return error(500, '');

        return '';
    }, {
        body: t.Partial(t.Object({
            name: t.String(),
            description: t.String(),
            location: t.String(),
            startAt: t.String(),
            endAt: t.String(),
            ticketsUserMax: t.Number(),
            isPrivate: t.Boolean()
        })),
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.String(),
            500: t.String(),
        }
    })