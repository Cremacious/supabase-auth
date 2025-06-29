'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { postSchema } from '@/lib/validations/posts';
import { createPost } from '@/lib/actions/post.action';
const PostForm = () => {
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
  });

  async function onSubmit(values: z.infer<typeof postSchema>) {
    try {
      console.log('Form submitted with values:', values);
      const response = await createPost(values);
      if (response.success) {
        toast.success('Post created successfully!');
        form.reset();
      } else {
        toast.error(`Failed to create post: ${response.message}`);
      }
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
              <FormDescription>Enter the title of your post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input
                  placeholder="Post content"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Enter the content of your post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published</FormLabel>
              <FormControl>
                <Input
                  placeholder="true or false"
                  {...field}
                  value={field.value !== undefined ? String(field.value) : ''}
                  onChange={(e) => field.onChange(e.target.value === 'true')}
                />
              </FormControl>
              <FormDescription>
                Set to true to publish the post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PostForm;
