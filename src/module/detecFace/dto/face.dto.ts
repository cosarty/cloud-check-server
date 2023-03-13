import {
  IsBase64,
  IsDefined,
  IsMimeType,
  IsOptional,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class DetectFaceDto {
  @ValidateIf((o: any) => !o.imageData)
  @IsDefined({ message: '请输入图片地址' })
  @IsUrl({}, { message: 'url错误' })
  imageURL: string;

  @ValidateIf((o: any) => !o.imageURL)
  @IsDefined({ message: '请输入base64字符' })
  @IsBase64({ message: '格式错误' })
  imageData: string;
}
