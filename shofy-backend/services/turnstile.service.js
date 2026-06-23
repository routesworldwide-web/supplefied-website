const { secret } = require("../config/secret");

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const getRequestIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIp =
    typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "";

  return forwardedIp || req.ip || req.socket?.remoteAddress;
};

/**
 * Validates a Cloudflare Turnstile token on the server.
 * Client-side widget completion is never treated as proof by itself.
 */
const verifyTurnstileToken = async ({ token, req, expectedAction }) => {
  if (!secret.turnstile_secret_key) {
    const error = new Error("Turnstile is not configured on the server");
    error.statusCode = 503;
    throw error;
  }

  if (!token || typeof token !== "string") {
    return { success: false, reason: "missing-token" };
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: secret.turnstile_secret_key,
      response: token,
      remoteip: getRequestIp(req),
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const error = new Error("Turnstile verification service is unavailable");
    error.statusCode = 503;
    throw error;
  }

  const result = await response.json();
  const isCloudflareTestResponse =
    result.metadata?.result_with_testing_key === true;
  const actionMatches =
    !expectedAction ||
    result.action === expectedAction ||
    isCloudflareTestResponse;

  return {
    success: Boolean(result.success && actionMatches),
    reason: actionMatches ? result["error-codes"] : ["action-mismatch"],
  };
};

module.exports = { verifyTurnstileToken };
