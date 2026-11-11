import crypto from "node:crypto";
import { getClientIp, sendJson } from "./http.js";

var COOKIE_NAME = "qw_admin_session";
var SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 giờ
var RATE_WINDOW_MS = 10 * 60 * 1000; // 10 phút
var RATE_MAX_FAILURES = 8;

var failedAttempts = new Map();

function getAuthConfig() {
  var sessionSecret = process.env.ADMIN_SESSION_SECRET || "";
  var plainPassword = process.env.ADMIN_PASSWORD || "";
  var passwordHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!sessionSecret || sessionSecret.length < 16) {
    return { configured: false, reason: "Thiếu biến môi trường ADMIN_SESSION_SECRET hợp lệ." };
  }
  if (!plainPassword && !passwordHash) {
    return { configured: false, reason: "Thiếu biến môi trường ADMIN_PASSWORD hoặc ADMIN_PASSWORD_HASH." };
  }
  return {
    configured: true,
    sessionSecret: sessionSecret,
    plainPassword: plainPassword,
    passwordHash: passwordHash
  };
}

function sha256Buffer(text) {
  return crypto.createHash("sha256").update(String(text), "utf8").digest();
}

export function verifyPassword(inputPassword) {
  var config = getAuthConfig();
  if (!config.configured) {
    return { ok: false, misconfigured: true, reason: config.reason };
  }
  if (typeof inputPassword !== "string" || inputPassword.length === 0 || inputPassword.length > 256) {
    return { ok: false };
  }

  if (config.passwordHash) {
    // Hỗ trợ định dạng scrypt:<salt>:<hex>
    var parts = config.passwordHash.split(":");
    if (parts.length === 3 && parts[0] === "scrypt") {
      try {
        var salt = parts[1];
        var expectedHex = parts[2];
        var expectedBuf = Buffer.from(expectedHex, "hex");
        var actualBuf = crypto.scryptSync(inputPassword, salt, expectedBuf.length);
        var matchHash = actualBuf.length === expectedBuf.length &&
          crypto.timingSafeEqual(actualBuf, expectedBuf);
        return { ok: matchHash };
      } catch (err) {
        return { ok: false };
      }
    }
  }

  if (config.plainPassword) {
    var a = sha256Buffer(inputPassword);
    var b = sha256Buffer(config.plainPassword);
    return { ok: crypto.timingSafeEqual(a, b) };
  }

  return { ok: false };
}

export function isRateLimited(req) {
  var ip = getClientIp(req);
  var now = Date.now();
  var entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (now - entry.firstAttemptAt > RATE_WINDOW_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= RATE_MAX_FAILURES;
}

export function recordFailedAttempt(req) {
  var ip = getClientIp(req);
  var now = Date.now();
  var entry = failedAttempts.get(ip);
  if (!entry || now - entry.firstAttemptAt > RATE_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, firstAttemptAt: now });
  } else {
    entry.count += 1;
  }
}

export function clearFailedAttempts(req) {
  failedAttempts.delete(getClientIp(req));
}

function signPayload(base64Payload, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(base64Payload)
    .digest("base64url");
}

export function createSessionToken() {
  var config = getAuthConfig();
  if (!config.configured) return null;

  var payload = {
    role: "admin",
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
    nonce: crypto.randomBytes(12).toString("hex")
  };
  var encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  var sig = signPayload(encoded, config.sessionSecret);
  return encoded + "." + sig;
}

function parseCookies(req) {
  var header = req.headers.cookie || "";
  var out = {};
  header.split(";").forEach(function (pair) {
    var idx = pair.indexOf("=");
    if (idx === -1) return;
    var key = pair.slice(0, idx).trim();
    var val = pair.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  });
  return out;
}

export function verifySession(req) {
  var config = getAuthConfig();
  if (!config.configured) {
    return { authenticated: false, misconfigured: true, reason: config.reason };
  }

  var cookies = parseCookies(req);
  var token = cookies[COOKIE_NAME];
  if (!token || typeof token !== "string") {
    return { authenticated: false };
  }

  var dotIdx = token.indexOf(".");
  if (dotIdx <= 0) {
    return { authenticated: false };
  }

  var encoded = token.slice(0, dotIdx);
  var sig = token.slice(dotIdx + 1);
  var expectedSig = signPayload(encoded, config.sessionSecret);

  var sigBuf = Buffer.from(sig, "utf8");
  var expectedBuf = Buffer.from(expectedSig, "utf8");
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { authenticated: false };
  }

  try {
    var payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload || payload.role !== "admin" || typeof payload.exp !== "number") {
      return { authenticated: false };
    }
    if (Date.now() > payload.exp) {
      return { authenticated: false };
    }
    return { authenticated: true, exp: payload.exp };
  } catch (err) {
    return { authenticated: false };
  }
}

function shouldUseSecureCookie(req) {
  var proto = req.headers["x-forwarded-proto"];
  if (proto === "https") return true;
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") return true;
  return false;
}

export function buildSessionCookie(req, token) {
  var parts = [
    COOKIE_NAME + "=" + encodeURIComponent(token),
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=" + SESSION_TTL_SECONDS
  ];
  if (shouldUseSecureCookie(req)) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function buildLogoutCookie(req) {
  var parts = [
    COOKIE_NAME + "=",
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0"
  ];
  if (shouldUseSecureCookie(req)) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function requireAdmin(req, res) {
  var status = verifySession(req);
  if (status.misconfigured) {
    sendJson(res, 503, { error: "Máy chủ chưa cấu hình biến bảo mật quản trị." });
    return false;
  }
  if (!status.authenticated) {
    sendJson(res, 401, { error: "Phiên quản trị không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại." });
    return false;
  }
  return true;
}
