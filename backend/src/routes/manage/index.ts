import { Elysia, error, t } from 'elysia';

import prisma from '@/services/database';

import creatorRouter from './creator';
import ownerRouter from './owner';
import managerRouter from './manager';
import moderatorRouter from './moderator';
import cashierRouter from './cashier';
import { getImage } from '@/services/image';


export default new Elysia({ prefix: '/manage/events' })
    .use(creatorRouter)
    .state('eventMember', {
        id: '',
        role: 0
    })
    .guard({
        async beforeHandle({ params, error, store }) {
            const { id } = store as { eventMember: { id: string, role: number }, id: string };

            const eventMember = await prisma.eventMember.findUnique({
                where: {
                    user_id_event_id: {
                        user_id: id,
                        event_id: params.id
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
        },
        params: t.Object({
            id: t.String()
        })
        // response: {
        //     403: t.String()
        // }
    }, app => app.group('/:eventId', app => app
        .use(ownerRouter)
        .use(managerRouter)
        .use(moderatorRouter)
        .use(cashierRouter)
    ))

    .get('', async ({ store }) => {
        const { id } = store as unknown as { id: string };

        const events = await prisma.event.findMany({
            where: {
                event_members: {
                    some: {
                        user_id: id
                    }
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                image_hash: true
            }
        });

        return events.map(event => {
            const image = getImage(event.id, event.image_hash, 'event');

            return {
                id: event.id,
                name: event.name,
                description: event.description,
                image
            }
        });
    }, {
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                name: t.String(),
                description: t.String(),
                image: t.String()
            }))
        },
        tags: ['Manage']
    })

    .post('', async ({ body, store }) => {
        const { id } = store as unknown as { id: string };

        const event = await prisma.event.create({
            data: {
                name: body.name,
                event_members: {
                    create: {
                        user_id: id,
                        role: 'creator'
                    }
                }
            },
            select: {
                id: true
            }
        });

        if (!event) return error(500, '');

        return {
            id: event.id
        };
    }, {
        body: t.Object({
            name: t.String()
        }),
        response: {
            201: t.Object({
                id: t.String()
            }),
            500: t.String()
        },
        tags: ['Creator']
    })