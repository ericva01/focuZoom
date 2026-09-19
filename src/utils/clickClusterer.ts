import { ClickEvent, ClickTarget, CursorPoint } from "@/types/editor";

/**
 * Automatically groups rapid burst clicks (e.g. clicks within 0.5s - 0.8s)
 * into a single unified Zoom sequence section.
 *
 * Inside this section:
 * - The zoom initiates smoothly on the first click.
 * - Stays zoomed in while gliding between consecutive click targets.
 * - Caps group duration to ~3.2s so the camera returns to 1.0x wide view between actions!
 * - Never chains normal paced clicks indefinitely.
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
  // A click belongs to the active cluster ONLY if:
  // (a) gap from the last click in cluster <= thresholdSec (e.g. 0.8s rapid burst / double-click)
  // AND
  // (b) total duration span of the cluster <= MAX_GROUP_SPAN (e.g. 3.2s)
  // This ensures bursts of clicks are smoothly grouped, but the camera returns
  // to 1.0x wide view between distinct actions rather than staying zoomed perpetually!
  const MAX_GROUP_SPAN = 3.2;
  const inDur = 0.4;
  const outDur = 0.4;
  const baseHoldAfterLast = 1.0;

  const targetGroups: ClickTarget[][] = [];
  let currentGroup: ClickTarget[] = [];

  for (const target of dedupedTargets) {
    if (currentGroup.length === 0) {
      currentGroup.push(target);
    } else {
      const prevTarget = currentGroup[currentGroup.length - 1];
      const gapFromPrev = target.timestamp - prevTarget.timestamp;
      const groupSpan = target.timestamp - currentGroup[0].timestamp;

      // Group together if it's a rapid burst (<= 0.8s) and does not exceed maximum section duration
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

    // Total hold ensures the zoom remains active from first click through last click + hold
    const spanBetweenFirstAndLast = lastTarget.timestamp - firstTarget.timestamp;
    const totalHold =
      group.length > 1
        ? Math.min(3.2, Math.max(0.8, Math.round((spanBetweenFirstAndLast + baseHoldAfterLast) * 10) / 10))
        : (matchedOriginal?.holdDuration ?? 1.2);

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
      targets: group.length > 1 ? group : undefined,
      cursorTrail: eventTrail && eventTrail.length > 0 ? eventTrail : undefined,
    });
  }

  // Ensure strict chronological sorting
  clusters.sort((a, b) => a.timestamp - b.timestamp);

  // Safety pass: if any consecutive clusters still touch or overlap, adjust hold duration so there is a clean gap (return to 1.0x)
  for (let i = 0; i < clusters.length - 1; i++) {
    const cur = clusters[i];
    const nxt = clusters[i + 1];
    const curEnd = cur.timestamp + (cur.zoomInDuration ?? 0.4) + (cur.holdDuration ?? 1.2) + (cur.zoomOutDuration ?? 0.4);
    if (curEnd > nxt.timestamp) {
      const maxAvailableHold = Math.max(
        0.3,
        nxt.timestamp - cur.timestamp - (cur.zoomInDuration ?? 0.4) - (cur.zoomOutDuration ?? 0.4) - 0.1
      );
      cur.holdDuration = Math.round(maxAvailableHold * 10) / 10;
    }
  }

  return clusters;
}

/**
 * Unpacks a grouped ClickEvent with multiple targets into individual discrete single-target ClickEvents
 */
export function ungroupClickEvent(event: ClickEvent): ClickEvent[] {
  if (!event.targets || event.targets.length <= 1) {
    return [{ ...event, targets: undefined }];
  }
  const defaultIn = event.zoomInDuration ?? 0.4;
  const defaultOut = event.zoomOutDuration ?? 0.4;
  const defaultHold = 1.2;

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
 * Groups multiple discrete ClickEvents into a single unified multi-target ClickEvent
 */
export function groupClickEvents(
  events: ClickEvent[],
  defaultZoom: number = 2.2,
  fullTrail?: CursorPoint[]
): ClickEvent | null {
  if (!events || events.length === 0) return null;
  if (events.length === 1) return events[0];

  const allTargets: ClickTarget[] = [];
  for (const ev of events) {
    if (ev.targets && ev.targets.length > 0) {
      allTargets.push(...ev.targets);
    } else {
      allTargets.push({
        timestamp: ev.timestamp,
        x: ev.x,
        y: ev.y,
        label: ev.label,
      });
    }
  }
  allTargets.sort((a, b) => a.timestamp - b.timestamp);

  const first = allTargets[0];
  const last = allTargets[allTargets.length - 1];
  const sortedEvents = events.slice().sort((a, b) => a.timestamp - b.timestamp);
  const firstEv = sortedEvents[0];
  const zoom = firstEv.zoom || defaultZoom;
  const inDur = firstEv.zoomInDuration ?? 0.4;
  const outDur = firstEv.zoomOutDuration ?? 0.4;
  const span = last.timestamp - first.timestamp;
  const holdDuration = Math.min(6.0, Math.max(1.0, Math.round((span + 0.8) * 10) / 10));

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
