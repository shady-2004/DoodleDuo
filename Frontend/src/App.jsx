import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Session from "./pages/Session";
import Sketches from "./pages/Sketches";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import { ToastContainer } from "react-toastify";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Nav />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home mode="login" />} />
            <Route path="/login" element={<Home mode="login" />} />
            <Route path="/signup" element={<Home mode="signup" />} />
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
                  <Session />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sketches/session/:code"
              element={
                <ProtectedRoute>
                  <Session />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
