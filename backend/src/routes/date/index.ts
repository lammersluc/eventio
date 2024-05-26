import { Elysia, t } from "elysia";

import prisma from '@/services/database';

export default new Elysia({ prefix: '/date/:id', tags: ['Event'] })
    .get('/options', async ({ params, error }) => {
        const options = await prisma.ticketDate.findUnique({
            where: {
                id: +params.id
            }}
        ).ticket_options({
            select: {
                id: true,
                name: true,
                price: true,
                tickets_max: true,
                tickets_sold: true
            }
        });

        if (!options) return error(404, '');

        return options.map(option => ({
            id: option.id,
            name: option.name,
            price: option.price,
            ticketsAvailable: option.tickets_max ? option.tickets_max - option.tickets_sold : null
        }));
    }, {
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                price: t.Nullable(t.Number()),
                ticketsAvailable: t.Nullable(t.Number())
            })),
            404: t.String()
        }
    })