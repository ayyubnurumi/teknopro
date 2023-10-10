// src/redux/usersSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export const selectUsers = (state) => state.users.data;

export default usersSlice.reducer;
