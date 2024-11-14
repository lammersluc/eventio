import { describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';

import { app } from '@/index';

const client = treaty(app);

describe('Elysia', () => {
    it('return a response', async () => {

        // @ts-ignore
        const { status } = await client.auth.login.post({});
        
        expect(status).toBe(422);
    })

    it('return a response', async () => {
        const { status } = await client.account.get();

        expect(status).toBe(401);
    })
})