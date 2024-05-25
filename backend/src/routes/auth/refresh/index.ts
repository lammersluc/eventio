import { Elysia, t } from 'elysia';
import bearer from '@elysiajs/bearer';

import { checkTokens, generateTokens } from '@/services/tokens';

export default new Elysia({ prefix: '/refresh' }).use(bearer())
    .post('/', async ({ body, error, bearer }) => {

        if (!bearer) return error(401, '');

        const uid = await checkTokens(bearer, body.refreshToken);

        if (!uid) return error(401, '');

        return generateTokens(uid);
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