import { prisma } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const {userId} = getAuth(req);
    if(!userId) return NextResponse.json({message : 'Unauthorized'}, {status : 401});
    const projects = await prisma.project.findMany({});
    return NextResponse.json({projects}, {status : 200});
}