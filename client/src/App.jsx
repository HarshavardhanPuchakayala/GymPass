import { Routes, Route, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GymPicker from "./pages/GymPicker";
import GymDashboard from "./pages/GymDashboard";
import Members from "./pages/Members.jsx";
import MemberDetail from "./pages/MemberDetail.jsx";
import Plans from "./pages/plans.jsx";
import Staff from "./pages/Staff.jsx";

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

     
        <Route
          path="members/:memberId"
          element={<MemberDetail />}
        />

        <Route path="plans" element={<Plans />} />

        <Route path="staff" element={<Staff />} />
      </Route>
    </Routes>
  );
}

export default App;