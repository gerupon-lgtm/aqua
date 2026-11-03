export const FEED_DEPTH=13.5,FEED_WIDTH=5.5;
export function feedPath(sourceX,cx,y=370){const r=4,d=FEED_DEPTH;return`M${sourceX} ${y} V${y+d-r} Q${sourceX} ${y+d} ${sourceX+r} ${y+d} H${cx-r} Q${cx} ${y+d} ${cx} ${y+d-r} V${y}`;}
