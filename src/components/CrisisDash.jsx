import { useState } from "react";
import { CRISIS_DATA } from "../Data";

export default function CrisisDash() {
  const [active, setActive] = useState(0);
  const c = CRISIS_DATA[active];

  return (
    <div className="crisis-container animate-fade">
      <h2 className="section-title">Global Shortage Monitor</h2>
      <div className="crisis-layout">
        <div className="country-list">
          {CRISIS_DATA.map((item, i) => (
            <button key={item.country} className={`country-item ${active===i?'active':''}`} onClick={()=>setActive(i)}>
              {item.flag} {item.country} <span className="gap">{item.shortage}% gap</span>
            </button>
          ))}
        </div>
        <div className="data-viz">
          <h3>{c.country} vs Global Needs</h3>
          <div className="stat-row">
            <span>Needed: {c.needed}M units</span>
            <div className="progress-bg"><div className="progress-fill red" style={{width: '100%'}}></div></div>
          </div>
          <div className="stat-row">
            <span>Collected: {c.have}M units</span>
            <div className="progress-bg"><div className="progress-fill green" style={{width: `${(c.have/c.needed)*100}%`}}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}