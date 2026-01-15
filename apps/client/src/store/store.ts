import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { baseApi } from "./api/baseApi";
import { adminApi } from "./api/adminApi";
import { reportsApi } from "./api/reportsApi";
import { verificationApi } from "./api/verificationApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer,
      [reportsApi.reducerPath]: reportsApi.reducer,
      [verificationApi.reducerPath]: verificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        baseApi.middleware,
        adminApi.middleware,
        reportsApi.middleware,
        verificationApi.middleware
      ),
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
