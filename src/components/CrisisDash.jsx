import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CRISIS, askClaude } from "../Data";
import WorldMap from "./WorldMap";

const REGIONS = ["All","Asia","Africa","Americas","Europe","MidEast"];
const barColor = s => s>70?"#c0392b":s>40?"#e67e22":s>15?"#f1c40f":"#00d68f";

export default function CrisisDash() {
  const [sel,      setSel]      = useState(null);
  const [region,   setRegion]   = useState("All");
  const [animated, setAnimated] = useState(false);
  const [aiTxt,    setAiTxt]    = useState("");
  const [load,     setLoad]     = useState(false);
  const pageRef = useRef(null);
  const barsRef = useRef(null);

  const filtered = CRISIS.filter(d => region==="All" || d.region===region);
  const sorted   = [...filtered].sort((a,b) => b.s-a.s);
  const selData  = CRISIS.find(d => d.c===sel);

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity:0,y:20 }, { opacity:1,y:0,duration:.5,ease:"power3.out" });
    setTimeout(() => setAnimated(true), 400);
  }, []);

  useEffect(() => {
    if (!barsRef.current) return;
    const fills = barsRef.current.querySelectorAll(".cbar-fill");
    gsap.fromTo(fills, { width:"0%" }, { width:(i)=>`${sorted[i]?.s||0}%`, duration:1.2, ease:"power3.out", stagger:.04 });
  }, [region, animated]);

  function handleSelect(country) { setSel(country===sel ? null : country); }

  async function runAI() {
    setLoad(true); setAiTxt("");
    const top = [...CRISIS].sort((a,b)=>b.s-a.s).slice(0,6).map(d=>`${d.c}:${d.s}%`).join(", ");
    const t = await askClaude(
      [{ role:"user", content:`Blood shortage data: ${top}. For STEM students: 1) Geographic/economic patterns? 2) Root causes? 3) How can AI & data science help? Teach critical thinking, 3 paragraphs.` }],
      "You are HemoLearn AI — data science and global health educator. Be insightful, inspire students to use STEM for real-world impact."
    );
    setAiTxt(t); setLoad(false);
  }

  return (
    <div className="page" ref={pageRef} style={{opacity:0}}>
      <div className="pg-head">
        <div className="pg-title">
          <span className="td">SYS://</span><span className="tb">BLOOD</span><span className="td">_</span><span className="tc">CRISIS</span>
        </div>
        <div className="pg-sub">30 COUNTRIES · REAL WHO-SOURCED DATA · LEARN DATA SCIENCE THROUGH A GLOBAL EMERGENCY</div>
      </div>

      <WorldMap selected={sel} onSelect={handleSelect}/>

      {selData && (
        <div className="sel-card" style={{borderColor:barColor(selData.s)+"44"}}>
          <div style={{fontSize:"2rem"}}>{selData.f}</div>
          <div>
            <div className="sel-name" style={{color:barColor(selData.s)}}>{selData.c}</div>
            <div className="sel-region">{selData.region}</div>
          </div>
          <div style={{marginLeft:"auto",textAlign:"right"}}>
            <div className="sel-pct" style={{color:barColor(selData.s)}}>{selData.s}%</div>
            <div className="sel-pct-lbl">Shortage</div>
          </div>
          {[["Needs",selData.need+"M/yr","var(--blood3)"],["Has",selData.have+"M/yr","#00d68f"],["Gap",((selData.need-selData.have).toFixed(2))+"M/yr","#e67e22"]].map(([l,v,c])=>(
            <div key={l} className="ssel">
              <div className="ssel-l">{l}</div>
              <div className="ssel-v" style={{color:c}}>{v}</div>
            </div>
          ))}
        </div>
      )}

      <div className="crisis-grid">
        <div>
          <div className="rfilter">
            {REGIONS.map(r => (
              <button key={r} className={`rfbtn${region===r?" on":""}`} onClick={()=>setRegion(r)}>{r}</button>
            ))}
          </div>
          <div className="panel" style={{padding:"1.25rem"}} ref={barsRef}>
            <div className="slbl">Shortage by Country · Severity Ranked</div>
            {sorted.map(d => (
              <div key={d.c} className={`cbar${sel===d.c?" sel":""}`} onClick={()=>handleSelect(d.c)}>
                <div className="cbar-flag">{d.f}</div>
                <div className="cbar-name">{d.c}</div>
                <div className="cbar-track">
                  <div className="cbar-fill" style={{width:animated?`${d.s}%`:"0%",background:`linear-gradient(90deg,${barColor(d.s)}99,${barColor(d.s)})`}}>
                    <span className="cbar-pct">{d.s}%</span>
                  </div>
                </div>
                <div className="cbar-need">{d.need}M</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
          <div className="panel" style={{padding:"1.4rem"}}>
            <div className="slbl">Global Supply Gap</div>
            <div className="stat-big blood">118.5M</div>
            <div className="stat-lbl">Units needed globally / year</div>
            <div className="divider"/>
            <div className="stat-big cy">92M</div>
            <div className="stat-lbl">Units collected globally / year</div>
            <div className="deficit-box">
              <div className="stat-big blood" style={{fontSize:"2rem"}}>72,603</div>
              <div className="stat-lbl" style={{marginTop:"3px"}}>Units short every single day</div>
            </div>
          </div>

          <div className="panel" style={{padding:"1.25rem"}}>
            <div className="slbl">AI Data Science Analysis</div>
            <p style={{fontFamily:"var(--mono)",fontSize:".68rem",color:"var(--t3)",lineHeight:1.65,marginBottom:".9rem"}}>
              IDENTIFY PATTERNS → FIND ROOT CAUSES → DESIGN AI INTERVENTIONS
            </p>
            <button className="xbtn" onClick={runAI} disabled={load}>
              {load ? "// SCANNING DATA..." : "// RUN AI ANALYSIS"}
            </button>
            {(aiTxt||load) && (
              <div className="ai-panel">
                <div className="ai-head"><div className="ai-pulse"/><span className="ai-lbl">AI · <span className="ac">DATA SCIENCE MODULE</span></span></div>
                <div className={`ai-body${load?" loading":""}`}>{load?"PROCESSING 30 COUNTRY DATASET...":aiTxt}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
