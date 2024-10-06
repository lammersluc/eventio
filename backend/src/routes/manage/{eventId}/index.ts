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

    .onBeforeHandle(async ({ error, store, params }) => {
        const { id } = store as { eventMember: { id: string, role: number }, id: string };

        const eventMember = await prisma.eventMember.findUnique({
            where: {
                user_id_event_id: {
                    user_id: id,
                    event_id: params.eventId
                }
            },
            select: {
                id: true,
                role: true
            }
        })

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

    .use(creatorRouter)
    .use(ownerRouter)
    .use(managerRouter)
    .use(moderatorRouter)
    .use(cashierRouter)

    .get('', async ({ error, params, store }) => {
        const eventId = params.eventId;

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
                amount: date.amount,
                sold: date.ticket_options.reduce((sold, option) => sold + option._count.tickets, 0)
            })),
            role: store.eventMember.role
        };
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.Object({
                name: t.String(),
                description: t.String(),
                banner: t.String(),
                location: t.Nullable(t.String()),
                startAt: t.Nullable(t.Date()),
                endAt: t.Nullable(t.Date()),
                dates: t.Array(t.Object({
                    id: t.String(),
                    name: t.String(),
                    validFrom: t.Nullable(t.Date()),
                    validUntil: t.Nullable(t.Date()),
                    amount: t.Number(),
                    sold: t.Number()
                })),
                role: t.Number()
            }),
            404: t.String()
        }
    })