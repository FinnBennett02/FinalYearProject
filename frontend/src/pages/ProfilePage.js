import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { isDark } = useTheme();
  const { token } = useAuth();

  const [form, setForm] = useState({
    age: "",
    weight: "",
    fitness_level: "",
    injuries: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          age: data.age ?? "",
          weight: data.weight ?? "",
          fitness_level: data.fitness_level ?? "",
          injuries: data.injuries ?? "",
        });
        setLoading(false);
      });
  }, [token]);

  const handleSave = () => {
    fetch("/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        age: form.age ? parseInt(form.age) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        fitness_level: form.fitness_level || null,
        injuries: form.injuries || null,
      }),
    }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const bg = isDark ? "#0f172a" : "#f0f2f5";
  const text = isDark ? "#f1f5f9" : "#111";
  const cardBg = isDark ? "#1e293b" : "#fff";
  const borderColor = isDark ? "#334155" : "#ddd";
  const inputBg = isDark ? "#0f172a" : "#fff";
  const labelColor = isDark ? "#94a3b8" : "#555";

  if (loading) return <div style={{ padding: "30px", color: text }}>Loading...</div>;

  return (
    <div style={{ ...styles.container, background: bg, color: text }}>
      <h1 style={{ ...styles.title, color: text }}>Your Profile</h1>
      <p style={{ color: labelColor, marginBottom: "24px" }}>
        This information is used to personalise your workout plans.
      </p>

      <div style={{ ...styles.card, background: cardBg, border: `1px solid ${borderColor}` }}>
        <div style={styles.field}>
          <label style={{ ...styles.label, color: labelColor }}>Age</label>
          <input
            type="number"
            style={{ ...styles.input, background: inputBg, color: text, border: `1px solid ${borderColor}` }}
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            placeholder="e.g. 25"
          />
        </div>

        <div style={styles.field}>
          <label style={{ ...styles.label, color: labelColor }}>Weight (kg)</label>
          <input
            type="number"
            style={{ ...styles.input, background: inputBg, color: text, border: `1px solid ${borderColor}` }}
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            placeholder="e.g. 75"
          />
        </div>

        <div style={styles.field}>
          <label style={{ ...styles.label, color: labelColor }}>Fitness Level</label>
          <select
            style={{ ...styles.input, background: inputBg, color: text, border: `1px solid ${borderColor}` }}
            value={form.fitness_level}
            onChange={(e) => setForm({ ...form, fitness_level: e.target.value })}
          >
            <option value="">Select...</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={{ ...styles.label, color: labelColor }}>Injuries / Limitations</label>
          <textarea
            style={{ ...styles.textarea, background: inputBg, color: text, border: `1px solid ${borderColor}` }}
            value={form.injuries}
            onChange={(e) => setForm({ ...form, injuries: e.target.value })}
            placeholder="e.g. knee injury, lower back pain"
          />
        </div>

        <div style={styles.footer}>
          {saved && <span style={styles.savedMsg}>Saved successfully</span>}
          <button style={styles.saveButton} onClick={handleSave}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    height: "100vh",
    boxSizing: "border-box",
    overflowY: "auto",
  },
  title: {
    fontSize: "22px",
    marginBottom: "6px",
  },
  card: {
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "500px",
  },
  field: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: "15px",
    borderRadius: "8px",
    outline: "none",
  },
  textarea: {
    padding: "10px",
    fontSize: "15px",
    borderRadius: "8px",
    outline: "none",
    height: "80px",
    resize: "vertical",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "16px",
    marginTop: "8px",
  },
  savedMsg: {
    fontSize: "13px",
    color: "#22c55e",
  },
  saveButton: {
    padding: "10px 24px",
    background: "#0084ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default ProfilePage;
