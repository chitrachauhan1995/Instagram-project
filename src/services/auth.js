import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const signUpUser = createAsyncThunk(
    'auth/sign-up',
    async (payload, thunkAPI) => {
        try {
            const response = await fetch('http://localhost:5000/auth/sign-up', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            let { data } = await response.json();
            if (response.status === 200) {
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (payload, thunkAPI) => {
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            let data = await response.json();
            if (response.status === 200) {
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

const initialState = {
    username: '',
    email: '',
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isFetching = false;
            return state;
        },
    },
    extraReducers: {
        [signUpUser.fulfilled]: (state, { payload }) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.email = payload.user.email;
            state.username = payload.user.name;
        },
        [signUpUser.pending]: (state) => {
            state.isFetching = true;
        },
        [signUpUser.rejected]: (state, { payload }) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [loginUser.fulfilled]: (state, { payload }) => {
            state.email = payload.email;
            state.username = payload.name;
            state.isFetching = false;
            state.isSuccess = true;
            return state;
        },
        [loginUser.rejected]: (state, { payload }) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [loginUser.pending]: (state) => {
            state.isFetching = true;
        },
    },
});

export const { clearState } = auth.actions;

export const userSelector = (state) => state.auth;
