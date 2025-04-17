import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import Footer from '../Footer/Footer';
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import styled from "styled-components";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, currentUser, error, clearError } = useAuth();
  const toast = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError(); // Clear error after showing it to prevent infinite loops
    }
  }, [error, toast, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    const { email, password } = formData;
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(email, password);
      toast.success("Sign in successful! Welcome aboard!");
      // Navigate is handled by the useEffect watching currentUser
    } catch (error) {
      // Error is already handled in the context and the useEffect above
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <BackgroundImage />
      <div className="content">
        <Header />
        <div className="form-container">
          <div className="form-wrapper">
            <h1>Sign In</h1>
            <form onSubmit={handleLogin}>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />
              </div>
              <div className="input-container">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  value={formData.password}
                  required
                />
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <div className="form-footer">
              <p>
                New to WatchWave? <Link to="/signup">Sign up now</Link>
              </p>
              <small>
                This page is protected by Google reCAPTCHA to ensure you're not a bot.
              </small>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;

  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .form-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 0 1rem;
  }

  .form-wrapper {
    background: rgba(0, 0, 0, 0.75);
    max-width: 450px;
    width: 100%;
    padding: 60px 68px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
      padding: 40px 30px;
      max-width: 90%;
    }

    h1 {
      color: white;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 28px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .input-container {
      position: relative;
      width: 100%;
    }

    input {
      width: 100%;
      padding: 16px 20px;
      border-radius: 4px;
      border: none;
      background: #333;
      color: white;
      font-size: 16px;
      outline: none;
      transition: all 0.2s ease;

      &:focus {
        background: #444;
      }

      &::placeholder {
        color: #8c8c8c;
      }
    }

    button {
      margin-top: 8px;
      padding: 16px;
      border-radius: 4px;
      background: #e50914;
      color: white;
      font-size: 16px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: #f40612;
      }
      
      &:disabled {
        background: #f4091280;
        cursor: not-allowed;
      }
    }

    .form-footer {
      margin-top: 24px;
      color: #737373;
      font-size: 14px;

      p {
        margin-bottom: 16px;
        color: #737373;
      }

      a {
        color: white;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }

      small {
        font-size: 12px;
        line-height: 1.4;
      }
    }
  }
`;

export default Login;
