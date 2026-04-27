import { useState } from "react";
import { gsap } from "gsap";
import BgCanvas from "./components/BgCanvas";
import Hero     from "./components/Hero";
import CompatLab from "./components/CompatLab";
import CrisisDash from "./components/CrisisDash";
import CaseSim   from "./components/CaseSim";

export default function App() {
  const [tab, setTab] = useState("home");

  function goTab(t) {
    setTab(t);
    gsap.fromTo("#main", { opacity:0, y:16 }, { opacity:1, y:0, duration:.4, ease:"power3.out" });
  }

  return (
    <div>
      <div className="grid-bg"/>
      <BgCanvas/>

      <div className="app-wrap">
        <nav className="nav">
          <div className="logo" onClick={() => goTab("home")}>
            <div className="logo-mark">H</div>
            <div className="logo-name"><span className="hl">HEMO</span><span className="lr">LEARN</span></div>
          </div>
          <div className="nav-right">
            {[["home","HOME"],["lab","🧬 LAB"],["crisis","📡 CRISIS"],["cases","🏥 CASES","8"]].map(([id,lbl,badge])=>(
              <button key={id} className={`ntab${tab===id?" on":""}`} onClick={()=>goTab(id)}>
                {lbl}{badge && <span className="nbadge">{badge}</span>}
              </button>
            ))}
          </div>
        </nav>

        <main id="main">
          {tab==="home"   && <Hero onStart={goTab}/>}
          {tab==="lab"    && <CompatLab/>}
          {tab==="crisis" && <CrisisDash/>}
          {tab==="cases"  && <CaseSim/>}
        </main>

        <footer className="footer">
          <span className="ft-b">HEMO</span><span className="ft-c">LEARN</span>
          {" · DSH HACKS V1 · AI × STEM EDUCATION · REAL DATA FROM KARACHI & 30 COUNTRIES · 2026"}
        </footer>
      </div>
    </div>
  );
}
