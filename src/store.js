import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { verificationAuthApi } from './services/verification-auth';
import { postsApi } from './services/posts';
import { usersApi } from './services/users';
import { conversationApi } from './services/conversation';
import { messageApi } from './services/message';

export const store = configureStore({
    reducer: {
        [verificationAuthApi.reducerPath]: verificationAuthApi.reducer,
        [postsApi.reducerPath]: postsApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [conversationApi.reducerPath]: conversationApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            verificationAuthApi.middleware,
            postsApi.middleware,
            usersApi.middleware,
            conversationApi.middleware,
            messageApi.middleware,
        ]),
});
setupListeners(store.dispatch);
