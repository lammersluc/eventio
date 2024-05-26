import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/dates'})
    .get('', async ({ error, params }) => {
        const dates = await prisma.event.findUnique({
            where: {
                id: +params.id
            }}
        ).ticket_dates({
            select: {
                id: true,
                name: true,
                valid_from: true,
                valid_until: true,
                tickets_max: true,
                tickets_sold: true
            }
        });

        if (!dates) return error(404, '');

        return dates.map(date => ({
            id: date.id,
            name: date.name,
            validFrom: date.valid_from,
            validUntil: date.valid_until,
            ticketsAvailable: date.tickets_max ? date.tickets_max - date.tickets_sold : null
        }));
    }, {
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                validFrom: t.Nullable(t.Date()),
                validUntil: t.Nullable(t.Date()),
                ticketsAvailable: t.Nullable(t.Number())
            })),
            404: t.String()
        }
    })