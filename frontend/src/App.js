import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: input }),
    });

    const data = await res.json();
    setResponse(data.workout);
  };

  return (
    <div style={styles.container}>
      <h1>My AI Chatbot</h1>

      <textarea
        style={styles.textarea}
        placeholder="Ask me something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>

      <div style={styles.responseBox}>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    fontFamily: "Arial, sans-serif",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  responseBox: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    background: "#f9f9f9",
  },
};

export default App;
