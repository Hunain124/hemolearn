import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BLOOD_GROUPS, COMPAT, BG_FACTS, askClaude } from "../Data";

export default function CompatLab() {
  const [patient, setPatient] = useState(null);
  const [donor, setDonor] = useState(null);
  const [aiTxt, setAiTxt] = useState(""); const [aiLoad, setAiLoad] = useState(false);
  const [msgs, setMsgs] = useState([{ r:"a", t:"👋 Hi! I'm your AI blood science tutor. Select blood groups above, or ask me anything — antigens, Rh factor, transfusion reactions, blood genetics..." }]);
  const [cin, setCin] = useState(""); const [cload, setCload] = useState(false);
  const endRef = useRef(null);
  const resultRef = useRef(null);
  const pageRef = useRef(null);

  const compat = patient && donor ? COMPAT[patient].recv.includes(donor) : null;

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:.6, ease:"power3.out" });
  }, []);

  useEffect(() => {
    if (resultRef.current && compat !== null) {
      gsap.fromTo(resultRef.current, { opacity:0, scale:.96, y:8 }, { opacity:1, scale:1, y:0, duration:.4, ease:"back.out(1.4)" });
    }
  }, [compat]);

  async function explain() {
    if (!patient || !donor || aiLoad) return;
    setAiLoad(true); setAiTxt("");
    const t = await askClaude(
      [{ role:"user", content:`Patient: ${patient}, Donor: ${donor}. Compatible? Explain ABO antigens, Rh factor, antibodies, and cellular consequences. Engaging for a biology student. 3 paragraphs max.` }],
      "You are HemoLearn AI — expert hematology educator. Make blood science fascinating. Use analogies. Be concise but complete."
    );
    setAiTxt(t); setAiLoad(false);
  }

  async function sendChat() {
    if (!cin.trim() || cload) return;
    const q = cin.trim(); setCin("");
    setMsgs(m => [...m, { r:"u", t:q }]); setCload(true);
    const ctx2 = patient ? `Context: Patient=${patient}${donor?", Donor="+donor:""}.` : "";
    const t = await askClaude([{ role:"user", content:`${ctx2} Student: ${q}` }],
      "You are HemoLearn AI. Answer blood science questions in ≤110 words. Friendly, clear, 1 emoji max.");
    setMsgs(m => [...m, { r:"a", t }]); setCload(false);
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, cload]);

  return (
    <div className="page" ref={pageRef} style={{ opacity:0 }}>
      <div className="page-head">
        <div className="page-title">🧬 <span className="ac">Compatibility</span> Lab</div>
        <div className="page-desc">Select blood groups to visualize compatibility and get AI-powered immunology explanations in real time.</div>
      </div>
      <div className="lab-layout">
        <div>
          <div className="glass glow" style={{ padding:"1.5rem", marginBottom:"1.25rem" }}>
            <div className="lbl">Patient Blood Group</div>
            <div className="bgs">
              {BLOOD_GROUPS.map(g => (
                <button key={g} className={`bgb${patient===g?" on":""}`} onClick={() => setPatient(g===patient?null:g)}>
                  <span>{g}</span>
                </button>
              ))}
            </div>
            <div className="lbl" style={{ marginTop:"1.25rem" }}>Donor Blood Group</div>
            <div className="bgs">
              {BLOOD_GROUPS.map(g => (
                <button key={g} className={`bgb${donor===g?" on":""}`} onClick={() => setDonor(g===donor?null:g)}>
                  <span>{g}</span>
                </button>
              ))}
            </div>

            {compat !== null && (
              <div ref={resultRef} className={`rbanner ${compat?"ok":"no"}`}>
                <div style={{ fontSize:"1.8rem" }}>{compat ? "🩸" : "⚠️"}</div>
                <div>
                  <div className={`rv ${compat?"ok":"no"}`}>{compat ? "COMPATIBLE" : "INCOMPATIBLE"}</div>
                  <div className="rd">{patient} patient ← {donor} donor &nbsp;·&nbsp; {compat ? "Safe to transfuse" : "Transfusion reaction risk"}</div>
                </div>
              </div>
            )}

            {patient && <div className="fact"><strong>💡 </strong>{BG_FACTS[patient]}</div>}

            {patient && (<>
              <div className="lbl" style={{ marginTop:"1rem" }}>Can receive from</div>
              <div className="chips">{COMPAT[patient].recv.map(g => <span key={g} className="chip g">{g}</span>)}</div>
              <div className="lbl" style={{ marginTop:".75rem" }}>Can donate to</div>
              <div className="chips">{COMPAT[patient].give.map(g => <span key={g} className="chip o">{g}</span>)}</div>
            </>)}

            <button className="xbtn" onClick={explain} disabled={!patient||!donor||aiLoad}>
              {aiLoad ? "🔬 Analyzing immunology..." : "🧠 Explain the Science with AI →"}
            </button>

            {(aiTxt||aiLoad) && (
              <div className="aip" style={{ marginTop:"1rem" }}>
                <div className="aih"><div className="ald"/><span className="all">HemoLearn AI · Immunology</span></div>
                <div className="aib">{aiLoad ? "Analyzing cellular interactions..." : aiTxt}</div>
              </div>
            )}
          </div>
        </div>

        <div className="glass glow" style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"1rem 1.25rem", borderBottom:"1px solid var(--bdr)" }}>
            <div className="lbl" style={{ margin:0 }}>AI Blood Science Tutor</div>
          </div>
          <div className="cmsgs">
            {msgs.map((m,i) => <div key={i} className={`cm ${m.r}`}>{m.t}</div>)}
            {cload && <div className="cm a" style={{ fontStyle:"italic", color:"var(--t3)" }}>Thinking...</div>}
            <div ref={endRef}/>
          </div>
          <div className="cfoot">
            <input className="ci" placeholder="Ask about blood types, genetics, reactions..."
              value={cin} onChange={e=>setCin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
            <button className="csend" onClick={sendChat} disabled={cload||!cin.trim()}>Send →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
