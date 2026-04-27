import { useEffect, useRef } from "react";

export default function BgCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, cells = [], veins = [], tick = 0, raf;

    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }

    function mkCell() {
      return {
        x: Math.random()*W, y: Math.random()*H,
        r: 6 + Math.random()*20,
        vx: (Math.random()-.5)*.28, vy: (Math.random()-.5)*.22,
        phase: Math.random()*Math.PI*2, speed: .007+Math.random()*.009,
        type: Math.random()<.6?"rbc":Math.random()<.5?"wbc":"plt",
        alpha: .04+Math.random()*.09, rot: Math.random()*Math.PI*2,
        rotS: (Math.random()-.5)*.007,
      };
    }

    function buildVeins() {
      veins = Array.from({length:8}, () => {
        const col = Math.random()<.6 ? "rgba(139,0,0,0.07)" : "rgba(0,255,240,0.03)";
        const pts = []; let x = Math.random()*W, y = Math.random()*H;
        for (let i = 0; i < 8; i++) {
          pts.push({x, y});
          x = Math.max(0,Math.min(W, x+(Math.random()-.5)*180));
          y = Math.max(0,Math.min(H, y+(Math.random()-.5)*130));
        }
        return { pts, col, w: .5+Math.random()*.7, flow: Math.random(), speed: .003+Math.random()*.004 };
      });
    }

    function drawRBC(x,y,r,a,rot) {
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.globalAlpha=a;
      ctx.beginPath(); ctx.ellipse(0,0,r,r*.62,0,0,Math.PI*2);
      const g=ctx.createRadialGradient(0,0,r*.08,0,0,r);
      g.addColorStop(0,"rgba(160,18,18,.28)"); g.addColorStop(.5,"rgba(192,40,40,.9)"); g.addColorStop(1,"rgba(100,8,8,.5)");
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,0,r*.3,r*.18,0,0,Math.PI*2);
      ctx.fillStyle="rgba(60,0,0,.4)"; ctx.fill();
      ctx.restore();
    }
    function drawWBC(x,y,r,a) {
      ctx.save(); ctx.globalAlpha=a*.4;
      ctx.beginPath();
      for (let i=0;i<8;i++) { const ang=(i/8)*Math.PI*2, nr=r*(.65+Math.sin(ang*3+tick*.01)*.22); i===0?ctx.moveTo(x+Math.cos(ang)*nr,y+Math.sin(ang)*nr):ctx.lineTo(x+Math.cos(ang)*nr,y+Math.sin(ang)*nr); }
      ctx.closePath(); ctx.fillStyle="rgba(80,120,255,.1)"; ctx.fill(); ctx.strokeStyle="rgba(80,120,255,.2)"; ctx.lineWidth=.8; ctx.stroke();
      ctx.restore();
    }
    function drawPlatelet(x,y,r,a,rot) {
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.globalAlpha=a*.55;
      ctx.beginPath(); ctx.ellipse(0,0,r*.75,r*.4,0,0,Math.PI*2);
      ctx.fillStyle="rgba(255,190,70,.18)"; ctx.fill(); ctx.strokeStyle="rgba(255,190,70,.32)"; ctx.lineWidth=.7; ctx.stroke();
      ctx.restore();
    }

    function loop() {
      tick++;
      ctx.clearRect(0,0,W,H);
      // Draw veins
      veins.forEach(v => {
        v.flow = (v.flow+v.speed)%1;
        ctx.save(); ctx.strokeStyle=v.col; ctx.lineWidth=v.w;
        ctx.beginPath(); ctx.moveTo(v.pts[0].x,v.pts[0].y);
        v.pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
        ctx.stroke();
        const pi = Math.floor(v.flow*(v.pts.length-1)); const pt = v.pts[pi];
        const pg=ctx.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,7);
        pg.addColorStop(0,"rgba(192,57,43,.3)"); pg.addColorStop(1,"rgba(192,57,43,0)");
        ctx.beginPath(); ctx.arc(pt.x,pt.y,7,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
        ctx.restore();
      });
      // Draw cells
      cells.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotS; p.phase+=p.speed;
        p.y+=Math.sin(p.phase)*.2;
        if(p.x<-p.r*2) p.x=W+p.r; if(p.x>W+p.r) p.x=-p.r*2;
        if(p.y<-p.r*2) p.y=H+p.r; if(p.y>H+p.r) p.y=-p.r*2;
        const a=p.alpha*(.65+.35*Math.sin(p.phase*1.4));
        if(p.type==="rbc") drawRBC(p.x,p.y,p.r,a,p.rot);
        else if(p.type==="wbc") drawWBC(p.x,p.y,p.r,a);
        else drawPlatelet(p.x,p.y,p.r,a,p.rot);
      });
      raf = requestAnimationFrame(loop);
    }

    resize();
    cells = Array.from({length:22}, mkCell);
    buildVeins();
    loop();
    window.addEventListener("resize", () => { resize(); buildVeins(); });
    return () => { cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:.55}} />;
}
