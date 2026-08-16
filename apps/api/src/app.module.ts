import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { TeacherAttendanceModule } from './modules/teacher-attendance/teacher-attendance.module';
import { DisciplineModule } from './modules/discipline/discipline.module';
import { CanteenModule } from './modules/canteen/canteen.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    AttendanceModule,
    TeacherAttendanceModule,
    DisciplineModule,
    CanteenModule,
  ],
})
export class AppModule {}
