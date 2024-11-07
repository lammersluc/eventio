import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import membersRouter from './members';
import bannerRouter from './banner';

export default new Elysia({ tags: ['Owner'] })
    .onBeforeHandle(({ error, store }) => {
        const { eventMember } = store as { eventMember: { role: number } };

        if (eventMember.role < 4) return error(403, '');
    })
    
    .use(membersRouter)
    .use(bannerRouter)

    .patch('', async ({ body, params: { eventId }, error }) => {

        const data = {
            name: body.name,
            description: body.description,
            location: body.location,
            start_at: body.startAt,
            end_at: body.endAt,
            tickets_user_max: body.ticketsUserMax,
            is_private: body.isPrivate
        }

        const updated = await prisma.event.update({
            where: {
                id: eventId
            },
            data,
            select: {
                id: true
            }
        });

        if (!updated) return error(500, '');

        return '';
    }, {
        body: t.Partial(t.Object({
            name: t.String(),
            description: t.Nullable(t.String()),
            location: t.Nullable(t.String()),
            startAt: t.Nullable(t.Date()),
            endAt: t.Nullable(t.Date()),
            ticketsUserMax: t.Nullable(t.Number()),
            isPrivate: t.Boolean()
        })),
        response: {
            200: t.String(),
            500: t.String(),
        }
    })