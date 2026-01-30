"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useAdmin } from '@/context/AdminContext';
import { getSettings, updateSettings, SiteSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [aboutContent, setAboutContent] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactX, setContactX] = useState<string>('');
  const [contactWhatsapp, setContactWhatsapp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Admin access required.");
      navigate('/admin-login');
      return;
    }

    const fetchInitialSettings = async () => {
      try {
        setLoadingInitialData(true);
        const settings = await getSettings();
        if (settings) {
          setAboutContent(settings.aboutContent || '');
          setContactEmail(settings.contactEmail || '');
          setContactPhone(settings.contactPhone || '');
          setContactX(settings.contactX || '');
          setContactWhatsapp(settings.contactWhatsapp || '');
        }
      } catch (err) {
        console.error("Failed to fetch initial settings:", err);
        toast.error("Failed to load settings for editing.");
      } finally {
        setLoadingInitialData(false);
      }
    };
    fetchInitialSettings();
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await updateSettings({
        aboutContent,
        contactEmail,
        contactPhone,
        contactX,
        contactWhatsapp,
      });
      if (updated) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings.");
      }
    } catch (error) {
      toast.error("Failed to update settings.");
      console.error("Error saving settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return null; // Redirect handled by useEffect
  }

  if (loadingInitialData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
          <p className="text-xl text-gray-700">Loading settings...</p>
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
            Site Settings
          </h1>
          <Card className="rounded-xl shadow-lg border-orange-100 border-2 p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">Edit About & Contact Info</CardTitle>
              <CardDescription className="text-gray-600">Update the content for your About Us page and your public contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <Label htmlFor="aboutContent" className="text-lg font-semibold text-gray-700 mb-2 block">About Us Content</Label>
                  <RichTextEditor
                    value={aboutContent}
                    onChange={setAboutContent}
                    placeholder="Write your About Us content here..."
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-lg font-semibold text-gray-700 mb-2 block">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="e.g., info@yourdomain.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-lg font-semibold text-gray-700 mb-2 block">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="e.g., +1 (555) 123-4567"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <Label htmlFor="contactX" className="text-lg font-semibold text-gray-700 mb-2 block">X (Twitter) Profile URL</Label>
                  <Input
                    id="contactX"
                    type="url"
                    placeholder="e.g., https://x.com/yourprofile"
                    value={contactX}
                    onChange={(e) => setContactX(e.target.value)}
                    className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <Label htmlFor="contactWhatsapp" className="text-lg font-semibold text-gray-700 mb-2 block">WhatsApp Link</Label>
                  <Input
                    id="contactWhatsapp"
                    type="url"
                    placeholder="e.g., https://wa.me/1234567890"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    className="rounded-lg p-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 text-lg shadow-md transition-all duration-300 transform hover:scale-105">
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default AdminSettingsPage;