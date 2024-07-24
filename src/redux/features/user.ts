import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: null,
  },
  reducers: {
    userStore: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = null;
    }    
  }
});

export const { userStore,logout } = userSlice.actions

export default userSlice.reducer