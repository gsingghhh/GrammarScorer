import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // You can adjust this endpoint
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/register`, {
        fullName,
        email,
        password,
      });
      if (res.status == 201) {
        setFullName("");
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Something went wrong");
      } else {
        setError("Server error");
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
          User Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="fullName" className="block mb-2 text-gray-400 font-semibold">
              Full Name
            </label>
            <div className="flex items-center border border-gray-700 rounded-md bg-gray-900 px-3 py-2 focus-within:ring-2 focus-within:ring-gray-500">
              <FaUser className="text-gray-500 mr-2" />
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
          </div>
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
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-400">
          Already a user?{" "}
          <Link to="/" className="underline text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
