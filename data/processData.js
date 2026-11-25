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

  // Bảng màu cờ tín hiệu hàng hải — đủ tương phản trên nền sáng và tối
  var STEP_ACCENTS = [
    { light: "#1F5D8C", dark: "#7DB4E0" },
    { light: "#0E6E78", dark: "#5CC6CF" },
    { light: "#8A5A06", dark: "#F0C15A" },
    { light: "#B83227", dark: "#F08A7E" },
    { light: "#3D4F9A", dark: "#A3B1EC" },
    { light: "#1F7A4D", dark: "#6FD39D" },
    { light: "#7A4A2A", dark: "#E0A57E" },
    { light: "#0C2233", dark: "#E7EEF2" }
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
      risks: PLACEHOLDER_TEXT,
      tasks: []
    };
  }

  var PROCESS_DATA = {
    storageKey: "quotation_workflow_progress_v1",
    themeStorageKey: "quotation_workflow_theme_v1",
    placeholderText: PLACEHOLDER_TEXT,
    stepAccents: STEP_ACCENTS,
    meta: {
      eyebrowCategory: "Quy trình nghiệp vụ đại lý tàu biển",
      eyebrowModule: "Quy trình báo giá",
      version: PLACEHOLDER_TEXT,
      organization: PLACEHOLDER_TEXT,
      sourceDocument: "Chương 3 – Khóa luận tốt nghiệp (Đề xuất quy trình lập PDA)",
      maintainerContact: PLACEHOLDER_TEXT,
      title: "Quy trình báo giá",
      // Gán chuỗi mô tả vào `dek` nếu muốn thay thế đoạn giới thiệu mặc định trong index.html
      dek: null,
      isDraftPlaceholder: true,
      draftBannerText:
        "Nội dung nghiệp vụ được xây dựng trên cơ sở quy trình lập PDA do nhóm nghiên cứu đề xuất tại Chương 3 của khóa luận."
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
