import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set Axios base URL
// axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.baseURL = "https://health-individual-project-node.onrender.com";

// Authorization setup with fallback
const setAuthHeader = () => {
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null;

  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    console.error("Token not found or expired. Please log in.");
    // Optional: Redirect user or show login prompt here
  }
};

// Generic error handler
const handleError = (error, thunkAPI) =>
  thunkAPI.rejectWithValue(error.response?.data?.message || error.message);

// Fetch private calculation data
export const fetchPrivateCalculationData = createAsyncThunk(
  "private/fetchPrivateCalculationData",
  async (formData, { rejectWithValue }) => {
    const { height, desiredWeight, age, bloodGroupIndex, currentWeight } =
      formData;

    if (
      !height ||
      !desiredWeight ||
      !age ||
      !bloodGroupIndex ||
      !currentWeight
    ) {
      return rejectWithValue("All parameters are required");
    }

    const url = `/api/private/${height}/${desiredWeight}/${age}/${bloodGroupIndex}/${currentWeight}`;

    try {
      setAuthHeader();
      const response = await axios.get(url);
      // console.log("response.data :", response.data);

      return response.data;
    } catch (error) {
      return handleError(error, { rejectWithValue });
    }
  }
);

// Add consumed product
export const addConsumedProductForSpecificDay = createAsyncThunk(
  "private/addConsumedProductForSpecificDay",
  async (credentials, thunkAPI) => {
    try {
      setAuthHeader();
      const response = await axios.post("/api/private/consumed", credentials);
      // console.log("Consumed product added:", response.data);

      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// Delete consumed product
export const deleteConsumedProductForSpecificDay = createAsyncThunk(
  "private/deleteConsumedProductForSpecificDay",
  async (credentials, thunkAPI) => {
    const { productId, date } = credentials;

    if (!productId || !date) {
      return thunkAPI.rejectWithValue("Product ID and date are required");
    }

    const url = `/api/private/consumed/${productId}/${date}`;

    try {
      setAuthHeader();
      const response = await axios.delete(url); // Use DELETE method here
      return {
        message: response.data.message,
        user: response.data.user,
      }; // Return productId for local update
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// Fetch consumed products
export const fetchConsumedProductsForSpecificDay = createAsyncThunk(
  "private/fetchConsumedProductsForSpecificDay",
  async (credentials, thunkAPI) => {
    const { date } = credentials;

    if (!date) {
      return thunkAPI.rejectWithValue("Date is required");
    }

    const url = `/api/private/${date}`;

    try {
      setAuthHeader();
      const response = await axios.get(url);

      // console.log("response.data :", response.data);

      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const setTotalSteps = createAsyncThunk(
  "private/setTotalSteps",
  async (credentials, thunkAPI) => {
    try {
      setAuthHeader();
      const response = await axios.post("/api/private/steps", credentials);
      // console.log("Operations totalSteps:", response.data);

      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const setSleepDailyRegistrations = createAsyncThunk(
  "private/setSleepDailyRegistrations",
  async (credentials, thunkAPI) => {
    try {
      setAuthHeader();
      const response = await axios.post("/api/private/sleep", credentials);
      // console.log("Operations sleep:", response.data);

      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const setHeartMetrix = createAsyncThunk(
  "private/setHeartMetrix",
  async (credentials, thunkAPI) => {
    try {
      setAuthHeader();
      const response = await axios.post("/api/private/heart", credentials);
      console.log("Operations heartMetrix:", response.data);

      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const addEditReminder = createAsyncThunk(
  "private/addEditReminder",
  async (credentials, thunkAPI) => {
    try {
      setAuthHeader();
      const response = await axios.post("/api/private/reminders", credentials);
      // console.log("Reminder operations added/edited:", response.data);

      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const refreshDoneReminders = createAsyncThunk(
  "private/refreshDoneReminders",
  async (credentials, thunkAPI) => {
    const url = `/api/private/reminders/refresh`;

    try {
      setAuthHeader();
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const deleteReminder = createAsyncThunk(
  "private/deleteReminder",
  async (credentials, thunkAPI) => {
    const { id } = credentials;

    if (!id) {
      return thunkAPI.rejectWithValue("Reminder Id is required");
    }

    const url = `/api/private/reminders/${id}`;

    try {
      setAuthHeader();
      const response = await axios.delete(url);

      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);
