-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "balance" DECIMAL NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "digit" TEXT NOT NULL,
    "password" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_accounts" ("balance", "code", "created_at", "digit", "id", "password", "updated_at", "userId") SELECT "balance", "code", "created_at", "digit", "id", "password", "updated_at", "userId" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE UNIQUE INDEX "accounts_userId_key" ON "accounts"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
