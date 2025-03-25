import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Slider from "../components/Slider";

function WatchWave() {
  const [isScrolled, setIsScrolled] = useState(false);

  const movies = useSelector((state) => state.WatchWave.movies);
  const genres = useSelector((state) => state.WatchWave.genres);
  const genresLoaded = useSelector((state) => state.WatchWave.genresLoaded);
  const [email, setEmail] = useState("");
  const getMoviesFromRange = (from, to) => {

    return movies.slice(from, to);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
      else setEmail(currentUser.email);
    });
  }, [navigate]);
  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "all" }));
    }
  }, [dispatch, genresLoaded, genres]);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0? false : true);
    return () => (window.onscroll = null);
  };

  var data = getMoviesFromRange(0, 100);
  var x = Math.floor(Math.random() * data.length);
  var mv = data[x];
  if (!mv) {
    mv = {
      "id": 453395,
      "name": "Doctor Strange in the Multiverse of Madness",
      "image": "/wcKFYIiVDvRURrzglV9kGu7fpfY.jpg",
      "genres": [
        "Fantasy",
        "Action",
        "Adventure"
      ]
    }

  }
  return (
    <Container>
      <Navbar isScrolled={isScrolled} email={email} />
      <div className="hero">
        <img
          src={`https://image.tmdb.org/t/p/original/${mv.image}`}
          alt="background"
          className="background-image"
        />
        <div className="container">
          <div className="logo">
            {mv.name}
          </div>
          <div className="buttons flex">
            <button
              onClick={() => navigate("/player", { state: { id: mv } })}
              className="flex j-center a-center"
            >
              <FaPlay />
              Play
            </button>
            <button
              onClick={() => navigate("/info", { state: { id: mv } })}
              className="flex j-center a-center"
            >
              <AiOutlineInfoCircle />
              More Info
            </button>
          </div>
        </div>
      </div>
      <Slider movies={movies} />
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
 .hero {
    position: relative;
   .background-image {
      filter: brightness(60%);
      height: 100vh;
      width: 100vw;
    }
    img {
      height: 100vh;
      width: 100vw;

    }
   .container {
      position: absolute;
      bottom: 5rem;
     .logo {
        width: 50%;
        height: 100%;
        margin-left: 5rem;
        font-size: 4rem;
        font-weight: bold;
      }
     .buttons {
        margin: 5rem;
        gap: 2rem;
        button {
          font-size: 1.4rem;
          gap: 1rem;
          border-radius: 0.2rem;
          padding: 0.5rem;
          padding-left: 2rem;
          padding-right: 2.4rem;
          border: none;
          cursor: pointer;
          transition: 0.2s ease-in-out;
          &:hover {
            opacity: 0.8;
          }
          &:nth-of-type(2) {
            background-color: rgba(109, 109, 110, 0.7);
            color: white;
            svg {
              font-size: 1.8rem;
            }
          }
        }
      }
    }
  }
`;
export default WatchWave;