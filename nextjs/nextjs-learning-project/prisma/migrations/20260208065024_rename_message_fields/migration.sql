/*
  Warnings:

  - You are about to drop the column `MessageRole` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `MessageType` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "MessageRole",
DROP COLUMN "MessageType",
ADD COLUMN     "messageRole" "MessageRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "messageType" "MessageType" NOT NULL DEFAULT 'NORMAL';
