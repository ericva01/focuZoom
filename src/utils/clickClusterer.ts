import { ClickEvent, ClickTarget, CursorPoint } from "@/types/editor";

/**
 * Calculates Euclidean distance between two 2D points (normalized 0..1).
 */
export function getPointsDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

/**
 * Calculates a sticky anchor point for nearby targets.
 * If multiple consecutive targets are within `threshold` (default 0.18, ~18% screen space),
 * they share the common cluster centroid to keep the camera completely steady & fixed.
 */
export function applyStickyAnchorsToTargets(
  targets: ClickTarget[],
  threshold: number = 0.18
): ClickTarget[] {
  if (!targets || targets.length <= 1) return targets;

  const result: ClickTarget[] = [];
  let cluster: ClickTarget[] = [targets[0]];

  for (let i = 1; i < targets.length; i++) {
    const current = targets[i];
    const firstInCluster = cluster[0];
    const dist = getPointsDistance(firstInCluster.x, firstInCluster.y, current.x, current.y);

    if (dist <= threshold) {
      cluster.push(current);
    } else {
      // Calculate cluster centroid
      const avgX = cluster.reduce((sum, t) => sum + t.x, 0) / cluster.length;
      const avgY = cluster.reduce((sum, t) => sum + t.y, 0) / cluster.length;
      const roundX = Math.round(avgX * 1000) / 1000;
      const roundY = Math.round(avgY * 1000) / 1000;

      for (const t of cluster) {
        result.push({
          ...t,
          x: roundX,
          y: roundY,
        });
      }
      cluster = [current];
    }
  }

  if (cluster.length > 0) {
    const avgX = cluster.reduce((sum, t) => sum + t.x, 0) / cluster.length;
    const avgY = cluster.reduce((sum, t) => sum + t.y, 0) / cluster.length;
    const roundX = Math.round(avgX * 1000) / 1000;
    const roundY = Math.round(avgY * 1000) / 1000;

    for (const t of cluster) {
      result.push({
        ...t,
        x: roundX,
        y: roundY,
      });
    }
  }

  return result;
}

/**
 * Automatically detects and merges any overlapping timeline animation keyframes
 * into a single unified grouped section.
 *
 * Prevents camera collision and jitter when keyframes are close or overlap.
 */
export function mergeOverlappingEvents(
  events: ClickEvent[],
  defaultZoom: number = 2.2,
  fullTrail?: CursorPoint[]
): ClickEvent[] {
  if (!events || events.length <= 1) return events || [];

  // Sort chronologically by start timestamp
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const merged: ClickEvent[] = [];
  let currentGroup: ClickEvent[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const nextEv = sorted[i];
    const prevEv = currentGroup[currentGroup.length - 1];

    // Compute end time of the active group
    const groupFirstTime = currentGroup[0].timestamp;
    const groupLastEnd = currentGroup.reduce((maxEnd, ev) => {
      const inD = ev.zoomInDuration ?? 0.8;
      const holdD = ev.holdDuration ?? 1.4;
      const outD = ev.zoomOutDuration ?? 0.8;
      return Math.max(maxEnd, ev.timestamp + inD + holdD + outD);
    }, groupFirstTime);

    // Overlap condition: next event starts before previous group finishes (or within 0.15s buffer)
    if (nextEv.timestamp < groupLastEnd + 0.15) {
      currentGroup.push(nextEv);
    } else {
      if (currentGroup.length === 1) {
        merged.push(currentGroup[0]);
      } else {
        const grouped = groupClickEvents(currentGroup, defaultZoom, fullTrail);
        if (grouped) merged.push(grouped);
      }
      currentGroup = [nextEv];
    }
  }

  if (currentGroup.length === 1) {
    merged.push(currentGroup[0]);
  } else if (currentGroup.length > 1) {
    const grouped = groupClickEvents(currentGroup, defaultZoom, fullTrail);
    if (grouped) merged.push(grouped);
  }

  return merged;
}

/**
 * Automatically groups rapid burst clicks (e.g. clicks within 0.8s)
 * into a single unified Zoom sequence section.
 */
