import { feedPath, FEED_WIDTH } from './board-part-geometry.js';
const DRAIN_PAN_IMAGE=new URL('../../public/graphics/part-drain-pan-v2.png',import.meta.url).href;
const GARDEN_SOIL_IMAGE=new URL('../../public/graphics/soil-loam-v1.webp',import.meta.url).href;
const MATERIAL_GROUND=370;
// The reviewed ivory mapping, in sRGB, expands the original ceramic shadows.
const IVORY_MATRIX=[...[ [215,245],[208,242],[185,232] ].flatMap(([low,high])=>{
 const slope=(high-low)/255/.45;
 return[.2126*slope,.7152*slope,.0722*slope,0,low/255-slope*.55];
}),0,0,0,1,0].join(' ');

export function materialDefs(out){
 out.push(`<defs><linearGradient id="garden-pipe-shell" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#fffdf5"/><stop offset=".28" stop-color="#f8f7ef"/><stop offset=".58" stop-color="#e2e5dc"/><stop offset=".84" stop-color="#b6c2c0"/><stop offset="1" stop-color="#f0f1e9"/></linearGradient></defs>`);
 out.push(`<defs><linearGradient id="garden-pan-side" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fffef7"/><stop offset=".45" stop-color="#e9eeeb"/><stop offset="1" stop-color="#aebfc9"/></linearGradient></defs>`);
 out.push(`<defs><linearGradient id="garden-ivory" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#d7e0df"/><stop offset=".18" stop-color="#f5f4ee"/><stop offset=".4" stop-color="#fffefa"/><stop offset=".72" stop-color="#e8ece7"/><stop offset="1" stop-color="#b6c6cc"/></linearGradient><linearGradient id="garden-metal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f7f1df"/><stop offset=".45" stop-color="#bba97b"/><stop offset=".7" stop-color="#eee5c9"/><stop offset="1" stop-color="#80959c"/></linearGradient></defs>`);
}

export function drawGardenFeed(out,sourceX,cx){
 // A solid glazed tube sits below/behind the pan. Its central riser disappears
 // into the underside; it must never be painted over the porcelain face.
 const d=feedPath(sourceX,cx,MATERIAL_GROUND);
 out.push(`<g class="outlet-visible garden-feed" fill="none" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"><path class="feed-shell" d="${d}" stroke="#879b9e" stroke-width="${FEED_WIDTH}"/><path class="feed-ceramic" d="${d}" stroke="url(#garden-pipe-shell)" stroke-width="4.2"/><path d="${d}" stroke="#fffdf5" stroke-width=".65" transform="translate(-.6 -.7)" opacity=".65"/></g>`);
}

export function materialWater(out,id,colour){
 out.push(`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${colour}" stop-opacity=".92"/><stop offset=".13" stop-color="${colour}" stop-opacity=".78"/><stop offset=".38" stop-color="${colour}" stop-opacity=".60"/><stop offset=".68" stop-color="${colour}" stop-opacity=".68"/><stop offset="1" stop-color="${colour}" stop-opacity=".91"/></linearGradient></defs>`);
 return`url(#${id})`;
}

export function drawGardenSoil(out){
 out.push(`<rect x="0" y="370" width="360" height="100" fill="#b29a7a"/><image class="garden-soil" href="${GARDEN_SOIL_IMAGE}" x="0" y="370" width="360" height="100" preserveAspectRatio="xMidYMid slice"/><path d="M0 370 Q9 368.8 18 370 T54 370 T90 370 T126 370 T162 370 T198 370 T234 370 T270 370 T306 370 T342 370 T378 370" fill="none" stroke="#8c826b" stroke-width="1.1"/>`);
}

export function drawSocket(out,cx,y,width){
 out.push(`<ellipse cx="${cx}" cy="${y+1.8}" rx="${width/2}" ry="2.1" fill="#344e60" opacity=".13"/><rect x="${cx-width/2}" y="${y-4}" width="${width}" height="5" rx="2" fill="url(#garden-ivory)" stroke="#879b9e" stroke-width=".65"/><path d="M${cx-width/2+2} ${y-3} H${cx+width/2-2}" stroke="#fffefa" stroke-width=".8"/>`);
}

export function drawGardenPedestal(out,cx,dy){
 if(dy>=0)return;
 const top=MATERIAL_GROUND+dy+5,bottom=MATERIAL_GROUND-5;
 const body=`M${cx-11} ${top} Q${cx} ${top+2} ${cx+11} ${top} L${cx+8} ${bottom} H${cx-8} Z`;
 out.push(`<g class="pedestal"><ellipse cx="${cx}" cy="${MATERIAL_GROUND+1.5}" rx="18" ry="2.4" fill="#4c4a40" opacity=".16"/><path class="pedestal-body" d="${body}" fill="#fffefa"/><path d="${body}" fill="url(#garden-ivory)" stroke="#9cafb1" stroke-width=".6"/>`);
 for(const dx of [-5,0,5])out.push(`<path d="M${cx+dx} ${top+4} L${cx+dx*.72} ${bottom-1}" fill="none" stroke="${dx<0?'#ffffff':'#bdcacb'}" stroke-width=".6" opacity=".65"/>`);
 out.push(`<ellipse cx="${cx}" cy="${top+1}" rx="13" ry="2.6" fill="url(#garden-ivory)" stroke="#b7af91" stroke-width=".6"/><rect class="pedestal-foot" x="${cx-15}" y="${MATERIAL_GROUND-5}" width="30" height="5.5" rx="2" fill="#fffefa" stroke="#9cadaa" stroke-width=".65"/><path d="M${cx-13} ${MATERIAL_GROUND-3.5} H${cx+13}" stroke="#ded9c8" stroke-width=".8"/></g>`);
}

