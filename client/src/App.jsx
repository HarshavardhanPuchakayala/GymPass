import { Routes, Route, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GymPicker from "./pages/GymPicker";
import GymDashboard from "./pages/GymDashboard";
import Members from "./pages/Members.jsx";
import MemberDetail from "./pages/MemberDetail.jsx";
import Plans from "./pages/plans.jsx";
import Staff from "./pages/Staff.jsx";
import Scanner from "./pages/Scanner.jsx";
import Overdue from "./pages/Overdue.jsx";
import CreateGym from "./pages/Creategym.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { GymProvider } from "./context/GymContext";

const GymLayout = () => {
  return (
    <GymProvider>
      <Outlet />
    </GymProvider>
  );
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Gym picker */}
      <Route
        path="/gyms"
        element={
          <ProtectedRoute>
            <GymPicker />
          </ProtectedRoute>
        }
      />

      {/* Create gym */}
      {/* This must come before /gyms/:gymId */}
      <Route
        path="/gyms/new"
        element={
          <ProtectedRoute>
            <CreateGym />
          </ProtectedRoute>
        }
      />

      {/* Gym routes */}
      <Route
        path="/gyms/:gymId"
        element={
          <ProtectedRoute>
            <GymLayout />
          </ProtectedRoute>
        }
      >
        {/* /gyms/:gymId */}
        <Route index element={<GymDashboard />} />

        {/* /gyms/:gymId/members */}
        <Route path="members" element={<Members />} />

        {/* /gyms/:gymId/members/:memberId */}
        <Route
          path="members/:memberId"
          element={<MemberDetail />}
        />

        {/* /gyms/:gymId/plans */}
        <Route path="plans" element={<Plans />} />

        {/* /gyms/:gymId/staff */}
        <Route path="staff" element={<Staff />} />

        {/* /gyms/:gymId/scanner */}
        <Route path="scanner" element={<Scanner />} />

        {/* /gyms/:gymId/overdue */}
        <Route path="overdue" element={<Overdue />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;