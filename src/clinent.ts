import * as OpenapiClient from '@alicloud/openapi-client';
import * as TeaUtil  from '@alicloud/tea-util';
import * as FacebodyClient  from "@alicloud/facebody20191230";

export const testClient =async () => { 
  let config = new OpenapiClient.Config({
    // "YOUR_ACCESS_KEY_ID", "YOUR_ACCESS_KEY_SECRET" 的生成请参考https://help.aliyun.com/document_detail/175144.html
    // 如果您是用的子账号AccessKey，还需要为子账号授予权限AliyunVIAPIFullAccess，请参考https://help.aliyun.com/document_detail/145025.html
    // 您的 AccessKey ID
    accessKeyId: 'LTAI5tCA7rEk5rVNpM3V3eu4',
    // 您的 AccessKey Secret
    accessKeySecret: 'nm1b8n5xZessxHQPpHk7AoR2vkvD3B'
  });
  // 访问的域名
  config.endpoint = `facebody.cn-shanghai.aliyuncs.com`;
  const client = new FacebodyClient.default(config);
  let tasks0 = new FacebodyClient.DetectLivingFaceRequestTasks({
    imageURL: "http://viapi-test.oss-cn-shanghai.aliyuncs.com/viapi-3.0domepic/facebody/DetectLivingFace/DetectLivingFace11.jpg",
  });
  let detectLivingFaceRequest = new FacebodyClient.DetectLivingFaceRequest({
    tasks: [
        tasks0
    ],
  });
  let runtime = new TeaUtil.RuntimeOptions({});
 return  client.detectLivingFaceWithOptions(detectLivingFaceRequest, runtime)
    .then(function (detectLivingFaceResponse) {
        // 获取整体结果
        // console.log(detectLivingFaceResponse);
        // 获取单个字段
      console.log(detectLivingFaceResponse.body.data);
      
      return detectLivingFaceResponse.body.data
    }, function (error) {
        // 获取整体报错信息
        console.log(error);
        // 获取单个字段
        console.log(error.data.Code);
    })
}