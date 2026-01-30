import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ArticleEditorPage from "./pages/ArticleEditorPage";
import AboutPage from "./pages/AboutPage"; // New import
import ContactPage from "./pages/ContactPage"; // New import
import AdminSettingsPage from "./pages/AdminSettingsPage"; // New import
import { AdminProvider } from "./context/AdminContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true }}>
        <AdminProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Public Routes */}
            <Route path="/about" element={<AboutPage />} /> {/* New route */}
            <Route path="/contact" element={<ContactPage />} /> {/* New route */}
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/article/:articleId" element={<ArticlePage />} />
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/new-article" element={<ArticleEditorPage />} />
            <Route path="/admin/edit/:articleId" element={<ArticleEditorPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} /> {/* New route */}
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;