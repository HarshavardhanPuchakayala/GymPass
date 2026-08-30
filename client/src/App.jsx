import {  Routes, Route, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GymPicker from "./pages/GymPicker";
import GymDashboard from "./pages/GymDashboard";
import Members from "./pages/Members.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { GymProvider } from "./context/GymContext";
import Plans from "./pages/plans.jsx";
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/gyms"
          element={
            <ProtectedRoute>
              <GymPicker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gyms/:gymId"
          element={
            <ProtectedRoute>
              <GymLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GymDashboard />} />

  <Route path="members" element={<Members />} />
        </Route>


  <Route path="plans" element={<Plans />} />      
      </Routes>
  );
}

export default App;