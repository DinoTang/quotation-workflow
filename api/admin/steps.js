import { requireAdmin } from "../../server/auth.js";
import { createStep, deleteStep, updateStep } from "../../server/db.js";
import { getQueryParams, methodNotAllowed, readJsonBody, sendJson } from "../../server/http.js";
import { isValidStepId, validateStepPayload } from "../../server/validation.js";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "PUT" && req.method !== "DELETE") {
    return methodNotAllowed(res, ["POST", "PUT", "DELETE"]);
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === "DELETE") {
    var params = getQueryParams(req);
    var idFromQuery = params.get("id");
    var bodyDel = {};
    try {
      bodyDel = await readJsonBody(req);
    } catch (err) {}

    var delId = idFromQuery || (bodyDel && bodyDel.id) || "";
    if (!isValidStepId(delId)) {
      return sendJson(res, 400, { error: "Mã định danh bước cần xóa không hợp lệ." });
    }

    try {
      var removed = await deleteStep(delId);
      if (!removed) {
        return sendJson(res, 404, { error: "Không tìm thấy bước cần xóa." });
      }
      return sendJson(res, 200, { deletedId: delId });
    } catch (err) {
      console.error("[DELETE /api/admin/steps]", err && err.message);
      return sendJson(res, 500, { error: "Không thể xóa bước khỏi cơ sở dữ liệu." });
    }
  }

  var body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    return sendJson(res, 400, { error: "Dữ liệu gửi lên không hợp lệ." });
  }

  var validated = validateStepPayload(body);
  if (validated.error) {
    return sendJson(res, 400, { error: validated.error });
  }

  if (req.method === "POST") {
    try {
      var created = await createStep(validated.data);
      return sendJson(res, 201, { step: created });
    } catch (err) {
      console.error("[POST /api/admin/steps]", err && err.message);
      return sendJson(res, 500, { error: "Không thể thêm bước mới vào cơ sở dữ liệu." });
    }
  }

  // PUT: cập nhật bước hiện có và bảo lưu ID cố định
  var updateId = body && body.id ? String(body.id) : "";
  if (!isValidStepId(updateId)) {
    return sendJson(res, 400, { error: "Thiếu hoặc sai mã định danh bước cần sửa." });
  }

  try {
    var updated = await updateStep(updateId, validated.data);
    if (!updated) {
      return sendJson(res, 404, { error: "Không tìm thấy bước cần cập nhật." });
    }
    return sendJson(res, 200, { step: updated });
  } catch (err) {
    console.error("[PUT /api/admin/steps]", err && err.message);
    return sendJson(res, 500, { error: "Không thể cập nhật thông tin bước." });
  }
}
