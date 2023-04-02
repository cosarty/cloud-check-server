import * as OpenapiClient from '@alicloud/openapi-client';
import * as TeaUtil from '@alicloud/tea-util';
import * as FacebodyClient from '@alicloud/facebody20191230';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { DetectFaceDto } from './dto/face.dto';
import { Readable } from 'stream';
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

  // 检测人脸
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

  // 创建人脸数据库
  async createFaceDb(dbName: string): Promise<void> {
    try {
      let requestBody = new FacebodyClient.CreateFaceDbRequest({
        name: dbName,
      });
      await this.client.createFaceDb(requestBody);
      console.log('--------------------创建人脸数据库成功--------------------');
    } catch (err) {
      console.log('create facebody db error');
      console.log(err.message);
    }
  }

  // 创建人脸样本
  async addFaceEntity(entityId: string): Promise<void> {
    try {
      const en = await this.searchFaceEntity(entityId);
      if (en.body.data) return;
      let requestBody = new FacebodyClient.AddFaceEntityRequest({});
      requestBody.dbName = 'cloud_check';
      requestBody.entityId = entityId.replace(/-/g, '_');
      await this.client.addFaceEntity(requestBody);
      console.log('--------------------创建人脸样本成功--------------------');
    } catch (err) {
      console.log('add face entity error.');
      console.log(err.message);
    }
  }

  // 录入人脸
  async entryFace(entityId: string, ImageUrl: any): Promise<void> {
    try {
      let requestBody = new FacebodyClient.AddFaceAdvanceRequest({});
      requestBody.dbName = 'cloud_check';
      requestBody.entityId = entityId.replace(/-/g, '_');
      requestBody.imageUrlObject = Readable.from(ImageUrl);
      let runtime = new TeaUtil.RuntimeOptions({});
      await this.client.addFaceAdvance(requestBody, runtime);
      console.log('--------------------录入人脸样本成功--------------------');
    } catch (err) {
      console.log('add face entity error.');
      console.log(err.message);
    }
  }
  // 获取人脸样本
  async searchFaceEntity(
    entityId: string,
  ): Promise<FacebodyClient.GetFaceEntityResponse> {
    try {
      let requestBody = new FacebodyClient.GetFaceEntityRequest({});
      requestBody.dbName = 'cloud_check';
      requestBody.entityId = entityId.replace(/-/g, '_');
      console.log('entit ', entityId.replace('-', '_'));
      console.log('--------------------获取人脸样本成功--------------------');
      return await this.client.getFaceEntity(requestBody);
    } catch (err) {
      console.log('get face entity error.');
      console.log(err.message);
    }
  }

  // 搜索人脸
  async searchFace(
    imageUrl: string,
    dbName: string = 'cloud_check',
    limit: number = 1,
  ): Promise<FacebodyClient.SearchFaceResponse> {
    try {
      const buf = Buffer.from(imageUrl, 'base64');
      let requestBody = new FacebodyClient.SearchFaceAdvanceRequest({});
      requestBody.dbName = dbName;
      requestBody.imageUrlObject = Readable.from(buf);
      requestBody.limit = limit;
      requestBody.maxFaceNum = 1;
      let runtime = new TeaUtil.RuntimeOptions({});
      return await this.client.searchFaceAdvance(requestBody, runtime);
    } catch (err) {
      console.log('search face error.');
      console.log(err.message);
    }
    return null;
  }

  async compareFace(detect: DetectFaceDto) {
    try {
      const fileStreamB = fs.createReadStream(
        path.join(process.cwd(), 'dist', 'static', 'test.jpg'),
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
