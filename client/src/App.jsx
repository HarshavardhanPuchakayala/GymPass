
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

import MemberLogin from "./pages/MemberLogin.jsx";
import MemberDashboard from "./pages/MemberDashboard.jsx";

import ProtectedRoute from "./components/ProtectedRoute";
import MemberProtectedRoute from "./components/MemberProtectedRoute";

import { GymProvider } from "./context/GymContext";
import { MemberAuthProvider } from "./context/MemberAuthContext";

const GymLayout = () => {
  return (
    <GymProvider>
      <Outlet />
    </GymProvider>
  );
};

const MemberAuthLayout = ({ children }) => {
  return (
    <MemberAuthProvider>
      {children}
    </MemberAuthProvider>
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
        path="/gyms/new"
        element={
          <ProtectedRoute>
            <CreateGym />
          </ProtectedRoute>
        }
      />


      <Route path="/gyms/:gymId">


        <Route
          path="member-login"
          element={
            <MemberAuthLayout>
              <MemberLogin />
            </MemberAuthLayout>
          }
        />


        <Route
          path="my-profile"
          element={
            <MemberAuthLayout>
              <MemberProtectedRoute>
                <MemberDashboard />
              </MemberProtectedRoute>
            </MemberAuthLayout>
          }
        />


        <Route
          element={
            <ProtectedRoute>
              <GymLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GymDashboard />} />

          <Route
            path="members"
            element={<Members />}
          />

          <Route
            path="members/:memberId"
            element={<MemberDetail />}
          />

          <Route
            path="plans"
            element={<Plans />}
          />

          <Route
            path="staff"
            element={<Staff />}
          />

          <Route
            path="scanner"
            element={<Scanner />}
          />

          <Route
            path="overdue"
            element={<Overdue />}
          />
        </Route>
      </Route>


      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;