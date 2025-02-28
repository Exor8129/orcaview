import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle PUT requests
export async function PUT(req, { params }) {
    const { id } = params;
    console.log("Incoming Request: PUT for ID:", id);

    try {
        const { deptRef } = await req.json();
        console.log("Received deptRef:", deptRef);

        // Check if the entry exists
        const existingEntry = await prisma.inRegister.findUnique({
            where: { id: Number(id) },
        });

        if (!existingEntry) {
            console.error("No record found with ID:", id);
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        // Update the record
        const updatedEntry = await prisma.inRegister.update({
            where: { id: Number(id) },
            data: { deptRef },
        });

        console.log("Updated Record:", updatedEntry);
        return NextResponse.json(updatedEntry, { status: 200 });
    } catch (error) {
        console.error("Database update error:", error);
        return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
}
