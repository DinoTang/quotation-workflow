var DEFAULT_PLACEHOLDER = "Chưa được cung cấp";
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var LEGACY_STEP_ID_REGEX = /^[a-z0-9_-]{3,64}$/i;

export function isValidStepId(id) {
  return typeof id === "string" && (UUID_REGEX.test(id) || LEGACY_STEP_ID_REGEX.test(id));
}

function cleanText(val, maxLen, fallback) {
  if (typeof val !== "string") return fallback;
  var trimmed = val.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
}

function cleanTextOrList(val, maxItems, maxItemLen) {
  if (Array.isArray(val)) {
    var items = val
      .map(function (item) { return typeof item === "string" ? item.trim().slice(0, maxItemLen) : ""; })
      .filter(Boolean)
      .slice(0, maxItems);
    if (items.length === 0) return DEFAULT_PLACEHOLDER;
    if (items.length === 1 && items[0] === DEFAULT_PLACEHOLDER) return DEFAULT_PLACEHOLDER;
    return items.length === 1 ? items[0] : items;
  }
  if (typeof val === "string") {
    var trimmed = val.trim();
    if (!trimmed || trimmed === DEFAULT_PLACEHOLDER) return DEFAULT_PLACEHOLDER;
    return trimmed.slice(0, maxItemLen * 4);
  }
  return DEFAULT_PLACEHOLDER;
}

function cleanRisks(val) {
  if (Array.isArray(val)) {
    var items = val
      .map(function (entry) {
        if (typeof entry === "string") {
          var s = entry.trim().slice(0, 600);
          return s ? { title: s, detail: "", solution: DEFAULT_PLACEHOLDER } : null;
        }
        if (!entry || typeof entry !== "object") return null;
        var title = cleanText(entry.title, 300, "");
        var detail = cleanText(entry.detail, 1000, "");
        var solution = cleanText(entry.solution, 1000, DEFAULT_PLACEHOLDER);
        if (!title && !detail) return null;
        return {
          title: title || "Rủi ro phát sinh",
          detail: detail,
          solution: solution
        };
      })
      .filter(Boolean)
      .slice(0, 30);
    return items.length > 0 ? items : DEFAULT_PLACEHOLDER;
  }
  if (typeof val === "string") {
    var trimmed = val.trim();
    if (!trimmed || trimmed === DEFAULT_PLACEHOLDER) return DEFAULT_PLACEHOLDER;
    return [{ title: trimmed.slice(0, 300), detail: "", solution: DEFAULT_PLACEHOLDER }];
  }
  return DEFAULT_PLACEHOLDER;
}

export function validateStepPayload(body) {
  if (!body || typeof body !== "object") {
    return { error: "Dữ liệu bước không hợp lệ." };
  }

  var title = cleanText(body.title, 220, "");
  if (!title) {
    return { error: "Vui lòng nhập tên bước." };
  }

  var code = cleanText(body.code, 40, "");
  if (!code) {
    return { error: "Vui lòng nhập mã / số thứ tự bước (ví dụ: Bước 01)." };
  }

  return {
    data: {
      code: code,
      title: title,
      isPlaceholder: Boolean(body.isPlaceholder),
      description: cleanTextOrList(body.description, 40, 800),
      lead: cleanTextOrList(body.lead, 20, 300),
      collaborators: cleanTextOrList(body.collaborators, 25, 300),
      inputs: cleanTextOrList(body.inputs, 40, 500),
      outputs: cleanTextOrList(body.outputs, 40, 500),
      risks: cleanRisks(body.risks)
    }
  };
}

export function validateMetaPayload(body) {
  if (!body || typeof body !== "object") {
    return { error: "Dữ liệu thông tin chung không hợp lệ." };
  }

  var title = cleanText(body.title, 160, "");
  if (!title) {
    return { error: "Tiêu đề quy trình không được để trống." };
  }

  return {
    data: {
      eyebrowCategory: cleanText(body.eyebrowCategory, 80, "Quy trình nội bộ"),
      eyebrowModule: cleanText(body.eyebrowModule, 80, "Quy trình báo giá"),
      title: title,
      dek: typeof body.dek === "string" && body.dek.trim() ? body.dek.trim().slice(0, 1000) : null,
      version: cleanText(body.version, 80, DEFAULT_PLACEHOLDER),
      organization: cleanText(body.organization, 140, DEFAULT_PLACEHOLDER),
      sourceDocument: cleanText(body.sourceDocument, 200, DEFAULT_PLACEHOLDER),
      maintainerContact: cleanText(body.maintainerContact, 140, DEFAULT_PLACEHOLDER),
      isDraftPlaceholder: Boolean(body.isDraftPlaceholder),
      draftBannerText: cleanText(
        body.draftBannerText,
        600,
        "Dữ liệu nghiệp vụ hiện đang ở trạng thái Placeholder minh họa (dự kiến khoảng 7 bước sơ bộ). Tên bước, chủ trì, phối hợp, chứng từ và rủi ro sẽ được điền chính xác sau khi nhận tài liệu quy trình báo giá chính thức."
      )
    }
  };
}
