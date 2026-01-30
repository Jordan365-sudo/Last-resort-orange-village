"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';
import ArticleForm from '@/components/ArticleForm';
import { Article, getArticleById, createArticle, updateArticle } from '@/lib/articles';
import { toast } from 'sonner';
import { useAdmin } from '@/context/AdminContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ArticleEditorPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [initialArticle, setInitialArticle] = useState<Article | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Admin access required.");
      navigate('/admin-login');
      return;
    }

    const fetchInitialArticle = async () => {
      if (articleId) {
        try {
          setLoadingInitialData(true);
          const article = await getArticleById(articleId, true); // Get even unpublished for admin
          if (article) {
            setInitialArticle(article);
          } else {
            toast.error("Article not found.");
            navigate('/admin');
          }
        } catch (err) {
          console.error(`Failed to fetch article with ID ${articleId}:`, err);
          toast.error("Failed to load article for editing.");
          navigate('/admin');
        } finally {
          setLoadingInitialData(false);
        }
      } else {
        setLoadingInitialData(false); // No articleId means creating a new one, no initial data to load
      }
    };
    fetchInitialArticle();
  }, [articleId, isAdmin, navigate]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let result: Article | undefined;
      if (articleId) {
        result = await updateArticle(articleId, data);
        if (result) toast.success("Article updated successfully!");
      } else {
        result = await createArticle(data);
        if (result) toast.success("Article created successfully!");
      }
      if (result) {
        navigate('/admin');
      } else {
        toast.error("Failed to save article.");
      }
    } catch (error) {
      toast.error("Failed to save article.");
      console.error("Error saving article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return null; // Redirect handled by useEffect
  }

  if (articleId && loadingInitialData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
          <p className="text-xl text-gray-700">Loading article data...</p>
        </main>
        <Footer />
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-6 text-orange-600 hover:text-orange-800 hover:bg-orange-50/50 rounded-full"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Admin Dashboard
          </Button>
          <h1 className="text-4xl font-extrabold text-orange-700 mb-8 text-center">
            {articleId ? 'Edit Article' : 'Create New Article'}
          </h1>
          <ArticleForm initialData={initialArticle} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default ArticleEditorPage;