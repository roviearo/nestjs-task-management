import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./task.model";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { GetTasksFilterDto } from "./dtos/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dtos/update-task-status.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { UserEntity } from "src/auth/user.entity";

@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@GetUser() user: UserEntity) {
    return this.tasksService.getTasks(user);
  }

  @Get("/:id")
  getTaskById(@Param("id") id: string, @GetUser() user: UserEntity) {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ) {
    return this.tasksService.createTask(createTaskDto, user.id);
  }

  @Delete("/:id")
  deleteTask(
    @Param("id") id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id") id: string,
    @GetUser() user: UserEntity,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, user, status);
  }
}
