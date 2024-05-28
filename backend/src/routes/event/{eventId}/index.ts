import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

import datesRouter from './dates';

export default new Elysia({ prefix: '/:eventId' })
    .use(datesRouter)

    .get('', async ({ error, params }) => {
        const eventId = +params.eventId;

        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            },
            select: {
                name: true,
                description: true,
                has_image: true,
                location: true,
                start_at: true,
                end_at: true,
                ticket_dates: {
                    select: {
                        id: true,
                        name: true,
                        valid_from: true,
                        valid_until: true,
                        amount: true,
                        ticket_options: {
                            select: {
                                _count: {
                                    select: {
                                        tickets: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!event) return error(404, '');

        const image = event.has_image ? fs.readFileSync(`./images/events/${eventId}.png`, { encoding: 'base64' }) : null;

        return {
            name: event.name,
            description: event.description,
            image,
            location: event.location,
            startAt: event.start_at,
            endAt: event.end_at,
            dates: event.ticket_dates.map(date => ({
                id: date.id,
                name: date.name,
                validFrom: date.valid_from,
                validUntil: date.valid_until,
                available: date.amount - date.ticket_options.reduce((sold, option) => sold + option._count.tickets, 0)
            }))
        }
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.Object({
                name: t.String(),
                description: t.Nullable(t.String()),
                image: t.Nullable(t.String()),
                location: t.Nullable(t.String()),
                startAt: t.Nullable(t.Date()),
                endAt: t.Nullable(t.Date()),
                dates: t.Array(t.Object({
                    id: t.Number(),
                    name: t.String(),
                    validFrom: t.Nullable(t.Date()),
                    validUntil: t.Nullable(t.Date()),
                    available: t.Number()
                }))
            }),
            404: t.String()
        }
    })

    .get('/wallet', async ({ error, params, store }) => {
        const { uid } = store as { uid: number };

        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: uid,
                    event_id: +params.eventId
                },
                event: {
                    is_private: false
                }
            },
            select: {
                id: true,
                coins: true,
                tickets: {
                    select: {
                        id: true,
                        scanned_at: true,
                        ticket_option: {
                            select: {
                                name: true,
                                ticket_date: {
                                    select: {
                                        name: true,
                                        valid_from: true,
                                        valid_until: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!wallet) return error(404, '');

        return {
            id: wallet.id,
            coins: wallet.coins,
            tickets: wallet.tickets.map(ticket => ({
                id: ticket.id,
                option: ticket.ticket_option.name,
                date: ticket.ticket_option.ticket_date.name,
                validFrom: ticket.ticket_option.ticket_date.valid_from,
                validUntil: ticket.ticket_option.ticket_date.valid_until,
                scannedAt: ticket.scanned_at
            }))
        };
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.Object({
                id: t.Number(),
                coins: t.Number(),
                tickets: t.Array(t.Object({
                    id: t.Number(),
                    option: t.String(),
                    date: t.String(),
                    validFrom: t.Nullable(t.Date()),
                    validUntil: t.Nullable(t.Date()),
                    scannedAt: t.Nullable(t.Date())
                }))
            }),
            404: t.String()
        },
        tags: ['Wallet']
    })