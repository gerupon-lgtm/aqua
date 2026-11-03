import { feedPath, FEED_WIDTH } from './board-part-geometry.js';
const DRAIN_PAN_IMAGE=new URL('../../public/graphics/part-drain-pan-v2.png',import.meta.url).href;
const GARDEN_SOIL_IMAGE=new URL('../../public/graphics/soil-loam-v1.webp',import.meta.url).href;
const MATERIAL_GROUND=370;

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

export function drawDrainPan(out,cx){
 const key=`drain-${Math.round(cx*100)}`;
 // One coherent bitmap supplies both the upper face and the even sidewall.
 // The upper aperture centre, not the lower transparent bore, defines the height.
 const holeY=30.611825192802055,imageY=MATERIAL_GROUND-holeY*62/512,imageH=62*104/512;
 out.push(`<g class="basin-vessel" data-flow-through="true" data-pan-left="${cx-31.5}" data-pan-right="${cx+31.5}" data-pan-top="${MATERIAL_GROUND-4.8}" data-pan-bottom="${MATERIAL_GROUND+10.2}" data-pan-centre-x="${cx}" data-pan-centre-y="${MATERIAL_GROUND}"><defs><filter id="${key}-edge" x="-5%" y="-15%" width="110%" height="130%"><feDropShadow dx="0" dy="0" stdDeviation=".4" flood-color="#526c7a" flood-opacity=".7"/></filter></defs><image class="porcelain-body" data-single-piece="true" href="${DRAIN_PAN_IMAGE}" x="${cx-31}" y="${imageY}" width="62" height="${imageH}" filter="url(#${key}-edge)"/></g>`);
}
export function drawNozzleLip(out,cx){
 out.push(`<path class="nozzle-front-lip" d="M${cx-2.7} ${MATERIAL_GROUND} Q${cx} ${MATERIAL_GROUND+2.2} ${cx+2.7} ${MATERIAL_GROUND}" fill="none" stroke="#8b9897" stroke-width=".8"/><path d="M${cx-1.9} ${MATERIAL_GROUND+.4} Q${cx} ${MATERIAL_GROUND+1.4} ${cx+1.9} ${MATERIAL_GROUND+.4}" fill="none" stroke="#faf7e8" stroke-width=".5"/>`);
}
