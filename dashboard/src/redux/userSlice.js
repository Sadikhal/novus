import {createSlice} from "@reduxjs/toolkit";


const initialState = {
  currentUser : null,
  loading : false,
  error : false
}

export const userSlice = createSlice({
  name : 'user',
  initialState,
  reducers : {
    loginStart : (state) => {
      state.loading = true;
      state.error = false;
    },
    loginSuccess : (state , action) => {
       const isActualAdmin = action.payload._id === import.meta.env.VITE_ADMIN_ID;

      state.currentUser = {
        ...action.payload,
         role: action.payload.role,
        isAdmin: action.payload.role === 'admin' && isActualAdmin ,
        isSeller: action.payload.role === 'seller',
        isCustomer: action.payload.role === 'user',
        brand: action.payload.brand || null,
      };
       state.loading = false;
       state.error = null;
    },
    loginFailure : (state,action) => {
      state.loading = false;
     state.error = action.payload;
    },
    logout : (state) => {
     state.currentUser = null;
     state.loading = false;
     state.error = null;
    },
    updateUser: (state, action) => {
     state.currentUser = {
        ...state.currentUser,
        ...action.payload,
        brand: action.payload.brand || state.currentUser?.brand || null,
      };
      state.loading = false;
      state.error = null;
    },
     updateVerificationStatus: (state, action) => {
      if (state.currentUser) {
        state.currentUser.isVerified = action.payload;
      }
    }
  }
})


export const { loginStart, loginSuccess, loginFailure, logout,updateVerificationStatus,updateUser } =
  userSlice.actions;

export default userSlice.reducer;