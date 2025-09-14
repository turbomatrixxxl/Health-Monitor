import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import RestrictedRoute from "./components/RestrictedRoute/RestrictedRoute";
import RestrictedLoginRoute from "./components/RestrictedLoginRoute/RestrictedLoginRoute.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SharedLayout from "./components/SharedLayout/SharedLayout";
import { useDispatch } from "react-redux";
import { refreshUser } from "./redux/auth/operationsAuth"; // Import refreshUser
import { useAuth } from "./hooks/useAuth"; // Import custom hook

import Loader from "./components/commonComponents/Loader";
import VerifyEmailPage from "./pages/VerifyEmailPageComponent/VerifyEmailPageComponent";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

import "./App.css";
import { setPrivateUser } from "./redux/private/privateSlice.js";
import { refreshDoneReminders } from "./redux/private/operationsPrivate.js";

// Lazy-loaded pages
const LazyCalculatorPage = React.lazy(() =>
  import("./pages/CalculatorPage/CalculatorPage")
);
const LazyDiaryPage = React.lazy(() => import("./pages/DiaryPage/DiaryPage"));
const LazyHomePage = React.lazy(() => import("./pages/HomePage/HomePage"));
const LazyLoginPage = React.lazy(() => import("./pages/LoginPage/LoginPage"));
const LazyRegistrationPage = React.lazy(() =>
  import("./pages/RegisterPage/RegisterPage")
);
const LazyDailyProgressPage = React.lazy(() =>
  import("./pages/DailyProgressPage")
);
const LazySleepPage = React.lazy(() => import("./pages/SleepPage"));
const LazyPsyhicalActivityPage = React.lazy(() =>
  import("./pages/PsyhicalActivityPage")
);
const LazyAlertsPage = React.lazy(() => import("./pages/AlertsPage"));
const LazyHealthMetricsPage = React.lazy(() =>
  import("./pages/HealthMetricsPage")
);
const LazyExportReportsPage = React.lazy(() =>
  import("./pages/ExportReportsPage")
);

function App() {
  const { isLoggedIn, isRefreshing, user } = useAuth(); // Check user verification status

  const dispatch = useDispatch();

  // Dispatch refreshUser when the app starts (or when page is refreshed)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(refreshUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn && user) {
      dispatch(setPrivateUser(user));
    }
  }, [dispatch, isLoggedIn, user]);

  useEffect(() => {
    if (isLoggedIn && user) {
      dispatch(refreshDoneReminders());
    }
  }, [dispatch, isLoggedIn, user]);

  if (isRefreshing) {
    return <Loader />; // Loader while checking refresh status
  }

  return (
    <React.Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          {/* Public Routes */}
          <Route
            index
            element={
              isLoggedIn === true ? <LazyCalculatorPage /> : <LazyHomePage />
            }
          />

          {/* Login & Registration Routes */}
          <Route
            path="/register"
            element={
              <RestrictedRoute
                redirectTo={"verify-email"}
                component={<LazyRegistrationPage />}
              />
            }
          />

          <Route
            path="/login"
            element={
              <RestrictedLoginRoute
                redirectTo={"/calculator"}
                component={<LazyLoginPage />}
              />
            }
          />

          {/* Email Verification */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Private Routes */}
          <Route
            path="/calculator"
            element={
              <PrivateRoute
                component={<LazyCalculatorPage />}
                redirectTo="/verify-email"
              />
            }
          />

          <Route
            path="/diary"
            element={
              <PrivateRoute
                component={<LazyDiaryPage />}
                redirectTo="/verify-email"
              />
            }
          />

          <Route
            path="/daily"
            element={
              <PrivateRoute
                component={<LazyDailyProgressPage />}
                redirectTo="/verify-email"
              />
            }
          />

          <Route
            path="/sleep"
            element={
              <PrivateRoute
                component={<LazySleepPage />}
                redirectTo="/verify-email"
              />
            }
          />

          <Route
            path="/physical"
            element={
              <PrivateRoute
                component={<LazyPsyhicalActivityPage />}
                redirectTo="/verify-email"
              />
            }
          />

          <Route
            path="/alerts"
            element={
              <PrivateRoute
                component={<LazyAlertsPage />}
                redirectTo="/verify-email"
              />
            }
          />

          <Route
            path="/metrix"
            element={
              <PrivateRoute
                component={<LazyHealthMetricsPage />}
                redirectTo="/verify-email"
              />
            }
          />

          <Route
            path="/export"
            element={
              <PrivateRoute
                component={<LazyExportReportsPage />}
                redirectTo="/verify-email"
              />
            }
          />

          {/* Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
}

export default App;
