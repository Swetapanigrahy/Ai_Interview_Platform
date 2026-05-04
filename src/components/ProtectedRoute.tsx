import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

/**
 * Guards routes that require an authenticated session.
 * - Redirects unauthenticated users to /sign-in
 * - Preserves the attempted location in `state.from` so we can return after login
 * - `replace` prevents back-button from re-entering the protected page after sign-out
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
