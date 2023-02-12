import * as Model from '@/models';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

export const SEQUELIZE_KEY = Symbol('SEQUELIZE');
export const databaseProviders = [
  ...Object.keys(Model).map((m) => ({
    provide: m.replace(/[A-Z]/g, (str) => `_${str}`).toUpperCase(),
    useValue: Model[m],
  })),
  {
    provide: 'MODELS_DATA',
    useValue: Model,
  },
  {
    provide: SEQUELIZE_KEY,
    inject: [ConfigService, 'MODELS_DATA'],
    useFactory: async (config: ConfigService, models: any) => {
      const databaseConf = config.get('database');
      const sequelize = new Sequelize({
        ...databaseConf,
        // models: [path.join(process.cwd(), 'src', 'models/*.entity.js')],
        define: {
          paranoid: true,
        },
      });

      sequelize.addModels([...Object.values(models)] as any);
      await sequelize.sync({ logging: true, force: true });
      return sequelize;
    },
  },
] as Provider[];
