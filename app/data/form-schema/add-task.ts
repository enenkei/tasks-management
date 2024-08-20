import {z} from 'zod';

export const addTaskSchema = z.object({
    title : z.string().min(5).max(50),
    userId : z.string().min(1),
    // stage : z.string().min(1),
    date : z.date(),
    priority : z.string().min(1),
    description : z.string().min(10)
});