import { z } from 'zod';

export const postSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional().nullable(),
    published: z.boolean().optional(),
    authorId: z.number().int().optional().nullable(),
});