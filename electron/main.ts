import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain, dialog, shell, desktopCapturer, session } from "electron";
import path from "path";
import fs from "fs";
import { startStaticServer, LocalServerResult } from "./server";

let mainWindow: BrowserWindow | null = null;
let staticServer: LocalServerResult | null = null;

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

function getStaticDir(): string {
  // Check common locations for the exported Next.js 'out' directory
  const candidatePaths = [
    path.join(process.resourcesPath, "app.asar.unpacked/out"),
    path.join(app.getAppPath(), "../app.asar.unpacked/out"),
    path.join(__dirname, "../out"),
    path.join(app.getAppPath(), "out"),
    path.join(process.resourcesPath, "out"),
    path.join(process.resourcesPath, "app/out"),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) {
      console.log("[Glideo] Found static export at:", p);
      return p;
    }
  }

  const fallback = path.join(__dirname, "../out");
  console.log("[Glideo] Fallback static path:", fallback);
  return fallback;
}

function createApplicationMenu(window: BrowserWindow) {
  const isMac = process.platform === "darwin";

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? ([
          {
            label: app.name,
            submenu: [
              { role: "about" as const },
              { type: "separator" as const },
              { role: "services" as const },
              { type: "separator" as const },
              { role: "hide" as const },
              { role: "hideOthers" as const },
              { role: "unhide" as const },
              { type: "separator" as const },
              { role: "quit" as const },
            ],
          },
        ] as MenuItemConstructorOptions[])
      : []),
    {
      label: "File",
      submenu: [
        {
          label: "New Project",
          accelerator: "CmdOrCtrl+N",
          click: () => window.webContents.send("menu:action", "file:new"),
        },
        {
          label: "Open Video...",
          accelerator: "CmdOrCtrl+O",
          click: () => window.webContents.send("menu:action", "file:open"),
        },
        {
          label: "Save Project",
          accelerator: "CmdOrCtrl+S",
          click: () => window.webContents.send("menu:action", "file:save"),
        },
        { type: "separator" as const },
        {
          label: "Export Video",
          accelerator: "CmdOrCtrl+E",
          click: () => window.webContents.send("menu:action", "file:export"),
        },
        { type: "separator" as const },
        isMac ? { role: "close" as const } : { role: "quit" as const },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" as const },
        { role: "redo" as const },
        { type: "separator" as const },
        { role: "cut" as const },
        { role: "copy" as const },
        { role: "paste" as const },
        { role: "selectAll" as const },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" as const },
        { role: "forceReload" as const },
        { role: "toggleDevTools" as const },
        { type: "separator" as const },
        { role: "resetZoom" as const },
        { role: "zoomIn" as const },
        { role: "zoomOut" as const },
        { type: "separator" as const },
        { role: "togglefullscreen" as const },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" as const },
        { role: "zoom" as const },
        ...(isMac
          ? [
              { type: "separator" as const },
              { role: "front" as const },
              { type: "separator" as const },
              { role: "window" as const },
            ]
          : [{ role: "close" as const }]),
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Glideo Documentation",
          click: async () => {
            await shell.openExternal("https://github.com/ericva01/focuZoom");
          },
        },
        {
          label: "Creator Community",
          click: async () => {
            await shell.openExternal("https://github.com/ericva01/focuZoom/discussions");
          },
        },
        { type: "separator" as const },
        {
          label: "About Glideo",
          click: () => {
            dialog.showMessageBox(window, {
              type: "info",
              title: "About Glideo",
              message: "Glideo",
              detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nNode: ${process.versions.node}\nChromium: ${process.versions.chrome}\nPlatform: ${process.platform} (${process.arch})\n\nAccelerated Canvas Video Editor with Dynamic 3D Camera Animations.`,
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function createWindow() {
  const iconPath =
    process.platform === "win32"
      ? path.join(__dirname, "../resources/icon.ico")
      : path.join(__dirname, "../resources/icon.png");

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: "#060913",
    title: "Glideo",
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
  });

  createApplicationMenu(mainWindow);

  // Smooth appearance: show window only when renderer has painted to prevent any visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Open external links clicked in the renderer in the user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (isDev) {
    const devUrl = process.env.ELECTRON_START_URL || "http://localhost:3000/desktop";
    console.log("[Glideo] Development mode, loading:", devUrl);
    await mainWindow.loadURL(devUrl);
  } else {
    try {
      const staticDir = getStaticDir();
      console.log("[Glideo] Production mode, starting local loopback server for:", staticDir);
      staticServer = await startStaticServer(staticDir);
      console.log("[Glideo] Server listening at:", staticServer.url);
      await mainWindow.loadURL(`${staticServer.url}/desktop`);
    } catch (err) {
      console.error("[Glideo] Failed to start internal offline server:", err);
      // Fallback to load direct desktop.html or index.html if server fails
      const fallbackDesktop = path.join(getStaticDir(), "desktop.html");
      const fallbackPath = fs.existsSync(fallbackDesktop)
        ? fallbackDesktop
        : path.join(getStaticDir(), "index.html");
      if (fs.existsSync(fallbackPath)) {
        await mainWindow.loadFile(fallbackPath);
      }
    }
  }
}

// -----------------------------------------------------------------------------
// IPC Handlers
// -----------------------------------------------------------------------------

function registerIpcHandlers() {
  // Native Video File Picker
  ipcMain.handle("dialog:openVideo", async () => {
    if (!mainWindow) return { canceled: true };

    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Select Video File",
      buttonLabel: "Import Video",
      properties: ["openFile"],
      filters: [
        {
          name: "Video Files (*.mp4, *.mov, *.webm, *.mkv, *.avi)",
          extensions: ["mp4", "mov", "webm", "mkv", "avi"],
        },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const filePath = result.filePaths[0];
    const fileName = path.basename(filePath);
    const stat = await fs.promises.stat(filePath);

    // For files under 50MB, provide dataUrl immediately; otherwise client can read chunks or load via file stream
    let dataUrl: string | undefined = undefined;
    if (stat.size <= 50 * 1024 * 1024) {
      const buffer = await fs.promises.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase().replace(".", "");
      const mime = ext === "mov" ? "video/quicktime" : `video/${ext}`;
      dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    return {
      canceled: false,
      filePath,
      fileName,
      size: stat.size,
      dataUrl,
    };
  });

  // Native Save Project Dialog
  ipcMain.handle("dialog:saveProject", async (_event, options: { defaultPath?: string; data: string }) => {
    if (!mainWindow) return { canceled: true };

    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Save Glideo Project",
      defaultPath: options.defaultPath || "project.glideo",
      filters: [
        { name: "Glideo Project (*.glideo)", extensions: ["glideo"] },
        { name: "JSON File (*.json)", extensions: ["json"] },
      ],
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    await fs.promises.writeFile(result.filePath, options.data, "utf8");
    return { canceled: false, filePath: result.filePath };
  });

  // Native Save Exported Video Dialog
  ipcMain.handle("dialog:saveExportedVideo", async (_event, { defaultName, buffer }: { defaultName: string; buffer: ArrayBuffer }) => {
    if (!mainWindow) return { canceled: true };

    const ext = path.extname(defaultName).replace(".", "") || "webm";
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Save Rendered Video",
      defaultPath: defaultName,
      filters: [
        { name: `${ext.toUpperCase()} Video (*.${ext})`, extensions: [ext] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    const nodeBuffer = Buffer.from(buffer);
    await fs.promises.writeFile(result.filePath, nodeBuffer);
    return { canceled: false, filePath: result.filePath };
  });

  // Safe file reading
  ipcMain.handle("fs:readFile", async (_event, { filePath, asBase64 }: { filePath: string; asBase64?: boolean }) => {
    const data = await fs.promises.readFile(filePath);
    if (asBase64) {
      return data.toString("base64");
    }
    return data.toString("utf8");
  });

  // Safe file writing
  ipcMain.handle("fs:writeFile", async (_event, { filePath, content }: { filePath: string; content: string | ArrayBuffer }) => {
    if (typeof content === "string") {
      await fs.promises.writeFile(filePath, content, "utf8");
    } else {
      await fs.promises.writeFile(filePath, Buffer.from(content));
    }
    return true;
  });

  // Desktop screen capturing sources
  ipcMain.handle("screen:getSources", async (_event, options?: { types?: Array<"window" | "screen"> }) => {
    const types = options?.types || ["screen", "window"];
    const sources = await desktopCapturer.getSources({
      types,
      thumbnailSize: { width: 400, height: 225 },
      fetchWindowIcons: true,
    });

    return sources.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail.toDataURL(),
    }));
  });

  // App & System information
  ipcMain.handle("app:getInfo", () => {
    return {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      electronVersion: process.versions.electron,
    };
  });

  // Open external URL in system browser
  ipcMain.handle("shell:openExternal", async (_event, url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      await shell.openExternal(url);
    }
  });

  // Reveal item in native file manager
  ipcMain.handle("shell:showItemInFolder", (_event, fullPath: string) => {
    shell.showItemInFolder(fullPath);
  });
}

// -----------------------------------------------------------------------------
// App Lifecycle
// -----------------------------------------------------------------------------

if (process.platform === "win32") {
  app.setAppUserModelId("com.glideo.app");
}

app.whenReady().then(async () => {
  // Enable screen & window capture for navigator.mediaDevices.getDisplayMedia in Electron
  session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ["screen", "window"],
        thumbnailSize: { width: 400, height: 225 },
      });
      if (sources.length > 0) {
        // Prioritize full primary display screen, fallback to first source
        const primarySource = sources.find((s) => s.id.startsWith("screen")) || sources[0];
        console.log("[Glideo] Granting display media request for:", primarySource.name, primarySource.id);
        callback({ video: primarySource });
      } else {
        callback({});
      }
    } catch (err) {
      console.error("[Glideo] Failed to handle display media request:", err);
      callback({});
    }
  });

  registerIpcHandlers();
  await createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (staticServer && staticServer.server) {
    try {
      staticServer.server.close();
    } catch {
      // ignore server close error
    }
  }
});
