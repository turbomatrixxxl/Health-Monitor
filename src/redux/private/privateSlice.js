import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPrivateCalculationData,
  addConsumedProductForSpecificDay,
  deleteConsumedProductForSpecificDay,
  fetchConsumedProductsForSpecificDay,
  setTotalSteps,
  setHeartMetrix,
  addEditReminder,
  deleteReminder,
  refreshDoneReminders,
  setSleepDailyRegistrations,
} from "./operationsPrivate";

const initialState = {
  user: null,
  height: "",
  desiredWeight: "",
  age: "",
  bloodGroupIndex: "",
  currentWeight: "",
  recommendedDailyCaloriesIntake: 0,
  dailyCalorieSummary: {
    dailyCalorieIntake: 0,
    totalCaloriesConsumed: 0,
    remainingCalories: 0,
    percentageCaloriesConsumed: 0,
  },
  consumedProducts: [],
  totalSteps: 0,
  isLoading: false,
  error: null,
  message: null,
};

const privateSlice = createSlice({
  name: "private",
  initialState,
  reducers: {
    setPrivateUser: (state, action) => {
      state.user = action.payload;
    },
    clearMessage(state) {
      state.message = null;
    },
    setPrivateFormData: (state, action) => {
      const { name, value } = action.payload;
      if (name in state) {
        state[name] = value;
      }
    },
    resetPrivateForm: (state) => {
      state.height = "";
      state.desiredWeight = "";
      state.age = "";
      state.bloodGroupIndex = "";
      state.currentWeight = "";
      state.result = null;
      state.error = null;
    },
    resetPrivateFormError: (state) => {
      state.error = null;
    },
    setTotalStepsForToday: (state, action) => {
      state.totalSteps = action.payload;
      // console.log("state.totalSteps :", state.totalSteps);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivateCalculationData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrivateCalculationData.fulfilled, (state, action) => {
        state.isLoading = false;
        const { recommendedDailyCaloriesIntake, data } = action.payload;
        state.user = data;
        // console.log("privateUser :", data);

        state.recommendedDailyCaloriesIntake = recommendedDailyCaloriesIntake;
      })
      .addCase(fetchPrivateCalculationData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addConsumedProductForSpecificDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addConsumedProductForSpecificDay.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, message } = action.payload;
        state.user = data;
        state.message = message;
      })
      .addCase(addConsumedProductForSpecificDay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteConsumedProductForSpecificDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteConsumedProductForSpecificDay.fulfilled,
        (state, action) => {
          const { message, user } = action.payload;

          state.isLoading = false;
          state.user = user;
          state.message = message;
          state.consumedProducts = user.consumedProducts;
        }
      )
      .addCase(
        deleteConsumedProductForSpecificDay.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      .addCase(fetchConsumedProductsForSpecificDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchConsumedProductsForSpecificDay.fulfilled,
        (state, action) => {
          state.isLoading = false;
          const {
            dailyCalorieIntake,
            totalCaloriesConsumed,
            remainingCalories,
            percentageCaloriesConsumed,
            consumedProducts,
          } = action.payload;

          // console.log("fetch :", action.payload);

          state.dailyCalorieSummary = {
            dailyCalorieIntake,
            totalCaloriesConsumed,
            remainingCalories,
            percentageCaloriesConsumed,
          };
          state.consumedProducts = consumedProducts;
        }
      )
      .addCase(
        fetchConsumedProductsForSpecificDay.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      .addCase(setTotalSteps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setTotalSteps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        // console.log("setTotalSteps Slice User :", action.payload.user);
      })
      .addCase(setTotalSteps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(setSleepDailyRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setSleepDailyRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        // console.log(
        //   "setSleepDailyRegistrations Slice  User :",
        //   action.payload.user
        // );
      })
      .addCase(setSleepDailyRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(setHeartMetrix.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setHeartMetrix.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        // console.log("setHeartMetrix Slice  User :", action.payload.user);
      })
      .addCase(setHeartMetrix.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addEditReminder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addEditReminder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        // console.log("addEditReminder Slice User :", action.payload.user);
      })
      .addCase(addEditReminder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(refreshDoneReminders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshDoneReminders.fulfilled, (state, action) => {
        const { message, user } = action.payload;

        state.isLoading = false;
        state.user = user;
        state.message = message;
        // console.log("refreshDoneReminders User :", user);
      })
      .addCase(refreshDoneReminders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteReminder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        const { message, user } = action.payload;

        state.isLoading = false;
        state.user = user;
        state.message = message;
        // console.log("Reminder Delete Slice User :", user);
      })
      .addCase(deleteReminder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPrivateUser,
  setPrivateFormData,
  resetPrivateForm,
  setTotalStepsForToday,
  clearMessage,
  resetPrivateFormError,
} = privateSlice.actions;

export const privateReducer = privateSlice.reducer;
