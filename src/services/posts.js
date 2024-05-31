import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const postsApi = createApi({
    reducerPath: 'postsApi',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
        prepareHeaders: (headers, { getState }) => {
            headers.set('Access-Control-Allow-Origin', '*');
            const token = Cookies.get('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['posts'],
    endpoints: (builder) => ({
        createPost: builder.mutation({
            query: (payload) => ({
                url: '/posts/create-post',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['posts'],
            async onQueryStarted(
                arg,
                {
                    dispatch,
                    getState,
                    queryFulfilled,
                    requestId,
                    extra,
                    getCacheEntry,
                }
            ) {},
            async onCacheEntryAdded(
                arg,
                {
                    dispatch,
                    getState,
                    extra,
                    requestId,
                    cacheEntryRemoved,
                    cacheDataLoaded,
                    getCacheEntry,
                }
            ) {},
        }),
        getFeedPost: builder.query({
            query: ({ page, perPage, search }) => ({
                url: `/posts/get-feed-post`,
                method: 'GET',
                params: {
                    page,
                    perPage,
                    search,
                },
            }),
            providesTags: ['posts'],
        }),
        getUserFeedPost: builder.query({
            query: ({ page, perPage, search }) => ({
                url: `/posts/get-user-posts`,
                method: 'GET',
                params: {
                    page,
                    perPage,
                    search,
                },
            }),
            providesTags: ['posts'],
        }),
        deletePost: builder.mutation({
            query: (id) => ({
                url: `/posts/delete-post/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['posts'],
        }),
        updatePost: builder.mutation({
            query: (payload) => ({
                url: `/posts/update-post`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['posts'],
        }),
    }),
});

export const {
    useCreatePostMutation,
    useDeletePostMutation,
    useUpdatePostMutation,
    useGetFeedPostQuery,
    useGetUserFeedPostQuery,
} = postsApi;
