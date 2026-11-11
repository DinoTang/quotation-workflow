import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import workflowHandler from "../api/workflow.js";
import adminLoginHandler from "../api/admin/login.js";
import adminLogoutHandler from "../api/admin/logout.js";
import adminSessionHandler from "../api/admin/session.js";
import adminMetaHandler from "../api/admin/meta.js";
import adminStepsHandler from "../api/admin/steps.js";
import adminReorderHandler from "../api/admin/reorder.js";

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var ROOT_DIR = path.resolve(__dirname, "..");

var MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

var API_ROUTES = new Map([
  ["/api/workflow", workflowHandler],
  ["/api/admin/login", adminLoginHandler],
  ["/api/admin/logout", adminLogoutHandler],
  ["/api/admin/session", adminSessionHandler],
  ["/api/admin/meta", adminMetaHandler],
  ["/api/admin/steps", adminStepsHandler],
  ["/api/admin/reorder", adminReorderHandler]
]);

var BLOCKED_PREFIXES = ["/api/", "/server/", "/supabase/", "/scripts/"];
var BLOCKED_FILES = new Set(["/package.json", "/vercel.json", "/.env", "/.env.local", "/.env.example"]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  var content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach(function (rawLine) {
    var line = rawLine.trim();
    if (!line || line.startsWith("#")) return;
    var eqIndex = line.indexOf("=");
    if (eqIndex <= 0) return;
    var key = line.slice(0, eqIndex).trim();
    var value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

function bootstrapDevEnvironment() {
  loadEnvFile(path.join(ROOT_DIR, ".env"));
  loadEnvFile(path.join(ROOT_DIR, ".env.local"));

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    process.env.QUOTATION_LOCAL_DEV_DB = "1";
    console.log("[dev-server] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY chưa cấu hình -> dùng JSON dev store cục bộ.");
  }

  if (!process.env.ADMIN_SESSION_SECRET) {
    process.env.ADMIN_SESSION_SECRET = crypto.randomBytes(32).toString("hex");
    console.log("[dev-server] Đã tạo ADMIN_SESSION_SECRET tạm thời cho phiên dev.");
  }

  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    console.warn("[dev-server] CẢNH BÁO: Chưa có ADMIN_PASSWORD hoặc ADMIN_PASSWORD_HASH trong .env; /admin sẽ trả HTTP 503 cho đến khi bạn cấu hình biến môi trường này.");
  }
}

function resolveStaticFile(pathname) {
  var normalized = pathname;
  if (normalized === "/") {
    normalized = "/index.html";
  } else if (normalized === "/admin" || normalized === "/admin/") {
    normalized = "/admin.html";
  }

  var lower = normalized.toLowerCase();
  for (var i = 0; i < BLOCKED_PREFIXES.length; i++) {
    if (lower.startsWith(BLOCKED_PREFIXES[i])) return null;
  }
  if (BLOCKED_FILES.has(lower) || lower.startsWith("/.")) {
    return null;
  }

  var safeRel = normalized.replace(/^\/+/, "");
  var targetPath = path.resolve(ROOT_DIR, safeRel);
  if (!targetPath.startsWith(ROOT_DIR + path.sep)) {
    return null;
  }

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    return targetPath;
  }

  if (!path.extname(targetPath)) {
    var htmlCandidate = targetPath + ".html";
    if (
      htmlCandidate.startsWith(ROOT_DIR + path.sep) &&
      fs.existsSync(htmlCandidate) &&
      fs.statSync(htmlCandidate).isFile()
    ) {
      return htmlCandidate;
    }
  }

  return null;
}

function sendNotFound(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("404 Not Found");
}

function handleRequest(req, res) {
  var parsedUrl = new URL(req.url || "/", "http://localhost");
  var pathname = parsedUrl.pathname;

  var apiHandler = API_ROUTES.get(pathname);
  if (apiHandler) {
    Promise.resolve(apiHandler(req, res)).catch(function (err) {
      console.error("[dev-server] API error:", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "Lỗi nội bộ máy chủ phát triển." }));
      } else if (!res.writableEnded) {
        res.end();
      }
    });
    return;
  }

  if (pathname.startsWith("/api/")) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "API endpoint không tồn tại." }));
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("405 Method Not Allowed");
    return;
  }

  var filePath = resolveStaticFile(pathname);
  if (!filePath) {
    sendNotFound(res);
    return;
  }

  var ext = path.extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
  if (ext === ".html") {
    res.setHeader("Cache-Control", "no-store");
  }

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}

bootstrapDevEnvironment();

var port = Number(process.env.PORT || 3000);
var host = process.env.HOST || "127.0.0.1";
var server = http.createServer(handleRequest);

server.listen(port, host, function () {
  console.log("[dev-server] Đang chạy tại http://" + host + ":" + port);
  console.log("[dev-server] Trang chính: http://" + host + ":" + port + "/");
  console.log("[dev-server] Quản trị:    http://" + host + ":" + port + "/admin");
});
