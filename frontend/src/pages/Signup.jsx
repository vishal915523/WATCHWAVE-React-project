import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import Footer from "../Footer/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, currentUser, error } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      await register(email, password);
      toast.success("Signup successful! Welcome aboard!");
    } catch (error) {
      // Error is already handled in the context
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundImage />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-between">
        <Header login />
        <div className="flex flex-col items-center justify-center h-full px-4 md:px-0">
          <div className="bg-black bg-opacity-70 w-full max-w-xl rounded-lg p-8">
            <div className="text-white text-2xl font-bold mb-6">Sign Up</div>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="px-4 py-2 rounded-lg text-stone-950"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="px-4 py-2 rounded-lg w-full text-stone-950"
                  required
                />
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-950"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button
                onClick={handleSignUp}
                className="px-4 py-2 bg-red-600 rounded-lg cursor-pointer text-white font-bold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
