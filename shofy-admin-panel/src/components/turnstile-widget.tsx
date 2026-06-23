"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_ID = "cloudflare-turnstile-script";
const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<NonNullable<Window["turnstile"]>> | undefined;

const loadTurnstile = () => {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;
    const script = existingScript || document.createElement("script");

    const handleLoad = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile API was not initialized"));
    };
    const handleError = () => {
      scriptPromise = undefined;
      reject(new Error("Turnstile could not be loaded"));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
};

type TurnstileWidgetProps = {
  action: string;
  onVerify: (token: string) => void;
  resetKey?: number;
};

/**
 * Admin Turnstile widget. Tokens are always verified again by the API.
 */
const TurnstileWidget = ({
  action,
  onVerify,
  resetKey = 0,
}: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    let active = true;

    if (!siteKey) {
      setLoadError("Security verification is not configured.");
      onVerify("");
      return;
    }

    setLoadError("");
    onVerify("");

    loadTurnstile()
      .then((turnstile) => {
        if (!active || !containerRef.current) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: "auto",
          callback: (token: string) => onVerify(token),
          "expired-callback": () => onVerify(""),
          "error-callback": () => {
            setLoadError("Security verification failed to load. Please retry.");
            onVerify("");
          },
        });
      })
      .catch(() => {
        if (active) {
          setLoadError("Security verification failed to load. Please retry.");
          onVerify("");
        }
      });

    return () => {
      active = false;
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, onVerify, resetKey, siteKey]);

  return (
    <div className="mb-5">
      <div ref={containerRef} />
      {loadError && (
        <p className="mt-2 mb-0 text-sm text-red" role="alert">
          {loadError}
        </p>
      )}
    </div>
  );
};

export default TurnstileWidget;
