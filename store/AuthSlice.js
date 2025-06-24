import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null
};

const authSlice = createSlice({
  
  name: 'auth',

  initialState,
  
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
