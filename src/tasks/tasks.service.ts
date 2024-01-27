import { Injectable, NotFoundException } from "@nestjs/common";
import { Task as TaskModel } from "./task.model";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { GetTasksFilterDto } from "./dtos/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";
import { TaskStatus } from "./task-status.enum";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>,
  ) {}

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<TaskModel[]> {
    const { status, search } = filterDto;

    const query = this.repo.createQueryBuilder("task");
    query.where({ user });

    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    if (search) {
      query.andWhere(
        "(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))",
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.repo.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<TaskModel> {
    const { title, description } = createTaskDto;

    const task = this.repo.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.repo.save(task);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.repo.delete({ id, user });

    if (result.affected === 0) {
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

    await this.repo.save(task);

    return task;
  }
}
