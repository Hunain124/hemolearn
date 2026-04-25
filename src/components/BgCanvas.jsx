import { useEffect, useRef } from "react";

export default function BgCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, cells = [], raf;
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    function init() {
      cells = Array.from({length:18}, (_,i) => ({
        x: Math.random()*W, y: Math.random()*H,
        r: 20+Math.random()*50, vx:(Math.random()-.5)*0.3, vy:(Math.random()-.5)*0.3,
        hue: Math.random()<0.7 ? 0 : 25, alpha:0.03+Math.random()*0.05
      }));
    }
    function draw() {
      ctx.clearRect(0,0,W,H);
      cells.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<-p.r) p.x=W+p.r; if (p.x>W+p.r) p.x=-p.r;
        if (p.y<-p.r) p.y=H+p.r; if (p.y>H+p.r) p.y=-p.r;
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2);
        g.addColorStop(0,`hsla(${p.hue},80%,50%,${p.alpha})`);
        g.addColorStop(1,`hsla(${p.hue},80%,50%,0)`);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*2,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(raf); };
  }, []);
  return <canvas id="bgCanvas" ref={ref} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0, opacity:0.4}}/>;
}