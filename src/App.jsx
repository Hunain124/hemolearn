import { useState } from "react";
import BgCanvas from "./components/BgCanvas";
import Hero from "./components/Hero";
import CompatLab from "./components/CompatLab";
import CrisisDash from "./components/CrisisDash";
import CaseSim from "./components/CaseSim";

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <div className="app-wrapper">
      <BgCanvas />
      <div className="app">
        <nav className="nav">
          <div className="logo" onClick={() => setTab("home")}>
            <div className="logo-icon">H</div>
            <div className="logo-text">Hemo<span>Learn</span></div>
          </div>
          <div className="nav-tabs">
            {[
              ["home", "Home"],
              ["lab", "🧬 Compat Lab"],
              ["crisis", "📊 Crisis Data"],
              ["cases", "🏥 Cases", "2"],
            ].map(([id, label, badge]) => (
              <button key={id} className={`nav-tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>
                {label}{badge && <span className="nav-badge">{badge}</span>}
              </button>
            ))}
          </div>
        </nav>

        <main className="content">
          {tab === "home" && <Hero onStart={t => setTab(t)} />}
          {tab === "lab" && <CompatLab />}
          {tab === "crisis" && <CrisisDash />}
          {tab === "cases" && <CaseSim />}
        </main>

        <footer className="footer">
          HemoLearn · DSH Hacks V1 · AI × STEM Education · 2026
        </footer>
      </div>
    </div>
  );
}