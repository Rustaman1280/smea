import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to Database via Prisma');
    } catch (err) {
      console.warn('⚠️ Database connection deferred or running without live DB connection:', err.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
