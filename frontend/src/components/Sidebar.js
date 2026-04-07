import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const { isDark, toggleTheme, newChat } = useTheme();

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>CoachAI</h2>

      <button style={styles.newChatButton} onClick={newChat}>
        + New Chat
      </button>

      <nav style={styles.nav}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Chat
        </NavLink>
        <NavLink
          to="/history"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          History
        </NavLink>
      </nav>

      <div style={styles.bottom}>
        <button style={styles.themeToggle} onClick={toggleTheme}>
          {isDark ? "☀ Light Mode" : "☾ Dark Mode"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "210px",
    background: "#111827",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 16px",
    flexShrink: 0,
  },
  logo: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#fff",
    paddingLeft: "4px",
  },
  newChatButton: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    background: "#0084ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  link: {
    display: "block",
    padding: "10px 14px",
    color: "#9ca3af",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "15px",
  },
  activeLink: {
    background: "#1f2937",
    color: "#fff",
  },
  bottom: {
    borderTop: "1px solid #1f2937",
    paddingTop: "16px",
  },
  themeToggle: {
    width: "100%",
    padding: "10px",
    background: "transparent",
    color: "#9ca3af",
    border: "1px solid #1f2937",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "left",
  },
};

export default Sidebar;
