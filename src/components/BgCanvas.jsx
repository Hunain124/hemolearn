import { useEffect, useRef } from "react";

export default function BgCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, cells = [], raf;

    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }

    function mkCell() {
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: 8 + Math.random() * 28,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .25,
        phase: Math.random() * Math.PI * 2,
        speed: .008 + Math.random() * .01,
        type: Math.random() < .65 ? "rbc" : Math.random() < .5 ? "wbc" : "platelet",
        alpha: .04 + Math.random() * .1,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - .5) * .008,
      };
    }

    function init() { cells = Array.from({ length: 24 }, mkCell); }

    function drawRBC(x, y, r, alpha, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * .65, 0, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(0, 0, r * .1, 0, 0, r);
      g.addColorStop(0, "rgba(180,20,20,0.3)");
      g.addColorStop(.5, "rgba(214,40,40,0.85)");
      g.addColorStop(1, "rgba(130,8,8,0.5)");
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 0, r * .32, r * .2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70,0,0,0.4)"; ctx.fill();
      ctx.restore();
    }

    function drawWBC(x, y, r, alpha) {
      ctx.save(); ctx.globalAlpha = alpha * .5;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const nr = r * (.65 + Math.random() * .35);
        i === 0 ? ctx.moveTo(x + Math.cos(a) * nr, y + Math.sin(a) * nr)
                : ctx.lineTo(x + Math.cos(a) * nr, y + Math.sin(a) * nr);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(100,150,255,0.12)"; ctx.fill();
      ctx.strokeStyle = "rgba(100,150,255,0.25)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }

    function drawPlatelet(x, y, r, alpha, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha * .65;
      ctx.beginPath(); ctx.ellipse(0, 0, r * .8, r * .45, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,200,80,0.22)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,200,80,0.4)"; ctx.lineWidth = .8; ctx.stroke();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      cells.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
        p.phase += p.speed;
        p.y += Math.sin(p.phase) * .25;
        if (p.x < -p.r * 2) p.x = W + p.r; if (p.x > W + p.r) p.x = -p.r * 2;
        if (p.y < -p.r * 2) p.y = H + p.r; if (p.y > H + p.r) p.y = -p.r * 2;
        const a = p.alpha * (.7 + .3 * Math.sin(p.phase * 1.5));
        if (p.type === "rbc") drawRBC(p.x, p.y, p.r, a, p.rot);
        else if (p.type === "wbc") drawWBC(p.x, p.y, p.r, a);
        else drawPlatelet(p.x, p.y, p.r, a, p.rot);
      });
      raf = requestAnimationFrame(draw);
    }

    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", () => {}); };
  }, []);

  return <canvas ref={ref} style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0, opacity:.45 }} />;
}
