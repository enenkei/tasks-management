import { z } from "zod";

export const addUserSchema = z.object({
    name : z.string().min(5).max(30),
    title : z.string().min(5).max(20),
    email : z.string().email("Invalid email").min(1),
    role : z.string().min(5)
});