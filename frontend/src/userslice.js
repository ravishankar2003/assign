import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentuser: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'ass_user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentuser = action.payload;
    },
    logout: (state) => {
      state.currentuser = null;
      state.loading = false;
    },
    setloading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setloading } = userSlice.actions;

export default userSlice.reducer;
