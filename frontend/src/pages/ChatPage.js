import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();
  const { token } = useAuth();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ input: input, history: messages }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setError(null);
      const botMessage = { role: "bot", text: data.workout, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);

    } catch {
      setError("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bg = isDark ? "#0f172a" : "#fff";
  const text = isDark ? "#f1f5f9" : "#111";
  const windowBg = isDark ? "#1e293b" : "#f9f9f9";
  const windowBorder = isDark ? "#334155" : "#ccc";
  const inputBorder = isDark ? "#334155" : "#ccc";
  const inputBg = isDark ? "#1e293b" : "#fff";

  return (
    <div style={{ ...styles.container, background: bg, color: text }}>

      {messages.length === 0 && (
        <div style={styles.intro}>
          <h2 style={{ color: text }}>Welcome to CoachAI</h2>
          <p style={{ color: isDark ? "#94a3b8" : "#555" }}>
            Your personal AI fitness coach specialising in plyometric training.
            Ask me to build you a workout, give training advice, or help you
            work around an injury.
          </p>
          <div style={styles.suggestions}>
            {["Build me a beginner plyometric plan", "I have a knee injury, what can I do?", "How do I improve my vertical jump?"].map((s) => (
              <button
                key={s}
                style={{ ...styles.suggestion, background: isDark ? "#1e293b" : "#f0f2f5", color: text, border: `1px solid ${inputBorder}` }}
                onClick={() => setInput(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...styles.chatWindow, background: windowBg, border: `1px solid ${windowBorder}` }}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === "user" ? styles.userRow : styles.botRow}>
            <div style={msg.role === "user" ? styles.userBubble : { ...styles.botBubble, background: isDark ? "#334155" : "#e5e5ea", color: text }}>
              <div style={styles.bubbleMarkdown}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              <span style={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div style={styles.botRow}>
            <div style={{ ...styles.botBubble, background: isDark ? "#334155" : "#e5e5ea", color: text }}>
              <p style={styles.bubbleText}>Thinking...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p style={{ color: "#ff4d4d", fontSize: "13px", margin: "4px 0" }}>{error}</p>}

      <div style={styles.inputRow}>
        <input
          style={{ ...styles.input, background: inputBg, color: text, border: `1px solid ${inputBorder}` }}
          placeholder="Ask me something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: "24px 30px",
    boxSizing: "border-box",
  },
  intro: {
    marginBottom: "16px",
  },
  suggestions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  suggestion: {
    padding: "8px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    borderRadius: "8px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  userRow: { display: "flex", justifyContent: "flex-end" },
  botRow: { display: "flex", justifyContent: "flex-start" },
  userBubble: {
    background: "#0084ff",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "18px 18px 4px 18px",
    maxWidth: "75%",
  },
  botBubble: {
    padding: "10px 14px",
    borderRadius: "18px 18px 18px 4px",
    maxWidth: "75%",
  },
  bubbleText: { margin: 0, fontSize: "15px" },
  bubbleMarkdown: { fontSize: "15px", lineHeight: "1.5" },
  timestamp: {
    fontSize: "11px",
    opacity: 0.6,
    display: "block",
    marginTop: "4px",
    textAlign: "right",
  },
  inputRow: { display: "flex", gap: "8px", marginTop: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "15px",
    borderRadius: "8px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "15px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    background: "#0084ff",
    color: "#fff",
  },
};

export default ChatPage;
