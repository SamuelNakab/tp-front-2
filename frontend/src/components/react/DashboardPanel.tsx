import { useEffect } from "react";
import HabitList from "./HabitList";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardPanel() {
  const { user, loading, signOut, error } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.replace("/login");
    }
  }, [loading, user]);

  if (loading) {
    return <p>Checking session...</p>;
  }

  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Signed in as {user.email}</p>
      {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}
      <button
        type="button"
        onClick={() => signOut()}
        style={{
          marginBottom: "1rem",
          borderRadius: "0.5rem",
          border: "1px solid #334155",
          padding: "0.5rem 0.75rem",
          background: "#0b1120",
          color: "#e2e8f0",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <HabitList userId={user.id} />
    </section>
  );
}
