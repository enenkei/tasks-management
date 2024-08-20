import { prisma } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const {userId} = getAuth(req);
    if(!userId) return NextResponse.json({message : 'Unauthorized'}, {status : 401});

    const user = await prisma.user.findUnique({
        where : {
            userId : userId
        }
    });
    if(!user){
        return NextResponse.json({message : 'User does not exist'}, {status : 401});
    }
    const users = await prisma.user.findMany({});
    return NextResponse.json({users}, {status : 200});
}