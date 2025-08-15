import { createSlice } from '@reduxjs/toolkit';

// searchSlice.js
const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchTerm: '',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: (state) => {
      state.searchTerm = '';
    }
  },
});

export const { setSearchTerm, clearSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;