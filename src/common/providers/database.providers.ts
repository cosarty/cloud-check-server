import { Login } from '@/login/entities/login.entity';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'DATA_MODELS',
    useValue: Login,
  },
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService, 'DATA_MODELS'],
    useFactory: async (config: ConfigService, models: any) => {
      const databaseConf = config.get('database');
      const sequelize = new Sequelize(databaseConf);
      sequelize.addModels([models]);
      await sequelize.sync({ logging: false });
      return sequelize;
    },
  },
] as Provider[];
