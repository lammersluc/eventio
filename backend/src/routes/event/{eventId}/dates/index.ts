import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/dates/:dateId' })
    .get('', async ({ error, params }) => {
        const dateId = +params.dateId;

        const date = await prisma.ticketDate.findUnique({
            where: {
                id: dateId
            },
            select: {
                name: true,
                valid_from: true,
                valid_until: true,
                amount: true,
                ticket_options: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        amount: true,
                        _count: {
                            select: {
                                tickets: true
                            }
                        }
                    }
                }
            }
        });

        if (!date) return error(404, '');

        return {
            name: date.name,
            validFrom: date.valid_from,
            validUntil: date.valid_until,
            options: date.ticket_options.map(option => ({
                id: option.id,
                name: option.name,
                price: option.price,
                available: option.amount - option._count.tickets
            }))
        }
    }, {
        params: t.Object({
            dateId: t.String()
        }),
        response: {
            200: t.Object({
                name: t.String(),
                validFrom: t.Nullable(t.Date()),
                validUntil: t.Nullable(t.Date()),
                options: t.Array(t.Object({
                    id: t.Number(),
                    name: t.String(),
                    price: t.Number(),
                    available: t.Number()
                }))
            }),
            404: t.String()
        }
    })