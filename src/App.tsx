import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import SetupDID from "./pages/admin/SetupDID";
import SmartTriadCodexManager from "./pages/admin/SmartTriadCodexManager";
import HomeHeroManager from "./pages/admin/content/HomeHeroManager";
import ContentEditor from "./pages/admin/content/ContentEditor";
import LatestNewsManager from "./pages/admin/content/LatestNewsManager";
import SecondHeroManager from "./pages/admin/content/SecondHeroManager";
import PennyDropsManager from "./pages/admin/content/PennyDropsManager";
import ScrollsManager from "./pages/admin/content/ScrollsManager";
import KnowdZManager from "./pages/admin/content/KnowdZManager";
import StayBullManager from "./pages/admin/content/StayBullManager";
import ContentImporter from "./pages/admin/content/ContentImporter";
import ExportContent from "./pages/admin/content/ExportContent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/console" element={<Layout><Index /></Layout>} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/setup-did" element={<SetupDID />} />
          <Route path="/admin/smarttriad/codex" element={<SmartTriadCodexManager />} />
          <Route path="/admin/content/import" element={<ContentImporter />} />
          <Route path="/admin/content/export" element={<ExportContent />} />
          <Route path="/admin/content/home-hero" element={<HomeHeroManager />} />
          <Route path="/admin/content/latest-news" element={<LatestNewsManager />} />
          <Route path="/admin/content/second-hero" element={<SecondHeroManager />} />
          <Route path="/admin/content/pennydrops" element={<PennyDropsManager />} />
          <Route path="/admin/content/scrolls" element={<ScrollsManager />} />
          <Route path="/admin/content/21knowdz" element={<KnowdZManager />} />
          <Route path="/admin/content/staybull" element={<StayBullManager />} />
          <Route path="/admin/content/edit/:id" element={<ContentEditor />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
