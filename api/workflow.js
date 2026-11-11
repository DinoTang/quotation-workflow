import { getWorkflow } from "../server/db.js";
import { methodNotAllowed, sendJson } from "../server/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }
  try {
    var data = await getWorkflow();
    return sendJson(res, 200, data);
  } catch (err) {
    console.error("[GET /api/workflow]", err && err.message);
    if (err && err.message === "SUPABASE_NOT_CONFIGURED") {
      return sendJson(res, 503, { error: "Hệ thống chưa kết nối cơ sở dữ liệu Supabase." });
    }
    return sendJson(res, 500, { error: "Không thể tải dữ liệu quy trình từ máy chủ." });
  }
}
