/**
 * DỮ LIỆU QUY TRÌNH BÁO GIÁ (TÁCH BIỆT KHỎI GIAO DIỆN)
 * -----------------------------------------------------------------------------
 * Hướng dẫn cập nhật khi có tài liệu quy trình báo giá chính thức:
 * 1. Cập nhật thông tin chung trong `meta` (phiên bản, ngày hiệu lực, đơn vị áp dụng,
 *    tên tài liệu nguồn) và đổi `isDraftPlaceholder: false`.
 * 2. Cập nhật mảng `steps`: có thể tăng, giảm, sắp xếp lại hoặc đổi tên các bước
 *    theo đúng tài liệu chính thức mà không cần chỉnh sửa code giao diện.
 * 3. Với mỗi bước, điền đúng 6 nhóm thông tin nghiệp vụ bắt buộc:
 *    - description   : Nội dung / mô tả công việc (chuỗi hoặc mảng chuỗi gạch đầu dòng)
 *    - lead          : Người hoặc đơn vị chịu trách nhiệm chính (chủ trì)
 *    - collaborators : Đơn vị cần liên hệ hoặc phối hợp (chuỗi hoặc mảng chuỗi)
 *    - inputs        : Chứng từ / tài liệu đầu vào cần có (chuỗi hoặc mảng chuỗi)
 *    - outputs       : Kết quả hoặc chứng từ đầu ra thu được (chuỗi hoặc mảng chuỗi)
 *    - risks         : Rủi ro phát sinh và cách giải quyết:
 *                      mảng object [{ title, detail, solution }] hoặc chuỗi "Chưa được cung cấp"
 * 4. Với trường thông tin nào tài liệu chưa đề cập, giữ nguyên giá trị "Chưa được cung cấp".
 */
(function (global) {
  "use strict";

  var PLACEHOLDER_TEXT = "Chưa được cung cấp";

  var STEP_ACCENTS = [
    { light: "#0F766E", dark: "#4FD1C5" },
    { light: "#0284C7", dark: "#60C5F7" },
    { light: "#4F46E5", dark: "#A5B4FC" },
    { light: "#9333EA", dark: "#D8B4FE" },
    { light: "#BE185D", dark: "#F472B6" },
    { light: "#C2410C", dark: "#FB923C" },
    { light: "#15803D", dark: "#4ADE80" }
  ];

  function createPlaceholderStep(order) {
    var padded = order < 10 ? "0" + order : String(order);
    return {
      id: "step-" + order,
      order: order,
      code: "Bước " + padded,
      title: "Chưa được cung cấp tên bước",
      isPlaceholder: true,
      description: PLACEHOLDER_TEXT,
      lead: PLACEHOLDER_TEXT,
      collaborators: PLACEHOLDER_TEXT,
      inputs: PLACEHOLDER_TEXT,
      outputs: PLACEHOLDER_TEXT,
      risks: PLACEHOLDER_TEXT
    };
  }

  var PROCESS_DATA = {
    storageKey: "quotation_workflow_progress_v1",
    themeStorageKey: "quotation_workflow_theme_v1",
    placeholderText: PLACEHOLDER_TEXT,
    stepAccents: STEP_ACCENTS,
    meta: {
      eyebrowCategory: "Quy trình nội bộ",
      eyebrowModule: "Quy trình báo giá",
      version: PLACEHOLDER_TEXT,
      organization: PLACEHOLDER_TEXT,
      sourceDocument: PLACEHOLDER_TEXT,
      maintainerContact: PLACEHOLDER_TEXT,
      title: "Quy trình báo giá",
      // Gán chuỗi mô tả vào `dek` nếu muốn thay thế đoạn giới thiệu mặc định trong index.html
      dek: null,
      isDraftPlaceholder: true,
      draftBannerText:
        "Dữ liệu nghiệp vụ hiện đang ở trạng thái Placeholder minh họa (dự kiến khoảng 7 bước sơ bộ). Tên bước, chủ trì, phối hợp, chứng từ và rủi ro sẽ được điền chính xác sau khi nhận tài liệu quy trình báo giá chính thức."
    },
    steps: [
      createPlaceholderStep(1),
      createPlaceholderStep(2),
      createPlaceholderStep(3),
      createPlaceholderStep(4),
      createPlaceholderStep(5),
      createPlaceholderStep(6),
      createPlaceholderStep(7)
    ]
  };

  global.QuotationApp = global.QuotationApp || {};
  global.QuotationApp.PROCESS_DATA = PROCESS_DATA;
})(window);
