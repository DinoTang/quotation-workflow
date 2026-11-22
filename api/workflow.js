import { formatSupabaseError, getWorkflow } from "../server/db.js";
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
    var message = formatSupabaseError(err, "Không thể tải dữ liệu quy trình từ máy chủ.");
    var isConfigError = err && (
      err.message === "SUPABASE_NOT_CONFIGURED" ||
      err.message === "SUPABASE_URL_IS_PLACEHOLDER" ||
      err.message === "SUPABASE_PUBLISHABLE_KEY_NOT_ALLOWED"
    );
    return sendJson(res, isConfigError ? 503 : 500, { error: message });
  }
}
