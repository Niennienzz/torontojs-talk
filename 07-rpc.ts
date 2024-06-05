import { type AppType } from './index';
import { hc } from 'hono/client';

const client = hc<AppType>('http://localhost:3000/');

client.users.$post({
    json: {
        email: 'joe@dragonflydb.io',
        nickname: 'joe_df',
        password: 'password123',
    },
}).then((response) => {
    console.log(response);
});
