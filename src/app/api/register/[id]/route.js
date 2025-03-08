import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle PUT requests
export async function PUT(req, { params }) {
    const { id } = params;
    console.log("Incoming Request: PUT for ID:", id);

    try {
        // Extract all the fields from the request body
        const {
            party,
            item,
            qty,
            department,
            deptRef,
            remark,
            others,
            complete, // If you want to update the 'completed' status too
        } = await req.json();
        
        console.log("Received Data:", { party, item, qty, department, deptRef, remark, others, complete });

        // Check if the entry exists
        const existingEntry = await prisma.inRegister.findUnique({
            where: { id: Number(id) },
        });

        if (!existingEntry) {
            console.error("No record found with ID:", id);
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        // Update the record with all the fields, only updating the ones provided
        const updatedEntry = await prisma.inRegister.update({
            where: { id: Number(id) },
            data: {
                party: party || existingEntry.party, // If the field is not provided, retain the existing value
                item: item || existingEntry.item,
                qty: qty || existingEntry.qty,
                department: department || existingEntry.department,
                deptRef: deptRef || existingEntry.deptRef,
                remark: remark || existingEntry.remark,
                others: others || existingEntry.others,
                complete: complete !== undefined ? complete : existingEntry.complete, // Handle the completed status
            },
        });

        console.log("Updated Record:", updatedEntry);
        return NextResponse.json(updatedEntry, { status: 200 });
    } catch (error) {
        console.error("Database update error:", error);
        return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
}
