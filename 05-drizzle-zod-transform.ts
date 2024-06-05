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
    (value) => {
        const passwordSaltHex = crypto.randomBytes(16).toString('hex');
        const hasher = crypto.createHash('sha256');
        hasher.update(value);
        hasher.update(passwordSaltHex);
        const passwordHashHex = hasher.digest('hex');
        return { passwordHashHex, passwordSaltHex };
    },
);

const userRequestSchema = userInsertSchema
    .pick({ email: true, nickname: true })
    .setKey('password', z.string().min(10).max(64))
    .transform((value) => {
        const { passwordHashHex, passwordSaltHex } = passwordSchema.parse(value.password);
        return {
            email: value.email,
            nickname: value.nickname,
            passwordHashHex,
            passwordSaltHex,
        };
    });

const rawUserRequest = {
    email: 'joe@dragonflydb.io',
    nickname: 'joe_df',
    password: 'password123',
};
console.log('=== Raw Request ===\n', rawUserRequest);

const userRequest = userRequestSchema.parse(rawUserRequest);
console.log('=== After Request Schema ===\n', userRequest);

const userInsert = userInsertSchema.parse(userRequest);
console.log('=== After Insert Schema ===\n', userInsert);

type UserRawRequest = typeof rawUserRequest;
type UserRequest = z.infer<typeof userRequestSchema>;
type UserInsert = z.infer<typeof userInsertSchema>;

export type { UserRawRequest, UserRequest, UserInsert };
export { users, userInsertSchema, userRequestSchema };
