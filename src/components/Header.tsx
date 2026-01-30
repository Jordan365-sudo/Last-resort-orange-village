"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ARTICLE_CATEGORIES, SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCog, Info, Mail, Settings } from 'lucide-react'; // Import new icons
import { useAdmin } from '@/context/AdminContext'; // Import useAdmin

const Header = () => {
  const { isAdmin } = useAdmin(); // Use the admin context

  return (
    <header className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 shadow-lg rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-tight hover:text-gray-100 transition-colors duration-300">
          {SITE_NAME}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {ARTICLE_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase().replace(/\s/g, '-')}`}
              className="text-lg font-medium hover:text-gray-200 transition-colors duration-300"
            >
              {category}
            </Link>
          ))}
          <Link
            to="/about"
            className="text-lg font-medium hover:text-gray-200 transition-colors duration-300 flex items-center"
          >
            <Info className="h-5 w-5 mr-1" /> About
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium hover:text-gray-200 transition-colors duration-300 flex items-center"
          >
            <Mail className="h-5 w-5 mr-1" /> Contact
          </Link>
          {isAdmin && ( // Show Admin Dashboard and Settings links if admin is logged in
            <>
              <Link
                to="/admin"
                className="text-lg font-medium hover:text-gray-200 transition-colors duration-300 flex items-center"
              >
                <UserCog className="h-5 w-5 mr-1" /> Admin
              </Link>
              <Link
                to="/admin/settings"
                className="text-lg font-medium hover:text-gray-200 transition-colors duration-300 flex items-center"
              >
                <Settings className="h-5 w-5 mr-1" /> Settings
              </Link>
            </>
          )}
          {!isAdmin && ( // Show Admin Login link if not logged in
            <Link
              to="/admin-login"
              className="text-lg font-medium hover:text-gray-200 transition-colors duration-300 flex items-center"
            >
              <UserCog className="h-5 w-5 mr-1" /> Admin Login
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          {isAdmin && ( // Show Admin Dashboard and Settings links if admin is logged in
            <>
              <Link
                to="/admin"
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <UserCog className="h-6 w-6" />
                <span className="sr-only">Admin Dashboard</span>
              </Link>
              <Link
                to="/admin/settings"
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <Settings className="h-6 w-6" />
                <span className="sr-only">Admin Settings</span>
              </Link>
            </>
          )}
          {!isAdmin && ( // Show Admin Login link if not logged in
            <Link
              to="/admin-login"
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <UserCog className="h-6 w-6" />
              <span className="sr-only">Admin Login</span>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white p-6 w-64">
              <Link to="/" className="text-2xl font-bold text-orange-600 mb-6 block">
                {SITE_NAME}
              </Link>
              <nav className="flex flex-col space-y-4">
                {ARTICLE_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase().replace(/\s/g, '-')}`}
                    className="text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300"
                  >
                    {category}
                  </Link>
                ))}
                <Link
                  to="/about"
                  className="text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 flex items-center"
                >
                  <Info className="h-5 w-5 mr-2" /> About
                </Link>
                <Link
                  to="/contact"
                  className="text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 flex items-center"
                >
                  <Mail className="h-5 w-5 mr-2" /> Contact
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 flex items-center"
                    >
                      <UserCog className="h-5 w-5 mr-2" /> Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 flex items-center"
                    >
                      <Settings className="h-5 w-5 mr-2" /> Admin Settings
                    </Link>
                  </>
                )}
                {!isAdmin && (
                  <Link
                    to="/admin-login"
                    className="text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 flex items-center"
                  >
                    <UserCog className="h-5 w-5 mr-2" /> Admin Login
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;