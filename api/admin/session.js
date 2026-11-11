import { verifySession } from "../../server/auth.js";
import { methodNotAllowed, sendJson } from "../../server/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  var session = verifySession(req);
  if (session.misconfigured) {
    return sendJson(res, 503, {
      authenticated: false,
      error: "Máy chủ chưa cấu hình biến môi trường bảo mật quản trị."
    });
  }
  if (!session.authenticated) {
    return sendJson(res, 401, { authenticated: false });
  }
  return sendJson(res, 200, { authenticated: true, exp: session.exp });
}
