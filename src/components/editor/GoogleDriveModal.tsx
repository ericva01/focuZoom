"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Folder,
  LogOut,
  Key,
  HelpCircle,
  UploadCloud,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  googleDriveService,
  GoogleDriveStatus,
  GoogleDriveUser,
} from "@/lib/googleDriveService";

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: () => void;
  onBackupProject?: () => Promise<void>;
}

// Google Drive brand icon
export function GoogleDriveIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.45-1.2 3-1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.45 1.2-3 1.2-4.5h-27.5l5.85 10.15z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  );
}

export function GoogleDriveModal({
  isOpen,
  onClose,
  onConnected,
  onBackupProject,
}: GoogleDriveModalProps) {
  const [status, setStatus] = useState<GoogleDriveStatus>({
    isConnected: false,
    user: null,
    folderId: null,
    clientId: "",
  });
  const [clientIdInput, setClientIdInput] = useState<string>("");
  const [manualTokenInput, setManualTokenInput] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"oauth" | "token">("oauth");
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [copiedOrigin, setCopiedOrigin] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const current = googleDriveService.getDriveStatus();
      setStatus(current);
      setClientIdInput(current.clientId || "");
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const handleCopyOrigin = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentOrigin);
      setCopiedOrigin(true);
      setTimeout(() => setCopiedOrigin(false), 2000);
    }
  };

  const handleOAuthConnect = async () => {
    setIsConnecting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await googleDriveService.requestGoogleDriveAccess(clientIdInput);
      if (res.success) {
        const updated = googleDriveService.getDriveStatus();
        setStatus(updated);
        setSuccessMsg("Successfully connected to personal Google Drive!");
        if (onConnected) onConnected();
      } else {
        setErrorMsg(res.error || "Failed to authenticate with Google.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTokenConnect = async () => {
    if (!manualTokenInput.trim()) {
      setErrorMsg("Please enter an access token.");
      return;
    }

    setIsConnecting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await googleDriveService.connectWithAccessToken(manualTokenInput.trim());
      if (res.success) {
        const updated = googleDriveService.getDriveStatus();
        setStatus(updated);
        setSuccessMsg("Successfully authenticated with Google Drive token!");
        setManualTokenInput("");
        if (onConnected) onConnected();
      } else {
        setErrorMsg(res.error || "Invalid or expired token.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Token validation failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm("Disconnect personal Google Drive account from FucuFlow?")) {
      googleDriveService.clearToken();
      setStatus({
        isConnected: false,
        user: null,
        folderId: null,
        clientId: googleDriveService.getStoredClientId(),
      });
      setSuccessMsg("Disconnected Google Drive account.");
    }
  };

  const handleRunBackup = async () => {
    if (!onBackupProject) return;
    setIsBackingUp(true);
    setErrorMsg(null);
    try {
      await onBackupProject();
      setSuccessMsg("Active project backed up to Google Drive!");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to backup project to Google Drive.");
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md p-3 sm:p-4 md:p-6 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg my-auto rounded-3xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-white/15 p-6 shadow-2xl backdrop-blur-2xl text-slate-800 dark:text-slate-100 max-h-[calc(100vh-2rem)] overflow-y-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xs">
              <GoogleDriveIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Personal Google Drive</span>
                {status.isConnected && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Connected
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Save rendered videos &amp; project files directly to your cloud
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback messages */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* State A: Already Connected */}
        {status.isConnected ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Connected Account</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {status.user?.email || "Google User"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  Target Folder
                </span>
                <span className="text-xs font-mono text-slate-800 dark:text-slate-200 font-semibold">
                  FucuFlow Studio Videos
                </span>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                All video exports and project backups are automatically stored inside the dedicated <strong>FucuFlow Studio Videos</strong> folder in your personal Google Drive.
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {onBackupProject && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRunBackup}
                  disabled={isBackingUp}
                  leftIcon={
                    isBackingUp ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5 text-[#FF6B2C]" />
                    )
                  }
                  className="w-full text-xs font-semibold"
                >
                  {isBackingUp ? "Backing up..." : "Backup Project Now"}
                </Button>
              )}

              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                  className="w-full text-xs font-semibold"
                >
                  Open Google Drive
                </Button>
              </a>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Google Account</span>
              </button>
            </div>
          </div>
        ) : (
          /* State B: Not Connected Yet */
          <div className="mt-5 space-y-4">
            {/* Tab switch */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-white/[0.05] p-1 border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("oauth")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "oauth"
                    ? "bg-white dark:bg-[#121829] text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Google Sign-In (OAuth)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("token")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "token"
                    ? "bg-white dark:bg-[#121829] text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Direct Access Token
              </button>
            </div>

            {activeTab === "oauth" && (
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#FF6B2C]" />
                      Google Cloud OAuth Client ID
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHelp(!showHelp)}
                      className="text-[11px] text-[#FF6B2C] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>{showHelp ? "Hide guide" : "How to get Client ID?"}</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    placeholder="e.g. 123456789-xxxx.apps.googleusercontent.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF6B2C] transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Uses Google Drive <code className="text-[#FF6B2C] font-mono text-[10px]">drive.file</code> scope: FucuFlow can <strong>only</strong> access files it creates, never your private documents.
                  </p>
                </div>

                {showHelp && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 space-y-2 leading-relaxed animate-in slide-in-from-top-2">
                    <p className="font-bold">How to create a free Google OAuth Client ID in 2 minutes:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                      <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#FF6B2C]">Google Cloud Console Credentials</a> page.</li>
                      <li>Click <strong>+ Create Credentials &rarr; OAuth Client ID</strong>.</li>
                      <li>Select Application type: <strong>Web application</strong>.</li>
                      <li>Under <em>Authorized JavaScript origins</em>, add your origin:</li>
                    </ol>
                    <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white dark:bg-black/30 border border-amber-300 dark:border-amber-700/50">
                      <code className="text-[11px] font-mono">{currentOrigin}</code>
                      <button
                        type="button"
                        onClick={handleCopyOrigin}
                        className="px-2 py-0.5 rounded bg-[#FF6B2C] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedOrigin ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedOrigin ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-[11px]">5. Click <strong>Create</strong> and paste your Client ID above.</p>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleOAuthConnect}
                  disabled={isConnecting}
                  leftIcon={
                    isConnecting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <GoogleDriveIcon className="w-4 h-4" />
                    )
                  }
                  className="w-full font-bold shadow-xs"
                >
                  {isConnecting ? "Connecting to Google..." : "Connect Personal Google Drive"}
                </Button>
              </div>
            )}

            {activeTab === "token" && (
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Google OAuth2 Access Token
                  </label>
                  <textarea
                    rows={3}
                    value={manualTokenInput}
                    onChange={(e) => setManualTokenInput(e.target.value)}
                    placeholder="Paste your personal OAuth access token (ya29....)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF6B2C] transition-colors resize-none"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Useful for quick personal testing via <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener noreferrer" className="text-[#FF6B2C] underline">OAuth Playground</a> or command line tokens.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleTokenConnect}
                  disabled={isConnecting}
                  leftIcon={
                    isConnecting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )
                  }
                  className="w-full font-bold shadow-xs"
                >
                  {isConnecting ? "Verifying Token..." : "Authenticate Token"}
                </Button>
              </div>
            )}

            {/* Privacy Guarantee Note */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 leading-relaxed">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                🔒 Zero-Cloud, Direct Device-to-Google Privacy
              </p>
              Your videos are rendered on your local hardware and uploaded directly from your browser to your Google Drive account. No third-party servers ever receive your credentials or media.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
