import { VrifyIdentity } from '@/common/rule/verify-identity.rule';
import { IsDefined, Validate, IsUUID } from 'class-validator';

// export class UploadUserAvatar {
//   @IsDefined({ message: '请输入用户id' })
//   @IsUUID('4', { message: 'id错误' })
//   @Validate(VrifyIdentity, ['all'], { message: '不存在此用户' })
//   userId: string;
// }
