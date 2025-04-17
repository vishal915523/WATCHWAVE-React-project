import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MoviePage from "./pages/Movies";
import WatchWave from "./pages/WatchWave";
import Player from "./pages/Player";
import Signup from "./pages/Signup";
import TVShows from "./pages/TVShows";
import Info from "./pages/Info";
import UserListedMovies from "./pages/UserListedMovies";
import Admin from "./pages/Admin";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/player" element={<Player />} />
            <Route exact path="/tv" element={<TVShows />} />
            <Route exact path="/movies" element={<MoviePage />} />
            <Route exact path="/info" element={<Info />} />
            <Route exact path="/new" element={<Player />} />
            <Route exact path="/mylist" element={<UserListedMovies />} />
            <Route exact path="/admin" element={<Admin />} />
            <Route exact path="/"  element={<WatchWave />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
