-- CreateTable
CREATE TABLE "inRegister" (
    "id" SERIAL NOT NULL,
    "regNo" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "deptRef" TEXT,
    "remark" TEXT,
    "others" TEXT,

    CONSTRAINT "inRegister_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inRegister_regNo_key" ON "inRegister"("regNo");
