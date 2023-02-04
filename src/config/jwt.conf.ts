import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  token_secret: 'Intelligent roll call system',
}));
