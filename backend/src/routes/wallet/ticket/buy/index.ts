import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/buy' })
    .post('', async ({ body, error, store }) => {
        const ticketOption = await prisma.ticketOption.findUnique({
            where: {
                id: body.option
            },
            select: {
                ticket_date: {
                    select: {
                        event_id: true
                    }
                },
                price: true,
                tickets_max: true,
                tickets_sold: true
            }
        });

        if (!ticketOption || (ticketOption.tickets_max && ticketOption.tickets_max - ticketOption.tickets_sold <= 0)) return error(404, '');

        //Check digital payment

        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: (store as { uid: number }).uid,
                    event_id: ticketOption.ticket_date.event_id
                }
            }
        });

        if (!wallet) return error(404, '');

        const ticket = await prisma.ticket.create({
            data: {
                wallet_id: wallet.id,
                ticket_option_id: body.option,
                purchased_at: new Date
            },
            select: {
                id: true
            }
        });

        if (!ticket) return error(500, '');

        return '';
    }, {
        body: t.Object({
            option: t.Number()
        }),
        response: {
            200: t.String(),
            404: t.String(),
            500: t.String()
        }
    })