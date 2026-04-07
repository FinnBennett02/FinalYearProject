import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import ChatPage from "./pages/ChatPage";
import HistoryPage from "./pages/HistoryPage";

function AppLayout() {
  const { isDark, chatKey } = useTheme();

  return (
    <div style={{ ...styles.layout, background: isDark ? "#1a1a2e" : "#f0f2f5" }}>
      <Sidebar />
      <div style={styles.main}>
        <Routes>
          <Route path="/" element={<ChatPage key={chatKey} />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  main: {
    flex: 1,
    overflow: "hidden",
  },
};

export default App;
