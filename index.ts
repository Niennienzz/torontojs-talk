import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userRequestSchema } from './05-drizzle-zod-transform';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Hello Hono!');
});

const route = app.post(
    '/users',
    zValidator('json', userRequestSchema),
    (c) => {
        const validated = c.req.valid('json');
        return c.text('OK!');
    }
);

export type AppType = typeof route;
export default app;
