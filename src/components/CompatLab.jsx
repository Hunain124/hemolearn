import { useState, useEffect } from "react";
import { BLOOD_GROUPS, COMPAT, BG_FACTS } from "../Data";

export default function CompatLab() {
  const [patient, setPatient] = useState(null);
  const [donor, setDonor] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (patient && donor) {
      const ok = COMPAT[patient].recv.includes(donor);
      setResult(ok ? "SAFE" : "DANGER");
    } else {
      setResult(null);
    }
  }, [patient, donor]);

  return (
    <div className="lab-container animate-fade">
      <h2 className="section-title">Blood Compatibility Lab</h2>
      <div className="lab-grid">
        <div className="lab-box">
          <label>Recipient (Patient)</label>
          <div className="bg-grid">
            {BLOOD_GROUPS.map(g => (
              <button key={g} className={`bg-btn ${patient===g?'active':''}`} onClick={()=>setPatient(g)}>{g}</button>
            ))}
          </div>
        </div>
        <div className="lab-box">
          <label>Donor</label>
          <div className="bg-grid">
            {BLOOD_GROUPS.map(g => (
              <button key={g} className={`bg-btn ${donor===g?'active':''}`} onClick={()=>setDonor(g)}>{g}</button>
            ))}
          </div>
        </div>
      </div>
      {result && (
        <div className={`result-card ${result}`}>
          <h3>{result === "SAFE" ? "✓ Transfusion Safe" : "⚠ Immune Reaction"}</h3>
          <p>{result === "SAFE" ? `${donor} can safely donate to ${patient}.` : `Incompatible! ${patient}'s antibodies will attack ${donor} cells.`}</p>
        </div>
      )}
      {patient && <div className="fact-box"><strong>Fact:</strong> {BG_FACTS[patient]}</div>}
    </div>
  );
}