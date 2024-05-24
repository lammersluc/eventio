import { Elysia, t } from 'elysia'
import bearer from '@elysiajs/bearer';

import { checkTokens, generateTokens } from '@/services/tokens';

export default new Elysia({ prefix: '/refresh' })
    .use(bearer())
    .post('/', async ({ body, bearer, set }) => {
        if (!bearer) {
            set.status = 401;
            return;
        }
        
        const uid = checkTokens(bearer, body.refreshToken); 
        if (!uid) {
            set.status = 401;
            return;
        }
    
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
            401: t.Void()
        }
    })