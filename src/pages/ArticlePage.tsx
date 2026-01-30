"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Article, getArticleById } from '@/lib/articles';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons'; // Import the new ShareButtons component

const ArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleUrl, setArticleUrl] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        try {
          setLoading(true);
          const foundArticle = await getArticleById(articleId);
          if (foundArticle) {
            setArticle(foundArticle);
            setArticleUrl(window.location.href); // Set the current URL for sharing
          } else {
            navigate('/404'); // Redirect to 404 if article not found
          }
        } catch (err) {
          console.error(`Failed to fetch article with ID ${articleId}:`, err);
          setError("Failed to load article. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchArticle();
  }, [articleId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
          <p className="text-xl text-gray-700">Loading article...</p>
        </main>
        <Footer />
        <MadeWithDyad />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
          <p className="text-xl text-red-500">{error}</p>
        </main>
        <Footer />
        <MadeWithDyad />
      </div>
    );
  }

  if (!article) {
    return null; // Should be handled by navigate('/404')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-8 lg:p-12">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-lg border-orange-100 border-2">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-orange-600 hover:text-orange-800 hover:bg-orange-50/50 rounded-full"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
          {article.coverImage && (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-800 mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            By <span className="font-semibold text-orange-600">{article.author}</span>
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Category: <span className="font-semibold text-orange-600">{article.category}</span>
          </p>
          <p className="text-xl italic text-gray-700 mb-8 border-l-4 border-orange-400 pl-4">
            "{article.summary}"
          </p>
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          <p className="text-sm text-gray-500 mt-8 text-right">
            Published: {new Date(article.createdAt).toLocaleDateString()}
          </p>
          {/* Share Buttons */}
          <ShareButtons title={article.title} url={articleUrl} />
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default ArticlePage;