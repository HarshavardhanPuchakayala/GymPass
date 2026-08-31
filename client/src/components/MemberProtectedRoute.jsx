
import { Navigate, useParams } from "react-router-dom";
import { useMemberAuth } from "../context/MemberAuthContext";

export default function MemberProtectedRoute({ children }) {
  const { gymId } = useParams();

  const {
    loading,
    isAuthenticated,
  } = useMemberAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-[var(--muted)]">
          Loading member portal...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/gyms/${gymId}/member-login`}
        replace
      />
    );
  }

  return children;
}
