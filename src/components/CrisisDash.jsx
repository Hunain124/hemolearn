import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CRISIS_DATA, askClaude } from "../Data";
import WorldMap from "./WorldMap";

const barColor = s => s > 70 ? "#d62828" : s > 40 ? "#f77f00" : s > 15 ? "#ffd166" : "#06d6a0";
const REGIONS = ["All", "Asia", "Africa", "Americas", "Europe", "MidEast"];
const REGION_MAP = {
  Pakistan:"Asia", Ethiopia:"Africa", Nigeria:"Africa", Bangladesh:"Asia",
  "DR Congo":"Africa", Tanzania:"Africa", Uganda:"Africa", Mozambique:"Africa",
  Myanmar:"Asia", Afghanistan:"Asia", Haiti:"Americas", Yemen:"MidEast",
  Sudan:"Africa", Cambodia:"Asia", Bolivia:"Americas", Guatemala:"Americas",
  Indonesia:"Asia", Philippines:"Asia", India:"Asia", Brazil:"Americas",
  Mexico:"Americas", "South Africa":"Africa", Turkey:"Europe", Iran:"MidEast",
  China:"Asia", Japan:"Asia", UK:"Europe", Germany:"Europe", France:"Europe", USA:"Americas",
};

export default function CrisisDash() {
  const [animated, setAnimated] = useState(false);
  const [aiTxt, setAiTxt] = useState(""); const [load, setLoad] = useState(false);
  const [sel, setSel] = useState(null);
  const [region, setRegion] = useState("All");
  const pageRef = useRef(null);
  const barsRef = useRef(null);

  const filtered = CRISIS_DATA.filter(d => region === "All" || REGION_MAP[d.country] === region);
  const sorted = [...filtered].sort((a,b) => b.shortage - a.shortage);
  const selData = CRISIS_DATA.find(d => d.country === sel);

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:.6, ease:"power3.out" });
    setTimeout(() => setAnimated(true), 400);
  }, []);

  useEffect(() => {
    if (barsRef.current) {
      gsap.fromTo(barsRef.current.querySelectorAll(".cbar-fill"),
        { width:"0%" },
        { width:(i) => `${sorted[i]?.shortage||0}%`, duration:1.2, ease:"power3.out", stagger:.04 }
      );
    }
  }, [region]);

  async function analyze() {
    setLoad(true); setAiTxt("");
    const top = [...CRISIS_DATA].sort((a,b)=>b.shortage-a.shortage).slice(0,6).map(d=>`${d.country}:${d.shortage}%`).join(", ");
    const t = await askClaude(
      [{ role:"user", content:`Blood shortage data: ${top}. For STEM students: 1) Geographic/economic patterns? 2) Root causes? 3) How can AI & data science help solve this? Teach critical thinking, 3 paragraphs.` }],
      "You are HemoLearn AI — data science and global health educator. Be insightful, inspire students to use STEM to solve real problems."
    );
    setAiTxt(t); setLoad(false);
  }

  function handleSelect(country) {
    setSel(country === sel ? null : country);
  }

  return (
    <div className="page" ref={pageRef} style={{ opacity:0 }}>
      <div className="page-head">
        <div className="page-title">📊 Global Blood <span className="ac">Crisis</span></div>
        <div className="page-desc">30 countries. Real WHO-sourced data. Learn data science through one of the world's most urgent problems.</div>
      </div>

      <WorldMap selected={sel} onSelect={handleSelect} />

      {selData && (
        <div className="glass glow sel-country" style={{ borderColor: barColor(selData.shortage)+"55" }}>
          <div style={{ fontSize:"2.2rem" }}>{selData.flag}</div>
          <div>
            <div style={{ fontFamily:"var(--disp)", fontSize:"1.6rem", letterSpacing:"1px" }}>{selData.country}</div>
            <div style={{ fontFamily:"var(--mono)", fontSize:".7rem", color:"var(--t3)" }}>{REGION_MAP[selData.country]}</div>
          </div>
          <div style={{ marginLeft:"auto", textAlign:"right" }}>
            <div style={{ fontFamily:"var(--disp)", fontSize:"2.2rem", color:barColor(selData.shortage) }}>{selData.shortage}%</div>
            <div style={{ fontSize:".68rem", color:"var(--t3)", fontFamily:"var(--mono)" }}>shortage</div>
          </div>
          {[["Needs", selData.needed+"M/yr", "var(--r)"], ["Has", selData.have+"M/yr", "var(--g)"], ["Gap", ((selData.needed-selData.have)).toFixed(2)+"M/yr", "var(--r2)"]].map(([l,v,c]) => (
            <div key={l} style={{ padding:".65rem 1rem", background:"var(--bg3)", borderRadius:"10px", border:"1px solid var(--bdr)", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--mono)", fontSize:".62rem", color:"var(--t3)", textTransform:"uppercase", letterSpacing:"1px" }}>{l}</div>
              <div style={{ fontFamily:"var(--disp)", fontSize:"1.3rem", color:c, lineHeight:1.1 }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      <div className="crisis-grid">
        <div>
          <div className="region-filter">
            {REGIONS.map(r => (
              <button key={r} className={`rfbtn${region===r?" on":""}`} onClick={() => setRegion(r)}>{r}</button>
            ))}
          </div>
          <div className="glass glow" style={{ padding:"1.25rem" }} ref={barsRef}>
            <div className="lbl">Shortage by Country · sorted by severity</div>
            {sorted.map(d => (
              <div key={d.country} className="cbar-row" onClick={() => handleSelect(d.country)}
                style={{ background: sel===d.country ? "rgba(214,40,40,.05)" : "" }}>
                <div className="cbar-flag">{d.flag}</div>
                <div className="cbar-country">{d.country}</div>
                <div className="cbar-track">
                  <div className="cbar-fill"
                    style={{ width: animated ? `${d.shortage}%` : "0%", background:`linear-gradient(90deg,${barColor(d.shortage)}bb,${barColor(d.shortage)})`, minWidth: animated?"26px":"0" }}>
                    <span className="cbar-pct">{d.shortage}%</span>
                  </div>
                </div>
                <div className="cbar-num">{d.needed}M</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div className="glass glow" style={{ padding:"1.4rem" }}>
            <div className="lbl">Global Supply Gap</div>
            <div style={{ fontFamily:"var(--disp)", fontSize:"2.8rem", color:"var(--r)", lineHeight:1 }}>118.5M</div>
            <div style={{ fontFamily:"var(--mono)", fontSize:".65rem", color:"var(--t3)", marginTop:"3px" }}>units needed globally / year</div>
            <div style={{ height:1, background:"var(--bdr)", margin:".8rem 0" }}/>
            <div style={{ fontFamily:"var(--disp)", fontSize:"2.8rem", color:"var(--g)", lineHeight:1 }}>92M</div>
            <div style={{ fontFamily:"var(--mono)", fontSize:".65rem", color:"var(--t3)", marginTop:"3px" }}>units collected globally / year</div>
            <div style={{ marginTop:"1rem", padding:".75rem", background:"rgba(214,40,40,.07)", borderRadius:"9px", border:"1px solid rgba(214,40,40,.2)" }}>
              <div style={{ fontFamily:"var(--disp)", fontSize:"1.8rem", color:"var(--r)" }}>72,603</div>
              <div style={{ fontSize:".75rem", color:"var(--t2)", marginTop:"1px" }}>units short <strong>every single day</strong></div>
            </div>
          </div>

          <div className="glass glow" style={{ padding:"1.25rem" }}>
            <div className="lbl">AI Data Science Analysis</div>
            <p style={{ fontSize:".84rem", color:"var(--t2)", lineHeight:1.7, marginBottom:".9rem" }}>
              Identify geographic patterns, economic correlations, and evidence-based AI interventions in this real global health dataset.
            </p>
            <button className="xbtn" onClick={analyze} disabled={load}>
              {load ? "🔬 Analyzing patterns..." : "🤖 Run AI Analysis →"}
            </button>
            {(aiTxt||load) && (
              <div className="aip" style={{ marginTop:"1rem" }}>
                <div className="aih"><div className="ald"/><span className="all">Data Science Insights</span></div>
                <div className="aib">{load ? "Identifying patterns across 30 countries..." : aiTxt}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
