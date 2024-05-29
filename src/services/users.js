import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const usersApi = createApi({
    reducerPath: 'usersApi',
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
    tagTypes: ['users'],
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                url: '/users/get-user-profile',
                method: 'GET',
            }),
            providesTags: ['users'],
        }),
        getUser: builder.query({
            query: ({ user_id }) => ({
                url: '/users/get-user',
                method: 'GET',
                params: {
                    user_id,
                },
            }),
            providesTags: ['users'],
        }),
        unfollowUser: builder.mutation({
            query: (payload) => ({
                url: '/users/unfollow-user',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['users'],
        }),
        showUserProfile: builder.query({
            query: (id) => ({
                url: `/users/show-user-profile?userId=${id}`,
                method: 'GET',
            }),
            providesTags: ['users'],
        }),
        followUser: builder.mutation({
            query: (payload) => ({
                url: '/users/follow-user',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['users'],
        }),
        acceptFollowRequest: builder.mutation({
            query: (payload) => ({
                url: '/users/accept-follow-requests',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['users'],
        }),
        getFollowRequests: builder.query({
            query: () => ({
                url: '/users/get-follow-requests',
                method: 'GET',
            }),
            providesTags: ['users'],
        }),
        updateUserProfile: builder.mutation({
            query: (payload) => ({
                url: '/users/update-user-profile',
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['users'],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserQuery,
    useUnfollowUserMutation,
    useShowUserProfileQuery,
    useFollowUserMutation,
    useAcceptFollowRequestMutation,
    useGetFollowRequestsQuery,
    useUpdateUserProfileMutation,
} = usersApi;
