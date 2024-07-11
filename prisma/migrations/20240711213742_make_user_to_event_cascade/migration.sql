-- DropForeignKey
ALTER TABLE "RegisteredEvent" DROP CONSTRAINT "RegisteredEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "RegisteredEvent" DROP CONSTRAINT "RegisteredEvent_userEmail_fkey";

-- AddForeignKey
ALTER TABLE "RegisteredEvent" ADD CONSTRAINT "RegisteredEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisteredEvent" ADD CONSTRAINT "RegisteredEvent_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
