import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [], // Initial posts data
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { setPosts } = postSlice.actions;

export const selectPosts = (state) => state.post.posts;

export default postSlice.reducer;
