import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import * as crypto from 'crypto';
import { uuidv7 } from 'uuidv7';

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
    id: (schema) => schema.id.default(uuidv7),
    email: (schema) => schema.email.email(),
    nickname: (schema) => schema.nickname.min(5).max(32),
    passwordHashHex: (schema) => schema.passwordHashHex.length(64),
    passwordSaltHex: (schema) => schema.passwordSaltHex.length(32),
});

const passwordSchema = z.string().transform(
    (passwordPlainText) => {
        const passwordSaltHex = crypto.randomBytes(16).toString('hex');
        const hasher = crypto.createHash('sha256');
        hasher.update(passwordPlainText);
        hasher.update(passwordSaltHex);
        const passwordHashHex = hasher.digest('hex');
        return { passwordHashHex, passwordSaltHex };
    },
);

const userRawRequestSchema = userInsertSchema
    .pick({ email: true, nickname: true })
    .setKey('password', z.string().min(10).max(64));

const userRequestSchema = userRawRequestSchema.transform((user) => {
    const { passwordHashHex, passwordSaltHex } = passwordSchema.parse(user.password);
    return {
        email: user.email,
        nickname: user.nickname,
        passwordHashHex,
        passwordSaltHex,
    };
});

type UserRawRequest = z.infer<typeof userRawRequestSchema>;
type UserRequest = z.infer<typeof userRequestSchema>;
type UserInsert = z.infer<typeof userInsertSchema>;

export type { UserRawRequest, UserRequest, UserInsert };
export { users, userRequestSchema, userInsertSchema };
