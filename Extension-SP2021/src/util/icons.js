const EXCLAMATION_DATA = 'M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z'
const K_DATA = 'M1100 9794 c-184 -27 -298 -61 -438 -134 -330 -170 -555 -470 -639 -852 -17 -79 -18 -246 -18 -3903 0 -3629 1 -3824 18 -3908 171 -840 1101 -1258 1832 -822 282 167 468 420 564 765 l26 95 5 1595 5 1594 30 -46 c40 -61 2912 -3446 2989 -3521 353 -351 889 -450 1353 -250 262 114 508 358 624 621 146 332 141 706 -15 1026 -29 61 -73 139 -97 173 -24 33 -541 647 -1149 1362 -608 716 -1105 1306 -1105 1311 0 5 497 594 1104 1309 607 715 1125 1330 1151 1368 246 353 286 816 105 1210 -118 256 -356 490 -614 604 -472 208 -1020 102 -1375 -268 -103 -108 -2920 -3425 -2965 -3492 l-36 -54 -5 1589 c-6 1744 -2 1613 -65 1804 -127 382 -459 690 -851 790 -131 34 -328 49 -434 34z'
const K_TRANS = 'translate(0,980) scale(0.1,-0.1)'

export function exclamationSym (xScale = 0.1, yScale, color = 'grey') {
  if (yScale === undefined) { yScale = xScale }
  const symbol = jQuery('<svg>')
  symbol.attr('viewBox', '0 0 192 512')
  symbol.append(
    jQuery('<g>').attr({ transform: `scale(${xScale}, ${yScale})`, fill: color }).append(
      jQuery('<path>').attr('d', EXCLAMATION_DATA)
    )
  )
  return symbol
}

export function letterKSym () {
  const symbol = jQuery('<svg>')
  symbol.attr({ x: 0, y: 0, width: 756, height: 980 })
  symbol.append(
    jQuery('<g>').attr('transform', K_TRANS).append(
      jQuery('<path>').attr('d', K_DATA)
    )
  )
  return symbol
}
