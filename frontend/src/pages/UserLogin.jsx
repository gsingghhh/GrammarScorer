// src/pages/Login.tsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo.jsx";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { UserContext } from "../contexts/UserContext.jsx";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {setUser} = useContext(UserContext)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/user/login`,
          {
            email,
            password,
          }
        );

        if (res.status === 200) {
          setUser({
            _id: res.data._id,
            fullName: res.data.fullName,
            email: res.data.email
          })
          const token = res.data.token;
          if (token) {
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          navigate("/home");
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || "Login failed");
        } else {
          setError("Server Error");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="absolute top-4 left-6">
        <Logo />
      </div>
      <div className="bg-gray-800 text-white p-10 rounded-3xl shadow-md w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide text-gray-300">
          User Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block mb-2 text-gray-400 font-semibold">
              Email
            </label>
            <div className="flex items-center border border-gray-700 rounded-md bg-gray-900 px-3 py-2 focus-within:ring-2 focus-within:ring-gray-500">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="password" className="block mb-2 text-gray-400 font-semibold">
              Password
            </label>
            <div className="flex items-center border border-gray-700 rounded-md bg-gray-900 px-3 py-2 focus-within:ring-2 focus-within:ring-gray-500">
              <FaLock className="text-gray-500 mr-2" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 ml-2 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full transition border py-3 font-semibold text-lg hover:bg-blue-600 border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-400">
          New user?{" "}
          <Link to="/register" className="underline text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
