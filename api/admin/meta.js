import { requireAdmin } from "../../server/auth.js";
import { updateMeta } from "../../server/db.js";
import { methodNotAllowed, readJsonBody, sendJson } from "../../server/http.js";
import { validateMetaPayload } from "../../server/validation.js";

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

  var validated = validateMetaPayload(body);
  if (validated.error) {
    return sendJson(res, 400, { error: validated.error });
  }

  try {
    var updated = await updateMeta(validated.data);
    return sendJson(res, 200, { meta: updated });
  } catch (err) {
    console.error("[PUT /api/admin/meta]", err && err.message);
    return sendJson(res, 500, { error: "Không thể cập nhật thông tin chung của quy trình." });
  }
}
