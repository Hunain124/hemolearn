import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero({ onStart }) {
  const eyeRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const btnsRef = useRef(null);
  const kpisRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(eyeRef.current,   { opacity:0, y:24 }, { opacity:1, y:0, duration:.7 })
      .fromTo(titleRef.current, { opacity:0, y:40 }, { opacity:1, y:0, duration:.8 }, "-=.4")
      .fromTo(subRef.current,   { opacity:0, y:20 }, { opacity:1, y:0, duration:.6 }, "-=.4")
      .fromTo(btnsRef.current,  { opacity:0, y:16 }, { opacity:1, y:0, duration:.5 }, "-=.35")
      .fromTo(kpisRef.current,  { opacity:0, y:16 }, { opacity:1, y:0, duration:.5 }, "-=.3");

    // Counter animation
    const counters = [
      { id:"kpi-1", target:8,   suffix:"" },
      { id:"kpi-2", target:118, suffix:"M" },
      { id:"kpi-3", target:30,  suffix:"" },
      { id:"kpi-4", target:88,  suffix:"%" },
    ];
    setTimeout(() => {
      counters.forEach(({ id, target, suffix }) => {
        const el = document.getElementById(id); if (!el) return;
        const dur = 1.5, steps = 90;
        let frame = 0;
        const t = setInterval(() => {
          frame++;
          el.textContent = Math.round((frame/steps)*target) + suffix;
          if (frame >= steps) { el.textContent = target+suffix; clearInterval(t); }
        }, (dur*1000)/steps);
      });
    }, 700);
  }, []);

  return (
    <div className="hero">
      <div className="hero-inner">
        <div ref={eyeRef} className="eyebrow" style={{opacity:0}}>
          <div className="eyebrow-dot" />
          AI × STEM EDUCATION · DSH HACKS V1 · KARACHI ORIGIN
        </div>

        <div ref={titleRef} className="h-title" style={{opacity:0}}>
          <span className="l1">LEARN</span>
          <span className="l2">BLOOD</span>
          <span className="l3">SCIENCE</span>
        </div>

        <p ref={subRef} className="h-sub" style={{opacity:0}}>
          From immunology to emergency medicine —{" "}
          <strong>AI-powered STEM education</strong> built on real clinical data
          from Karachi and 30 countries worldwide.
        </p>

        <div ref={btnsRef} className="h-btns" style={{opacity:0}}>
          <button className="btn-blood" onClick={() => onStart("lab")}>[ ENTER LAB ]</button>
          <button className="btn-cy" onClick={() => onStart("crisis")}>[ VIEW CRISIS DATA ]</button>
        </div>

        <div ref={kpisRef} className="h-kpis" style={{opacity:0}}>
          <div className="kpi"><div className="kpi-n blood" id="kpi-1">0</div><div className="kpi-l">Blood Groups</div></div>
          <div className="kpi"><div className="kpi-n cy" id="kpi-2">0</div><div className="kpi-l">Units Needed / Year</div></div>
          <div className="kpi"><div className="kpi-n dim" id="kpi-3">0</div><div className="kpi-l">Countries Tracked</div></div>
          <div className="kpi"><div className="kpi-n blood" id="kpi-4">0%</div><div className="kpi-l">Pakistan Shortage</div></div>
        </div>
      </div>
    </div>
  );
}
