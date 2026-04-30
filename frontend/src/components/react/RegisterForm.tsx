import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm() {
  const { register, loading, error, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      window.location.replace("/dashboard");
    }
  }, [loading, user]);

  if (loading) {
    return <p style={{ color: "#94a3b8" }}>Loading...</p>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);

    try {
      await register(email, password);
      setSuccess("Account created. Check your email to confirm registration.");
    } catch {
      // Error state is already handled in useAuth.
    }
  }

  return (
    <>
      {user ? <p style={{ color: "#22c55e" }}>You are logged in. Redirecting to dashboard...</p> : null}
      {success ? <p style={{ color: "#22c55e" }}>{success}</p> : null}
      {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </>
  );
}
