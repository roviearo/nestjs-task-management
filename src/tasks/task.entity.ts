import { TaskStatus } from "./task-status.enum";
import { UserEntity } from "./../auth/user.entity";
import { Exclude } from "class-transformer";
import { Task } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class TaskEntity implements Task {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: TaskStatus;

  @ApiProperty({ required: false, nullable: true })
  userId: string;

  @ApiProperty({ required: false, type: UserEntity })
  user: UserEntity;

  constructor({ user, ...data }: Partial<TaskEntity>) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
  }
}
