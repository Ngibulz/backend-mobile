import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AliOssModule } from 'nestjs-ali-oss';
import { AliOssController } from './ali-oss.controller';
import { AliOssHelperService } from './ali-oss.service';

@Module({
  imports: [
    AliOssModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get("OSS_REGION"),
        accessKeyId: configService.get("OSS_KEY_ID"),
        accessKeySecret: configService.get("OSS_KEY_SECRET"),
        bucket: configService.get("OSS_BUCKET"),
        timeout: configService.get("OSS_TIMEOUT", 60000)//60 seconds
      }),
      inject: [ConfigService],
    }),
  ],
  controllers:[AliOssController],
  providers: [AliOssHelperService],
  exports: [AliOssHelperService]
})
export class AliOssHelperModule { }
