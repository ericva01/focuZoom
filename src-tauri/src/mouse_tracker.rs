use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Mutex, OnceLock};
use std::time::Instant;
use serde::Serialize;

#[derive(Serialize, Clone, Debug)]
pub struct RecordedClick {
    pub timestamp: f64,
    pub x: f64,
    pub y: f64,
}

#[derive(Serialize, Clone, Debug)]
pub struct CursorPoint {
    pub timestamp: f64,
    pub x: f64,
    pub y: f64,
}

#[derive(Serialize, Clone, Debug)]
pub struct TrackingSessionResult {
    pub clicks: Vec<RecordedClick>,
    pub trail: Vec<CursorPoint>,
}

struct TrackerState {
    tracking: AtomicBool,
    start_time: Mutex<Option<Instant>>,
    clicks: Mutex<Vec<RecordedClick>>,
    trail: Mutex<Vec<CursorPoint>>,
}

fn tracker() -> &'static TrackerState {
    static TRACKER: OnceLock<TrackerState> = OnceLock::new();
    TRACKER.get_or_init(|| TrackerState {
        tracking: AtomicBool::new(false),
        start_time: Mutex::new(None),
        clicks: Mutex::new(Vec::new()),
        trail: Mutex::new(Vec::new()),
    })
}

#[cfg(target_os = "windows")]
mod win {
    #[repr(C)]
    #[derive(Copy, Clone, Debug)]
    pub struct POINT {
        pub x: i32,
        pub y: i32,
    }

    #[repr(C)]
    #[derive(Copy, Clone, Debug)]
    pub struct RECT {
        pub left: i32,
        pub top: i32,
        pub right: i32,
        pub bottom: i32,
    }

    #[repr(C)]
    #[derive(Copy, Clone, Debug)]
    pub struct MONITORINFO {
        pub cb_size: u32,
        pub rc_monitor: RECT,
        pub rc_work: RECT,
        pub dw_flags: u32,
    }

    pub type HMONITOR = isize;
    pub const MONITOR_DEFAULTTONEAREST: u32 = 2;
    pub const VK_LBUTTON: i32 = 0x01;
    pub const DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2: isize = -4;

    #[link(name = "user32")]
    extern "system" {
        pub fn GetCursorPos(lpPoint: *mut POINT) -> i32;
        pub fn GetAsyncKeyState(vKey: i32) -> i16;
        pub fn GetSystemMetrics(nIndex: i32) -> i32;
        pub fn MonitorFromPoint(pt: POINT, dwFlags: u32) -> HMONITOR;
        pub fn GetMonitorInfoW(hMonitor: HMONITOR, lpmi: *mut MONITORINFO) -> i32;
        pub fn SetThreadDpiAwarenessContext(dpiContext: isize) -> isize;
    }

    pub const SM_CXSCREEN: i32 = 0;
    pub const SM_CYSCREEN: i32 = 1;

    #[inline]
    pub unsafe fn normalize_cursor_point(pt: POINT) -> (f64, f64) {
        let h_monitor = MonitorFromPoint(pt, MONITOR_DEFAULTTONEAREST);
        if h_monitor != 0 {
            let mut mi = MONITORINFO {
                cb_size: std::mem::size_of::<MONITORINFO>() as u32,
                rc_monitor: RECT { left: 0, top: 0, right: 0, bottom: 0 },
                rc_work: RECT { left: 0, top: 0, right: 0, bottom: 0 },
                dw_flags: 0,
            };
            if GetMonitorInfoW(h_monitor, &mut mi) != 0 {
                let mon_w = (mi.rc_monitor.right - mi.rc_monitor.left).max(1);
                let mon_h = (mi.rc_monitor.bottom - mi.rc_monitor.top).max(1);
                let norm_x = ((pt.x - mi.rc_monitor.left) as f64 / mon_w as f64).clamp(0.02, 0.98);
                let norm_y = ((pt.y - mi.rc_monitor.top) as f64 / mon_h as f64).clamp(0.02, 0.98);
                return (norm_x, norm_y);
            }
        }

        // Fallback: primary screen
        let screen_w = GetSystemMetrics(SM_CXSCREEN).max(1);
        let screen_h = GetSystemMetrics(SM_CYSCREEN).max(1);
        let norm_x = (pt.x as f64 / screen_w as f64).clamp(0.02, 0.98);
        let norm_y = (pt.y as f64 / screen_h as f64).clamp(0.02, 0.98);
        (norm_x, norm_y)
    }
}

