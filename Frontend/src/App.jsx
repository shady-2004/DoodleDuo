import BrowserRouter from "react-router-dom/BrowserRouter";
import Routes from "react-router-dom/Routes";
import Route from "react-router-dom/Route";
import Sketch from "./components/Sketch";
import Sketches from "./components/Sketches";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home _="login" />} />
            <Route path="/login" element={<Home _="login" />} />
            <Route path="/signup" element={<Home _="signup" />} />
            <Route
              path="/sketches"
              element={
                <ProtectedRoute>
                  <Sketches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sketches/:id"
              element={
                <ProtectedRoute>
                  <Sketch />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
