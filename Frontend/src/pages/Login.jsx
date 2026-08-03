import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import API from "../api/axios";
import LoginImage from "../assets/login.jpg";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const res = await API.post("/auth/login", {
        role,
        password,
      });

      // STORE TOKEN
      localStorage.setItem("token", res.data.token);

      // STORE ROLE
      localStorage.setItem("role", res.data.user.role);

      // REDIRECT
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#2f2f2f] p-5">
      {/* MAIN CARD */}
      <div className="w-full h-full bg-white overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="flex items-center justify-center px-10">
          <div className="w-full max-w-sm">
            {/* HEADING */}
            <h1 className="text-5xl font-bold text-black mb-3">
              Welcome Back!
            </h1>

            <p className="text-gray-500 text-sm mb-12">
              Welcome back please enter your details
            </p>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                >
                  <option value="admin">Admin</option>

                  <option value="staff1">Staff 1</option>

                  <option value="staff2">Staff 2</option>

                  <option value="staff3">Staff 3</option>
                </select>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
                  >
                    {showPassword ? (
                      <EyeOff size={20} strokeWidth={2} />
                    ) : (
                      <Eye size={20} strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 hover:opacity-90 transition"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Developed & Maintained By
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  Calyonix Infotech
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex h-screen overflow-hidden">
          <img
            src={LoginImage}
            alt="login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
