'use server';

import { prisma } from "@/lib/db";
import { readRecord, readRecordByUserId } from "./crud";
import { Task, User } from "@prisma/client";
import moment from "moment";

type priority = 'medium' | 'low' | 'high';
type stage = 'todo' | 'inprogress' | 'completed' | 'review';
export type activity = 'started' | 'commented' | 'change status' | 'assigned' | 'reassigned' | 'review' | 'completed';

export async function getTasksByProject(userId: string, projectId: string) {
    // const user = await readRecordByUserId('User', userId);
    // if(!user) return null;
    // console.log(projectId);
    const project: any = await prisma.project.findFirst({
        include: {
            tasks: {
                include: {
                    assignee: true,
                    activities : {
                        include : {
                            owner : true
                        }
                    }
                }
            },
            users: true
        },
        where: {
            id: projectId
        }
    });
    return project;
}

export async function getTaskbyTaskId(taskId: string) {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: {
            assignee: true,
            activities: {
                include: {
                    owner: true
                }
            }
        }
    });
    return task;
}

export async function createNewTask(userId: string, values: any, projectId: string) {
    const user: User = await readRecordByUserId('User', userId);
    if (!user) return null;
    const todoStage : stage = 'todo';
    const taskData: any = {
        title: values.title,
        date: new Date(values.date),
        priority: values.priority,
        stage: todoStage,
        projectId: projectId,
        assigneeId: values.userId,
        description : values.description,
        createdById: user?.id,
        createdByName: user?.name
    }
    const task = await prisma.task.create({
        data: taskData
    });
    if (task) {
        // console.log('activity');
        const started: activity = 'started';
        await prisma.activity.create({
            data: {
                type: started,
                taskId: task?.id,
                comment: 'Task started on ' + moment(new Date()).format('DD/MM/YYYY')
            }
        });
        const assigned: activity = 'assigned';
        await prisma.activity.create({
            data: {
                type: assigned,
                taskId: task?.id,
                comment: 'Task assigned to ' + user.name,
                ownerId: values.userId
            }
        });
        // if (values?.stage === 'completed') {
        //     const completed: activity = 'close';
        //     await prisma.activity.create({
        //         data: {
        //             type: completed,
        //             taskId: task?.id,
        //             comment: 'Great job! Closing task',
        //             ownerId: values.userId
        //         }
        //     });
        // }
    }
    return task;
}

export async function updateTask(taskId: string, values: any) {
    if (!taskId) return null;
    const taskData: any = {
        date: values.date ?? new Date(values.date),
        priority: values.priority,
        stage: values.stage,
        assigneeId: values.assigneeId,
    };
    const task = await prisma.task.update({
        data: taskData,
        where: {
            id: taskId
        }
    });
    return task;
}

export async function getUnassignedUsersOnTask(taskId: string) {
    if (!taskId) return { error: 'Invalid input' };
    const task: Task = await readRecord('Task', taskId);
    if (!task) return { error: 'No task found' };
    const users = await prisma.user.findMany({});
    if (!users) return { error: 'No users found' };
    const unassignedUsers = users?.filter((user) => user.id !== task.assigneeId);
    // console.log(unassignedUsers);
    return unassignedUsers;
}

export async function createActivity(type: string, comment: string, userId: string, taskId : string) {
    if (!userId || !taskId) return;
    const user = await readRecordByUserId('User', userId);
    if (user) {
        const activity = await prisma.activity.create({
            data: {
                type,
                comment,
                ownerId: user.id,
                taskId
            }
        });
        return activity;
    }
    return null;
}

export async function getTasksByPriority ( projectId : string, userId : string) {
    if(!projectId) return null;
    const user = await readRecordByUserId('User', userId);
    if (user) {        
        const priorities = await prisma.task.groupBy({
            by : "priority",            
            _count : {projectId : true},
            where : {
                projectId
            }
        });        
        const data = priorities?.map((p) => {
            return {
                priority : p.priority,
                count : p._count.projectId
            }
        })
        // console.log(data);
        // console.log(stages);
        return data;
    }
    return null;
}

export async function getTasksByStage ( projectId : string, userId : string) {
    if(!projectId) return null;
    const user = await readRecordByUserId('User', userId);
    if (user) {        
        const stages = await prisma.task.groupBy({
            by : 'stage',
            _count : {
                projectId : true
            },
            where : {
                projectId
            }
        });
        const data = stages?.map((p) => {
            return {
                stage : p.stage,
                count : p._count.projectId,
                fill : `var(--color-${p.stage})`
            }
        })
        // console.log(data);
        // console.log(stages);
        return data;
    }
    return null;
}