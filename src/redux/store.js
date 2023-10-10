// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './userSlice.js';
import postReducer from './postSlice.js';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    post: postReducer,
  },
});
