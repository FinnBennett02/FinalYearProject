import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      login(data.access_token, data.username);
      navigate("/");
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  const bg = isDark ? "#0f172a" : "#f0f2f5";
  const cardBg = isDark ? "#1e293b" : "#fff";
  const text = isDark ? "#f1f5f9" : "#111";
  const inputBg = isDark ? "#0f172a" : "#fff";
  const borderColor = isDark ? "#334155" : "#ddd";

  return (
    <div style={{ ...styles.page, background: bg }}>
      <div style={{ ...styles.card, background: cardBg, border: `1px solid ${borderColor}` }}>
        <h2 style={{ ...styles.title, color: text }}>Welcome back</h2>
        <p style={{ ...styles.subtitle, color: isDark ? "#94a3b8" : "#666" }}>Log in to CoachAI</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={{ ...styles.label, color: text }}>Email</label>
          <input
            style={{ ...styles.input, background: inputBg, color: text, border: `1px solid ${borderColor}` }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={{ ...styles.label, color: text }}>Password</label>
          <input
            style={{ ...styles.input, background: inputBg, color: text, border: `1px solid ${borderColor}` }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={{ ...styles.switchText, color: isDark ? "#94a3b8" : "#666" }}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "36px",
    borderRadius: "12px",
  },
  title: {
    fontSize: "22px",
    margin: "0 0 4px",
  },
  subtitle: {
    margin: "0 0 24px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "bold",
    marginTop: "8px",
  },
  input: {
    padding: "10px",
    fontSize: "15px",
    borderRadius: "8px",
    outline: "none",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "13px",
    margin: "4px 0 0",
  },
  button: {
    marginTop: "12px",
    padding: "12px",
    background: "#0084ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },
  switchText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
  },
  link: {
    color: "#0084ff",
    textDecoration: "none",
  },
};

export default LoginPage;
