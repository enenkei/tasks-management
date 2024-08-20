import { prisma } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {
    const {userId} = getAuth(req);
    if(!userId){
        return NextResponse.json({message : 'Unauthorized'}, {status : 401});
    }
    const taskId = req.nextUrl.searchParams.get("taskId");
    if(!taskId) return NextResponse.json({message : 'Invalid input'}, {status : 500});
    const task = await prisma.task.findUnique({
        where : {
            id : taskId
        },
        include : {
            assignee : true
        }
    });
    if(task){
        return NextResponse.json({task}, {status : 200});
    }
    
    return NextResponse.json({message : 'No data'}, { status : 200});
}