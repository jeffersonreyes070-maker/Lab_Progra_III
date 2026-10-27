import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  // se exporta para que el guard pueda usarlo en productos y upload
  exports: [AuthService],
})
export class AuthModule {}