#[tauri::command]
pub fn start_mouse_tracking() {
    let t = tracker();
    t.tracking.store(true, Ordering::SeqCst);
    if let Ok(mut start) = t.start_time.lock() {
        *start = Some(Instant::now());
    }
    if let Ok(mut clicks) = t.clicks.lock() {
        clicks.clear();
    }
    if let Ok(mut trail) = t.trail.lock() {
        trail.clear();
    }

    #[cfg(target_os = "windows")]
    {
        std::thread::spawn(move || {
            unsafe {
                // Ensure thread is Per-Monitor DPI Aware V2 so physical screen pixels match 1:1
                win::SetThreadDpiAwarenessContext(win::DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
            }

            let mut was_down = false;
            let mut last_click_time = 0.0f64;
            let mut last_sample_time = 0.0f64;
            let mut last_pos = (-1i32, -1i32);

            while tracker().tracking.load(Ordering::Relaxed) {
                let elapsed = tracker()
                    .start_time
                    .lock()
                    .ok()
                    .and_then(|st| st.map(|s| s.elapsed().as_secs_f64()))
                    .unwrap_or(0.0);

                let mut pt = win::POINT { x: 0, y: 0 };

                if unsafe { win::GetCursorPos(&mut pt) } != 0 {
                    // Sample every ~20ms (up to 50 FPS) if moved, or every 60ms if stationary
                    let has_moved = pt.x != last_pos.0 || pt.y != last_pos.1;
                    let time_since_last = elapsed - last_sample_time;
                    if (has_moved && time_since_last >= 0.02) || time_since_last >= 0.06 {
                        last_pos = (pt.x, pt.y);
                        last_sample_time = elapsed;

                        let (norm_x, norm_y) = unsafe { win::normalize_cursor_point(pt) };

                        if let Ok(mut trail) = tracker().trail.lock() {
                            if trail.len() < 120_000 {
                                trail.push(CursorPoint {
                                    timestamp: (elapsed * 100.0).round() / 100.0,
                                    x: (norm_x * 1000.0).round() / 1000.0,
                                    y: (norm_y * 1000.0).round() / 1000.0,
                                });
                            }
                        }
                    }

                    // Click detection
                    let key_state = unsafe { win::GetAsyncKeyState(win::VK_LBUTTON) };
                    let is_down = (key_state as u16 & 0x8000) != 0;

                    if is_down && !was_down {
                        // Debounce rapid clicks within 120ms
                        if elapsed - last_click_time > 0.12 {
                            last_click_time = elapsed;
                            let (norm_x, norm_y) = unsafe { win::normalize_cursor_point(pt) };

                            if let Ok(mut clicks) = tracker().clicks.lock() {
                                clicks.push(RecordedClick {
                                    timestamp: (elapsed * 100.0).round() / 100.0,
                                    x: (norm_x * 1000.0).round() / 1000.0,
                                    y: (norm_y * 1000.0).round() / 1000.0,
                                });
                            }
                        }
                    }
                    was_down = is_down;
                }

                std::thread::sleep(std::time::Duration::from_millis(16));
            }
        });
    }
}

#[tauri::command]
pub fn stop_mouse_tracking() -> TrackingSessionResult {
    let t = tracker();
    t.tracking.store(false, Ordering::SeqCst);
    let clicks = t.clicks.lock().map(|c| c.clone()).unwrap_or_default();
    let trail = t.trail.lock().map(|tr| tr.clone()).unwrap_or_default();
    TrackingSessionResult { clicks, trail }
}
