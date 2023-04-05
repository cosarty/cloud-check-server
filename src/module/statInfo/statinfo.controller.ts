import { ModelsEnum, PickModelType } from '@/models';
import { Controller, Inject } from '@nestjs/common';

@Controller('statinfo')
export class StatInfoController {
  constructor(
    @Inject(ModelsEnum.StatInfo)
    private readonly statInfo: PickModelType<ModelsEnum.StatInfo>,
  ) { }
  
  
  
}
