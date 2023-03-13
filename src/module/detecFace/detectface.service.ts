import * as OpenapiClient from '@alicloud/openapi-client';
import * as TeaUtil from '@alicloud/tea-util';
import * as FacebodyClient from '@alicloud/facebody20191230';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { DetectFaceDto } from './dto/face.dto';

@Injectable()
export class DetectFaceService {
  private get client() {
    let config = new OpenapiClient.Config({
      // 您的 AccessKey ID
      accessKeyId: process.env.accessKeyId,
      // 您的 AccessKey Secret
      accessKeySecret: process.env.accessKeySecret,
    });
    // 访问的域名
    config.endpoint = `facebody.cn-shanghai.aliyuncs.com`;
    return new FacebodyClient.default(config);
  }

  async detectFaceClent(detect: DetectFaceDto) {
    let tasks0 = new FacebodyClient.DetectLivingFaceRequestTasks({
      ...detect,
    });
    let detectLivingFaceRequest = new FacebodyClient.DetectLivingFaceRequest({
      tasks: [tasks0],
    });
    let runtime = new TeaUtil.RuntimeOptions({});
    return this.client.detectLivingFaceWithOptions(
      detectLivingFaceRequest,
      runtime,
    );
  }
  async compareFace(detect: DetectFaceDto) {
    try {
      const fileStreamB = fs.createReadStream(
        path.join(process.cwd(),'dist', 'static', 'test.jpg'),
      );

      const compareFaceAdvanceRequest =
        new FacebodyClient.CompareFaceAdvanceRequest({
          imageDataA: detect.imageData,
          imageURLBObject: fileStreamB,
        });
      let runtime = new TeaUtil.RuntimeOptions({});
      return this.client.compareFaceAdvance(compareFaceAdvanceRequest, runtime);
    } catch (err) {
      console.log('compare face error.');
    }
    return null;
  }
}
