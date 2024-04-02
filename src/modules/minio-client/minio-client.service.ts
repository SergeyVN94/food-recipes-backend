import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { config } from './config';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class MinioClientService {
  private readonly baseBucket = config.MINIO_BUCKET;

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {}

  public async upload(
    file: Express.Multer.File,
    bucket: string = this.baseBucket,
  ) {
    const fileName = crypto.randomUUID() + path.extname(file.originalname);

    await this.client.putObject(bucket, fileName, file.buffer);

    return {
      url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${fileName}`,
      fileName,
      path: `/${config.MINIO_BUCKET}/${fileName}`,
    };
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    return this.client.removeObject(baseBucket, objetName);
  }
}
