import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';
import { getImage } from '@/services/image';

import dateRouter from './date';

export default new Elysia({ prefix: '/:eventId' })
    .use(dateRouter)

    .get('', async ({ error, params: { eventId } }) => {

        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            },
            select: {
                name: true,
                description: true,
                banner_hash: true,
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

        const banner = getImage(eventId, event.banner_hash, 'events', 'banner');

        return {
            name: event.name,
            description: event.description,
            banner,
            location: event.location,
            startAt: event.start_at,
            endAt: event.end_at,
            dates: event.ticket_dates.map(date => ({
                id: date.id,
                name: date.name,
                validFrom: date.valid_from,
                validUntil: date.valid_until,
                available: date.amount ? date.amount - date.ticket_options.reduce((sold, option) => sold + option._count.tickets, 0) : null
            }))
        }
    }, {
        response: {
            200: t.Object({
                name: t.String(),
                description: t.Nullable(t.String()),
                banner: t.String(),
                location: t.Nullable(t.String()),
                startAt: t.Nullable(t.Date()),
                endAt: t.Nullable(t.Date()),
                dates: t.Array(t.Object({
                    id: t.String(),
                    name: t.String(),
                    validFrom: t.Nullable(t.Date()),
                    validUntil: t.Nullable(t.Date()),
                    available: t.Nullable(t.Number())
                }))
            }),
            404: t.String()
        }
    })

    .get('/wallet', async ({ error, params: { eventId }, store }) => {
        const { id } = store as { id: string };

        const wallet = await prisma.wallet.findUnique({
            where: {
                user_id_event_id: {
                    user_id: id,
                    event_id: eventId
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
        response: {
            200: t.Object({
                id: t.String(),
                coins: t.Number(),
                tickets: t.Array(t.Object({
                    id: t.String(),
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