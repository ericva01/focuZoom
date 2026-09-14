import { ClickEvent, ClickTarget, CursorPoint } from "@/types/editor";

/**
 * Automatically groups clicks that happen close to each other (e.g. within 1.5 - 2.0 seconds)
 * into a single unified Zoom sequence object.
 *
 * Inside this unified object:
 * - The zoom initiates on the first click.
 * - Stays zoomed in without zooming back out to 1.0x.
 * - Smoothly glides to each subsequent click target and follows continuous cursor trajectory.
 * - Holds until after the last click before smoothly zooming out.
 */
export function clusterNearbyClicks(
  clicks: ClickEvent[],
  thresholdSec: number = 2.0,
  defaultZoom: number = 2.2,
  fullTrail?: CursorPoint[]
): ClickEvent[] {
  if (!clicks || clicks.length === 0) return [];

  // Sort chronologically
  const sorted = [...clicks].sort((a, b) => a.timestamp - b.timestamp);
  const clusters: ClickEvent[] = [];
  let currentGroup: ClickEvent[] = [];

  for (const click of sorted) {
    if (currentGroup.length === 0) {
      currentGroup.push(click);
    } else {
      const prevClick = currentGroup[currentGroup.length - 1];
      const gap = click.timestamp - prevClick.timestamp;

      // If within threshold, merge into current cluster
      if (gap <= thresholdSec) {
        currentGroup.push(click);
      } else {
        clusters.push(buildClusterEvent(currentGroup, defaultZoom, fullTrail));
        currentGroup = [click];
      }
    }
  }

  if (currentGroup.length > 0) {
    clusters.push(buildClusterEvent(currentGroup, defaultZoom, fullTrail));
  }

  return clusters;
}

function buildClusterEvent(
  group: ClickEvent[],
  defaultZoom: number,
  fullTrail?: CursorPoint[]
): ClickEvent {
  const first = group[0];
  const last = group[group.length - 1];

  const allTargets: ClickTarget[] = [];
  for (const item of group) {
    if (item.targets && item.targets.length > 0) {
      allTargets.push(...item.targets);
    } else {
      allTargets.push({
        timestamp: item.timestamp,
        x: item.x,
        y: item.y,
        label: item.label,
      });
    }
  }

  // Sort target timestamps chronologically
  allTargets.sort((a, b) => a.timestamp - b.timestamp);

  const zoomScale = first.zoom || defaultZoom;
  const inDur = first.zoomInDuration ?? 0.4;
  const outDur = last.zoomOutDuration ?? 0.4;
  const baseHoldAfterLast = 1.4;

  const totalHold =
    group.length > 1
      ? Math.round(((last.timestamp - first.timestamp) + baseHoldAfterLast) * 10) / 10
      : (first.holdDuration ?? 1.4);

  const startTime = first.timestamp;
  const endTime = startTime + inDur + totalHold + outDur;

  // Extract continuous cursor points that occur during this zoom window
  let eventTrail: CursorPoint[] | undefined;
  if (fullTrail && fullTrail.length > 0) {
    eventTrail = fullTrail.filter(
      (p) => p.timestamp >= startTime - 0.25 && p.timestamp <= endTime + 0.25
    );
  } else {
    // Collect any existing trails from the grouped items
    const existing = group.flatMap((g) => g.cursorTrail || []);
    if (existing.length > 0) {
      existing.sort((a, b) => a.timestamp - b.timestamp);
      eventTrail = existing;
    }
  }

  return {
    id: group.length > 1 ? `zoom-cluster-${first.id}` : first.id,
    timestamp: first.timestamp,
    x: first.x,
    y: first.y,
    zoom: zoomScale,
    zoomInDuration: inDur,
    holdDuration: totalHold,
    zoomOutDuration: outDur,
    label:
      group.length > 1
        ? `Zoom ${zoomScale}X (${allTargets.length} Clicks)`
        : (first.label || `Zoom ${zoomScale}X`),
    enabled: group.some((g) => g.enabled),
    framingStyle: first.framingStyle,
    screenAnglePreset: first.screenAnglePreset,
    targets: allTargets,
    cursorTrail: eventTrail && eventTrail.length > 0 ? eventTrail : undefined,
  };
}
