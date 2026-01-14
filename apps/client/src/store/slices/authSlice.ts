import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/auth";
import type { RootState } from "../store";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Load initial state from localStorage (client-side only)
const loadAuthFromStorage = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }

  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return {
      token,
      user,
      isAuthenticated: !!token && !!user,
    };
  } catch (error) {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

// Initialize with safe defaults, will be hydrated on client
const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    loadAuthFromLocalStorage: (state) => {
      const loaded = loadAuthFromStorage();
      state.token = loaded.token;
      state.user = loaded.user;
      state.isAuthenticated = loaded.isAuthenticated;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Persist to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { setCredentials, logout, loadAuthFromLocalStorage, updateUser } =
  authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
