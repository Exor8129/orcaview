import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const records = await prisma.inRegister.findMany();

    // Format Date in YYYY-MM-DD without time
    const formattedRecords = records.map(record => ({
      ...record,
      date: dayjs(record.date).format("YYYY-MM-DD"), // ✅ Correct and clean format
    }));

    return Response.json(formattedRecords);
  } catch (error) {
    return Response.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const data = await req.json();

    // Get the last used regNo from the database
    const lastEntry = await prisma.inRegister.findFirst({
      orderBy: { regNo: "desc" },
    });

    const newRegNo = lastEntry ? lastEntry.regNo + 1 : 1; // If no entries exist, start at 1

    const savedEntry = await prisma.inRegister.create({
      data: {
        regNo: newRegNo, // Use the updated regNo
        date: new Date(data.date), // ✅ Ensures correct format
        courier: data.courier,
        party: data.party,
        item: data.item,
        qty: Number(data.qty),
        department: data.department,
        deptRef: data.deptRef,
        remark: data.remark,
        others: data.others,
        complete:"Open",
      },
    });

    return Response.json(savedEntry);
  } catch (error) {
    console.error("Error saving data:", error);
    return Response.json({ error: "Failed to save data", details: error.message }, { status: 500 });
  }
}
