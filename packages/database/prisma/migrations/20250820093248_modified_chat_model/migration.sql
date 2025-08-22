-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "imageId" TEXT,
ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "lastMessageId" TEXT,
ADD COLUMN     "onlyAdminsCanMessage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "participant1Id" TEXT,
ADD COLUMN     "participant2Id" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "mediaId" TEXT;

-- CreateIndex
CREATE INDEX "Chat_isGroup_idx" ON "Chat"("isGroup");

-- CreateIndex
CREATE INDEX "Chat_participant1Id_participant2Id_idx" ON "Chat"("participant1Id", "participant2Id");

-- CreateIndex
CREATE INDEX "Chat_lastMessageAt_idx" ON "Chat"("lastMessageAt" DESC);

-- CreateIndex
CREATE INDEX "Chat_createdAt_idx" ON "Chat"("createdAt");

-- CreateIndex
CREATE INDEX "Message_chatId_sentAt_idx" ON "Message"("chatId", "sentAt" DESC);

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_sentAt_idx" ON "Message"("sentAt" DESC);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
