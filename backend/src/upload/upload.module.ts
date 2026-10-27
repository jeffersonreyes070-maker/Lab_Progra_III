import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  // AuthModule se importa porque el guard necesita revisar los tokens
  imports: [AuthModule],
  controllers: [UploadController],
})
export class UploadModule {}
