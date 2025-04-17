import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Admin() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!isAdmin()) {
      navigate("/");
      toast.error("You don't have permission to access this page");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/user/admin/users");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, navigate, isAdmin]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset === 0 ? false : true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/user/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="content">
        <h1>Admin Dashboard - User Management</h1>
        
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-list">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? "Yes" : "No"}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>
                        {currentUser._id !== user._id && (
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    color: white;
  }
  
  h1 {
    margin-bottom: 2rem;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .users-list {
    width: 100%;
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #444;
      }
      
      th {
        background-color: #111;
        font-weight: bold;
      }
      
      tr:hover {
        background-color: #333;
      }
      
      .delete-btn {
        background-color: #e50914;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        
        &:hover {
          background-color: #bd0009;
        }
      }
    }
  }
`; 