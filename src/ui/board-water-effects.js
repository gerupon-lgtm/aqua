// Native SVG drawing, with the same nozzle, time and success conditions as board.js.
const f=n=>Number(n).toFixed(2);

export function drawFountain(out,cx,top,since,still,art){
 const rise=still?1:Math.min(1,Math.max(0,since)/600),ease=1-(1-rise)**2;
 const base=top+6,height=98*ease,peak=base-height,key=`spray-${Math.round(cx*100)}`;
 out.push(`<g class="fountain-spray" opacity="${f(Math.min(1,ease*1.5))}" pointer-events="none"><defs><filter id="${key}-haze" x="-30%" y="-20%" width="160%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter><filter id="${key}-depth" x="-10%" y="-5%" width="120%" height="110%"><feDropShadow dx="0" dy="0" stdDeviation=".45" flood-color="#418fb6" flood-opacity=".35"/></filter></defs>`);
 const fan=`M${f(cx-2)} ${f(base)} C${f(cx-6)} ${f(peak+22*ease)} ${f(cx-14*ease)} ${f(peak+9*ease)} ${f(cx-30*ease)} ${f(peak+24*ease)} Q${cx} ${f(peak-2*ease)} ${f(cx+30*ease)} ${f(peak+24*ease)} C${f(cx+14*ease)} ${f(peak+9*ease)} ${f(cx+6)} ${f(peak+22*ease)} ${f(cx+2)} ${f(base)} Z`;
 out.push(`<path d="${fan}" fill="#77c4dd" opacity=".22" filter="url(#${key}-haze)"/><g class="fountain-core">`);
 if(art){
  const n=Math.floor(since/140),frame=still?6:n<6?n+1:4+((n-6)%3),width=84*Math.sqrt(ease);
  out.push(`<image href="${art(`fx-fountain-0${frame}.png`)}" x="${f(cx-width/2)}" y="${f(base-height)}" width="${f(width)}" height="${f(height)}" opacity=".98" filter="url(#${key}-depth)"/>`);
 }else out.push(`<path d="${fan}" fill="#c7f0fa" opacity=".7"/>`);
 out.push('</g>');
 if(ease>.7)for(const dir of [-1,1])for(let i=0;i<4;i++){
  const p=still?(i+.4)/4.4:((since/(1050+i*90)+i*.279+dir*.13)%1+1)%1;
  const x=cx+dir*(22+p*17),y=peak+17+p*51;
  out.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(.6+(i%2)*.2)}" ry="${f(1.1+i*.12)}" fill="#e7faff" stroke="#63b2ce" stroke-width=".25" opacity="${f(.7-p*.25)}"/>`);
 }
 out.push('</g>');
}

export function drawRainbow(out,cx,top,opacity){
 const x=Math.max(40,Math.min(320,cx)),base=top-30,r=39,key=`spectrum-${Math.round(cx*100)}`;
 const stops=[
  [0,'#ab8bd6',0],[.43,'#ab8bd6',0],[.5,'#ab8bd6',.58],
  [.57,'#7e9be0',.71],[.64,'#6fc9e9',.73],[.71,'#77c99a',.73],
  [.78,'#f0dc6d',.78],[.85,'#f3aa64',.77],[.9,'#ec776e',.7],
  [.96,'#ec776e',.2],[1,'#ec776e',0]
 ];
 out.push(`<g class="rainbow" opacity="${opacity.toFixed(3)}" pointer-events="none"><defs><radialGradient id="${key}-colour" gradientUnits="userSpaceOnUse" cx="${x}" cy="${base}" r="${r}">${stops.map(([offset,c,a])=>`<stop offset="${offset}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient><linearGradient id="${key}-ends" gradientUnits="userSpaceOnUse" x1="0" y1="${base-r}" x2="0" y2="${base}"><stop stop-color="#fff"/><stop offset=".65" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="${key}-fade" maskUnits="userSpaceOnUse" x="${x-r-4}" y="${base-r-4}" width="${r*2+8}" height="${r+8}"><rect x="${x-r-4}" y="${base-r-4}" width="${r*2+8}" height="${r+8}" fill="url(#${key}-ends)"/></mask><filter id="${key}-soft" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation=".65"/></filter></defs><path d="M${x-r} ${base} A${r} ${r} 0 0 1 ${x+r} ${base} Z" fill="url(#${key}-colour)" filter="url(#${key}-soft)" mask="url(#${key}-fade)"/></g>`);
}
