"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';
import ArticleCard from '@/components/ArticleCard';
import { Article, getArticlesByCategory } from '@/lib/articles';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formattedCategoryName = categoryName ? categoryName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Unknown Category';

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      if (categoryName) {
        try {
          setLoading(true);
          const fetchedArticles = await getArticlesByCategory(categoryName, false); // Get only published articles for the category
          setArticles(fetchedArticles);
        } catch (err) {
          console.error(`Failed to fetch articles for category ${categoryName}:`, err);
          setError("Failed to load articles for this category. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCategoryArticles();
  }, [categoryName]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-6">
          Articles in <span className="capitalize">{formattedCategoryName}</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Here you will find all published articles related to the {formattedCategoryName} category.
        </p>
        {loading ? (
          <p className="text-gray-600 col-span-full">Loading articles...</p>
        ) : error ? (
          <p className="text-red-500 col-span-full">{error}</p>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 col-span-full">No published articles found in this category yet.</p>
        )}
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default CategoryPage;