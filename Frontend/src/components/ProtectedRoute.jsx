import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.jsx";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);
  return isAuthenticated && children;
}

export default ProtectedRoute;
