-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRole" (
    "roleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("roleId", "userId"),
    CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserRole" ("roleId", "userId") SELECT "roleId", "userId" FROM "UserRole";
DROP TABLE "UserRole";
ALTER TABLE "new_UserRole" RENAME TO "UserRole";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
