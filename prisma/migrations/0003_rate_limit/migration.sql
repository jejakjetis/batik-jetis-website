CREATE TABLE "RateLimit" (
    "key" VARCHAR(100) NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key","windowStart")
);
CREATE INDEX "RateLimit_windowStart_idx" ON "RateLimit"("windowStart");
ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "RateLimit" FROM anon, authenticated;
