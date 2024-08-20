'use server';

import { prisma } from "@/lib/db";

export type ModelName = 'User' | 'Task' | 'Team' | 'Activity' | 'Asset' | 'SubTask' | 'Project';

export async function readRecord(model: ModelName, id: string) {
    const data = await (prisma as any)[model].findUnique({
        where: {
            id
        }
    });
    // console.log('user:', user);
    return data;
}

export async function readRecordByUserId(model: ModelName, id: string) {
    const data = await (prisma as any)[model].findFirst({
        where: {
            userId: id
        }
    });
    // console.log('user:', user);
    return data;
}

export async function readRecords(model: ModelName, filter: {}, take: number = 25) {
    return await (prisma as any)[model].findMany({
        where: filter,
        take
    });
}

export async function readRecordsNoFilter(model: ModelName, take: number = 25) {
    return await (prisma as any)[model].findMany({
        take
    });
}

export async function createRecord(model: ModelName, data: any) {
    // const table = await readRecordByUserId(model, data.userId);
    // if(table) return;
    return await (prisma as any)[model].create({
        data
    });
}

export async function updateRecordByUserId(model: ModelName, userId: string, data: any) {
    const table = await readRecordByUserId(model, userId);
    if (table) {
        return await (prisma as any)[model].update({
            where: {
                id: table.id
            },
            data
        });
    }
    return null;
}

export async function updateRecord(model: ModelName, id: string, data: any) {
    // console.log(data);
    return await (prisma as any)[model].update({
        where: { id },
        data,
    });
}

export async function deleteRecord(model: ModelName, id: string) {
    return await (prisma as any)[model].delete({ where: { id } });
}