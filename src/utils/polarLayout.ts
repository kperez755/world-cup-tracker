/**
 * Polar coordinate math for the circular bracket layout.
 * Positions match nodes on concentric rings using polar-to-Cartesian conversion.
 */

/** Convert polar coordinates to Cartesian */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180; // -90 to start from top
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

/** Calculate the radius for a given ring */
export function calculateRingRadius(
  ring: number,
  totalRings: number,
  maxRadius: number,
  minRadius: number = 60
): number {
  if (totalRings <= 1) return (maxRadius + minRadius) / 2;
  // Ring 0 = outermost, ring (totalRings-1) = center
  const t = ring / (totalRings - 1);
  return maxRadius - t * (maxRadius - minRadius);
}

/** Calculate the angle for a match within its ring */
export function calculateMatchAngle(
  index: number,
  totalInRing: number,
  offsetDeg: number = 0
): number {
  if (totalInRing === 0) return 0;
  const spacing = 360 / totalInRing;
  return offsetDeg + index * spacing;
}

/** Generate an SVG curved path between two points (for connector lines) */
export function generateConnectorPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx: number,
  cy: number
): string {
  // Use a quadratic bezier that curves through the bracket center direction
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Pull the control point toward the center
  const controlX = midX + (cx - midX) * 0.3;
  const controlY = midY + (cy - midY) * 0.3;

  return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
}

export function generateOrthogonalConnector(
  nodeChild: { x: number; y: number; angle: number },
  nodeParent: { x: number; y: number; angle: number },
  cx: number,
  cy: number
): string {
  const rChild = Math.hypot(nodeChild.x - cx, nodeChild.y - cy);
  const rParent = Math.hypot(nodeParent.x - cx, nodeParent.y - cy);

  if (rParent <= 1) { // Final node at center
    return `M ${nodeChild.x} ${nodeChild.y} L ${nodeParent.x} ${nodeParent.y}`;
  }

  const rMid = (rChild + rParent) / 2;
  const start = { x: nodeChild.x, y: nodeChild.y };
  const end = { x: nodeParent.x, y: nodeParent.y };

  const mid1 = polarToCartesian(cx, cy, rMid, nodeChild.angle);
  const mid2 = polarToCartesian(cx, cy, rMid, nodeParent.angle);

  const delta = ((nodeParent.angle - nodeChild.angle + 540) % 360) - 180;
  const sweepFlag = delta > 0 ? 1 : 0;

  return `M ${start.x} ${start.y} 
          L ${mid1.x} ${mid1.y} 
          A ${rMid} ${rMid} 0 0 ${sweepFlag} ${mid2.x} ${mid2.y} 
          L ${end.x} ${end.y}`;
}

/** Calculate layout for the entire bracket */
export function calculateBracketLayout(config: {
  centerX: number;
  centerY: number;
  maxRadius: number;
  rings: Array<{ count: number; offsetDeg?: number }>;
}): Array<Array<{ x: number; y: number; angle: number; radius: number }>> {
  const { centerX, centerY, maxRadius, rings } = config;
  const totalRings = rings.length;

  return rings.map((ring, ringIndex) => {
    const radius = calculateRingRadius(ringIndex, totalRings, maxRadius);
    return Array.from({ length: ring.count }, (_, i) => {
      const angle = calculateMatchAngle(i, ring.count, ring.offsetDeg ?? 0);
      const { x, y } = polarToCartesian(centerX, centerY, radius, angle);
      return { x, y, angle, radius };
    });
  });
}
