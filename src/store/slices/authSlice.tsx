import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import axiosInstance from "@/utils/axiosInterceptor";
import { Dispatch } from 'redux';

const defaultDict = {
  isAuthenticated: false,
  user: {
    
  },
};

const initialState = getCookie("refreshToken")
  ? { ...defaultDict, isAuthenticated: true }
  : defaultDict;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    firstTimeUserFetching: (state, action) => {
      state.user = action.payload.user;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export default authSlice.reducer;
export const { login, logout, updateUser, firstTimeUserFetching } =
  authSlice.actions;


// Actions
export const fetchUsers = () => async (dispatch:Dispatch) => {
  try {
    console.log("hi")
    const { data } = await axiosInstance.get("/user");
    dispatch(firstTimeUserFetching({ user: data.message }));
  } catch (error) {
    dispatch(firstTimeUserFetching({}));
  }
};
