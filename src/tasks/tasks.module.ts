import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { AuthModule } from "src/auth/auth.module";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TaskModule {}
