import { requireAdmin } from "../../server/auth.js";
import { reorderSteps } from "../../server/db.js";
import { methodNotAllowed, readJsonBody, sendJson } from "../../server/http.js";
import { isValidStepId } from "../../server/validation.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return methodNotAllowed(res, ["PUT"]);
  }
  if (!requireAdmin(req, res)) return;

  var body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    return sendJson(res, 400, { error: "Dữ liệu gửi lên không hợp lệ." });
  }

  var orderedIds = body && Array.isArray(body.orderedIds) ? body.orderedIds : null;
  if (!orderedIds || orderedIds.length === 0) {
    return sendJson(res, 400, { error: "Danh sách thứ tự bước không hợp lệ." });
  }

  for (var i = 0; i < orderedIds.length; i++) {
    if (!isValidStepId(orderedIds[i])) {
      return sendJson(res, 400, { error: "ID bước trong danh sách sắp xếp không hợp lệ." });
    }
  }

  try {
    var result = await reorderSteps(orderedIds);
    if (result.error) {
      return sendJson(res, 400, { error: result.error });
    }
    return sendJson(res, 200, { steps: result.steps });
  } catch (err) {
    console.error("[PUT /api/admin/reorder]", err && err.message);
    return sendJson(res, 500, { error: "Không thể lưu thứ tự bước mới." });
  }
}
