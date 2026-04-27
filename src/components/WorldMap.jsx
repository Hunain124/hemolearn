import { useEffect, useRef, useCallback } from "react";
import { CRISIS } from "../Data";

const barColor = s => s>70?"#c0392b":s>40?"#e67e22":s>15?"#f1c40f":"#00d68f";

export default function WorldMap({ selected, onSelect }) {
  const canvasRef  = useRef(null);
  const tipRef     = useRef(null);
  const stateRef   = useRef({ dots:[], phase:0, hovered:null });

  const project = useCallback((lat, lng, W, H) => ({
    x: (lng+180)/360*W,
    y: (90-lat)/180*H,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      stateRef.current.dots = CRISIS.map(d => {
        const {x,y} = project(d.lat, d.lng, W, H);
        return { ...d, px:x, py:y, scale:1 };
      });
    }

    function drawGrid() {
      ctx.save();
      for (let lat=-60; lat<=60; lat+=30) {
        const {y} = project(lat,0,W,H);
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y);
        ctx.strokeStyle = lat===0 ? "rgba(0,255,240,0.07)" : "rgba(0,255,240,0.025)";
        ctx.lineWidth = lat===0 ? 1 : .5; ctx.stroke();
      }
      for (let lng=-120; lng<=180; lng+=60) {
        const {x} = project(0,lng,W,H);
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H);
        ctx.strokeStyle="rgba(0,255,240,0.02)"; ctx.lineWidth=.5; ctx.stroke();
      }
      ctx.restore();
    }

    function drawDots() {
      const { dots, phase, hovered } = stateRef.current;
      dots.forEach((d, i) => {
        const isSel = selected === d.c;
        const isHov = hovered === i;
        d.scale += ((isSel||isHov ? 1.8 : 1) - d.scale) * .1;
        const col = barColor(d.s);
        const r = (3.5 + d.s/18) * d.scale;

        if (isSel || isHov) {
          [r+5, r+10].forEach((rr, ri) => {
            ctx.beginPath(); ctx.arc(d.px, d.py, rr+Math.sin(phase*3+i)*(ri+1)*2, 0, Math.PI*2);
            ctx.strokeStyle = col+(ri===0?"55":"22"); ctx.lineWidth=1.2; ctx.stroke();
          });
        }

        const g = ctx.createRadialGradient(d.px,d.py,0,d.px,d.py,r*3);
        g.addColorStop(0,col+"55"); g.addColorStop(1,col+"00");
        ctx.beginPath(); ctx.arc(d.px,d.py,r*3,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();

        ctx.beginPath(); ctx.arc(d.px,d.py,r,0,Math.PI*2);
        const cg = ctx.createRadialGradient(d.px-r*.3,d.py-r*.3,0,d.px,d.py,r);
        cg.addColorStop(0,col+"ff"); cg.addColorStop(1,col+"bb");
        ctx.fillStyle=cg; ctx.fill();

        if (isSel || isHov) {
          ctx.save();
          ctx.fillStyle="rgba(255,255,255,.9)";
          ctx.font=`bold ${Math.max(9,10*d.scale*.75)}px Rajdhani,sans-serif`;
          ctx.textAlign="center"; ctx.shadowColor="rgba(0,0,0,.9)"; ctx.shadowBlur=6;
          ctx.fillText(d.c, d.px, d.py-r-7);
          ctx.restore();
        }
      });
    }

    function loop() {
      stateRef.current.phase += .015;
      ctx.clearRect(0,0,W,H);
      drawGrid(); drawDots();
      raf = requestAnimationFrame(loop);
    }

    function hitTest(mx, my) {
      const { dots } = stateRef.current;
      for (let i=dots.length-1; i>=0; i--) {
        const d = dots[i];
        if (Math.hypot(mx-d.px, my-d.py) < (4+d.s/14)*2) return i;
      }
      return null;
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const sx = W/rect.width, sy = H/rect.height;
      const mx = (e.clientX-rect.left)*sx, my = (e.clientY-rect.top)*sy;
      const hit = hitTest(mx, my);
      stateRef.current.hovered = hit;
      canvas.style.cursor = hit!==null ? "pointer" : "default";
      const tip = tipRef.current; if (!tip) return;
      if (hit !== null) {
        const d = CRISIS[hit];
        tip.style.opacity="1";
        tip.style.left = (e.clientX-canvas.getBoundingClientRect().left+16)+"px";
        tip.style.top  = (e.clientY-canvas.getBoundingClientRect().top-20)+"px";
        tip.innerHTML  = `
          <div class="map-tip-name">${d.f} ${d.c}</div>
          <div class="map-tip-row"><div class="tip-dot" style="background:${barColor(d.s)}"></div>${d.s}% shortage</div>
          <div class="map-tip-row">Needs ${d.need}M · Has ${d.have}M units/yr</div>`;
      } else { tip.style.opacity="0"; }
    }

    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX-rect.left)*(W/rect.width);
      const my = (e.clientY-rect.top)*(H/rect.height);
      const hit = hitTest(mx, my);
      if (hit !== null) onSelect(CRISIS[hit].c);
    }

    resize(); loop();
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);
    const ro = new ResizeObserver(() => resize()); ro.observe(canvas.parentElement);
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener("mousemove",onMouseMove); canvas.removeEventListener("click",onClick); ro.disconnect(); };
  }, [selected, project, onSelect]);

  return (
    <div className="map-wrap">
      <canvas ref={canvasRef}/>
      <div ref={tipRef} className="map-tip"/>
      <div className="map-legend">
        {[["Critical >70%","#c0392b"],["High 40-70%","#e67e22"],["Moderate","#f1c40f"],["Low <15%","#00d68f"]].map(([l,c])=>(
          <div key={l} className="leg-row"><div className="leg-dot" style={{background:c}}/>{l}</div>
        ))}
      </div>
    </div>
  );
}
