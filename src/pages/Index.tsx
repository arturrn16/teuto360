
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "@/components/ui/loader-spinner";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect if auth status is known (not loading) and not already redirecting
    if (!isLoading && !redirecting) {
      setRedirecting(true);
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirecting]);

  // Show a better loading component while checking auth state
  return <PageLoader />;
};

export default Index;
