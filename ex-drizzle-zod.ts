import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    email: text('email').notNull(),
    nickname: text('nickname').notNull().unique(),
    passwordHashHex: text('password_hash').notNull(),
    passwordSaltHex: text('password_salt').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const userInsertSchema = createInsertSchema(users, {
    id: (schema) => schema.id.uuid(),
    email: (schema) => schema.email.email(),
    nickname: (schema) => schema.nickname.min(5).max(32),
    passwordHashHex: (schema) => schema.passwordHashHex.length(64),
    passwordSaltHex: (schema) => schema.passwordSaltHex.length(32),
});

const userRequest = userInsertSchema
    .pick({ email: true, nickname: true })
    .setKey("password", z.string().min(10).max(64));

type UserRequest = z.infer<typeof userRequest>;
