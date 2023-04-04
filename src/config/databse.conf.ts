import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'dianming',
  pool: {
    max: 5,
    min: 0,
  },
}));
