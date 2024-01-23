import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TaskModule, AuthModule, UsersModule],
})
export class AppModule {}
