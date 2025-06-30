import Login from "../components/Login";
import Signup from "../components/Signup";
import { useState, useEffect } from "react";
import useAuth from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

function Home({ mode }) {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const animations = [
    "✏️ Draw together in real-time",
    "🤝 Collaborate seamlessly",
    "🌟 Create amazing art",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [animations.length]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/sketches");
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Section - Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {mode === "login" ? <Login /> : <Signup />}
        </div>
      </div>

      {/* Right Section - Branding and Animation - Hidden on small screens */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white p-8 overflow-y-auto relative">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              DoodleDuo
            </h1>
            <p className="text-xl text-blue-100">
              Where creativity meets collaboration
            </p>
          </div>

          <div className="flex justify-center space-x-4 my-8">
            <div className="animate-bounce delay-100">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                ✏️
              </div>
            </div>
            <div className="animate-bounce delay-300">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                🎨
              </div>
            </div>
            <div className="animate-bounce delay-500">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                ✨
              </div>
            </div>
          </div>

          <div className="h-16 flex items-center justify-center">
            <p className="text-lg text-blue-100 transition-all duration-500 ease-in-out">
              {animations[currentAnimation]}
            </p>
          </div>

          <div className="space-y-4 text-left max-w-sm">
            <h3 className="text-xl font-semibold text-center mb-6">
              Perfect for Collaborative Drawing
            </h3>
            <div className="space-y-3 text-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>Real-time collaboration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>Multiple users drawing together</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>Save your artwork</span>
              </div>
            </div>
          </div>

          {/* Floating Elements Animation */}
          <div className="absolute top-20 right-20 animate-pulse">
            <div className="w-4 h-4 bg-white/30 rounded-full"></div>
          </div>
          <div className="absolute bottom-32 right-16 animate-pulse delay-1000">
            <div className="w-3 h-3 bg-white/40 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 right-32 animate-pulse delay-2000">
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
