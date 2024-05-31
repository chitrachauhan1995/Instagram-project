import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const messageApi = createApi({
    reducerPath: 'messageApi',
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
    tagTypes: ['message'],
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (id) => ({
                url: `/messages/${id}`,
                method: 'GET',
            }),
            providesTags: ['message'],
        }),
        addMessage: builder.mutation({
            query: (payload) => ({
                url: '/messages',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['message'],
        }),
    }),
});

export const { useAddMessageMutation, useGetMessagesQuery } = messageApi;
