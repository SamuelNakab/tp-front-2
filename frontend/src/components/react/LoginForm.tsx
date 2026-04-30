import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const { login, loading, error, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    await login(email, password);
  }

  return (
    <>
      {user ? <p style={{ color: "#22c55e" }}>You are already logged in.</p> : null}
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
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
}
