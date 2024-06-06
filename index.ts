import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userRequestSchema, userInsertSchema } from './05-drizzle-zod-transform';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Hello Hono!');
});

const route = app.post(
    '/users',
    zValidator('json', userRequestSchema),
    (c) => {
        const userRequest = c.req.valid('json');
        const userInsert = userInsertSchema.parse(userRequest);
        console.log('=== After Request Schema ===\n', userRequest);
        console.log('=== After Insert Schema ===\n', userInsert);
        return c.text('OK!');
    }
);

export type AppType = typeof route;
export default app;
