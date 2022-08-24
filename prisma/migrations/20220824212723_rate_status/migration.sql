-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" DECIMAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Rate" ("created_at", "id", "updated_at", "value") SELECT "created_at", "id", "updated_at", "value" FROM "Rate";
DROP TABLE "Rate";
ALTER TABLE "new_Rate" RENAME TO "Rate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
