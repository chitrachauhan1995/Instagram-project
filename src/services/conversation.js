import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const conversationApi = createApi({
    reducerPath: 'conversationApi',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
        prepareHeaders: (headers) => {
            headers.set('Access-Control-Allow-Origin', '*');
            const token = Cookies.get('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['conversation'],
    endpoints: (builder) => ({
        getConversations: builder.query({
            query: (id) => ({
                url: `/conversations/${id}`,
                method: 'GET',
            }),
            providesTags: ['conversation'],
        }),
        addConversation: builder.mutation({
            query: (payload) => ({
                url: '/conversations',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['conversation'],
        }),
    }),
});

export const { useAddConversationMutation, useGetConversationsQuery } =
    conversationApi;
