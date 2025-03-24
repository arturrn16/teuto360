
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "@/components/ui/loader-spinner";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Always redirect to dashboard if authenticated, or login if not
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show a better loading component while redirecting
  return <PageLoader />;
};

export default Index;
