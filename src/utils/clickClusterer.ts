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
  thresholdSec: number = 1.8,
  defaultZoom: number = 2.2,
  fullTrail?: CursorPoint[]
): ClickEvent[] {
  if (!clicks || clicks.length === 0) return [];

  // Step 1: Flatten all incoming events and unpack any existing multi-target clusters
  const rawTargets: ClickTarget[] = [];
  for (const c of clicks) {
    if (c.targets && c.targets.length > 0) {
      for (const t of c.targets) {
        rawTargets.push({
          timestamp: t.timestamp,
          x: t.x,
          y: t.y,
          label: t.label || c.label,
        });
      }
    } else {
      rawTargets.push({
        timestamp: c.timestamp,
        x: c.x,
        y: c.y,
        label: c.label,
      });
    }
  }

  // Sort raw clicks chronologically
  rawTargets.sort((a, b) => a.timestamp - b.timestamp);

  // Deduplicate clicks that happen virtually at the same exact time (< 0.05s)
  const dedupedTargets: ClickTarget[] = [];
  for (const t of rawTargets) {
    if (dedupedTargets.length === 0) {
      dedupedTargets.push(t);
    } else {
      const prev = dedupedTargets[dedupedTargets.length - 1];
      if (Math.abs(t.timestamp - prev.timestamp) >= 0.05) {
        dedupedTargets.push(t);
      }
    }
  }

  if (dedupedTargets.length === 0) return [];

  // Step 2: Group clicks into non-overlapping unified zoom sections
  // A click belongs to the active cluster if:
  // (a) gap from the last click in cluster <= thresholdSec (e.g. 1.8s)
  // OR
  // (b) click timestamp occurs before the current cluster would have finished its zoom hold/exit
  const targetGroups: ClickTarget[][] = [];
  let currentGroup: ClickTarget[] = [];
  let currentGroupEstimatedEnd = 0;

  const inDur = 0.4;
  const outDur = 0.4;
  const baseHoldAfterLast = 1.2;

  for (const target of dedupedTargets) {
    if (currentGroup.length === 0) {
      currentGroup.push(target);
      currentGroupEstimatedEnd = target.timestamp + inDur + baseHoldAfterLast + outDur;
    } else {
      const prevTarget = currentGroup[currentGroup.length - 1];
      const gapFromPrev = target.timestamp - prevTarget.timestamp;

      // Check if this click should be unified into the active section
      const isWithinTimeThreshold = gapFromPrev <= thresholdSec;
      const isWithinActiveZoomWindow = target.timestamp < (currentGroupEstimatedEnd - 0.1);

      if (isWithinTimeThreshold || isWithinActiveZoomWindow) {
        currentGroup.push(target);
        // Extend cluster end time so following clicks can also merge seamlessly
        currentGroupEstimatedEnd = Math.max(
          currentGroupEstimatedEnd,
          target.timestamp + inDur + baseHoldAfterLast + outDur
        );
      } else {
        targetGroups.push(currentGroup);
        currentGroup = [target];
        currentGroupEstimatedEnd = target.timestamp + inDur + baseHoldAfterLast + outDur;
      }
    }
  }

  if (currentGroup.length > 0) {
    targetGroups.push(currentGroup);
  }

  // Step 3: Convert each target group into a single ClickEvent
  const clusters: ClickEvent[] = [];
  for (let idx = 0; idx < targetGroups.length; idx++) {
    const group = targetGroups[idx];
    const firstTarget = group[0];
    const lastTarget = group[group.length - 1];

    // Find any matching style properties from the original clicks
    const matchedOriginal = clicks.find(
      (c) => Math.abs(c.timestamp - firstTarget.timestamp) < 0.15
    ) || clicks[0];

    const zoomScale = matchedOriginal?.zoom || defaultZoom;
    const actualInDur = matchedOriginal?.zoomInDuration ?? inDur;
    const actualOutDur = matchedOriginal?.zoomOutDuration ?? outDur;

    // Total hold ensures the zoom remains fully zoomed from first click through last click + hold
    const spanBetweenFirstAndLast = lastTarget.timestamp - firstTarget.timestamp;
    const totalHold =
      group.length > 1
        ? Math.round((spanBetweenFirstAndLast + baseHoldAfterLast) * 10) / 10
        : (matchedOriginal?.holdDuration ?? 1.4);

    const startTime = Math.round(firstTarget.timestamp * 100) / 100;
    const endTime = startTime + actualInDur + totalHold + actualOutDur;

    // Extract continuous cursor points that occur during this zoom window
    let eventTrail: CursorPoint[] | undefined;
    if (fullTrail && fullTrail.length > 0) {
      eventTrail = fullTrail.filter(
        (p) => p.timestamp >= startTime - 0.25 && p.timestamp <= endTime + 0.25
      );
    } else {
      const existing = clicks.flatMap((c) => c.cursorTrail || []);
      if (existing.length > 0) {
        eventTrail = existing.filter(
          (p) => p.timestamp >= startTime - 0.25 && p.timestamp <= endTime + 0.25
        );
      }
    }

    const clusterId =
      group.length > 1
        ? `zoom-cluster-${Math.round(startTime * 100)}-${group.length}`
        : (matchedOriginal?.id || `zoom-${Math.round(startTime * 100)}`);

    const clusterLabel =
      group.length > 1
        ? `Zoom ${zoomScale}X (${group.length} Clicks)`
        : (matchedOriginal?.label || `Zoom ${zoomScale}X`);

    clusters.push({
      id: clusterId,
      timestamp: startTime,
      x: firstTarget.x,
      y: firstTarget.y,
      zoom: zoomScale,
      zoomInDuration: actualInDur,
      holdDuration: totalHold,
      zoomOutDuration: actualOutDur,
      label: clusterLabel,
      enabled: matchedOriginal ? (matchedOriginal.enabled ?? true) : true,
      framingStyle: matchedOriginal?.framingStyle,
      screenAnglePreset: matchedOriginal?.screenAnglePreset,
      targets: group,
      cursorTrail: eventTrail && eventTrail.length > 0 ? eventTrail : undefined,
    });
  }

  // Ensure strict chronological sorting and zero overlap between consecutive cluster sections
  clusters.sort((a, b) => a.timestamp - b.timestamp);

  // Safety pass: if any consecutive clusters still touch or overlap, adjust start or trim
  for (let i = 0; i < clusters.length - 1; i++) {
    const cur = clusters[i];
    const nxt = clusters[i + 1];
    const curEnd = cur.timestamp + (cur.zoomInDuration ?? 0.4) + (cur.holdDuration ?? 1.4) + (cur.zoomOutDuration ?? 0.4);
    if (curEnd > nxt.timestamp) {
      // If overlap detected, clamp cur hold duration so it cleanly finishes before nxt starts
      const maxAvailableHold = Math.max(
        0.3,
        nxt.timestamp - cur.timestamp - (cur.zoomInDuration ?? 0.4) - (cur.zoomOutDuration ?? 0.4) - 0.05
      );
      cur.holdDuration = Math.round(maxAvailableHold * 10) / 10;
    }
  }

  return clusters;
}
