import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CASES, askClaude } from "../Data";

export default function CaseSim() {
  const [idx,      setIdx]      = useState(0);
  const [answered, setAnswered] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loadFb,   setLoadFb]   = useState(false);
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity:0,y:20 }, { opacity:1,y:0,duration:.5,ease:"power3.out" });
  }, []);

  const c      = CASES[idx];
  const isDone = idx in answered;
  const correct = Object.entries(answered).filter(([i,v]) => v===CASES[+i].ans).length;
  const dc = c.diff==="Beginner"?"b":c.diff==="Intermediate"?"i":"a";

  async function choose(opt) {
    if (isDone) return;
    setAnswered(a => ({...a,[idx]:opt}));
    setLoadFb(true);
    const ok = opt===c.ans;
    const t = await askClaude(
      [{ role:"user", content:`Case: "${c.q}" Chosen: "${c.opts[opt]}". Correct: "${c.opts[c.ans]}". ${ok?"CORRECT":"WRONG"}. Teach "${c.tag}" in 65 words. Be warm & educational.` }],
      "You are HemoLearn AI clinical educator. Concise, encouraging, educational feedback."
    );
    setFeedback(f => ({...f,[idx]:t}));
    setLoadFb(false);
  }

  function navTo(i) {
    if (i<0||i>=CASES.length) return;
    setIdx(i);
    if (cardRef.current) gsap.fromTo(cardRef.current, { opacity:0,x:16 }, { opacity:1,x:0,duration:.35,ease:"power3.out" });
  }

  return (
    <div className="page" ref={pageRef} style={{opacity:0}}>
      <div className="pg-head">
        <div className="pg-title">
          <span className="td">SYS://</span><span className="tb">CLINICAL</span><span className="td">_</span><span className="tc">CASES</span>
        </div>
        <div className="pg-sub">8 REAL EMERGENCY SCENARIOS · LEARN THE DECISION-MAKING LOGIC THAT SAVES LIVES</div>
      </div>

      <div className="case-grid">
        {/* Case card */}
        <div className="panel" style={{padding:"1.75rem"}} ref={cardRef}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1.25rem",flexWrap:"wrap"}}>
            <span className={`diff-tag ${dc}`}>{c.diff}</span>
            <span style={{fontFamily:"var(--mono)",fontSize:".64rem",color:"var(--t3)",letterSpacing:"1px"}}>// {c.tag}</span>
            <span style={{marginLeft:"auto",fontFamily:"var(--mono)",fontSize:".68rem",color:"var(--t3)"}}>CASE {idx+1}/{CASES.length}</span>
          </div>

          <div className="case-q">{c.q}</div>

          <div>
            {c.opts.map((opt,i) => {
              let cls = "opt";
              if (isDone) { if(i===c.ans) cls+=" correct"; else if(i===answered[idx]&&i!==c.ans) cls+=" wrong"; }
              return (
                <button key={i} className={cls} onClick={()=>choose(i)} disabled={isDone}>
                  <span className="opt-key">{String.fromCharCode(65+i)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {isDone && (
            <div className="explanation">
              <strong>◈ CLINICAL EXPLANATION: </strong>{c.explain}
            </div>
          )}

          <div className="case-footer">
            <button className="case-nav-btn" onClick={()=>navTo(idx-1)} disabled={idx===0}>◀ PREV</button>
            <div className="score-display">SCORE: <strong>{correct}</strong>/{CASES.length}</div>
            <button className="case-nav-btn" onClick={()=>navTo(idx+1)} disabled={idx===CASES.length-1||!isDone}>NEXT ▶</button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div className="panel" style={{overflow:"hidden"}}>
            <div className="panel-head"><div className="ph-dot"/><div className="ph-lbl">AI CLINICAL FEEDBACK · <span className="ac">LIVE</span></div></div>
            <div style={{padding:"1.1rem 1.25rem",fontFamily:"var(--body)",fontSize:".84rem",lineHeight:1.75,color:"var(--t2)",minHeight:"110px"}}>
              {!isDone && <span style={{color:"var(--t3)",fontFamily:"var(--mono)",fontSize:".68rem",fontStyle:"italic"}}>AWAITING RESPONSE...</span>}
              {loadFb  && <span style={{color:"var(--t3)",fontFamily:"var(--mono)",fontSize:".68rem",fontStyle:"italic"}}>GENERATING FEEDBACK...</span>}
              {!loadFb && feedback[idx]}
            </div>
          </div>

          <div className="panel" style={{padding:"1.25rem"}}>
            <div className="slbl">Progress</div>
            <div className="prog-dots">
              {CASES.map((_,i) => {
                let cls="pdot";
                if(i===idx) cls+=" cur";
                else if(i in answered) cls+=answered[i]===CASES[i].ans?" done":" wd";
                return <div key={i} className={cls} onClick={()=>navTo(i)} title={`Case ${i+1}`}/>;
              })}
            </div>
            <div style={{display:"flex",gap:"1.5rem",marginTop:"1rem"}}>
              {[["✓",correct,"#00ff80","Correct"],["✗",Object.keys(answered).length-correct,"var(--blood3)","Wrong"],["○",CASES.length-Object.keys(answered).length,"var(--t3)","Left"]].map(([s,v,col,l])=>(
                <div key={l}>
                  <div style={{fontFamily:"var(--disp)",fontSize:"1.8rem",color:col}}>{v}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:".62rem",color:"var(--t3)",textTransform:"uppercase",letterSpacing:"1px"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{padding:"1.25rem"}}>
            <div className="slbl">Topics</div>
            <div className="chips">
              {CASES.map((cas,i) => (
                <span key={i} className={`chip ${i in answered?(answered[i]===cas.ans?"g":"b"):"c"}`}
                  style={{opacity:i in answered?1:.45}} onClick={()=>navTo(i)}>
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
