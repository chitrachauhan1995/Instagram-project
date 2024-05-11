import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "./services/auth";
import {postsApi} from "./services/posts";
import {usersApi} from "./services/users";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [postsApi.reducerPath]: postsApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([authApi.middleware, postsApi.middleware, usersApi.middleware])
});
setupListeners(store.dispatch)
