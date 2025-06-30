import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.jsx";
import { useEffect } from "react";
import { PropagateLoader } from "react-spinners";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <PropagateLoader />; // or a spinner

  return isAuthenticated && children;
}

export default ProtectedRoute;
