"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { Article } from '@/lib/articles';
import RichTextEditor from './RichTextEditor'; // Import the new RichTextEditor

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100, { message: "Title must not exceed 100 characters." }),
  author: z.string().min(3, { message: "Author name must be at least 3 characters." }).max(50, { message: "Author name must not exceed 50 characters." }),
  coverImage: z.string().url({ message: "Cover image must be a valid URL." }).min(10, { message: "Cover image URL is required." }),
  summary: z.string().min(20, { message: "Summary must be at least 20 characters." }).max(300, { message: "Summary must not exceed 300 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }), // Content is now HTML string
  category: z.enum(ARTICLE_CATEGORIES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
  published: z.boolean(),
});

interface ArticleFormProps {
  initialData?: Article;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      author: initialData?.author || '',
      coverImage: initialData?.coverImage || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      category: (initialData?.category || ARTICLE_CATEGORIES[0]) as z.infer<typeof formSchema>['category'],
      published: initialData?.published || false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 bg-white rounded-xl shadow-lg border-orange-100 border-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Article Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter article title" {...field} className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Author Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter author's name" {...field} className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://image.z.ai/your-image.jpg" {...field} className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Short Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide a brief summary of the article (max 300 characters)" {...field} rows={4} className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Article Content</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write your article here..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-lg shadow-md">
                  {ARTICLE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-lg font-semibold text-gray-700">Publish Article</FormLabel>
                <FormDescription className="text-gray-600">
                  Toggle to make the article visible to the public.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 text-lg shadow-md transition-all duration-300 transform hover:scale-105">
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Article' : 'Create Article')}
        </Button>
      </form>
    </Form>
  );
};

export default ArticleForm;