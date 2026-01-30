"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    author: string; // Added author
    coverImage: string; // Added coverImage
    summary: string; // Added summary
    category: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Card className="w-full max-w-sm mx-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-orange-200 border-2 flex flex-col">
      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      )}
      <CardHeader className="pb-2 flex-grow">
        <CardTitle className="text-2xl font-bold text-orange-700">{article.title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          By <span className="font-medium text-orange-500">{article.author}</span> in <span className="font-medium text-orange-500">{article.category}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-800 leading-relaxed">{article.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <Link to={`/article/${article.id}`}>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 shadow-md transition-all duration-300 transform hover:scale-105">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;