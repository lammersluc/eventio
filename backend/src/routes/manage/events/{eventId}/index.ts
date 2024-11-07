import { Elysia, t } from 'elysia';

import prisma from '@/services/database';
import { getImage } from '@/services/image';

import creatorRouter from './creator';
import ownerRouter from './owner';
import managerRouter from './manager';
import moderatorRouter from './moderator';
import cashierRouter from './cashier';

export default new Elysia({ prefix: '/:eventId' })
    .state('eventMember', {
        id: '',
        role: 0
    })

    .onBeforeHandle(async ({ error, store, params: { eventId } }) => {
        const { id } = store as { eventMember: { id: string, role: number }, id: string };

        const eventMember = await prisma.eventMember.findUnique({
            where: {
                user_id_event_id: {
                    user_id: id,
                    event_id: eventId
                }
            },
            select: {
                id: true,
                role: true
            }
        });

        if (!eventMember) return error(403, '');

        const roles = {
            creator: 5,
            owner: 4,
            manager: 3,
            moderator: 2,
            cashier: 1
        }

        store.eventMember = { id: eventMember.id, role: roles[eventMember.role] };
    })

    .guard({
        response: {
            403: t.String()
        }
    }, app => app
        .use(creatorRouter)
        .use(ownerRouter)
        .use(managerRouter)
        .use(moderatorRouter)
        .use(cashierRouter)

        .get('', async ({ error, params: { eventId }, store }) => {

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
                    tickets_users_max: true,
                    is_private: true,
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
                ticketsUserMax: event.tickets_users_max,
                isPrivate: event.is_private,
                dates: event.ticket_dates.map(date => ({
                    id: date.id,
                    name: date.name,
                    validFrom: date.valid_from,
                    validUntil: date.valid_until,
                    amount: date.amount,
                    sold: date.ticket_options.reduce((sold, option) => sold + option._count.tickets, 0)
                })),
                role: store.eventMember.role
            };
        }, {
            response: {
                200: t.Object({
                    name: t.String(),
                    description: t.Nullable(t.String()),
                    banner: t.String(),
                    location: t.Nullable(t.String()),
                    startAt: t.Nullable(t.Date()),
                    endAt: t.Nullable(t.Date()),
                    ticketsUserMax: t.Nullable(t.Number()),
                    isPrivate: t.Boolean(),
                    dates: t.Array(t.Object({
                        id: t.String(),
                        name: t.String(),
                        validFrom: t.Nullable(t.Date()),
                        validUntil: t.Nullable(t.Date()),
                        amount: t.Nullable(t.Number()),
                        sold: t.Number()
                    })),
                    role: t.Number()
                }),
                404: t.String()
            },
            tags: ['Manage']
        })
    )