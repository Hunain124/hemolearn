import { useEffect, useRef, useCallback } from "react";
import { CRISIS } from "../Data";

// ── Colour by shortage severity ─────────────────────────────────
const dotColor = s =>
  s > 70 ? "#e74c3c" :
  s > 40 ? "#e67e22" :
  s > 15 ? "#f1c40f" : "#00d68f";

// ── Simplified continent fill polygons (equirectangular) ─────────
// Each polygon: array of [lng, lat] pairs
const CONTINENTS = [
  { name:"North America", color:"rgba(0,255,240,0.028)", pts:[[-168,72],[-52,72],[-52,15],[-92,15],[-80,8],[-168,8]] },
  { name:"South America", color:"rgba(0,255,240,0.025)", pts:[[-82,12],[-34,6],[-34,-56],[-76,-56],[-82,12]] },
  { name:"Europe",        color:"rgba(0,255,240,0.032)", pts:[[-10,71],[40,71],[40,35],[-10,35]] },
  { name:"Africa",        color:"rgba(200,30,30,0.055)", pts:[[-18,37],[52,37],[52,-35],[-18,-35]] },
  { name:"Asia",          color:"rgba(200,30,30,0.038)", pts:[[26,72],[145,72],[145,0],[100,-10],[72,8],[26,8]] },
  { name:"Oceania",       color:"rgba(0,255,240,0.020)", pts:[[113,-10],[153,-10],[153,-45],[113,-45]] },
];

