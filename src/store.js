import { configureStore } from '@reduxjs/toolkit';
import { verificationAuthApi } from './services/verification-auth';
import { postsApi } from './services/posts';
import { usersApi } from './services/users';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
    reducer: {
        [verificationAuthApi.reducerPath]: verificationAuthApi.reducer,
        [postsApi.reducerPath]: postsApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            verificationAuthApi.middleware,
            postsApi.middleware,
            usersApi.middleware,
        ]),
});
setupListeners(store.dispatch);
