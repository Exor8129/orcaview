import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const parties = await prisma.party.findMany(); // Fetch all parties
    return NextResponse.json(parties);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch parties" }, { status: 500 });
  }
}
