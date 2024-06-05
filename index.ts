import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userRequestSchema } from './05-drizzle-zod-transform';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Hello Hono!');
});

app.post(
    '/users',
    zValidator('json', userRequestSchema),
    (c) => {
        return c.text('OK!');
    }
);

export default app;
