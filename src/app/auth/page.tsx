"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // small delay to simulate network call
    await new Promise((r) => setTimeout(r, 600));

    if (isLogin) {
      const result = login(email, password);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message);
      }
    } else {
      // For signup, just show a message (mock)
      setError("Registration coming soon! Use test accounts below.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3" style={{ background: "#6C47FF" }}>
              <span className="text-white text-2xl font-bold">E</span>
            </div>
            <span className="text-white text-3xl font-bold">EduCore</span>
          </div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Learn Without<br />
            <span style={{ color: "#6C47FF" }}>Limits.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Join over 100,000 students building real skills with project-based courses.
          </p>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              { val: "500+", label: "Courses" },
              { val: "100K+", label: "Students" },
              { val: "4.8★", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-white text-xl font-bold">{stat.val}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="flex items-center mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-2" style={{ background: "#6C47FF" }}>
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold" style={{ color: "#1A1A2E" }}>EduCore</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: "#1A1A2E" }}>
            {isLogin ? "Welcome back!" : "Create an account"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {isLogin ? "Log in to continue learning" : "Start your learning journey"}
          </p>

          {/* Tab Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isLogin ? "bg-white shadow text-purple-700" : "text-gray-500"}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isLogin ? "bg-white shadow text-purple-700" : "text-gray-500"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Mehta"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-70"
              style={{ background: "#6C47FF" }}
            >
              {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
            </button>
          </form>

          {/* Test credentials hint */}
          <div className="mt-6 p-4 bg-purple-50 rounded-xl text-xs text-purple-700 border border-purple-100">
            <p className="font-semibold mb-1">🧪 Test Credentials</p>
            <p>Student: arjun@example.com / student123</p>
            <p>Instructor: priya@example.com / instructor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
