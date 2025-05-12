import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/HeroSection";

const Home = () => {
  const {
    user,
    login,
    loginWithEmail,
    signUp,
    loading,
    error: authError,
    isSignUp,
    toggleSignUp,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    }
  };

  const displayError = error || authError;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mb-10">
      <HeroSection />

      <div className="card max-w-lg mt-4 mx-3">
        {loading ? (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        ) : user ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-white">
              Welcome back, {user.displayName}! 👋
            </h1>
            <p className="mb-6 text-gray-300">
              Ready to track your mood today? Your mental well-being journey
              continues here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-stretch">
              <Link to="/checkin" className="w-full sm:w-auto">
                <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-full hover:bg-indigo-700 transition-all duration-300">
                  Daily Check-In
                </button>
              </Link>
              <Link to="/results" className="w-full sm:w-auto">
                <button className="w-full text-white border-2 border-indigo-600 py-3 px-6 rounded-full transition-all duration-300">
                  View Progress
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-white text-2xl font-bold mb-4">
              Start Your Wellness Journey
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Track your moods, discover patterns, and improve your mental
              well-being with MoodMate.
            </p>

            {displayError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-8 rounded-full hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div className="relative flex items-center justify-center text-sm mb-3">
              <div className="flex-grow border-t border-gray-300" />
              <span className="px-3 text-gray-500">Or</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="mt-5 w-full text-gray-200 border border-gray-300 py-3 px-8 rounded-full hover:bg-gray-700 transition-all duration-300 flex items-center justify-center mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => {
                  toggleSignUp();
                  setError(null);
                }}
                className="ml-1 text-indigo-600 hover:text-indigo-700"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
