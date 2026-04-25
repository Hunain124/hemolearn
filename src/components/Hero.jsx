export default function Hero({ onStart }) {
  return (
    <div className="hero">
      <div className="hero-eyebrow"><div className="pulse-dot"/>AI × STEM Education · DSH Hacks V1</div>
      <h1 className="hero-h1">
        <span className="dim">LEARN</span><br/>
        <span className="grad">BLOOD</span><br/>
        <span className="dim">SCIENCE</span>
      </h1>
      <p className="hero-sub">
        From immunology to emergency medicine — AI-powered STEM education built on{" "}
        <strong>real clinical data</strong> from Karachi and around the world.
      </p>
      <div className="hero-cta-row">
        <button className="btn-primary" onClick={()=>onStart("lab")}>Start Learning →</button>
        <button className="btn-secondary" onClick={()=>onStart("crisis")}>View Crisis Data</button>
      </div>
      <div className="hero-stats">
        <div className="hero-stat"><div className="stat-n red">8</div><div className="stat-l">Blood Groups</div></div>
        <div className="hero-stat"><div className="stat-n orange">118M</div><div className="stat-l">Units Needed/yr</div></div>
        <div className="hero-stat"><div className="stat-n green">8</div><div className="stat-l">Clinical Cases</div></div>
        <div className="hero-stat"><div className="stat-n red">88%</div><div className="stat-l">Pakistan Shortage</div></div>
      </div>
    </div>
  );
}