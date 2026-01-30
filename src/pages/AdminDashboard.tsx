"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useAdmin } from '@/context/AdminContext';
import { Article, getArticles, deleteArticle, publishArticle, unpublishArticle } from '@/lib/articles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin, lockAdmin } = useAdmin();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedArticles = await getArticles(true); // Get all articles, including unpublished
      setArticles(fetchedArticles);
    } catch (err) {
      console.error("Failed to fetch articles for admin dashboard:", err);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Admin access required.");
      navigate('/admin-login');
      return;
    }
    fetchArticles();
  }, [isAdmin, navigate, fetchArticles]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const success = await deleteArticle(id);
        if (success) {
          toast.success("Article deleted successfully!");
          fetchArticles();
        } else {
          toast.error("Failed to delete article.");
        }
      } catch (err) {
        console.error("Error deleting article:", err);
        toast.error("An unexpected error occurred while deleting the article.");
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      let success: Article | undefined;
      if (currentStatus) {
        success = await unpublishArticle(id);
        if (success) toast.info("Article unpublished.");
      } else {
        success = await publishArticle(id);
        if (success) toast.success("Article published!");
      }
      if (success) {
        fetchArticles();
      } else {
        toast.error("Failed to change article status.");
      }
    } catch (err) {
      console.error("Error toggling publish status:", err);
      toast.error("An unexpected error occurred while changing article status.");
    }
  };

  const handleLogout = () => {
    lockAdmin();
    navigate('/');
  };

  if (!isAdmin) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-orange-700">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/admin/new-article')} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-3 shadow-md transition-all duration-300 transform hover:scale-105">
                Create New Article
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 rounded-full px-6 py-3 shadow-md transition-all duration-300 transform hover:scale-105">
                <LogOut className="mr-2 h-5 w-5" /> Logout
              </Button>
            </div>
          </div>

          <Card className="rounded-xl shadow-lg border-orange-100 border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">All Articles</CardTitle>
              <CardDescription className="text-gray-600">Manage your published and unpublished articles.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-gray-600 py-8">Loading articles...</p>
              ) : error ? (
                <p className="text-center text-red-500 py-8">{error}</p>
              ) : articles.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No articles found. Start by creating a new one!</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50 text-orange-800">
                        <TableHead className="w-[200px] font-bold">Title</TableHead>
                        <TableHead className="font-bold">Category</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Last Updated</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-800">{article.title}</TableCell>
                          <TableCell className="text-gray-700">{article.category}</TableCell>
                          <TableCell>
                            <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${article.published ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {article.published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(article.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/edit/${article.id}`)}
                              className="text-blue-600 hover:bg-blue-50/50 rounded-full"
                              title="Edit Article"
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTogglePublish(article.id, article.published)}
                              className={`rounded-full ${article.published ? 'text-yellow-600 hover:bg-yellow-50/50' : 'text-green-600 hover:bg-green-50/50'}`}
                              title={article.published ? "Unpublish Article" : "Publish Article"}
                            >
                              {article.published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(article.id)}
                              className="text-red-600 hover:bg-red-50/50 rounded-full"
                              title="Delete Article"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default AdminDashboard;