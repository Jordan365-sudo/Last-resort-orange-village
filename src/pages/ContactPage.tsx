"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { getSettings, SiteSettings } from '@/lib/settings';
import { SITE_NAME } from '@/lib/constants';
import { Mail, Phone, Twitter, MessageCircle } from 'lucide-react';

const ContactPage = () => {
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
          setError("Contact information not found.");
        }
      } catch (err) {
        console.error("Failed to fetch contact information:", err);
        setError("Failed to load contact information. Please try again later.");
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
            Contact {SITE_NAME}
          </h1>
          {loading ? (
            <p className="text-center text-gray-600 py-8">Loading contact information...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : settings ? (
            <div className="space-y-6 text-lg text-gray-700">
              {settings.contactEmail && (
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="h-6 w-6 text-orange-500" />
                  <a href={`mailto:${settings.contactEmail}`} className="text-blue-600 hover:underline">
                    {settings.contactEmail}
                  </a>
                </div>
              )}
              {settings.contactPhone && (
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="h-6 w-6 text-orange-500" />
                  <a href={`tel:${settings.contactPhone}`} className="text-blue-600 hover:underline">
                    {settings.contactPhone}
                  </a>
                </div>
              )}
              {settings.contactX && (
                <div className="flex items-center justify-center space-x-3">
                  <Twitter className="h-6 w-6 text-orange-500" />
                  <a href={settings.contactX} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    X (Twitter)
                  </a>
                </div>
              )}
              {settings.contactWhatsapp && (
                <div className="flex items-center justify-center space-x-3">
                  <MessageCircle className="h-6 w-6 text-orange-500" />
                  <a href={settings.contactWhatsapp} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    WhatsApp
                  </a>
                </div>
              )}
              {!settings.contactEmail && !settings.contactPhone && !settings.contactX && !settings.contactWhatsapp && (
                <p className="text-center text-gray-600 py-8">No contact information available yet.</p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">No contact information available yet.</p>
          )}
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default ContactPage;