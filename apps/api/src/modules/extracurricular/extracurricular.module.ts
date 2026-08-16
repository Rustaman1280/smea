import { Module } from '@nestjs/common';
import { ExtracurricularService } from './extracurricular.service';
import { ExtracurricularController } from './extracurricular.controller';

@Module({
  controllers: [ExtracurricularController],
  providers: [ExtracurricularService],
  exports: [ExtracurricularService],
})
export class ExtracurricularModule {}
