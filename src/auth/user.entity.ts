import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { TaskEntity } from "src/tasks/task.entity";

export class UserEntity implements User {
  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @Exclude()
  password: string;
}
