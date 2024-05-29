import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
        prepareHeaders: (headers) => {
            headers.set("Access-Control-Allow-Origin", "*");
            headers.set("Accept", "application/json");
            headers.set("mode", 'no-cors');
            return headers;
        },
    }),
    tagTypes: ["auth"],
    endpoints: (builder) => ({
        sendVerificationCode: builder.mutation({
            query: (payload) => ({
                url: `/auth/send-verification-otp`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["auth"],
        }),
        verifyOtp: builder.mutation({
            query: (payload) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["auth"],
        }),
        verifyEmail: builder.query({
            query: () => ({
                url: "/auth/verify-email",
                method: "GET",
            }),
            providesTags: ["auth"],
        }),
    }),
});

export const {
    useSendVerificationCodeMutation,
    useVerifyOtpMutation,
    useVerifyEmailQuery,
} = authApi;
