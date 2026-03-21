import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    const userMessage = { role: "user", text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]); // never mutate array directly, always create a new one
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await res.json();
      const botMessage = { role: "bot", text: data.workout, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to reach backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My AI Chatbot</h1>

      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === "user" ? styles.userRow : styles.botRow}>
            <div style={msg.role === "user" ? styles.userBubble : styles.botBubble}>
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
            <div style={styles.botBubble}>
              <p style={styles.bubbleText}>Thinking...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
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
    maxWidth: "600px",
    margin: "50px auto",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    background: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  userRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  botRow: {
    display: "flex",
    justifyContent: "flex-start",
  },
  userBubble: {
    background: "#0084ff",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "18px 18px 4px 18px",
    maxWidth: "75%",
  },
  botBubble: {
    background: "#e5e5ea",
    color: "#000",
    padding: "10px 14px",
    borderRadius: "18px 18px 18px 4px",
    maxWidth: "75%",
  },
  bubbleText: {
    margin: 0,
    fontSize: "15px",
  },
  bubbleMarkdown: {
    fontSize: "15px",
    lineHeight: "1.5",
  },
  timestamp: {
    fontSize: "11px",
    opacity: 0.6,
    display: "block",
    marginTop: "4px",
    textAlign: "right",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
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

export default App;
