import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CASES, askClaude } from "../Data";

export default function CaseSim() {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loadFb, setLoadFb] = useState(false);
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  const c = CASES[idx];
  const isDone = idx in answered;
  const correct = Object.entries(answered).filter(([i,v]) => v === CASES[+i].ans).length;
  const dc = c.diff === "Beginner" ? "b" : c.diff === "Intermediate" ? "i" : "a";

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:.6, ease:"power3.out" });
  }, []);

  function animCard() {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { opacity:0, x:20 }, { opacity:1, x:0, duration:.4, ease:"power3.out" });
    }
  }

  async function choose(opt) {
    if (isDone) return;
    setAnswered(a => ({ ...a, [idx]:opt }));
    setLoadFb(true);
    const ok = opt === c.ans;
    const fb = await askClaude(
      [{ role:"user", content:`Case: "${c.q}" Chosen: "${c.opts[opt]}". Correct: "${c.opts[c.ans]}". ${ok?"CORRECT":"WRONG"}. Teach "${c.tag}" in 60 words. Be warm & educational.` }],
      "You are HemoLearn AI clinical educator. Concise, encouraging feedback."
    );
    setFeedback(f => ({ ...f, [idx]:fb }));
    setLoadFb(false);
  }

  function goTo(i) { setIdx(i); animCard(); }

  return (
    <div className="page" ref={pageRef} style={{ opacity:0 }}>
      <div className="page-head">
        <div className="page-title">🏥 Clinical <span className="ac">Cases</span></div>
        <div className="page-desc">8 real emergency scenarios. Learn medical decision-making used in hospitals worldwide.</div>
      </div>
      <div className="case-layout">
        <div className="glass glow" style={{ padding:"1.75rem" }} ref={cardRef}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.25rem", flexWrap:"wrap" }}>
            <span className={`dbadge ${dc}`}>{c.diff}</span>
            <span style={{ fontFamily:"var(--mono)", fontSize:".68rem", color:"var(--t3)" }}>// {c.tag}</span>
            <span style={{ marginLeft:"auto", fontFamily:"var(--mono)", fontSize:".7rem", color:"var(--t3)" }}>Case {idx+1}/{CASES.length}</span>
          </div>
          <div className="cq">{c.q}</div>
          <div>
            {c.opts.map((opt,i) => {
              let cls = "obtn";
              if (isDone) {
                if (i === c.ans) cls += " correct";
                else if (i === answered[idx] && i !== c.ans) cls += " wrong";
              }
              return (
                <button key={i} className={cls} onClick={() => choose(i)} disabled={isDone}>
                  <span className="okey">{String.fromCharCode(65+i)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
          {isDone && <div className="expl"><strong>📚 Explanation: </strong>{c.explain}</div>}
          <div className="cfoot2">
            <button className="cnbtn" onClick={() => goTo(idx-1)} disabled={idx===0}>← Prev</button>
            <div className="spill">Score: <strong>{correct}</strong>/{CASES.length}</div>
            <button className="cnbtn" onClick={() => goTo(idx+1)} disabled={idx===CASES.length-1||!isDone}>Next →</button>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          <div className="glass glow" style={{ overflow:"hidden" }}>
            <div className="aih" style={{ padding:"1rem 1.25rem" }}><div className="ald"/><span className="all">AI Clinical Feedback</span></div>
            <div style={{ padding:"1.1rem 1.25rem", fontSize:".85rem", lineHeight:1.75, color:"var(--t2)", minHeight:"110px" }}>
              {!isDone && <span style={{ color:"var(--t3)", fontStyle:"italic" }}>Choose an answer to get personalized AI feedback...</span>}
              {loadFb && <span style={{ fontStyle:"italic" }}>Generating feedback...</span>}
              {!loadFb && feedback[idx]}
            </div>
          </div>

          <div className="glass glow" style={{ padding:"1.25rem" }}>
            <div className="lbl">Progress</div>
            <div className="pdots">
              {CASES.map((_,i) => {
                let cls = "pd";
                if (i===idx) cls += " cur";
                else if (i in answered) cls += answered[i]===CASES[i].ans?" done":" wd";
                return <div key={i} className={cls} onClick={() => goTo(i)} title={`Case ${i+1}`}/>;
              })}
            </div>
            <div style={{ display:"flex", gap:"1.5rem", marginTop:"1rem" }}>
              {[["✓",correct,"var(--g)","Correct"],["✗",Object.keys(answered).length-correct,"var(--r)","Wrong"],["○",CASES.length-Object.keys(answered).length,"var(--t3)","Left"]].map(([sym,val,col,lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily:"var(--disp)", fontSize:"1.8rem", color:col }}>{val}</div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:".65rem", color:"var(--t3)", textTransform:"uppercase", letterSpacing:"1px" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass glow" style={{ padding:"1.25rem" }}>
            <div className="lbl">Topics</div>
            <div className="chips">
              {CASES.map((cas,i) => (
                <span key={i}
                  className={`chip ${i in answered?(answered[i]===cas.ans?"g":"r"):"b"}`}
                  style={{ opacity: i in answered?1:.4, cursor:"pointer" }}
                  onClick={() => goTo(i)}>
                  {cas.tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
