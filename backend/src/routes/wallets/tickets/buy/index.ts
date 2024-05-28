import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/buy' })
    .post('', async ({ body, params, error }) => {

        const ticketOptions = await prisma.ticketOption.findMany({
            where: {
                id: {
                    in: body.map(option => option.optionId)
                }
            },
            select: {
                id: true,
                amount: true,
                ticket_date: {
                    select: {
                        id: true,
                        event_id: true,
                        amount: true
                    }
                },
                _count: {
                    select: {
                        tickets: true
                    }
                }
            }
        });

        const wallet = await prisma.wallet.findUnique({
            where: {
                id: +params.walletId
            },
            select: {
                id: true,
                event: {
                    select: {
                        id: true,
                        tickets_users_max: true
                    }
                },
                _count: {
                    select: {
                        tickets: true
                    }
                }
            }
        });

        if (!wallet) return error(500, '');

        if (ticketOptions.some(option => option.ticket_date.event_id !== wallet.event.id)) return error(400, '');

        const eventTooMany = wallet._count.tickets + body.reduce((acc, option) => acc + option.amount, 0) - wallet.event.tickets_users_max;

        if (eventTooMany > 0) return error(410, { eventTooMany });

        const dates: {
            id: number,
            amount: number,
            tickets: number
        }[] = [];

        ticketOptions.forEach(option => {
            const date = dates.find(date => date.id === option.ticket_date.id);

            if (!date) dates.push({
                id: option.ticket_date.id,
                amount: option.ticket_date.amount,
                tickets: (body.find(o => o.optionId === option.id)?.amount ?? 0) + option._count.tickets
            });
            else date.tickets += option._count.tickets;
        });

        const datesTooMany = dates.filter(date => date.tickets > date.amount).map(date => ({
            id: date.id,
            tooMany: date.tickets - date.amount
        }));

        if (datesTooMany.length > 0) return error(410, { datesTooMany });
        
        const optionsTooMany: {
            id: number,
            tooMany: number
        }[] = [];
        
        body.forEach(option => {
            const optionData = ticketOptions.find(o => o.id === option.optionId);

            if (!optionData) return null;
            
            const tooMany = option.amount + optionData._count.tickets - optionData.amount;

            if (tooMany > 0)
                optionsTooMany.push({
                    id: option.optionId,
                    tooMany
                });
        });

        if (optionsTooMany.length > 0) return error(410, { optionsTooMany });

        // Check stripe payment

        const now = new Date();

        const tickets = body.map(option => ({
            wallet_id: +params.walletId,
            ticket_option_id: option.optionId,
            purchased_at: now
        }));
        
        const created = await prisma.ticket.createMany({
            data: tickets
        });

        if (!created) return error(500, '');

        return '';
    }, {
        body: t.Array(t.Object({
            optionId: t.Number(),
            amount: t.Number({ minimum: 1 })
        })),
        params: t.Object({
            walletId: t.String()
        }),
        response: {
            200: t.String(),
            400: t.String(),
            410: t.Partial(t.Object({
                eventTooMany: t.Optional(t.Number()),
                datesTooMany: t.Array(t.Object({
                    id: t.Number(),
                    tooMany: t.Number()
                })),
                optionsTooMany: t.Array(t.Object({
                    id: t.Number(),
                    tooMany: t.Number()
                }))
            })),
            500: t.String()
        }
    })