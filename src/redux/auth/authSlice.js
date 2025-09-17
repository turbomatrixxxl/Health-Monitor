import { createSlice } from "@reduxjs/toolkit";
import {
  logIn,
  register,
  logOut,
  refreshUser,
  resendVerificationEmail,
  updateUserInfo,
  updateUserAvatar,
} from "./operationsAuth";

const initialState = {
  user: null,
  avatarURL: null,
  token: null,
  isLoading: false,
  isLoggedIn: false,
  isRegistered: false,
  isRefreshing: false,
  error: null,
  isLoggedOut: false,
  emailResendStatus: null,
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;

  if (!state.isLoggedIn) {
    state.user = null;
    state.token = null;
  }

  state.isRefreshing = false;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;

  if (!state.isRefreshing) {
    state.user = null;
    state.token = null;
    state.isLoggedIn = false;
  }

  state.isRefreshing = false;
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, handlePending)
      .addCase(logIn.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.avatarURL = payload.user.avatarURL || null;
        // console.log(payload.user);

        if (payload.user.verify === false) {
          state.token = null;
          state.isLoggedIn = false;
        } else {
          state.token = payload.token;
          state.isLoggedIn = true;
        }
        state.isLoggedOut = false;
        state.isRegistered = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logIn.rejected, handleRejected)

      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        // console.log(payload.user);
        state.avatarURL = payload.user.avatarURL || null;

        if (state.user.verify) {
          state.isLoggedOut = false;
        }

        state.isRegistered = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, handleRejected)

      .addCase(logOut.pending, handlePending)
      .addCase(logOut.fulfilled, (state) => {
        const token = JSON.parse(localStorage.getItem("token"));

        if (token) {
          localStorage.setItem("token", null);
        }

        if (!token || token === null) {
          state.user = null;
          state.token = null;
          state.isLoggedIn = false;
          state.isLoading = false;
          state.error = null;
          state.isRegistered = false;
        }

        state.user = null;
        state.avatarURL = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isLoading = false;
        state.error = null;
        state.isRegistered = false;
        state.isLoggedOut = true;
      })
      .addCase(logOut.rejected, handleRejected)

      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        state.user = payload.data;
        // console.log(state.user);
        state.avatarURL = payload.data.avatarURL || null;

        if (payload.verify === false) {
          state.token = null;
          state.isLoggedIn = false;
          state.isLoggedOut = true;
        } else {
          state.isLoggedIn = true;
          state.isLoggedOut = false;
        }

        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isRefreshing = false;
        state.isLoggedIn = false;
        state.user = null;
      })

      .addCase(resendVerificationEmail.pending, (state) => {
        state.emailResendStatus = null;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, { payload }) => {
        state.emailResendStatus = payload;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.emailResendStatus = null;
        state.error = action.payload;
      })

      .addCase(updateUserInfo.pending, handlePending)
      .addCase(updateUserInfo.fulfilled, (state, { payload }) => {
        state.user = payload?.data?.user;
        state.avatarURL = payload?.data?.user?.avatarURL || null; // Set the avatar URL
        state.isLoading = false;
        state.error = null;
        state.isLoggedOut = false;
        state.emailResendStatus = "User updated suscesfully...!";
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, { payload }) => {
        // console.log("Avatar payload :", payload);

        state.avatarURL = payload.avatarUrl;
        state.isLoading = false;
        state.error = null;
        state.isLoggedOut = false;
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const authReducer = authSlice.reducer;
