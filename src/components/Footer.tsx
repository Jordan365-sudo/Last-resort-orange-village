"use client";

import React from 'react';
import { SITE_NAME } from '@/lib/constants';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 text-center mt-12 rounded-t-xl">
      <div className="container mx-auto">
        <p className="text-lg mb-2">&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        <p className="text-sm text-gray-400">
          Crafted with passion for insightful reporting.
        </p>
      </div>
    </footer>
  );
};

export default Footer;