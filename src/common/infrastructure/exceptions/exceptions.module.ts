import { Module } from '@nestjs/common';
import { ExceptionsService } from 'src/common/services/exceptions.service';

@Module({
  providers: [ExceptionsService],
  exports: [ExceptionsService],
})
export class ExceptionsModule {}
