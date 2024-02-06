-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_id_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
