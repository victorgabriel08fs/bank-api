-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "adress" TEXT,
    "token" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "adress" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT,
    "value" DECIMAL NOT NULL,
    "billingType" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "receivedDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpfCnpj_key" ON "users"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");
