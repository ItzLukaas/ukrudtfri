-- CreateIndex
CREATE INDEX IF NOT EXISTS "OpenSlot_startsAt_idx" ON "OpenSlot"("startsAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "OpenSlot_endsAt_idx" ON "OpenSlot"("endsAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlockedWindow_startsAt_idx" ON "BlockedWindow"("startsAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlockedWindow_endsAt_idx" ON "BlockedWindow"("endsAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Booking_customerEmail_idx" ON "Booking"("customerEmail");
