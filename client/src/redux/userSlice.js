import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;

    },
    updateUser: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetUserError: (state) => {
      state.error = null;
    },
     updateVerificationStatus: (state, action) => {
      if (state.currentUser) {
        state.currentUser.isVerified = action.payload;
      }
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  updateVerificationStatus,
  loginFailure, 
  logout,
  updateUser,
  updateUserFailure,
  resetUserError
} = userSlice.actions;

export default userSlice.reducer;