import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
// changes begin 
const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
};

// Local backend API URL
const API_URL = "http://localhost:5001/api/user";

export const getGenres = createAsyncThunk("WatchWave/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=3d39d6bfe362592e6aa293f01fbcf9b9"
  );
  return genres;
});

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
  });
};

const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk(
  "WatchWave/genre",
  async ({ genre, type }, thunkAPI) => {
    const {
      WatchWave: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `https://api.themoviedb.org/3/discover/${type}?api_key=3d39d6bfe362592e6aa293f01fbcf9b9&with_genres=${genre}`,
      genres
    );
  }
);

export const fetchMovies = createAsyncThunk(
  "WatchWave/trending",
  async ({ type }, thunkAPI) => {
    const {
      WatchWave: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

export const getUsersLikedMovies = createAsyncThunk(
  "WatchWave/getLiked",
  async (email) => {
    try {
      const {
        data: { movies },
      } = await axios.get(`${API_URL}/liked/${email}`);
      if(movies)
        return movies;
      else 
        return [];
    } catch (error) {
      console.error("Error fetching liked movies:", error);
      return [];
    }
  }
);

export const removeMovieFromLiked = createAsyncThunk(
  "WatchWave/deleteLiked",
  async ({ movieId, movieName, email }, { rejectWithValue }) => {
    try {
      const {
        data: { movies },
      } = await axios.put(`${API_URL}/remove`, {
        email,
        movieId,
      });
      return movies || [];
    } catch (error) {
      console.error("Error removing movie:", error);
      return rejectWithValue(error.response?.data?.msg || 'Error removing movie');
    }
  }
);

const WatchWaveSlice = createSlice({
  name: "WatchWave",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    WatchWave: WatchWaveSlice.reducer,
  },
});

export const { setGenres, setMovies } = WatchWaveSlice.actions;
