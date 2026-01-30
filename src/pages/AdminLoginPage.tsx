"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { SITE_NAME } from '@/lib/constants';

const AdminLoginPage = () => {
  const [keyword, setKeyword] = useState('');
  const { unlockAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockAdmin(keyword)) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
        <Card className="w-full max-w-md rounded-xl shadow-lg border-orange-200 border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-orange-700">Admin Access</CardTitle>
            <CardDescription className="text-gray-600">Enter the secret keyword to unlock admin features for {SITE_NAME}.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  id="keyword"
                  type="password"
                  placeholder="Secret Keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 text-lg shadow-md transition-all duration-300 transform hover:scale-105">
                Unlock Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default AdminLoginPage;