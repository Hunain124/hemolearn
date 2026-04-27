import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BLOOD_GROUPS, COMPAT, FACTS, askClaude } from "../Data";

export default function CompatLab() {
  const [patient, setPatient] = useState(null);
  const [donor,   setDonor]   = useState(null);
  const [aiTxt,   setAiTxt]   = useState("");
  const [aiLoad,  setAiLoad]  = useState(false);
  const [msgs,    setMsgs]    = useState([{ r:"a", t:"SYSTEM ONLINE. I am HemoLearn AI — your blood science tutor. Select blood groups to analyze compatibility, or ask me anything about hematology, antigens, transfusion reactions, blood genetics..." }]);
  const [cin,     setCin]     = useState("");
  const [cload,   setCload]   = useState(false);
  const endRef    = useRef(null);
  const resultRef = useRef(null);
  const pageRef   = useRef(null);

  const compat = patient && donor ? COMPAT[patient].recv.includes(donor) : null;

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:.5, ease:"power3.out" });
  }, []);

  useEffect(() => {
    if (resultRef.current && compat !== null) {
      gsap.fromTo(resultRef.current, { opacity:0, scaleY:.8 }, { opacity:1, scaleY:1, duration:.35, ease:"back.out(1.5)", transformOrigin:"top" });
    }
  }, [compat, patient, donor]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, cload]);

  async function explain() {
    if (!patient || !donor || aiLoad) return;
    setAiLoad(true); setAiTxt("");
    const t = await askClaude(
      [{ role:"user", content:`Patient: ${patient}, Donor: ${donor}. Compatible? Explain ABO antigens, Rh factor, antibodies present, and cellular-level consequences. Make it engaging for a biology student. 3 paragraphs max.` }],
      "You are HemoLearn AI — expert hematology educator. Make blood science fascinating. Use analogies. Be precise and educational."
    );
    setAiTxt(t); setAiLoad(false);
  }

  async function sendChat() {
    if (!cin.trim() || cload) return;
    const q = cin.trim(); setCin("");
    setMsgs(m => [...m, { r:"u", t:q }]); setCload(true);
    const ctx = patient ? `Context: Patient=${patient}${donor?", Donor="+donor:""}.` : "";
    const t = await askClaude([{ role:"user", content:`${ctx} Student: ${q}` }],
      "You are HemoLearn AI. Answer blood science questions in ≤110 words. Be precise and educational.");
    setMsgs(m => [...m, { r:"a", t }]); setCload(false);
  }

  return (
    <div className="page" ref={pageRef} style={{opacity:0}}>
      <div className="pg-head">
        <div className="pg-title">
          <span className="td">SYS://</span>
          <span className="tb">COMPAT</span>
          <span className="td">_</span>
          <span className="tc">LAB</span>
        </div>
        <div className="pg-sub">SELECT BLOOD GROUPS → ANALYZE COMPATIBILITY → AI-POWERED IMMUNOLOGY EXPLANATION</div>
      </div>

      <div className="lab-grid">
        {/* Left panel */}
        <div className="panel" style={{padding:"1.4rem"}}>
          <div className="slbl">Patient Blood Group</div>
          <div className="bg-grid">
            {BLOOD_GROUPS.map(g => (
              <button key={g} className={`bgb${patient===g?" on":""}`} onClick={() => setPatient(g===patient?null:g)}>{g}</button>
            ))}
          </div>

          <div className="slbl" style={{marginTop:"1.2rem"}}>Donor Blood Group</div>
          <div className="bg-grid">
            {BLOOD_GROUPS.map(g => (
              <button key={g} className={`bgb${donor===g?" on":""}`} onClick={() => setDonor(g===donor?null:g)}>{g}</button>
            ))}
          </div>

          {compat !== null && (
            <div ref={resultRef} className={`result-strip ${compat?"ok":"no"}`}>
              <div>
                <div className={`rv ${compat?"ok":"no"}`}>{compat ? "▲ COMPATIBLE" : "■ INCOMPATIBLE"}</div>
                <div className="rd">{patient} PATIENT ← {donor} DONOR &nbsp;·&nbsp; {compat ? "SAFE TO TRANSFUSE" : "IMMUNE REACTION RISK"}</div>
              </div>
            </div>
          )}

          {patient && (
            <div className="fact-bar">
              <strong>▸ {patient}</strong> — {FACTS[patient]}
            </div>
          )}

          {patient && (
            <>
              <div className="slbl" style={{marginTop:"1rem"}}>Can receive from</div>
              <div className="chips">{COMPAT[patient].recv.map(g => <span key={g} className="chip g">{g}</span>)}</div>
              <div className="slbl" style={{marginTop:".75rem"}}>Can donate to</div>
              <div className="chips">{COMPAT[patient].give.map(g => <span key={g} className="chip b">{g}</span>)}</div>
            </>
          )}

          <button className="xbtn" onClick={explain} disabled={!patient||!donor||aiLoad}>
            {aiLoad ? "// ANALYZING..." : "// EXPLAIN IMMUNOLOGY WITH AI"}
          </button>

          {(aiTxt || aiLoad) && (
            <div className="ai-panel">
              <div className="ai-head"><div className="ai-pulse"/><span className="ai-lbl">HEMOLEARN AI · <span className="ac">IMMUNOLOGY MODULE</span></span></div>
              <div className={`ai-body${aiLoad?" loading":""}`}>{aiLoad ? "SCANNING ANTIGEN-ANTIBODY INTERACTIONS..." : aiTxt}</div>
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div className="panel" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div className="panel-head">
            <div className="ph-dot"/>
            <div className="ph-lbl">AI TUTOR · <span className="ac">HEMOLEARN.AI</span></div>
          </div>
          <div className="chat-msgs">
            {msgs.map((m,i) => <div key={i} className={`msg ${m.r}`}>{m.t}</div>)}
            {cload && <div className="msg a" style={{color:"var(--t3)",fontStyle:"italic",fontSize:".72rem"}}>PROCESSING...</div>}
            <div ref={endRef}/>
          </div>
          <div className="chat-foot">
            <input className="chat-inp" placeholder="ASK ABOUT BLOOD SCIENCE, GENETICS, ANTIGENS..."
              value={cin} onChange={e=>setCin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
            <button className="chat-send" onClick={sendChat} disabled={cload||!cin.trim()}>SEND ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}
