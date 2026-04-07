import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const { isDark } = useTheme();
  const { token } = useAuth();

  useEffect(() => {
    fetch("/history", {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Failed to load history:", err));
  }, [token]);

  const handleClear = () => {
    setHistory([]);
  };

  const bg = isDark ? "#0f172a" : "#f0f2f5";
  const text = isDark ? "#f1f5f9" : "#111";
  const cardBg = isDark ? "#1e293b" : "#fff";
  const cardHeaderBg = isDark ? "#334155" : "#f5f5f5";
  const borderColor = isDark ? "#334155" : "#ddd";

  return (
    <div style={{ ...styles.container, background: bg, color: text }}>
      <div style={styles.header}>
        <h1 style={{ ...styles.title, color: text }}>Workout History</h1>
        {history.length > 0 && (
          <button style={styles.clearButton} onClick={handleClear}>
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p style={{ color: isDark ? "#94a3b8" : "#888", fontSize: "15px" }}>
          No workouts saved yet. Head to the chat to generate one.
        </p>
      ) : (
        history.map((item, index) => (
          <div key={index} style={{ ...styles.card, background: cardBg, border: `1px solid ${borderColor}` }}>
            <div
              style={{ ...styles.cardHeader, background: cardHeaderBg }}
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              <span style={{ ...styles.prompt, color: text }}>{item.prompt}</span>
              <div style={styles.cardMeta}>
                <span style={{ fontSize: "12px", color: isDark ? "#94a3b8" : "#888" }}>
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <span style={{ fontSize: "12px", color: isDark ? "#94a3b8" : "#555" }}>
                  {expanded === index ? "▲" : "▼"}
                </span>
              </div>
            </div>
            {expanded === index && (
              <div style={{ ...styles.response, color: text, borderTop: `1px solid ${borderColor}` }}>
                <ReactMarkdown>{item.response}</ReactMarkdown>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    overflowY: "auto",
    height: "100vh",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "22px",
    margin: 0,
  },
  clearButton: {
    padding: "8px 16px",
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  card: {
    borderRadius: "10px",
    marginBottom: "12px",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    cursor: "pointer",
  },
  prompt: {
    fontWeight: "bold",
    fontSize: "15px",
    flex: 1,
    marginRight: "10px",
  },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  response: {
    padding: "16px",
    fontSize: "15px",
    lineHeight: "1.6",
  },
};

export default HistoryPage;
