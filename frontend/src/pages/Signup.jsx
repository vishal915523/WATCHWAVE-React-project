import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import Footer from "../Footer/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import styled from "styled-components";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, currentUser, error, clearError } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, toast, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const { email, password } = formData;
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(email, password);
      toast.success("Signup successful! Welcome aboard!");
    } catch (error) {
      console.error("Signup error:", error);
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
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  value={formData.password}
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </form>
            <div className="form-footer">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
              <small>
                By signing up, you agree to our Terms of Use and Privacy Policy.
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

    .toggle-password {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #8c8c8c;
      cursor: pointer;
      font-size: 14px;
      
      &:hover {
        color: white;
      }
    }

    button[type="submit"] {
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
