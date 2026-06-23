const { verifyTurnstileToken } = require("../services/turnstile.service");

/**
 * Protects a route with mandatory server-side Turnstile validation.
 */
const requireTurnstile = (expectedAction) => async (req, res, next) => {
  try {
    const verification = await verifyTurnstileToken({
      token: req.body?.turnstileToken,
      req,
      expectedAction,
    });

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        captchaRequired: true,
        message: "Please complete the security verification and try again.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Requires Turnstile only after repeated failed logins for the same email/IP.
 */
const requireTurnstileAfterFailures =
  ({ AttemptModel, threshold, windowMs, expectedAction }) =>
  async (req, res, next) => {
    try {
      const email = String(req.body?.email || "").trim().toLowerCase();
      const ipAddress = req.ip || req.socket?.remoteAddress || "unknown";
      const attempt = await AttemptModel.findOne({ email, ipAddress });
      const isCurrentWindow =
        attempt &&
        Date.now() - attempt.firstAttemptAt.getTime() <= windowMs;
      const captchaRequired =
        Boolean(isCurrentWindow) && attempt.count >= threshold;

      if (!captchaRequired) {
        return next();
      }

      const verification = await verifyTurnstileToken({
        token: req.body?.turnstileToken,
        req,
        expectedAction,
      });

      if (!verification.success) {
        return res.status(400).json({
          success: false,
          captchaRequired: true,
          message: "Please complete the security verification and try again.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = { requireTurnstile, requireTurnstileAfterFailures };
