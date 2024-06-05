import { Schema } from 'redis-om';

const users = new Schema('users', {
    id: { type: 'string', indexed: true },
    email: { type: 'string' },
    nickname: { type: 'string' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
}, {
    dataStructure: 'JSON',
});
