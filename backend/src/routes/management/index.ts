import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

import ownerRouter from './owner';
import managerRouter from './manager';
import moderatorRouter from './moderator';
import cashierRouter from './cashier';

export default new Elysia({ prefix: '/event/:id', tags: ['Management'] })
    .state('role', 0)
    .guard({
        async beforeHandle({ params, error, store }) {
            const { uid } = store as { role: number, uid: number };

            const eventMember = await prisma.eventMember.findUnique({
                where: {
                    user_id_event_id: {
                        user_id: uid,
                        event_id: +params.id
                    }
                },
                select: {
                    role: true
                }
            })

            if (!eventMember) return error(403, '');
            
            const roles = {
                owner: 4,
                manager: 3,
                moderator: 2,
                cashier: 1
            }

            store.role = roles[eventMember.role];
        },
        params: t.Object({
            id: t.String()
        }),
        response: {
            403: t.String()
        }}, app => app
        .use(ownerRouter)
        .use(managerRouter)
        .use(moderatorRouter)
        .use(cashierRouter)
    )