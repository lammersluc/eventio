import { Elysia, t } from 'elysia';

import prisma from '@/services/database';

// import optionIdRouter from './{optionId}';

export default new Elysia({ prefix: '/options' })
    // .use(optionIdRouter)

    .put('', async ({ body, params: { dateId }, error, set }) => {

        const created = await prisma.ticketOption.create({
            data: {
                ticket_date_id: dateId,
                name: body.name,
            }
        });

        if (!created) return error(404, '');

        set.status = 201;
        return '';
    }, {
        body: t.Object({
            name: t.String()
        }),
        response: {
            201: t.String(),
            404: t.String()
        }
    })