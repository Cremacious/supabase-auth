'use server';
import { z } from 'zod';
import { postSchema } from '../validations/posts';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function createPost(data: z.infer<typeof postSchema>) {
  try {
    const post = postSchema.parse(data);
    await prisma.post.create({ data: post });
    return { success: true, message: 'Post created successfully' };
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({});
    return { success: true, data: posts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}
