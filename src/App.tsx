
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Import pages (not layout)
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Layout and protected pages will be imported in a separate route file
import AppRoutes from "./routes/AppRoutes";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes outside Layout */}
            <Route path="/login" element={<Login />} />
            
            {/* App routes with Layout */}
            <Route path="/*" element={<AppRoutes />} />
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
