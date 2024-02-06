import { Module } from "@nestjs/common";
import { TaskModule } from "./tasks/tasks.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { configValidationSchema } from "./config.schema";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.NODE_ENV}`],
      validationSchema: configValidationSchema,
    }),
    TaskModule,
    AuthModule,
    PrismaModule,
  ],
})
export class AppModule {}
