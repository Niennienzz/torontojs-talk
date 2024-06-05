import { Type, type Static } from '@sinclair/typebox';
import ajv from './ajv';

const newUserSchema = Type.Object({
    email: Type.String({
        format: 'email',
    }),
    nickname: Type.String({
        minLength: 5,
        maxLength: 32,
    }),
    password: Type.String({
        minLength: 10,
        maxLength: 64,
    }),
});

const checker = ajv.compile(newUserSchema);
const ok = checker({
    email: 'joe@dragonflydb.io',
    nickname: 'joe_df',
    password: 'password1234Abcd#',
});
console.log(ok);

type NewUser = Static<typeof newUserSchema>;
type User = NewUser & { id: string };
