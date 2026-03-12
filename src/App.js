import { useState, useEffect, useRef } from "react";

const TYPING_LINES = [
  "$ juzzyai chat --provider ollama --model codellama",
  "👋 Hey, zhus! How can I help?",
  "zhus@codellama > write a REST API in Python",
  "🤖 JuzzyAI:",
  "```python",
  "from fastapi import FastAPI",
  "app = FastAPI()",
  "",
  "@app.get('/users/{user_id}')",
  "def get_user(user_id: int):",
  "    return {'id': user_id}",
  "```",
  "[codellama | 42+318 tokens | 2.1s]",
];

function TypingTerminal() {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [cursor, setCursor] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentLine >= TYPING_LINES.length) return;
    const line = TYPING_LINES[currentLine];
    if (currentChar < line.length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLines((l) => [...l, line]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines, currentChar]);

  const getColor = (line) => {
    if (line.startsWith("$")) return "#4ade80";
    if (line.startsWith("👋") || line.startsWith("🤖")) return "#86efac";
    if (line.startsWith("zhus@")) return "#a78bfa";
    if (line.startsWith("[")) return "#6b7280";
    if (line.startsWith("```") || line.startsWith("from") || line.startsWith("app") || line.startsWith("@") || line.startsWith("def") || line.startsWith("    ")) return "#93c5fd";
    return "#d1d5db";
  };

  const currentText = currentLine < TYPING_LINES.length
    ? TYPING_LINES[currentLine].slice(0, currentChar)
    : "";

  return (
    <div
      ref={ref}
      style={{
        background: "#0a0a0a",
        border: "1px solid #1f2937",
        borderRadius: "12px",
        padding: "24px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: "13px",
        lineHeight: "1.8",
        height: "320px",
        overflowY: "auto",
        scrollbarWidth: "none",
        boxShadow: "0 0 60px rgba(74,222,128,0.05), 0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {["#ef4444","#f59e0b","#22c55e"].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
      </div>
      {lines.map((line, i) => (
        <div key={i} style={{ color: getColor(line), whiteSpace: "pre" }}>
          {line || "\u00a0"}
        </div>
      ))}
      {currentLine < TYPING_LINES.length && (
        <div style={{ color: getColor(TYPING_LINES[currentLine]), whiteSpace: "pre" }}>
          {currentText}
          <span style={{ opacity: cursor ? 1 : 0, color: "#4ade80" }}>█</span>
        </div>
      )}
    </div>
  );
}

const features = [
  { icon: "💬", title: "Smart Chat", desc: "Conversational coding assistant that remembers context across your session." },
  { icon: "🔍", title: "Code Analysis", desc: "Instant bug detection, performance issues, and best practice violations." },
  { icon: "⚡", title: "Code Generation", desc: "Describe what you need in plain English, get production-ready code." },
  { icon: "🔧", title: "Refactoring", desc: "Clean up and modernize existing code with targeted improvements." },
  { icon: "📡", title: "Streaming", desc: "See responses appear in real time with beautiful Markdown rendering." },
  { icon: "🌐", title: "Offline Ready", desc: "Use Ollama locally — no internet, no API keys, no cost." },
];

const providers = [
  { name: "Ollama", type: "Local", free: true, desc: "Run models on your machine" },
  { name: "Groq", type: "Cloud", free: true, desc: "Blazing fast inference" },
  { name: "Gemini", type: "Cloud", free: true, desc: "Google's AI models" },
  { name: "HuggingFace", type: "Cloud", free: true, desc: "Thousands of models" },
];

const commands = [
  { cmd: "juzzyai", desc: "Start chat (default)" },
  { cmd: "juzzyai analyze --file app.py", desc: "Analyze a file" },
  { cmd: "juzzyai generate", desc: "Generate code" },
  { cmd: "juzzyai refactor --file utils.py", desc: "Refactor code" },
];

export default function App() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("juzzyai");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050505",
      color: "#e5e7eb",
      fontFamily: "'JetBrains Mono', monospace",
      overflowX: "hidden",
    }}>
      {/* Noise overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        opacity: 0.4,
      }} />

      {/* Grid lines */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Nav */}
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 48px", borderBottom: "1px solid #111",
        }}>
          <div style={{ color: "#4ade80", fontSize: "16px", fontWeight: 700, letterSpacing: "2px" }}>
            JUZZY<span style={{ color: "#86efac" }}>AI</span>
          </div>
          <div style={{ display: "flex", gap: "32px", fontSize: "12px", color: "#6b7280" }}>
            {["Features", "Providers", "Install"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: "#6b7280", textDecoration: "none", letterSpacing: "1px" }}
                onMouseEnter={e => e.target.style.color = "#4ade80"}
                onMouseLeave={e => e.target.style.color = "#6b7280"}>
                {item}
              </a>
            ))}
          </div>
          <a
            href="https://github.com/Zhussup/juzzyai/releases"
            style={{
              background: "#4ade80", color: "#000", padding: "8px 20px",
              borderRadius: "6px", textDecoration: "none", fontSize: "12px",
              fontWeight: 700, letterSpacing: "1px",
            }}
          >
            DOWNLOAD
          </a>
        </nav>

        {/* Hero */}
        <section style={{ padding: "100px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "inline-block", background: "#0f1a0f", border: "1px solid #166534",
            borderRadius: "20px", padding: "4px 14px", fontSize: "11px",
            color: "#4ade80", marginBottom: "32px", letterSpacing: "2px",
          }}>
            v1.0.0 — FREE & OPEN SOURCE
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 800, lineHeight: 1.05,
            margin: "0 0 24px", letterSpacing: "-2px",
          }}>
            AI coding assistant<br />
            <span style={{ color: "#4ade80" }}>in your terminal.</span>
          </h1>

          <p style={{
            fontSize: "16px", color: "#6b7280", maxWidth: "500px",
            lineHeight: 1.7, marginBottom: "48px",
          }}>
            Chat, analyze, generate and refactor code using free AI models — locally or in the cloud. No subscriptions. No browser.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "80px" }}>
            <a
              href="https://github.com/Zhussup/juzzyai/releases"
              style={{
                background: "#4ade80", color: "#000", padding: "14px 32px",
                borderRadius: "8px", textDecoration: "none", fontSize: "13px",
                fontWeight: 700, letterSpacing: "1px",
              }}
            >
              ↓ DOWNLOAD FOR WINDOWS
            </a>
            <a
              href="https://github.com/Zhussup/juzzyai"
              style={{
                background: "transparent", color: "#e5e7eb", padding: "14px 32px",
                borderRadius: "8px", textDecoration: "none", fontSize: "13px",
                fontWeight: 700, letterSpacing: "1px", border: "1px solid #1f2937",
              }}
            >
              VIEW ON GITHUB →
            </a>
          </div>

          <TypingTerminal />
        </section>

        {/* Features */}
        <section id="features" style={{ padding: "80px 48px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "3px", marginBottom: "16px" }}>
            // FEATURES
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "48px", letterSpacing: "-1px" }}>
            Everything you need.
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px",
            background: "#111", border: "1px solid #111", borderRadius: "12px", overflow: "hidden",
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "#050505", padding: "32px",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#0a0a0a"}
                onMouseLeave={e => e.currentTarget.style.background = "#050505"}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#f9fafb", marginBottom: "8px", letterSpacing: "0.5px" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Providers */}
        <section id="providers" style={{ padding: "80px 48px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "3px", marginBottom: "16px" }}>
            // PROVIDERS
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "48px", letterSpacing: "-1px" }}>
            All free. Your choice.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {providers.map((p, i) => (
              <div key={i} style={{
                background: "#0a0a0a", border: "1px solid #1f2937",
                borderRadius: "10px", padding: "24px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#f9fafb" }}>{p.name}</div>
                  <div style={{
                    fontSize: "10px", background: "#0f1a0f", color: "#4ade80",
                    border: "1px solid #166534", borderRadius: "4px", padding: "2px 8px", letterSpacing: "1px",
                  }}>FREE</div>
                </div>
                <div style={{ fontSize: "11px", color: "#4ade80", marginBottom: "8px", letterSpacing: "1px" }}>
                  {p.type.toUpperCase()}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Install */}
        <section id="install" style={{ padding: "80px 48px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "3px", marginBottom: "16px" }}>
            // QUICK START
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "48px", letterSpacing: "-1px" }}>
            Up in 30 seconds.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px", letterSpacing: "1px" }}>
                COMMANDS
              </div>
              <div style={{
                background: "#0a0a0a", border: "1px solid #1f2937",
                borderRadius: "10px", overflow: "hidden",
              }}>
                {commands.map((c, i) => (
                  <div key={i} style={{
                    padding: "14px 20px", borderBottom: i < commands.length - 1 ? "1px solid #111" : "none",
                    display: "flex", gap: "16px", alignItems: "center",
                  }}>
                    <span style={{ color: "#4ade80", fontSize: "12px", whiteSpace: "nowrap" }}>{c.cmd}</span>
                    <span style={{ color: "#4b5563", fontSize: "11px" }}>{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px", letterSpacing: "1px" }}>
                CHAT COMMANDS
              </div>
              <div style={{
                background: "#0a0a0a", border: "1px solid #1f2937",
                borderRadius: "10px", overflow: "hidden",
              }}>
                {["/help", "/new", "/sessions", "/copy", "/clear", "/reset", "/exit"].map((cmd, i, arr) => (
                  <div key={i} style={{
                    padding: "14px 20px", borderBottom: i < arr.length - 1 ? "1px solid #111" : "none",
                  }}>
                    <span style={{ color: "#a78bfa", fontSize: "12px" }}>{cmd}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: "80px 48px", textAlign: "center",
          borderTop: "1px solid #111",
        }}>
          <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "3px", marginBottom: "24px" }}>
            // GET STARTED
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, marginBottom: "16px", letterSpacing: "-1px" }}>
            Start coding smarter.
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "40px" }}>
            Free. Open source. No cloud required.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://github.com/Zhussup/juzzyai/releases"
              style={{
                background: "#4ade80", color: "#000", padding: "14px 36px",
                borderRadius: "8px", textDecoration: "none", fontSize: "13px",
                fontWeight: 700, letterSpacing: "1px",
              }}
            >
              ↓ DOWNLOAD
            </a>
            <button
              onClick={handleCopy}
              style={{
                background: "transparent", color: copied ? "#4ade80" : "#e5e7eb",
                padding: "14px 36px", borderRadius: "8px", fontSize: "13px",
                fontWeight: 700, letterSpacing: "1px", border: "1px solid #1f2937",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {copied ? "✓ COPIED!" : "$ juzzyai"}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: "24px 48px", borderTop: "1px solid #111",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: "11px", color: "#374151",
        }}>
          <div>JUZZYAI © 2026</div>
          <a href="https://github.com/Zhussup/juzzyai" style={{ color: "#374151", textDecoration: "none" }}>
            GITHUB →
          </a>
        </footer>
      </div>
    </div>
  );
}