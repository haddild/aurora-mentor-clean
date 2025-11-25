import { useState, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I’m Aurora. How can I help you today? 🌙" }
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("chat");
  const [theme, setTheme] = useState("purple");
  const [customColor, setCustomColor] = useState("#9b59b6");

  const [showBirthday, setShowBirthday] = useState(false);

  // 🎂 Show birthday banner on Nov 26 & 27
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    if ((month === 11 && day === 26) || (month === 11 && day === 27)) {
      setShowBirthday(true);
    }
  }, []);

  // 🎨 Apply theme color
  useEffect(() => {
    if (theme === "custom") {
      document.documentElement.style.setProperty("--accent", customColor);
      document.documentElement.style.setProperty("--bubble", customColor + "33");
    } else {
      const presets = {
        blue: "#3498db",
        pink: "#ff7eb9",
        purple: "#9b59b6",
        green: "#2ecc71",
        gold: "#f1c40f"
      };
      document.documentElement.style.setProperty("--accent", presets[theme]);
      document.documentElement.style.setProperty("--bubble", presets[theme] + "33");
    }
  }, [theme, customColor]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          messages: newMessages
        })
      });

      const data = await res.json();

      setMessages(m => [...m, { role: "assistant", content: data.text || "…" }]);
    } catch (err) {
      setMessages(m => [
        ...m,
        { role: "assistant", content: "Aurora had a small issue — please try again!" }
      ]);
    }
  };

  const modes = [
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "study", icon: "📘", label: "Study" },
    { id: "learn", icon: "🧠", label: "Learn" },
    { id: "motivation", icon: "✨", label: "Motivation" }
  ];

  return (
    <div className="app">

      {/* 🎂 Birthday Banner */}
      {showBirthday && (
        <div className="birthday-banner">
          🎂 Happy Birthday my angelll! ✨
        </div>
      )}

      {/* Aurora Gradient Background */}
      <div className="aurora-bg" />

      {/* Sidebar Modes */}
      <div className="sidebar">
        {modes.map(m => (
          <div
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`mode-btn ${mode === m.id ? "active" : ""}`}
          >
            <span className="icon">{m.icon}</span>
            <span className="label">{m.label}</span>
          </div>
        ))}

        {/* Theme Controls */}
        <div className="theme-controls">
          <p>Theme</p>
          <div className="theme-row">
            {["pink", "purple", "blue", "green", "gold"].map(t => (
              <div
                key={t}
                className={`theme-dot ${theme === t ? "active" : ""}`}
                style={{ background: `var(--${t})` }}
                onClick={() => setTheme(t)}
              />
            ))}

            {/* Custom Color */}
            <div
              className={`theme-dot ${theme === "custom" ? "active" : ""}`}
              style={{ background: customColor }}
              onClick={() => setTheme("custom")}
            />
          </div>

          {theme === "custom" && (
            <input
              type="color"
              value={customColor}
              onChange={e => setCustomColor(e.target.value)}
              className="color-picker"
            />
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="chat">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`bubble ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Message Aurora…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}
