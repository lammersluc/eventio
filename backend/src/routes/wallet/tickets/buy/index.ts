import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/buy' })
    .post('', async ({ body, error, store }) => {
        const optionIds = body.optionIds;
        const ticketOptions = await prisma.ticketOption.findMany({
            where: {
                id: {
                    in: optionIds
                }
            },
            select: {
                id: true,
                tickets_max: true,
                tickets_sold: true,
                ticket_date: {
                    select: {
                        event_id: true
                    }
                }
            }
        });

        const optionEvents = [...new Set(ticketOptions.map(option => option.ticket_date.event_id))];

        if (optionEvents.length > 1) return error(400, '');

        if (
            ticketOptions.filter(option => 
                option.tickets_max &&
                option.tickets_max - option.tickets_sold <= 0
            ).length > 0
        ) return error(404, '');

        //Check digital payment

        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: (store as { uid: number }).uid,
                    event_id: optionEvents[0]
                }
            }
        });

        if (!wallet) return error(404, '');
        
        const now = new Date;

        const tickets = body.optionIds.map(optionId => ({
            wallet_id: wallet.id,
            ticket_option_id: optionId,
            purchased_at: now
        }));
        
        const created = await prisma.ticket.createMany({
            data: tickets
        });

        if (!created) return error(500, '');

        return '';
    }, {
        body: t.Object({
            optionIds: t.Array(t.Number())
        }),
        response: {
            200: t.String(),
            400: t.String(),
            404: t.String(),
            500: t.String()
        }
    })