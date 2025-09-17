import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

axios.defaults.baseURL = "https://health-individual-project-node.onrender.com";

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  localStorage.setItem("token", JSON.stringify(token));
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = "";
  localStorage.removeItem("token");
};

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post("/api/users/login", credentials);

      const { token, user } = response.data;
      // console.log(user);

      if (user.verify === false) {
        localStorage.removeItem("token");
        return { user, token: null };
      }

      setAuthHeader(token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post("/api/users/signup", credentials);
      const { user, token } = response.data;

      if (user.verify === false) {
        return { user, token: null };
      }

      setAuthHeader(token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await axios.post("/api/users/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Using the current token
      },
    });

    clearAuthHeader();

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (token === null || !token) {
      return thunkAPI.rejectWithValue("Unable to fetch user: No token found");
    }
    try {
      setAuthHeader(token);
      const response = await axios.get("/api/users/current");
      // console.log(response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerificationEmail",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post("/api/users/verify", { email });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "auth/updateUserInfo",
  async (userData, thunkAPI) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.patch("/api/users/update", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  "auth/updateUserAvatar",
  async (formData, thunkAPI) => {
    // console.log("formData from ops :", formData);

    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value); // Log key-value pairs in FormData
    //   console.log("ops");
    // }

    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await axios.patch("/api/users/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log("Form data:", formData);
      // console.log("Headers:", {
      //   Authorization: `Bearer ${token}`,
      //   "Content-Type": "multipart/form-data",
      // });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
