import {
  buildSessionCookie,
  clearFailedAttempts,
  createSessionToken,
  isRateLimited,
  recordFailedAttempt,
  verifyPassword
} from "../../server/auth.js";
import { methodNotAllowed, readJsonBody, sendJson } from "../../server/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  if (isRateLimited(req)) {
    return sendJson(res, 429, {
      error: "Bạn đã thử sai mật khẩu quá nhiều lần. Vui lòng đợi vài phút rồi thử lại."
    });
  }

  var body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    return sendJson(res, 400, { error: "Dữ liệu gửi lên không hợp lệ." });
  }

  var password = body && typeof body.password === "string" ? body.password : "";
  var check = verifyPassword(password);

  if (check.misconfigured) {
    return sendJson(res, 503, { error: check.reason || "Máy chủ chưa cấu hình mật khẩu quản trị." });
  }

  if (!check.ok) {
    recordFailedAttempt(req);
    await new Promise(function (resolve) { setTimeout(resolve, 250); });
    return sendJson(res, 401, { error: "Mật khẩu quản trị không chính xác." });
  }

  clearFailedAttempts(req);
  var token = createSessionToken();
  if (!token) {
    return sendJson(res, 503, { error: "Không thể khởi tạo phiên đăng nhập quản trị." });
  }

  return sendJson(
    res,
    200,
    { authenticated: true },
    { "Set-Cookie": buildSessionCookie(req, token) }
  );
}
