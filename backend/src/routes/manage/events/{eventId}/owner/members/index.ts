import { Elysia, t } from 'elysia';

import prisma from '@/services/database';
import { getImage } from '@/services/image';

export default new Elysia({ prefix: '/members'})
    .get('', async ({ params: { eventId }, error }) => {
        const members = await prisma.eventMember.findMany({
            where: {
                event_id: eventId
            },
            select: {
                user_id: true,
                role: true,
                user: {
                    select: {
                        username: true,
                        avatar_hash: true
                    }
                }
            }
        });

        if (!members) return error(404, '');

        return members.map(member => {
            const avatar = getImage(member.user_id, member.user.avatar_hash, 'users');

            return {
                id: member.user_id,
                username: member.user.username,
                avatar,
                role: member.role
            };
        });
    }, {
        response: {
            200: t.Array(t.Object({
                id: t.String(),
                username: t.String(),
                avatar: t.String(),
                role: t.String()
            })),
            404: t.String()
        }
    })

    .post('', async ({ body, params: { eventId }, error }) => {        
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
                    event_id: eventId
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
                event_id: eventId,
                role
            }
        }).catch(() => null);

        if (!created) return error(500, '');

        return '';
    }, {
        body: t.Object({
            userId: t.String(),
            role: t.String({ pattern: '/^(owner|manager|moderator|cashier)$/' })
        }),
        response: {
            200: t.String(),
            400: t.String(),
            403: t.String(),
            404: t.String(),
            500: t.String()
        }
    })
    
    .delete('/:userId', async ({ params: { userId, eventId }, error }) => {
        const eventMember = await prisma.eventMember.findUnique({
            where: {
                user_id_event_id: {
                    user_id: userId,
                    event_id: eventId
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
            userId: t.String(),
            eventId: t.String()
        }),
        response: {
            200: t.String(),
            403: t.String(),
            404: t.String(),
            500: t.String()
        }
    })