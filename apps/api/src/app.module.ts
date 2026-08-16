import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { TeacherAttendanceModule } from './modules/teacher-attendance/teacher-attendance.module';
import { DisciplineModule } from './modules/discipline/discipline.module';
import { CanteenModule } from './modules/canteen/canteen.module';
import { ExtracurricularModule } from './modules/extracurricular/extracurricular.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { ProjectTrackerModule } from './modules/project-tracker/project-tracker.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { VoucherModule } from './modules/voucher/voucher.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    AttendanceModule,
    TeacherAttendanceModule,
    DisciplineModule,
    CanteenModule,
    ExtracurricularModule,
    SubjectsModule,
    ProjectTrackerModule,
    InventoryModule,
    VoucherModule,
  ],
})
export class AppModule {}
