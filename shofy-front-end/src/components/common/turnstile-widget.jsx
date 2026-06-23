"use client";

import React, { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "cloudflare-turnstile-script";
const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise;

const loadTurnstile = () => {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID);
    const script = existingScript || document.createElement("script");

    const handleLoad = () => resolve(window.turnstile);
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

/**
 * Shared Cloudflare Turnstile widget.
 * The emitted token must still be validated by the backend.
 */
const TurnstileWidget = ({ action, onVerify, resetKey = 0 }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loadError, setLoadError] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    let active = true;

    if (!siteKey) {
      setLoadError("Security verification is not configured.");
      onVerify("");
      return undefined;
    }

    setLoadError("");
    onVerify("");

    loadTurnstile()
      .then((turnstile) => {
        if (!active || !containerRef.current || !turnstile) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: "auto",
          callback: (token) => onVerify(token),
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
    <div className="mb-20">
      <div ref={containerRef} />
      {loadError && (
        <p className="text-danger mt-2 mb-0" role="alert">
          {loadError}
        </p>
      )}
    </div>
  );
};

export default TurnstileWidget;