export function clusterNearbyClicks(
  clicks: ClickEvent[],
  thresholdSec: number = 0.8,
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
  const MAX_GROUP_SPAN = 4.0;
  const inDur = 0.8;
  const outDur = 0.8;
  const baseHoldAfterLast = 1.4;

  const targetGroups: ClickTarget[][] = [];
  let currentGroup: ClickTarget[] = [];

  for (const target of dedupedTargets) {
    if (currentGroup.length === 0) {
      currentGroup.push(target);
    } else {
      const prevTarget = currentGroup[currentGroup.length - 1];
      const gapFromPrev = target.timestamp - prevTarget.timestamp;
      const groupSpan = target.timestamp - currentGroup[0].timestamp;

      if (gapFromPrev <= thresholdSec && groupSpan <= MAX_GROUP_SPAN) {
        currentGroup.push(target);
      } else {
        targetGroups.push(currentGroup);
        currentGroup = [target];
      }
    }
  }

  if (currentGroup.length > 0) {
    targetGroups.push(currentGroup);
  }

  // Step 3: Convert each target group into a single ClickEvent with sticky anchors
  const clusters: ClickEvent[] = [];
  for (let idx = 0; idx < targetGroups.length; idx++) {
    const rawGroup = targetGroups[idx];
    const group = applyStickyAnchorsToTargets(rawGroup, 0.18);
    const firstTarget = group[0];
    const lastTarget = group[group.length - 1];

    const matchedOriginal = clicks.find(
      (c) => Math.abs(c.timestamp - firstTarget.timestamp) < 0.15
    ) || clicks[0];

    const zoomScale = matchedOriginal?.zoom || defaultZoom;
    const actualInDur = matchedOriginal?.zoomInDuration ?? inDur;
    const actualOutDur = matchedOriginal?.zoomOutDuration ?? outDur;

    const spanBetweenFirstAndLast = lastTarget.timestamp - firstTarget.timestamp;
    const totalHold =
      group.length > 1
        ? Math.min(4.5, Math.max(1.0, Math.round((spanBetweenFirstAndLast + baseHoldAfterLast) * 10) / 10))
        : (matchedOriginal?.holdDuration ?? 1.4);

    const startTime = Math.round(firstTarget.timestamp * 100) / 100;
    const endTime = startTime + actualInDur + totalHold + actualOutDur;

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
      targets: group.length > 1 ? group : undefined,
      cursorTrail: eventTrail && eventTrail.length > 0 ? eventTrail : undefined,
    });
  }

  // Safety pass: merge any remaining overlaps
  return mergeOverlappingEvents(clusters, defaultZoom, fullTrail);
}

/**
 * Unpacks a grouped ClickEvent with multiple targets into individual discrete single-target ClickEvents
 */
export function ungroupClickEvent(event: ClickEvent): ClickEvent[] {
  if (!event.targets || event.targets.length <= 1) {
    return [{ ...event, targets: undefined }];
  }
  const defaultIn = event.zoomInDuration ?? 0.8;
  const defaultOut = event.zoomOutDuration ?? 0.8;
  const defaultHold = 1.4;

  return event.targets.map((tgt, idx) => ({
    id: `${event.id}-part-${idx}-${Math.round(tgt.timestamp * 100)}`,
    timestamp: Math.round(tgt.timestamp * 100) / 100,
    x: tgt.x,
    y: tgt.y,
    zoom: event.zoom || 2.0,
    zoomInDuration: defaultIn,
    holdDuration: defaultHold,
    zoomOutDuration: defaultOut,
    label: tgt.label || `Zoom ${(event.zoom || 2.0).toFixed(1)}X`,
    enabled: event.enabled ?? true,
    framingStyle: event.framingStyle,
    screenAnglePreset: event.screenAnglePreset,
    targets: undefined,
  }));
}

/**
 * Groups multiple discrete ClickEvents into a single unified multi-target ClickEvent with sticky anchors
 */
export function groupClickEvents(
  events: ClickEvent[],
  defaultZoom: number = 2.2,
  fullTrail?: CursorPoint[]
): ClickEvent | null {
  if (!events || events.length === 0) return null;
  if (events.length === 1) return events[0];

  const rawTargets: ClickTarget[] = [];
  for (const ev of events) {
    if (ev.targets && ev.targets.length > 0) {
      rawTargets.push(...ev.targets);
    } else {
      rawTargets.push({
        timestamp: ev.timestamp,
        x: ev.x,
        y: ev.y,
        label: ev.label,
      });
    }
  }
  rawTargets.sort((a, b) => a.timestamp - b.timestamp);

  // Apply sticky centroid anchoring for nearby buttons
  const allTargets = applyStickyAnchorsToTargets(rawTargets, 0.18);

  const first = allTargets[0];
  const last = allTargets[allTargets.length - 1];
  const sortedEvents = events.slice().sort((a, b) => a.timestamp - b.timestamp);
  const firstEv = sortedEvents[0];
  const zoom = firstEv.zoom || defaultZoom;
  const inDur = firstEv.zoomInDuration ?? 0.8;
  const outDur = firstEv.zoomOutDuration ?? 0.8;
  const span = last.timestamp - first.timestamp;
  const holdDuration = Math.min(6.0, Math.max(1.2, Math.round((span + 1.2) * 10) / 10));

  const startTime = Math.round(first.timestamp * 100) / 100;
  const endTime = startTime + inDur + holdDuration + outDur;

  let eventTrail: CursorPoint[] | undefined;
  if (fullTrail && fullTrail.length > 0) {
    eventTrail = fullTrail.filter(
      (p) => p.timestamp >= startTime - 0.25 && p.timestamp <= endTime + 0.25
    );
  } else {
    const existing = events.flatMap((c) => c.cursorTrail || []);
    if (existing.length > 0) {
      eventTrail = existing.filter(
        (p) => p.timestamp >= startTime - 0.25 && p.timestamp <= endTime + 0.25
      );
    }
  }

  return {
    id: `zoom-group-${Math.round(startTime * 100)}-${allTargets.length}`,
    timestamp: startTime,
    x: first.x,
    y: first.y,
    zoom,
    zoomInDuration: inDur,
    holdDuration,
    zoomOutDuration: outDur,
    label: `Zoom ${zoom}X (${allTargets.length} Clicks)`,
    enabled: firstEv.enabled ?? true,
    framingStyle: firstEv.framingStyle,
    screenAnglePreset: firstEv.screenAnglePreset,
    targets: allTargets,
    cursorTrail: eventTrail && eventTrail.length > 0 ? eventTrail : undefined,
  };
}
