"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone);

    if (isStandalone) return;

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setDismissed(true);
  };

  if (deferredPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 rounded-xl bg-blue-600 p-4 text-white shadow-lg safe-bottom md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">Install Rental Manager</p>
            <p className="mt-1 text-sm text-blue-100">Add to your home screen for app-like experience</p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-blue-200 hover:text-white" aria-label="Dismiss">
            <X className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={handleInstall}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600"
        >
          <Download className="h-4 w-4" />
          Install App
        </button>
      </div>
    );
  }

  if (isIos) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-lg safe-bottom md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">Install on iPhone</p>
            <p className="mt-1 text-sm text-gray-500">
              Tap Share → <strong>Add to Home Screen</strong>
            </p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-gray-400 hover:text-gray-600" aria-label="Dismiss">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
