import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero({ onStart }) {
  const eyebrow = useRef(null);
  const h1 = useRef(null);
  const sub = useRef(null);
  const btns = useRef(null);
  const stats = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(eyebrow.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8 })
      .fromTo(h1.current,      { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .9 }, "-=.5")
      .fromTo(sub.current,     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, "-=.5")
      .fromTo(btns.current,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, "-=.4")
      .fromTo(stats.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, "-=.35");
  }, []);

  return (
    <div className="hero">
      <div className="hero-content">
        <div ref={eyebrow} className="hero-eyebrow" style={{ opacity: 0 }}>
          <div className="pulse-dot" />
          AI × STEM Education · DSH Hacks V1
        </div>
        <h1 ref={h1} className="hero-h1" style={{ opacity: 0 }}>
          <span className="dim">LEARN</span><br />
          <span className="grad">BLOOD</span><br />
          <span className="dim">SCIENCE</span>
        </h1>
        <p ref={sub} className="hero-sub" style={{ opacity: 0 }}>
          From immunology to emergency medicine —{" "}
          <strong>AI-powered STEM education</strong> built on real clinical data
          from Karachi and 30 countries worldwide.
        </p>
        <div ref={btns} className="hero-cta-row" style={{ opacity: 0 }}>
          <button className="btn-primary" onClick={() => onStart("lab")}>Start Learning →</button>
          <button className="btn-secondary" onClick={() => onStart("crisis")}>View Crisis Data</button>
        </div>
        <div ref={stats} className="hero-stats" style={{ opacity: 0 }}>
          <div className="hero-stat"><div className="stat-n red">8</div><div className="stat-l">Blood Groups</div></div>
          <div className="hero-stat"><div className="stat-n orange">118M</div><div className="stat-l">Units Needed/yr</div></div>
          <div className="hero-stat"><div className="stat-n green">30</div><div className="stat-l">Countries Tracked</div></div>
          <div className="hero-stat"><div className="stat-n red">88%</div><div className="stat-l">Pakistan Shortage</div></div>
        </div>
      </div>
    </div>
  );
}
