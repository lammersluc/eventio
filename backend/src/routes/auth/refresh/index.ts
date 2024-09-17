import { Elysia, t } from 'elysia';
import bearer from '@elysiajs/bearer';

import { checkTokens, generateTokens } from '@/services/tokens';

export default new Elysia({ prefix: '/refresh' }).use(bearer())
    .post('', async ({ body, error, bearer }) => {
        if (!bearer) return error(401, '');

        const id = await checkTokens(bearer, body.refreshToken);

        if (!id) return error(401, '');

        return generateTokens(id);
    }, {
        body: t.Object({
            refreshToken: t.String()
        }),
        response: {
            200: t.Object({
                accessToken: t.String(),
                refreshToken: t.String()
            }),
            401: t.String()
        }
    })