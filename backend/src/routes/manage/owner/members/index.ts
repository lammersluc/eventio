import { Elysia, t } from 'elysia';
import fs from 'fs';

import prisma from '@/services/database';

export default new Elysia({ prefix: '/members'})
    .get('', async ({ params, error }) => {
        const members = await prisma.eventMember.findMany({
            where: {
                event_id: +params.eventId
            },
            select: {
                user_id: true,
                role: true,
                user: {
                    select: {
                        username: true,
                        has_image: true
                    }
                }
            }
        });

        if (!members) return error(404, '');

        return members.map(member => {
            const image = member.user.has_image ? fs.readFileSync(`./images/users/${member.user_id}.png`, { encoding: 'base64' }) : null;
            return {
                id: member.user_id,
                username: member.user.username,
                image,
                role: member.role
            };
        });
    }, {
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                username: t.String(),
                image: t.Nullable(t.String()),
                role: t.String()
            })),
            404: t.String()
        }
    })

    .post('', async ({ body, params, error }) => {        
        const user = await prisma.user.findUnique({
            where: {
                id: body.userId
            }
        });

        if (!user) return error(404, '');
        
        const role = body.role as 'owner' | 'manager' | 'moderator' | 'cashier';

        const eventMember = await prisma.eventMember.findUnique({
            where: {
                user_id_event_id: {
                    user_id: body.userId,
                    event_id: +params.eventId
                }
            }
        });

        if (eventMember) {
            if (eventMember.role === 'creator') return error(403, '');

            const updated = await prisma.eventMember.update({
                where: {
                    id: eventMember.id
                },
                data: {
                    role
                }
            }).catch(() => null);
    
            if (!updated) return error(500, '');

            return '';
        }

        const created = await prisma.eventMember.create({
            data: {
                user_id: body.userId,
                event_id: +params.eventId,
                role
            }
        }).catch(() => null);

        if (!created) return error(500, '');

        return '';
    }, {
        body: t.Object({
            userId: t.Number(),
            role: t.String({ pattern: '/^(owner|manager|moderator|cashier)$/' })
        }),
        params: t.Object({
            eventId: t.String()
        }),
        response: {
            200: t.String(),
            400: t.String(),
            403: t.String(),
            404: t.String(),
            500: t.String()
        }
    })

    .delete('/:userId', async ({ params, error }) => {
        const eventMember = await prisma.eventMember.findUnique({
            where: {
                user_id_event_id: {
                    user_id: +params.userId,
                    event_id: +params.eventId
                }
            }
        });

        if (!eventMember) return error(404, '');
        if (eventMember.role === 'creator') return error(403, '');

        const deleted = await prisma.eventMember.delete({
            where: {
                id: eventMember.id
            }
        }).catch(() => null);

        if (!deleted) return error(500, '');

        return '';
    }, {
        params: t.Object({
            eventId: t.String(),
            userId: t.String()
        }),
        response: {
            200: t.String(),
            403: t.String(),
            404: t.String(),
            500: t.String()
        }
    })