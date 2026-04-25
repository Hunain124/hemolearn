import { useEffect, useRef, useCallback } from "react";
import { CRISIS_DATA } from "../Data";

const barColor = s => s > 70 ? "#d62828" : s > 40 ? "#f77f00" : s > 15 ? "#ffd166" : "#06d6a0";

export default function WorldMap({ selected, onSelect }) {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const state = useRef({ dots:[], phase:0, hovered:null });

  const project = useCallback((lat, lng, W, H) => ({
    x: (lng + 180) / 360 * W,
    y: (90 - lat) / 180 * H,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      state.current.dots = CRISIS_DATA.map(d => {
        const { x, y } = project(d.lat, d.lng, W, H);
        return { ...d, px: x, py: y, scale: 1 };
      });
    }

    function drawGrid() {
      ctx.save();
      // Lat lines
      for (let lat = -60; lat <= 60; lat += 30) {
        const { y } = project(lat, 0, W, H);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = lat === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.035)";
        ctx.lineWidth = lat === 0 ? 1.2 : .6; ctx.stroke();
      }
      // Lng lines
      for (let lng = -120; lng <= 180; lng += 60) {
        const { x } = project(0, lng, W, H);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = .6; ctx.stroke();
      }
      // Label axes
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.font = `${Math.max(9, W*0.01)}px 'JetBrains Mono', monospace`;
      ctx.textAlign = "left";
      const labels = [["Americas",-100,20],["Europe/Africa",10,30],["Asia/Oceania",90,20]];
      labels.forEach(([l,lng,lat]) => {
        const {x,y} = project(lat,lng,W,H);
        ctx.fillText(l,x,y);
      });
      ctx.restore();
    }

    function drawDots() {
      const { dots, phase, hovered } = state.current;
      dots.forEach((d, i) => {
        const isSel = selected === d.country;
        const isHov = hovered === i;
        d.scale += ((isSel||isHov ? 1.65 : 1) - d.scale) * .1;
        const col = barColor(d.shortage);
        const r = (4 + d.shortage / 16) * d.scale;

        // Ripple for selected/hovered
        if (isSel || isHov) {
          const ripR = r + 5 + Math.sin(phase * 3 + i) * 4;
          ctx.beginPath(); ctx.arc(d.px, d.py, ripR, 0, Math.PI * 2);
          ctx.strokeStyle = col + "60"; ctx.lineWidth = 1.5; ctx.stroke();
          // Second ripple
          const ripR2 = r + 10 + Math.sin(phase * 2 + i * .5) * 6;
          ctx.beginPath(); ctx.arc(d.px, d.py, ripR2, 0, Math.PI * 2);
          ctx.strokeStyle = col + "25"; ctx.lineWidth = 1; ctx.stroke();
        }

        // Glow halo
        const grd = ctx.createRadialGradient(d.px, d.py, 0, d.px, d.py, r * 3);
        grd.addColorStop(0, col + "55");
        grd.addColorStop(1, col + "00");
        ctx.beginPath(); ctx.arc(d.px, d.py, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();

        // Core
        ctx.beginPath(); ctx.arc(d.px, d.py, r, 0, Math.PI * 2);
        const cg = ctx.createRadialGradient(d.px - r*.3, d.py - r*.3, 0, d.px, d.py, r);
        cg.addColorStop(0, col + "ff");
        cg.addColorStop(1, col + "aa");
        ctx.fillStyle = cg; ctx.fill();

        // Country name for sel/hov
        if (isSel || isHov) {
          ctx.save();
          ctx.fillStyle = "rgba(255,255,255,0.92)";
          ctx.font = `bold ${Math.max(10, 11 * d.scale * .8)}px 'Outfit', sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 6;
          ctx.fillText(d.country, d.px, d.py - r - 7);
          ctx.restore();
        }
      });
    }

    function loop() {
      state.current.phase += .016;
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawDots();
      raf = requestAnimationFrame(loop);
    }

    function hitTest(mx, my) {
      const { dots } = state.current;
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        if (Math.hypot(mx - d.px, my - d.py) < (5 + d.shortage/14) * 2) return i;
      }
      return null;
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const sx = W / rect.width, sy = H / rect.height;
      const mx = (e.clientX - rect.left) * sx;
      const my = (e.clientY - rect.top) * sy;
      const hit = hitTest(mx, my);
      state.current.hovered = hit;
      canvas.style.cursor = hit !== null ? "pointer" : "default";
      const tip = tooltipRef.current;
      if (hit !== null && tip) {
        const d = CRISIS_DATA[hit];
        tip.style.opacity = "1";
        tip.style.left = (e.clientX - canvas.getBoundingClientRect().left + 18) + "px";
        tip.style.top = (e.clientY - canvas.getBoundingClientRect().top - 24) + "px";
        tip.innerHTML = `
          <div style="font-weight:700;font-size:.88rem;margin-bottom:4px">${d.flag} ${d.country}</div>
          <div style="display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:.7rem;color:var(--t2)">
            <div style="width:8px;height:8px;border-radius:50%;background:${barColor(d.shortage)};flex-shrink:0"></div>
            ${d.shortage}% shortage
          </div>
          <div style="font-family:var(--mono);font-size:.7rem;color:var(--t3);margin-top:2px">
            Needs ${d.needed}M · Has ${d.have}M units/yr
          </div>`;
      } else if (tip) { tip.style.opacity = "0"; }
    }

    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      const hit = hitTest(mx, my);
      if (hit !== null) onSelect(CRISIS_DATA[hit].country);
    }

    resize(); loop();
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);
    const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement);
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener("mousemove",onMouseMove); canvas.removeEventListener("click",onClick); ro.disconnect(); };
  }, [selected, project, onSelect]);

  return (
    <div className="map-wrap">
      <canvas ref={canvasRef} className="world-canvas" />
      <div ref={tooltipRef} className="map-tooltip" />
      <div className="map-legend">
        {[["Critical >70%","#d62828"],["High 40-70%","#f77f00"],["Moderate","#ffd166"],["Low <15%","#06d6a0"]].map(([l,c]) => (
          <div key={l} className="ml-item"><div className="ml-dot" style={{ background:c }}/>{l}</div>
        ))}
      </div>
    </div>
  );
}
