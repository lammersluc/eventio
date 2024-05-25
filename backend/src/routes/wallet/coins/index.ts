import Elysia from 'elysia';

import transferRouter from './transfer';

export default new Elysia({ prefix: '/coins' })
    .use(transferRouter)