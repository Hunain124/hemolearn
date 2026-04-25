import { useState } from "react";
import { CASES } from "../Data"; // Ek dot mazeed lagao (..)

export default function CaseSim() {
  const [idx, setIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleAnswer = (ans) => {
    setSelected(ans);
    setShowResult(true);
  };

  const nextCase = () => {
    setIdx((idx + 1) % CASES.length);
    setShowResult(false);
    setSelected(null);
  };

  return (
    <div className="case-container animate-fade">
      <div className="case-card">
        <div className="case-meta">Case Study #{idx + 1}</div>
        <h2>{CASES[idx].title}</h2>
        <p className="case-desc">{CASES[idx].desc}</p>

        <div className="options-grid">
          {CASES[idx].opts.map(opt => (
            <button 
              key={opt} 
              disabled={showResult}
              className={`opt-btn ${showResult && opt === CASES[idx].ans ? 'correct' : ''} ${selected === opt && opt !== CASES[idx].ans ? 'wrong' : ''}`}
              onClick={() => handleAnswer(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="explanation animate-slide-up">
            <strong>{selected === CASES[idx].ans ? "Correct!" : "Not quite."}</strong>
            <p>{CASES[idx].explain}</p>
            <button className="btn-next" onClick={nextCase}>Next Case →</button>
          </div>
        )}
      </div>
    </div>
  );
}