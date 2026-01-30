"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(linkedInUrl, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-gray-200">
      <span className="text-lg font-semibold text-gray-700 flex items-center">
        <Share2 className="h-5 w-5 mr-2 text-orange-500" /> Share This Article:
      </span>
      <Button onClick={shareOnTwitter} className="bg-[#1DA1F2] hover:bg-[#1A91DA] text-white rounded-full px-4 py-2 flex items-center shadow-md transition-all duration-300 transform hover:scale-105">
        <Twitter className="h-4 w-4 mr-2" /> Twitter
      </Button>
      <Button onClick={shareOnFacebook} className="bg-[#1877F2] hover:bg-[#166FEF] text-white rounded-full px-4 py-2 flex items-center shadow-md transition-all duration-300 transform hover:scale-105">
        <Facebook className="h-4 w-4 mr-2" /> Facebook
      </Button>
      <Button onClick={shareOnLinkedIn} className="bg-[#0A66C2] hover:bg-[#085BA3] text-white rounded-full px-4 py-2 flex items-center shadow-md transition-all duration-300 transform hover:scale-105">
        <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
      </Button>
      <Button onClick={copyLink} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 rounded-full px-4 py-2 flex items-center shadow-md transition-all duration-300 transform hover:scale-105">
        <LinkIcon className="h-4 w-4 mr-2" /> Copy Link
      </Button>
    </div>
  );
};

export default ShareButtons;