"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { getSettings, SiteSettings } from '@/lib/settings';
import { SITE_NAME } from '@/lib/constants';

const AboutPage = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const fetchedSettings = await getSettings();
        if (fetchedSettings) {
          setSettings(fetchedSettings);
        } else {
          setError("About content not found.");
        }
      } catch (err) {
        console.error("Failed to fetch about content:", err);
        setError("Failed to load about content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-8 lg:p-12">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-lg border-orange-100 border-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-800 mb-6 text-center">
            About {SITE_NAME}
          </h1>
          {loading ? (
            <p className="text-center text-gray-600 py-8">Loading about content...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : settings?.aboutContent ? (
            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: settings.aboutContent }}
            />
          ) : (
            <p className="text-center text-gray-600 py-8">No about content available yet.</p>
          )}
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default AboutPage;