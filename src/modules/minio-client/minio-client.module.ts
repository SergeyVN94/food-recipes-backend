import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';

import { config } from './config';
import { MinioClientService } from './minio-client.service';

@Module({
  imports: [
    MinioModule.register({
      endPoint: config.MINIO_ENDPOINT,
      port: config.MINIO_PORT,
      useSSL: false,
      accessKey: config.MINIO_ACCESSKEY,
      secretKey: config.MINIO_SECRETKEY,
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