export default function WorldMap({ selected, onSelect }) {
  const canvasRef = useRef(null);
  const tipRef    = useRef(null);
  const st        = useRef({ dots:[], phase:0, hov:null });

  const proj = useCallback((lat, lng, W, H) => ({
    x: (lng + 180) / 360 * W,
    y: (90  - lat) / 180 * H,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;

    /* ── resize ── */
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      st.current.dots = CRISIS.map(d => {
        const p = proj(d.lat, d.lng, W, H);
        return { ...d, px:p.x, py:p.y, scale:1, glowR:0 };
      });
    }

    /* ── continent fills ── */
    function drawContinents() {
      CONTINENTS.forEach(cont => {
        ctx.beginPath();
        cont.pts.forEach(([lng,lat],i) => {
          const {x,y} = proj(lat,lng,W,H);
          i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        });
        ctx.closePath();
        ctx.fillStyle = cont.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,255,240,0.04)";
        ctx.lineWidth = .6;
        ctx.stroke();
      });
    }

    /* ── grid lines ── */
    function drawGrid() {
      ctx.save();
      // lat lines
      for (let lat=-60; lat<=60; lat+=30) {
        const {y} = proj(lat,0,W,H);
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y);
        ctx.strokeStyle = lat===0 ? "rgba(0,255,240,0.09)" : "rgba(0,255,240,0.03)";
        ctx.lineWidth   = lat===0 ? 1 : .5;
        ctx.setLineDash(lat===0?[]:[4,8]);
        ctx.stroke();
      }
      // lng lines
      for (let lng=-120; lng<=180; lng+=60) {
        const {x} = proj(0,lng,W,H);
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H);
        ctx.strokeStyle = "rgba(0,255,240,0.025)";
        ctx.lineWidth   = .5;
        ctx.setLineDash([4,10]);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    }

    /* ── connection lines between high-shortage neighbours ── */
    function drawConnections() {
      const highRisk = st.current.dots.filter(d => d.s > 70);
      ctx.save();
      for (let i=0; i<highRisk.length; i++) {
        for (let j=i+1; j<highRisk.length; j++) {
          const a=highRisk[i], b=highRisk[j];
          const dist = Math.hypot(a.px-b.px, a.py-b.py);
          if (dist > W*0.45) continue;          // skip too-far pairs
          const alpha = 0.04 + 0.06*(1-dist/(W*0.45));
          const grad = ctx.createLinearGradient(a.px,a.py,b.px,b.py);
          grad.addColorStop(0, `rgba(230,74,60,${alpha})`);
          grad.addColorStop(.5,`rgba(230,74,60,${alpha*1.6})`);
          grad.addColorStop(1, `rgba(230,74,60,${alpha})`);
          ctx.beginPath(); ctx.moveTo(a.px,a.py); ctx.lineTo(b.px,b.py);
          ctx.strokeStyle = grad; ctx.lineWidth=.7; ctx.stroke();
        }
      }
      ctx.restore();
    }

    /* ── animated pulse rings ── */
    function drawPulseRings(d, phase) {
      const col = dotColor(d.s);
      [1,2,3].forEach(ring => {
        const t   = (phase*0.4 + ring*0.33) % 1;
        const rr  = d.glowR * (0.6 + t * 1.4);
        const alpha = (1-t) * 0.35;
        ctx.beginPath(); ctx.arc(d.px, d.py, rr, 0, Math.PI*2);
        ctx.strokeStyle = col + Math.round(alpha*255).toString(16).padStart(2,"0");
        ctx.lineWidth   = 1.2 - t*0.8;
        ctx.stroke();
      });
    }

    /* ── dots ── */
    function drawDots() {
      const { dots, phase, hov } = st.current;
      dots.forEach((d,i) => {
        const isSel = selected===d.c, isHov = hov===i;
        const active = isSel||isHov;

        // Smooth scale
        const targetS = active ? 1.85 : 1;
        d.scale += (targetS - d.scale) * .1;

        const col  = dotColor(d.s);
        const base = 3.5 + d.s/18;
        const r    = base * d.scale;
        d.glowR    = r * 3.5;

        // Pulse rings
        drawPulseRings(d, phase + i*0.17);

        // Glow halo
        const grd = ctx.createRadialGradient(d.px,d.py,0,d.px,d.py,d.glowR);
        grd.addColorStop(0, col+"66");
        grd.addColorStop(.4,col+"22");
        grd.addColorStop(1, col+"00");
        ctx.beginPath(); ctx.arc(d.px,d.py,d.glowR,0,Math.PI*2);
        ctx.fillStyle=grd; ctx.fill();

        // Core dot with 3D gradient
        const cg = ctx.createRadialGradient(
          d.px-r*.35, d.py-r*.35, 0,
          d.px,       d.py,       r
        );
        cg.addColorStop(0, "#ffffff55");
        cg.addColorStop(.3, col+"ff");
        cg.addColorStop(1,  col+"99");
        ctx.beginPath(); ctx.arc(d.px,d.py,r,0,Math.PI*2);
        ctx.fillStyle=cg; ctx.fill();

        // Rim glow for selected/hovered
        if (active) {
          ctx.beginPath(); ctx.arc(d.px,d.py,r,0,Math.PI*2);
          ctx.strokeStyle=col; ctx.lineWidth=1.5;
          ctx.shadowColor=col; ctx.shadowBlur=12;
          ctx.stroke();
          ctx.shadowBlur=0;
        }

        // Country label
        if (active) {
          ctx.save();
          // Label background pill
          const label = d.c;
          ctx.font=`600 ${Math.max(10,11*d.scale*.72)}px 'Rajdhani',sans-serif`;
          const tw = ctx.measureText(label).width;
          const lx=d.px-tw/2-6, ly=d.py-r-22, lw=tw+12, lh=16;
          ctx.fillStyle="rgba(4,4,14,0.85)";
          ctx.beginPath();
          ctx.roundRect(lx,ly,lw,lh,3);
          ctx.fill();
          ctx.strokeStyle=col+"88"; ctx.lineWidth=.8; ctx.stroke();
          // Text
          ctx.fillStyle="#fff";
          ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillText(label, d.px, ly+lh/2);
          // Flag emoji
          ctx.font=`${Math.max(8,10*d.scale*.65)}px sans-serif`;
          ctx.fillText(d.f, d.px, d.py-r-30);
          ctx.restore();
        }
      });
    }

    /* ── main loop ── */
    function loop() {
      st.current.phase += .014;
      ctx.clearRect(0,0,W,H);
      drawGrid();
      drawContinents();
      drawConnections();
      drawDots();
      raf = requestAnimationFrame(loop);
    }

    /* ── hit test ── */
    function hitTest(mx,my) {
      const { dots } = st.current;
      for (let i=dots.length-1; i>=0; i--) {
        const d=dots[i];
        if (Math.hypot(mx-d.px, my-d.py) < (4+d.s/12)*2.2) return i;
      }
      return null;
    }

    /* ── mouse events ── */
    function onMove(e) {
      const rect=canvas.getBoundingClientRect();
      const sx=W/rect.width, sy=H/rect.height;
      const mx=(e.clientX-rect.left)*sx, my=(e.clientY-rect.top)*sy;
      const hit=hitTest(mx,my);
      st.current.hov=hit;
      canvas.style.cursor=hit!==null?"pointer":"default";

      const tip=tipRef.current; if(!tip) return;
      if (hit!==null) {
        const d=CRISIS[hit], col=dotColor(d.s);
        tip.style.opacity="1";
        const bRect=canvas.getBoundingClientRect();
        tip.style.left=(e.clientX-bRect.left+18)+"px";
        tip.style.top =(e.clientY-bRect.top -30)+"px";
        tip.innerHTML=`
          <div style="font-family:'Rajdhani',sans-serif;font-size:1rem;font-weight:700;letter-spacing:1px;margin-bottom:5px;color:#fff">
            ${d.f} ${d.c}
          </div>
          <div style="display:flex;align-items:center;gap:7px;font-family:'Share Tech Mono',monospace;font-size:.68rem;color:#aaa;margin-bottom:3px">
            <div style="width:8px;height:8px;border-radius:50%;background:${col};box-shadow:0 0 6px ${col};flex-shrink:0"></div>
            <span style="color:${col};font-size:.8rem;font-weight:700">${d.s}%</span> shortage
          </div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:.65rem;color:#666">
            Needs ${d.need}M · Has ${d.have}M units/yr
          </div>`;
      } else { tip.style.opacity="0"; }
    }

    function onClick(e) {
      const rect=canvas.getBoundingClientRect();
      const mx=(e.clientX-rect.left)*(W/rect.width);
      const my=(e.clientY-rect.top)*(H/rect.height);
      const hit=hitTest(mx,my);
      if (hit!==null) onSelect(CRISIS[hit].c);
    }

    resize(); loop();
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click",     onClick);
    const ro=new ResizeObserver(resize); ro.observe(canvas.parentElement);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click",     onClick);
      ro.disconnect();
    };
  }, [selected, proj, onSelect]);

  return (
    <div className="map-wrap">
      <canvas ref={canvasRef}/>

      {/* Tooltip */}
      <div ref={tipRef} className="map-tip"/>

      {/* Corner labels */}
      <div style={{position:"absolute",top:10,left:14,fontFamily:"'Share Tech Mono',monospace",fontSize:".62rem",color:"rgba(0,255,240,0.3)",letterSpacing:"1.5px"}}>
        SYS://GLOBAL_BLOOD_MAP · {CRISIS.length} COUNTRIES
      </div>

      {/* Legend */}
      <div className="map-legend">
        {[["CRITICAL >70%","#e74c3c"],["HIGH 40-70%","#e67e22"],["MODERATE","#f1c40f"],["LOW <15%","#00d68f"]].map(([l,c])=>(
          <div key={l} className="leg-row">
            <div className="leg-dot" style={{background:c,boxShadow:`0 0 5px ${c}`}}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
