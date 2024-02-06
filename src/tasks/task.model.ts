import { User } from "@prisma/client";
import { TaskStatus } from "./task-status.enum";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  user: User;
  userId: string;
}
