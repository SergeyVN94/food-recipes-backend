import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';

import { MinioClientService } from './minio-client.service';
import { config } from './config';

@Module({
  imports: [
    MinioModule.register({
      endPoint: config.MINIO_ENDPOINT,
      port: config.MINIO_PORT,
      useSSL: false,
      accessKey: config.MINIO_ACCESSKEY,
      secretKey: config.MINIO_SECRETKEY,
    })
  ],
  providers: [MinioClientService],
  exports: [MinioClientService]
})
export class MinioClientModule {}

