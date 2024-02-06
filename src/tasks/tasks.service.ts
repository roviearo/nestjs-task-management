import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { GetTasksFilterDto } from "./dtos/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { UserEntity } from "src/auth/user.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { Task, User } from "@prisma/client";

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async getTasks(user: UserEntity): Promise<Task[]> {
    return await this.prismaService.task.findMany({ where: { user } });
  }

  async getTasksWithFilter(user: UserEntity, filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;

    const tasks = this.prismaService.task.findMany({
      where: {
        user,
        status,
        title: { contains: search },
        description: { contains: search },
      },
    });

    return tasks;
  }

  async getTaskById(id: string, user: UserEntity): Promise<Task> {
    const found = await this.prismaService.task.findUnique({
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = await this.prismaService.task.create({
      data: {
        title,
        description,
        status: TaskStatus.OPEN,
        userId,
      },
    });

    return task;
  }

  async deleteTask(id: string, user: UserEntity): Promise<void> {
    try {
      const result = await this.prismaService.task.delete({
        where: { id, user },
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    user: User,
    status: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    return this.prismaService.task.update({ where: { id }, data: task });
  }
}
