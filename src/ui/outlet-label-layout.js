import { FEED_DEPTH, FEED_WIDTH } from './board-part-geometry.js';
import { outletAnnotations, annotationRect } from './board-annotations.js';

// 札と引き出し線だけを配置する。配管や計算上の高さは動かさない。
export function createOutletLabelLayout({ basinPlacement, pipePath, pipeCrossings, pipeLabelPositions, boardViewBox }) {
  // 水門の名前札の幅も、盤面の共通バッジと同じ方法で見積もる。
  const width = (text, size) => [...text].reduce((sum, ch) => sum + (/[\x20-\x7e]/.test(ch) ? size * .6 : size * 1.02), 0);
  const R=13.65,CLEAR=.1,cache=new WeakMap();
  function distance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy,t=den?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den)):0;return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
  function circleRect(p,r){return Math.hypot(Math.max(r.l-p.x,0,p.x-r.r),Math.max(r.t-p.y,0,p.y-r.b))<R+CLEAR;}
  function inside(p,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++)if((poly[i].y>p.y)!==(poly[j].y>p.y)&&p.x<(poly[j].x-poly[i].x)*(p.y-poly[i].y)/(poly[j].y-poly[i].y)+poly[i].x)yes=!yes;return yes;}

  function route(anchor,size,ratio=null){const sign=Math.sign(size.x-anchor.x)||-1,end={x:size.x-sign*13,y:size.y},bend=ratio==null?Math.min(Math.abs(size.y-anchor.y),Math.abs(end.x-anchor.x)*.65):Math.abs(end.x-anchor.x)*ratio,elbow={x:anchor.x+sign*bend,y:size.y};return{anchor,elbow,end};}
  // A second orientation keeps the horizontal leg close to the pipe and meets
  // the lower/upper side of the round badge along the diagonal.
  function routeNearPipe(anchor,size){
   const sign=Math.sign(size.x-anchor.x)||-1,bend=Math.min(Math.abs(size.x-anchor.x)*.55,Math.abs(size.y-anchor.y)*.9),elbow={x:anchor.x+sign*bend,y:anchor.y},dx=elbow.x-size.x,dy=elbow.y-size.y,len=Math.hypot(dx,dy)||1,end={x:size.x+13*dx/len,y:size.y+13*dy/len};
   return{anchor,elbow,end,routeStyle:'near-pipe'};
  }
  const legs=g=>[[g.anchor,g.elbow],[g.elbow,g.end]];
  function crosses(a,b,c,d){const f=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);return f(a,b,c)*f(a,b,d)<-.001&&f(c,d,a)*f(c,d,b)<-.001;}
  function conflicts(g,previous){return previous.some(h=>legs(g).some(([a,b])=>distance(h.size,a,b)<R+1||legs(h).some(([c,d])=>crosses(a,b,c,d)))||legs(h).some(([a,b])=>distance(g.size,a,b)<R+1));}
  function rectCross(a,b,r){return(a.x>=r.l&&a.x<=r.r&&a.y>=r.t&&a.y<=r.b)||(b.x>=r.l&&b.x<=r.r&&b.y>=r.t&&b.y<=r.b)||[[{x:r.l,y:r.t},{x:r.r,y:r.t}],[{x:r.r,y:r.t},{x:r.r,y:r.b}],[{x:r.r,y:r.b},{x:r.l,y:r.b}],[{x:r.l,y:r.b},{x:r.l,y:r.t}]].some(([c,d])=>crosses(a,b,c,d));}
  function leaderPenalty(g,obs){let cost=0;for(const c of obs.circles)if(legs(g).some(([a,b])=>distance(c,a,b)<c.r+1.2))cost+=2200;for(const r of obs.rects.filter(r=>['quantity','height','ruler','feed-intake'].includes(r.kind)))if(legs(g).some(([a,b])=>rectCross(a,b,r)))cost+=4000;for(const s of obs.segments.filter(s=>s.kind==='pipe'))if(legs(g).some(([a,b])=>crosses(a,b,s.a,s.b)))cost+=g.routeStyle==='near-pipe'?10:350;return cost;}
  function obstacles(layout,stage){const rects=[],circles=[],segments=[],bowls=[];
   for(const n of layout.nodes.values()){const source=n.kind==='spring',half=source?31.6:17.5;rects.push({kind:'glass',l:n.cx-half,r:n.cx+half,t:source?layout.yOf(layout.H)-42:layout.towerTop-4,b:374});}
   rects.push({kind:'ruler',l:0,r:23,t:layout.yOf(layout.H)-22,b:378});
   for(const wall of stage.walls??[]){const x=18+wall.x*32.4;rects.push({kind:'wall',l:x-9,r:x+9,t:layout.yOf(Number(wall.height)),b:371});}
   for(const o of stage.outlets){const{cx}=basinPlacement(layout,o),y=layout.yOf(Number(o.height)),n=layout.nodes.get(o.tower);    const notes=outletAnnotations(layout,o,cx);
    rects.push({kind:'feed-intake',l:n.cx-FEED_WIDTH/2-.5,r:n.cx+FEED_WIDTH/2+.5,t:y-.5,b:y+FEED_DEPTH-3.5});
    rects.push(annotationRect(notes.quantity,'quantity'),annotationRect(notes.height,'height'));
    rects.push({kind:'jet',l:cx-3,r:cx+3,t:y-96,b:y});rects.push({kind:'rainbow',l:cx-39,r:cx+39,t:y-103,b:y-62});
    if(y<370)rects.push({kind:'pedestal',l:cx-14,r:cx+14,t:y+5,b:365},{kind:'pedestal foot',l:cx-16,r:cx+16,t:363,b:372});
    const poly=[];for(let k=0;k<=12;k++){const a=Math.PI+k*Math.PI/12;poly.push({x:cx+31.5*Math.cos(a),y:y+1+5.8*Math.sin(a)});}for(let k=0;k<=12;k++){const a=k*Math.PI/12;poly.push({x:cx+30*Math.cos(a),y:y+4+6.2*Math.sin(a)});}bowls.push(poly);
    segments.push({kind:'outlet',a:{x:n.cx,y},b:{x:n.cx,y:y+FEED_DEPTH},w:FEED_WIDTH/2},{kind:'outlet',a:{x:n.cx,y:y+FEED_DEPTH},b:{x:cx,y:y+FEED_DEPTH},w:FEED_WIDTH/2},{kind:'outlet',a:{x:cx,y:y+FEED_DEPTH},b:{x:cx,y},w:FEED_WIDTH/2});
   }
   for(const p of pipeLabelPositions(layout,stage).values())circles.push({...p,r:14.65,kind:'normal badge'});
   for(const c of stage.candidates){const p=pipePath(layout,c);for(let i=1;i<p.pts.length;i++)segments.push({kind:'pipe',a:{x:p.pts[i-1][0],y:p.pts[i-1][1]},b:{x:p.pts[i][0],y:p.pts[i][1]},w:4.75});if(c.gate){const x=p.gx??p.mx,w=Math.round(12+width('水門',8));rects.push({kind:'gate',l:x-5.75,r:x+5.75,t:p.my-12.75,b:p.my+12.75},{kind:'gate caption',l:x-w/2-.6,r:x+w/2+.6,t:p.my-26.1,b:p.my-11.9});}}
   for(const c of pipeCrossings(layout,stage)){const pts=[[c.left-12,c.y],[c.left,c.y-8],[c.right,c.y-8],[c.right+12,c.y]];for(let i=1;i<pts.length;i++)segments.push({kind:'bridge',a:{x:pts[i-1][0],y:pts[i-1][1]},b:{x:pts[i][0],y:pts[i][1]},w:4.75});}
   return{rects,circles,segments,bowls};
  }
  function collisions(p,obs,placed=[]){const result=[];
   for(const r of obs.rects)if(circleRect(p,r))result.push(r.kind);
   for(const c of [...obs.circles,...placed])if(Math.hypot(c.x-p.x,c.y-p.y)<R+(c.r??R)+CLEAR)result.push(c.kind??'outlet badge');
   for(const s of obs.segments)if(distance(p,s.a,s.b)<R+s.w+CLEAR)result.push(s.kind);
   for(const poly of obs.bowls)if(inside(p,poly)||poly.some((a,i)=>distance(p,a,poly[(i+1)%poly.length])<R+.65+CLEAR))result.push('bowl');
   return result;
  }
  function elbowPlacements(layout,stage){if(cache.has(layout))return cache.get(layout);const obs=obstacles(layout,stage),placed=[],map=new Map(),top=Number(boardViewBox(layout,stage,true).split(' ')[1]);
   const centres=stage.outlets.map(o=>basinPlacement(layout,o).cx),leftmost=Math.min(...centres),rightmost=Math.max(...centres);
   const ordered=[...stage.outlets].sort((a,b)=>Number(a.height)-Number(b.height)||basinPlacement(layout,a).cx-basinPlacement(layout,b).cx);
   for(const outlet of ordered){const{cx}=basinPlacement(layout,outlet),mouthY=layout.yOf(Number(outlet.height)),anchor={x:cx-13,y:mouthY+FEED_DEPTH};const xs=new Set([13.8,346.2,cx-61,cx+61,cx+22,cx+24]);for(let x=14;x<=346;x+=4)xs.add(x);const ys=new Set([mouthY-28,mouthY-32,mouthY-48,mouthY+27,mouthY+14,mouthY+12.5,mouthY+13,382.5,383,384,394,410,426,442,454]);for(let y=Math.ceil((top+R+1)/4)*4;y<=455;y+=4)ys.add(y);
    const side=centres.length>1?(cx===rightmost?1:cx===leftmost?-1:0):-1,preferredX=cx+side*55,preferredY=side===1?mouthY+22:mouthY-28;
    const candidates=[];for(const x of xs)for(const y of ys){if(x-R<0||x+R>360||y-R<top||y+R>470||Math.abs(x-anchor.x)<R+12)continue;const p={x,y};const inward=side===1?x<cx+(360-cx<50?14:30):side===-1?x>cx-24:false;const score=(x-anchor.x)**2+(y-anchor.y)**2+.3*(x-preferredX)**2+2*(y-preferredY)**2+(inward?2200:0);candidates.push({...p,score});}candidates.sort((a,b)=>a.score-b.score);
    const previous=[...map.values()];let size=null,bestScore=Infinity,chosenRoute=null;for(const p of candidates){if(p.score>bestScore)break;if(collisions(p,obs,placed).length)continue;const routes=[{...routeNearPipe(anchor,p),extra:0},...[null,.3,.55,.8].map(ratio=>({...route(anchor,p,ratio),routeStyle:'near-badge',extra:35+(ratio==null?0:18)}))];for(const plan of routes){const g={...plan,size:p};if(conflicts(g,previous))continue;const score=p.score+leaderPenalty(g,obs)+plan.extra;if(score<bestScore){size={...p,score};bestScore=score;chosenRoute=g;}}}if(!size)throw new Error(`${stage.id}/${outlet.id}: 空きがない`);
    const{end,elbow}=chosenRoute;
    const entry={cx,mouthY,size,anchor,elbow,end,routeStyle:chosenRoute.routeStyle,below:size.y>=mouthY+12};map.set(outlet.id,entry);placed.push({...size,r:R});
   }cache.set(layout,map);return map;}
  return { placements: elbowPlacements, obstacles, collisions };
}
