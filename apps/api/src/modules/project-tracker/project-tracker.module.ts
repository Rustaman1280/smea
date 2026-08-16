import { Module } from '@nestjs/common';
import { ProjectTrackerService } from './project-tracker.service';
import { ProjectTrackerController } from './project-tracker.controller';

@Module({
  controllers: [ProjectTrackerController],
  providers: [ProjectTrackerService],
  exports: [ProjectTrackerService],
})
export class ProjectTrackerModule {}
