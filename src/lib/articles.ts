import { ARTICLE_CATEGORIES } from './constants';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client

export interface Article {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  summary: string;
  content: string;
  category: string; // Must be one of ARTICLE_CATEGORIES
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to convert Supabase row to Article interface
const mapSupabaseArticle = (data: any): Article => ({
  id: data.id,
  title: data.title,
  author: data.author,
  coverImage: data.cover_image,
  summary: data.summary,
  content: data.content,
  category: data.category,
  published: data.published,
  createdAt: new Date(data.created_at),
  updatedAt: new Date(data.updated_at),
});

export const getArticles = async (includeUnpublished = false): Promise<Article[]> => {
  let query = supabase.from('articles').select('*');

  if (!includeUnpublished) {
    query = query.eq('published', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
  return data.map(mapSupabaseArticle);
};

export const getArticleById = async (id: string, includeUnpublished = false): Promise<Article | undefined> => {
  let query = supabase.from('articles').select('*').eq('id', id).single();

  if (!includeUnpublished) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    return undefined;
  }
  return data ? mapSupabaseArticle(data) : undefined;
};

export const getArticlesByCategory = async (category: string, includeUnpublished = false): Promise<Article[]> => {
  const formattedCategory = category.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  let query = supabase.from('articles').select('*').eq('category', formattedCategory);

  if (!includeUnpublished) {
    query = query.eq('published', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching articles for category ${formattedCategory}:`, error);
    return [];
  }
  return data.map(mapSupabaseArticle);
};

export const createArticle = async (newArticle: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article | undefined> => {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: newArticle.title,
      author: newArticle.author,
      cover_image: newArticle.coverImage,
      summary: newArticle.summary,
      content: newArticle.content,
      category: newArticle.category,
      published: newArticle.published,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating article:", error);
    return undefined;
  }
  return data ? mapSupabaseArticle(data) : undefined;
};

export const updateArticle = async (id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article | undefined> => {
  const { data, error } = await supabase
    .from('articles')
    .update({
      title: updates.title,
      author: updates.author,
      cover_image: updates.coverImage,
      summary: updates.summary,
      content: updates.content,
      category: updates.category,
      published: updates.published,
      updated_at: new Date().toISOString(), // Manually update timestamp
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating article with ID ${id}:`, error);
    return undefined;
  }
  return data ? mapSupabaseArticle(data) : undefined;
};

export const deleteArticle = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting article with ID ${id}:`, error);
    return false;
  }
  return true;
};

export const publishArticle = async (id: string): Promise<Article | undefined> => {
  return updateArticle(id, { published: true });
};

export const unpublishArticle = async (id: string): Promise<Article | undefined> => {
  return updateArticle(id, { published: false });
};