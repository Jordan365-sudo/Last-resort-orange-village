"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface AdminContextType {
  isAdmin: boolean;
  unlockAdmin: (keyword: string) => void;
  lockAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    // Initialize from localStorage to persist admin state across refreshes
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAdmin', String(isAdmin));
    }
  }, [isAdmin]);

  const unlockAdmin = (keyword: string) => {
    if (keyword === "Shipakapaka") {
      setIsAdmin(true);
      toast.success("Admin mode unlocked!");
      return true;
    } else {
      toast.error("Incorrect keyword.");
      return false;
    }
  };

  const lockAdmin = () => {
    setIsAdmin(false);
    toast.info("Admin mode locked.");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, unlockAdmin, lockAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};