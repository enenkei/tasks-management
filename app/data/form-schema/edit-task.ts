import { z } from "zod"

export const editTaskSchema = z.object({
    // title : z.string().min(1),
    stage : z.string().optional(),
    date : z.date().optional(),
    priority : z.string().optional(),
    assigneeId : z.string().optional()
})