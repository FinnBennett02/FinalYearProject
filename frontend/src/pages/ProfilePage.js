import { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { isDark } = useTheme();
  const { token, username } = useAuth();

  const [form, setForm] = useState({
    age: "",
    weight: "",
    fitness_level: "",
    injuries: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [workoutCount, setWorkoutCount] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef();

  const avatarKey = `avatar_${username}`;

  useEffect(() => {
    const stored = localStorage.getItem(avatarKey);
    if (stored) setAvatar(stored);

    fetch("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          age: data.age ?? "",
          weight: data.weight ?? "",
          fitness_level: data.fitness_level ?? "",
          injuries: data.injuries ?? "",
        });
      });

    fetch("/history", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setWorkoutCount(Array.isArray(data) ? data.length : 0);
        setLoading(false);
      });
  }, [token, avatarKey]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      localStorage.setItem(avatarKey, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (form.age && (isNaN(form.age) || form.age < 10 || form.age > 100))
      newErrors.age = "Age must be between 10 and 100";
    if (form.weight && (isNaN(form.weight) || form.weight < 20 || form.weight > 300))
      newErrors.weight = "Weight must be between 20 and 300 kg";
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
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
  const statBg = isDark ? "#0f172a" : "#f8fafc";

  const initials = username ? username.slice(0, 2).toUpperCase() : "?";

  if (loading) return <div style={{ padding: "30px", color: text }}>Loading...</div>;

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", padding: "30px", boxSizing: "border-box", overflowY: "auto" }}>

      {/* Header card */}
      <div style={{ ...styles.card, background: cardBg, border: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: "28px", marginBottom: "24px", flexWrap: "wrap" }}>

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            onClick={() => fileInputRef.current.click()}
            title="Click to change photo"
            style={{
              width: 90, height: 90, borderRadius: "50%",
              background: avatar ? "transparent" : "#0084ff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: "bold", color: "#fff",
              cursor: "pointer", overflow: "hidden",
              border: `3px solid ${borderColor}`,
            }}
          >
            {avatar
              ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials}
          </div>
          <div style={styles.cameraIcon} onClick={() => fileInputRef.current.click()}>&#128247;</div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>

        {/* Name + stats */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>{username}</div>
          <div style={{ fontSize: 13, color: labelColor, marginBottom: 16 }}>
            {form.fitness_level || "Fitness level not set"}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ ...styles.stat, background: statBg, border: `1px solid ${borderColor}` }}>
              <span style={{ fontSize: 22, fontWeight: "bold", color: "#0084ff" }}>{workoutCount}</span>
              <span style={{ fontSize: 12, color: labelColor }}>Workouts Generated</span>
            </div>
            <div style={{ ...styles.stat, background: statBg, border: `1px solid ${borderColor}` }}>
              <span style={{ fontSize: 22, fontWeight: "bold", color: "#0084ff" }}>{form.age || "—"}</span>
              <span style={{ fontSize: 12, color: labelColor }}>Age</span>
            </div>
            <div style={{ ...styles.stat, background: statBg, border: `1px solid ${borderColor}` }}>
              <span style={{ fontSize: 22, fontWeight: "bold", color: "#0084ff" }}>{form.weight ? `${form.weight}kg` : "—"}</span>
              <span style={{ fontSize: 12, color: labelColor }}>Weight</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form card */}
      <div style={{ ...styles.card, background: cardBg, border: `1px solid ${borderColor}` }}>
        <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20, color: text }}>Edit Details</div>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={{ ...styles.label, color: labelColor }}>Age</label>
            <input
              type="number"
              style={{ ...styles.input, background: inputBg, color: text, border: `1px solid ${errors.age ? "#ff4d4d" : borderColor}` }}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="e.g. 25"
            />
            {errors.age && <span style={styles.error}>{errors.age}</span>}
          </div>

          <div style={styles.field}>
            <label style={{ ...styles.label, color: labelColor }}>Weight (kg)</label>
            <input
              type="number"
              style={{ ...styles.input, background: inputBg, color: text, border: `1px solid ${errors.weight ? "#ff4d4d" : borderColor}` }}
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="e.g. 75"
            />
            {errors.weight && <span style={styles.error}>{errors.weight}</span>}
          </div>

          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
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

          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <label style={{ ...styles.label, color: labelColor }}>Injuries / Limitations</label>
            <textarea
              style={{ ...styles.textarea, background: inputBg, color: text, border: `1px solid ${borderColor}` }}
              value={form.injuries}
              onChange={(e) => setForm({ ...form, injuries: e.target.value })}
              placeholder="e.g. knee injury, lower back pain"
            />
          </div>
        </div>

        <div style={styles.footer}>
          {saved && <span style={styles.savedMsg}>Saved successfully</span>}
          <button style={styles.saveButton} onClick={handleSave}>Save Profile</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "700px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px 20px",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 18px",
    borderRadius: "10px",
    minWidth: 80,
  },
  field: {
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
    marginTop: "20px",
  },
  savedMsg: {
    fontSize: "13px",
    color: "#22c55e",
  },
  error: {
    fontSize: "12px",
    color: "#ff4d4d",
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
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: "#0084ff",
    borderRadius: "50%",
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    cursor: "pointer",
  },
};

export default ProfilePage;
