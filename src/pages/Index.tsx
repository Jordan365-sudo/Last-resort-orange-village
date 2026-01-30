"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { SITE_NAME } from "@/lib/constants";
import { getArticles, Article } from "@/lib/articles";
import React, { useEffect, useState } from "react";

const Index = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        const publishedArticles = await getArticles(false); // Get only published articles
        setFeaturedArticles(publishedArticles.slice(0, 3)); // Display a few recent articles on the homepage
      } catch (err) {
        console.error("Failed to fetch featured articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-extrabold text-orange-600 mb-6 leading-tight">
          Welcome to <span className="block sm:inline">{SITE_NAME}</span>
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mb-8">
          Your source for original articles on a diverse range of topics, crafted for general readers seeking insight and understanding.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <a
            href="/category/lifestyle"
            className="px-6 py-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            Explore Lifestyle
          </a>
          <a
            href="/category/science"
            className="px-6 py-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
          >
            Discover Science
          </a>
        </div>

        <section className="w-full max-w-5xl">
          <h2 className="text-4xl font-bold text-orange-700 mb-8">Featured Articles</h2>
          {loading ? (
            <p className="text-gray-600 col-span-full">Loading featured articles...</p>
          ) : error ? (
            <p className="text-red-500 col-span-full">{error}</p>
          ) : featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 col-span-full">No featured articles available yet.</p>
          )}
        </section>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Index;