export function drawDrainPan(out,cx,{imageHref=DRAIN_PAN_IMAGE,id=`drain-${Math.round(cx*100)}`}={}){
 const key=id;
 // One coherent bitmap supplies both the upper face and the even sidewall.
 // The upper aperture centre, not the lower transparent bore, defines the height.
 const holeY=30.611825192802055,imageY=MATERIAL_GROUND-holeY*62/512,imageH=62*104/512;
 const cy=imageY+imageH*29.5/104,rx=62*.488,ry=imageH*27.5/104;
 const rear=`M${cx-rx} ${cy} A${rx} ${ry} 0 0 1 ${cx+rx} ${cy}`;
 const lower=`M${cx-62*.475} ${imageY+imageH*.72} Q${cx} ${imageY+imageH*1.21} ${cx+62*.475} ${imageY+imageH*.72}`;
 const leaves=[];
 for(const dx of [-20,0,20]){
  const front=Math.sqrt(1-(dx/30.5)**2),mx=cx+dx,my=imageY+imageH*(.50+.285*front);
  leaves.push(`<path d="M${mx-4.7} ${my+.7} Q${mx} ${my-.1} ${mx+4.7} ${my+.7}" fill="none" stroke="#a0844e" stroke-width=".5" stroke-linecap="round"/>`);
  for(const d of[
   `M${mx-1} ${my+.4} Q${mx-3.6} ${my-2} ${mx-4.3} ${my-1.5} Q${mx-3.2} ${my+1} ${mx-1} ${my+.4} Z`,
   `M${mx+1} ${my+.4} Q${mx+3.6} ${my-2} ${mx+4.3} ${my-1.5} Q${mx+3.2} ${my+1} ${mx+1} ${my+.4} Z`,
   `M${mx} ${my+.4} Q${mx-1.7} ${my-1} ${mx} ${my-2.2} Q${mx+1.7} ${my-1} ${mx} ${my+.4} Z`
  ])leaves.push(`<path d="${d}" fill="url(#${key}-gold)" stroke="#9b7e45" stroke-width=".2"/>`);
 }
 // Scale around the upper aperture, keeping the jet and the plumbing fixed.
 // A tighter shadow clears the horizontal feed beneath the thicker sidewall.
 out.push(`<g class="basin-vessel" data-pan-finish="ivory-gold-leaves" data-flow-through="true" data-pan-left="${cx-31.5}" data-pan-right="${cx+31.5}" data-pan-top="${MATERIAL_GROUND-4.8}" data-pan-bottom="${MATERIAL_GROUND+10.2}" data-pan-centre-x="${cx}" data-pan-centre-y="${MATERIAL_GROUND}"><defs><filter id="${key}-edge" x="-5%" y="-15%" width="110%" height="130%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${IVORY_MATRIX}"/><feDropShadow dx="0" dy="0" stdDeviation=".15" flood-color="#7c7869" flood-opacity=".9"/></filter><linearGradient id="${key}-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8edce"/><stop offset=".3" stop-color="#c4a569"/><stop offset=".6" stop-color="#e8d19c"/><stop offset="1" stop-color="#b49965"/></linearGradient></defs><g class="pan-depth" transform="translate(0 370) scale(1 1.14) translate(0 -370)"><image class="porcelain-body" data-single-piece="true" href="${imageHref}" x="${cx-31}" y="${imageY}" width="62" height="${imageH}" filter="url(#${key}-edge)"/><g class="pan-decoration" pointer-events="none"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#${key}-gold)" stroke-width="1.4"/><path class="pan-rear-edge" d="${rear}" fill="none" stroke="#8b6b34" stroke-width="1.4" stroke-linecap="round"/><path d="${lower}" fill="none" stroke="url(#${key}-gold)" stroke-width=".8" opacity=".95"/><g class="pan-side-pattern" data-pattern="leaves">${leaves.join('')}</g></g></g></g>`);
}
export function drawNozzleLip(out,cx){
 out.push(`<path class="nozzle-front-lip" d="M${cx-2.7} ${MATERIAL_GROUND} Q${cx} ${MATERIAL_GROUND+2.2} ${cx+2.7} ${MATERIAL_GROUND}" fill="none" stroke="#8b9897" stroke-width=".8"/><path d="M${cx-1.9} ${MATERIAL_GROUND+.4} Q${cx} ${MATERIAL_GROUND+1.4} ${cx+1.9} ${MATERIAL_GROUND+.4}" fill="none" stroke="#faf7e8" stroke-width=".5"/>`);
}
