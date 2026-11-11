(function (global) {
  "use strict";

  var app = global.QuotationApp || {};
  var DATA = app.PROCESS_DATA || {};
  var storage = app.storage;
  var DEFAULT_PLACEHOLDER = DATA.placeholderText || "Chưa được cung cấp";

  var state = {
    authenticated: false,
    meta: null,
    steps: [],
    editingStepId: null,
    deletingStep: null,
    busy: false
  };

  var dom = {
    themeToggle: document.getElementById("themeToggle"),
    themeLabel: document.getElementById("themeLabel"),
    authLoading: document.getElementById("adminAuthLoading"),
    loginView: document.getElementById("adminLoginView"),
    loginForm: document.getElementById("adminLoginForm"),
    passwordInput: document.getElementById("adminPasswordInput"),
    loginError: document.getElementById("adminLoginError"),
    loginSubmit: document.getElementById("adminLoginSubmit"),
    workspaceView: document.getElementById("adminWorkspaceView"),
    workspaceError: document.getElementById("adminWorkspaceError"),
    stepsSummary: document.getElementById("adminStepsSummary"),
    refreshBtn: document.getElementById("adminRefreshBtn"),
    addStepBtn: document.getElementById("adminAddStepBtn"),
    logoutBtn: document.getElementById("adminLogoutBtn"),
    stepsList: document.getElementById("adminStepsList"),
    metaForm: document.getElementById("adminMetaForm"),
    metaTitle: document.getElementById("metaTitle"),
    metaVersion: document.getElementById("metaVersion"),
    metaCategory: document.getElementById("metaCategory"),
    metaModule: document.getElementById("metaModule"),
    metaOrg: document.getElementById("metaOrg"),
    metaContact: document.getElementById("metaContact"),
    metaSource: document.getElementById("metaSource"),
    metaDek: document.getElementById("metaDek"),
    metaIsDraft: document.getElementById("metaIsDraft"),
    metaDraftBanner: document.getElementById("metaDraftBanner"),
    metaError: document.getElementById("adminMetaError"),
    saveMetaBtn: document.getElementById("adminSaveMetaBtn"),
    stepModal: document.getElementById("stepEditorModal"),
    stepModalTitle: document.getElementById("stepModalTitle"),
    stepModalSub: document.getElementById("stepModalSub"),
    stepEditorForm: document.getElementById("stepEditorForm"),
    stepCodeInput: document.getElementById("stepCodeInput"),
    stepTitleInput: document.getElementById("stepTitleInput"),
    stepPlaceholderInput: document.getElementById("stepPlaceholderInput"),
    stepDescInput: document.getElementById("stepDescInput"),
    stepLeadInput: document.getElementById("stepLeadInput"),
    stepCollabInput: document.getElementById("stepCollabInput"),
    stepInputsInput: document.getElementById("stepInputsInput"),
    stepOutputsInput: document.getElementById("stepOutputsInput"),
    addRiskRowBtn: document.getElementById("addRiskRowBtn"),
    stepRisksList: document.getElementById("stepRisksList"),
    stepEditorError: document.getElementById("stepEditorError"),
    stepModalCancelBtn: document.getElementById("stepModalCancelBtn"),
    stepModalSaveBtn: document.getElementById("stepModalSaveBtn"),
    deleteModal: document.getElementById("deleteStepModal"),
    deleteStepName: document.getElementById("deleteStepName"),
    deleteCancelBtn: document.getElementById("deleteCancelBtn"),
    deleteConfirmBtn: document.getElementById("deleteConfirmBtn"),
    toastRegion: document.getElementById("toastRegion")
  };

  /* --------------------------------------------------------------------------
     HELPERS
     -------------------------------------------------------------------------- */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pad2(num) {
    return num < 10 ? "0" + num : String(num);
  }

  function setBoxError(el, message) {
    if (!el) return;
    if (!message) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = message;
  }

  function showToast(message) {
    if (!dom.toastRegion) return;
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    dom.toastRegion.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3400);
  }

  function isDarkActive() {
    var forced = document.documentElement.getAttribute("data-theme");
    if (forced === "dark") return true;
    if (forced === "light") return false;
    return Boolean(global.matchMedia && global.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function updateThemeButton() {
    var dark = isDarkActive();
    dom.themeLabel.textContent = dark ? "Chế độ sáng" : "Chế độ tối";
    dom.themeToggle.setAttribute(
      "aria-label",
      dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
    );
  }

  function toggleTheme() {
    var next = isDarkActive() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    if (storage) {
      storage.saveTheme(DATA.themeStorageKey || "quotation_workflow_theme_v1", next);
    }
    updateThemeButton();
  }

  function fieldValueToText(val) {
    if (val === null || val === undefined) return "";
    if (Array.isArray(val)) {
      return val
        .filter(function (item) { return item && item !== DEFAULT_PLACEHOLDER; })
        .join("\n");
    }
    var s = String(val).trim();
    return !s || s === DEFAULT_PLACEHOLDER ? "" : s;
  }

  function textToFieldValue(text) {
    var lines = String(text || "")
      .split(/\r?\n/)
      .map(function (line) { return line.trim(); })
      .filter(Boolean);
    if (lines.length === 0) return DEFAULT_PLACEHOLDER;
    return lines.length === 1 ? lines[0] : lines;
  }

  function summarizeField(val) {
    if (Array.isArray(val)) {
      return val.length > 0 ? val[0] + (val.length > 1 ? " (+" + (val.length - 1) + " ý)" : "") : DEFAULT_PLACEHOLDER;
    }
    if (typeof val === "string" && val.trim()) {
      return val.trim();
    }
    return DEFAULT_PLACEHOLDER;
  }

  /* --------------------------------------------------------------------------
     API CLIENT
     -------------------------------------------------------------------------- */
  function apiRequest(url, options) {
    var opts = Object.assign({
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: { Accept: "application/json" }
    }, options || {});

    if (opts.body && typeof opts.body !== "string") {
      opts.headers = Object.assign({}, opts.headers, { "Content-Type": "application/json" });
      opts.body = JSON.stringify(opts.body);
    }

    return global.fetch(url, opts).then(function (res) {
      return res.json().catch(function () {
        return null;
      }).then(function (payload) {
        if (!res.ok) {
          var err = new Error((payload && payload.error) || ("Lỗi máy chủ HTTP " + res.status));
          err.status = res.status;
          throw err;
        }
        return payload;
      });
    });
  }

  function handleAuthError(err) {
    if (err && err.status === 401) {
      closeStepModal();
      closeDeleteModal();
      showLoginView("Phiên quản trị đã hết hạn hoặc chưa hợp lệ. Vui lòng đăng nhập lại.");
      return true;
    }
    return false;
  }

  /* --------------------------------------------------------------------------
     VIEW TRANSITIONS
     -------------------------------------------------------------------------- */
  function showLoadingView() {
    dom.authLoading.hidden = false;
    dom.loginView.hidden = true;
    dom.workspaceView.hidden = true;
  }

  function showLoginView(errorMessage) {
    state.authenticated = false;
    dom.authLoading.hidden = true;
    dom.loginView.hidden = false;
    dom.workspaceView.hidden = true;
    setBoxError(dom.loginError, errorMessage || "");
    if (dom.passwordInput) {
      dom.passwordInput.value = "";
      dom.passwordInput.focus();
    }
  }

  function showWorkspaceView() {
    state.authenticated = true;
    dom.authLoading.hidden = true;
    dom.loginView.hidden = true;
    dom.workspaceView.hidden = false;
    setBoxError(dom.loginError, "");
  }

  /* --------------------------------------------------------------------------
     DATA LOADING & RENDERING
     -------------------------------------------------------------------------- */
  function loadWorkflow() {
    setBoxError(dom.workspaceError, "");
    return apiRequest("/api/workflow")
      .then(function (payload) {
        state.meta = payload.meta || {};
        state.steps = (Array.isArray(payload.steps) ? payload.steps : []).slice().sort(function (a, b) {
          return (a.order || 0) - (b.order || 0);
        });
        renderStepsList();
        populateMetaForm();
      })
      .catch(function (err) {
        setBoxError(dom.workspaceError, err.message || "Không thể tải dữ liệu quy trình.");
      });
  }

  function renderStepsList() {
    var total = state.steps.length;
    dom.stepsSummary.textContent = "Đang xuất bản " + total + " bước quy trình · Cập nhật đồng bộ cho toàn bộ người truy cập";
    dom.stepsList.innerHTML = "";

    if (total === 0) {
      dom.stepsList.innerHTML =
        '<div class="admin-empty">Chưa có bước quy trình nào. Nhấn <strong>+ Thêm bước mới</strong> để tạo bước đầu tiên.</div>';
      return;
    }

    state.steps.forEach(function (step, index) {
      var card = document.createElement("article");
      card.className = "admin-step-card";
      card.dataset.stepId = step.id;

      var riskCount = Array.isArray(step.risks) ? step.risks.length : 0;
      var draftBadge = step.isPlaceholder
        ? '<span class="admin-badge-draft">Placeholder minh họa</span>'
        : "";

      card.innerHTML =
        '<div class="admin-step-main">' +
          '<div class="admin-step-top">' +
            '<span class="admin-step-order">Thứ tự #' + pad2(index + 1) + "</span>" +
            '<span class="admin-step-code">' + escapeHtml(step.code) + "</span>" +
            draftBadge +
            '<span class="admin-step-id" title="ID cố định trong cơ sở dữ liệu">ID: ' + escapeHtml(step.id) + "</span>" +
          "</div>" +
          '<h3 class="admin-step-title">' + escapeHtml(step.title) + "</h3>" +
          '<p class="admin-step-desc">' + escapeHtml(summarizeField(step.description)) + "</p>" +
          '<div class="admin-step-meta">' +
            "<span>Chủ trì: <strong>" + escapeHtml(summarizeField(step.lead)) + "</strong></span>" +
            "<span>Rủi ro: <strong>" + (riskCount > 0 ? riskCount + " mục" : DEFAULT_PLACEHOLDER) + "</strong></span>" +
          "</div>" +
        "</div>" +
        '<div class="admin-step-actions">' +
          '<button class="admin-icon-btn" type="button" data-action="up"' + (index === 0 ? " disabled" : "") + ' aria-label="Đưa bước lên trước">↑ Lên</button>' +
          '<button class="admin-icon-btn" type="button" data-action="down"' + (index === total - 1 ? " disabled" : "") + ' aria-label="Đưa bước xuống sau">↓ Xuống</button>' +
          '<button class="admin-icon-btn" type="button" data-action="edit">Chỉnh sửa</button>' +
          '<button class="admin-icon-btn is-danger" type="button" data-action="delete">Xóa</button>' +
        "</div>";

      card.querySelector('[data-action="up"]').addEventListener("click", function () {
        moveStep(index, -1);
      });
      card.querySelector('[data-action="down"]').addEventListener("click", function () {
        moveStep(index, 1);
      });
      card.querySelector('[data-action="edit"]').addEventListener("click", function () {
        openStepModal(step);
      });
      card.querySelector('[data-action="delete"]').addEventListener("click", function () {
        openDeleteModal(step);
      });

      dom.stepsList.appendChild(card);
    });
  }

  function populateMetaForm() {
    var meta = state.meta || {};
    dom.metaTitle.value = meta.title || "Quy trình báo giá";
    dom.metaCategory.value = meta.eyebrowCategory || "Quy trình nội bộ";
    dom.metaModule.value = meta.eyebrowModule || "Quy trình báo giá";
    dom.metaVersion.value = fieldValueToText(meta.version);
    dom.metaVersion.placeholder = DEFAULT_PLACEHOLDER;
    dom.metaOrg.value = fieldValueToText(meta.organization);
    dom.metaOrg.placeholder = DEFAULT_PLACEHOLDER;
    dom.metaSource.value = fieldValueToText(meta.sourceDocument);
    dom.metaSource.placeholder = DEFAULT_PLACEHOLDER;
    dom.metaContact.value = fieldValueToText(meta.maintainerContact);
    dom.metaContact.placeholder = DEFAULT_PLACEHOLDER;
    dom.metaDek.value = meta.dek || "";
    dom.metaIsDraft.checked = Boolean(meta.isDraftPlaceholder);
    dom.metaDraftBanner.value = meta.draftBannerText || "";
    setBoxError(dom.metaError, "");
  }

  /* --------------------------------------------------------------------------
     RISK ROWS BUILDER IN STEP MODAL
     -------------------------------------------------------------------------- */
  function appendRiskRow(entry) {
    var risk = entry || {};
    var row = document.createElement("div");
    row.className = "admin-risk-row";
    row.innerHTML =
      '<div class="admin-field">' +
        '<input class="admin-input" data-risk-field="title" type="text" maxlength="300" placeholder="Tên rủi ro phát sinh *" value="' + escapeHtml(risk.title || "") + '">' +
        '<input class="admin-input" data-risk-field="detail" type="text" maxlength="1000" placeholder="Mô tả chi tiết / hệ quả (tùy chọn)" value="' + escapeHtml(risk.detail || "") + '">' +
      "</div>" +
      '<div class="admin-field">' +
        '<textarea class="admin-textarea" data-risk-field="solution" rows="2" maxlength="1000" placeholder="Cách giải quyết / Biện pháp phòng ngừa">' + escapeHtml(fieldValueToText(risk.solution)) + "</textarea>" +
      "</div>" +
      '<button class="admin-icon-btn is-danger" type="button" data-action="remove-risk">Xóa dòng</button>';

    row.querySelector('[data-action="remove-risk"]').addEventListener("click", function () {
      if (row.parentNode) row.parentNode.removeChild(row);
      syncEmptyRisksHint();
    });

    dom.stepRisksList.appendChild(row);
    return row;
  }

  function syncEmptyRisksHint() {
    var existingHint = dom.stepRisksList.querySelector(".admin-risk-empty-hint");
    var hasRows = dom.stepRisksList.querySelectorAll(".admin-risk-row").length > 0;
    if (hasRows && existingHint) {
      existingHint.parentNode.removeChild(existingHint);
    } else if (!hasRows && !existingHint) {
      var hint = document.createElement("p");
      hint.className = "admin-hint admin-risk-empty-hint";
      hint.textContent = "Chưa có dòng rủi ro nào (trang chính sẽ hiển thị \"" + DEFAULT_PLACEHOLDER + "\"). Nhấn \"+ Thêm dòng rủi ro\" để bổ sung.";
      dom.stepRisksList.appendChild(hint);
    }
  }

  function renderRiskRows(risks) {
    dom.stepRisksList.innerHTML = "";
    if (Array.isArray(risks) && risks.length > 0) {
      risks.forEach(function (item) {
        if (typeof item === "string") {
          appendRiskRow({ title: item, detail: "", solution: "" });
        } else if (item && typeof item === "object") {
          appendRiskRow(item);
        }
      });
    }
    syncEmptyRisksHint();
  }

  function collectRiskRows() {
    var rows = Array.prototype.slice.call(dom.stepRisksList.querySelectorAll(".admin-risk-row"));
    var items = [];
    rows.forEach(function (row) {
      var title = row.querySelector('[data-risk-field="title"]').value.trim();
      var detail = row.querySelector('[data-risk-field="detail"]').value.trim();
      var solution = row.querySelector('[data-risk-field="solution"]').value.trim();
      if (!title && !detail && !solution) return;
      items.push({
        title: title || "Rủi ro phát sinh",
        detail: detail,
        solution: solution || DEFAULT_PLACEHOLDER
      });
    });
    return items.length > 0 ? items : DEFAULT_PLACEHOLDER;
  }

  /* --------------------------------------------------------------------------
     STEP MODAL & CRUD ACTIONS
     -------------------------------------------------------------------------- */
  function openStepModal(step) {
    var isEdit = Boolean(step && step.id);
    state.editingStepId = isEdit ? step.id : null;
    setBoxError(dom.stepEditorError, "");

    if (isEdit) {
      dom.stepModalTitle.textContent = "Chỉnh sửa bước: " + step.code;
      dom.stepModalSub.textContent = "ID cố định: " + step.id + " (được giữ nguyên để không mất dấu hoàn thành của người dùng).";
      dom.stepCodeInput.value = step.code || "";
      dom.stepTitleInput.value = step.title || "";
      dom.stepPlaceholderInput.checked = Boolean(step.isPlaceholder);
      dom.stepDescInput.value = fieldValueToText(step.description);
      dom.stepLeadInput.value = fieldValueToText(step.lead);
      dom.stepCollabInput.value = fieldValueToText(step.collaborators);
      dom.stepInputsInput.value = fieldValueToText(step.inputs);
      dom.stepOutputsInput.value = fieldValueToText(step.outputs);
      renderRiskRows(step.risks);
    } else {
      var nextNum = state.steps.length + 1;
      dom.stepModalTitle.textContent = "Thêm bước quy trình mới";
      dom.stepModalSub.textContent = "Bước mới sẽ được cấp một ID cố định riêng và thêm vào cuối quy trình.";
      dom.stepCodeInput.value = "Bước " + pad2(nextNum);
      dom.stepTitleInput.value = "";
      dom.stepPlaceholderInput.checked = false;
      dom.stepDescInput.value = "";
      dom.stepLeadInput.value = "";
      dom.stepCollabInput.value = "";
      dom.stepInputsInput.value = "";
      dom.stepOutputsInput.value = "";
      renderRiskRows([]);
    }

    dom.stepModal.hidden = false;
    dom.stepTitleInput.focus();
  }

  function closeStepModal() {
    dom.stepModal.hidden = true;
    state.editingStepId = null;
    setBoxError(dom.stepEditorError, "");
  }

  function openDeleteModal(step) {
    if (!step) return;
    state.deletingStep = step;
    dom.deleteStepName.textContent = step.code + " — " + step.title;
    dom.deleteModal.hidden = false;
    dom.deleteCancelBtn.focus();
  }

  function closeDeleteModal() {
    dom.deleteModal.hidden = true;
    state.deletingStep = null;
  }

  function moveStep(index, delta) {
    if (state.busy) return;
    var targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= state.steps.length) return;

    var reordered = state.steps.slice();
    var moved = reordered.splice(index, 1)[0];
    reordered.splice(targetIndex, 0, moved);
    var orderedIds = reordered.map(function (s) { return s.id; });

    state.busy = true;
    setBoxError(dom.workspaceError, "");

    apiRequest("/api/admin/reorder", {
      method: "PUT",
      body: { orderedIds: orderedIds }
    })
      .then(function (payload) {
        state.steps = payload.steps || reordered;
        renderStepsList();
        showToast("Đã cập nhật thứ tự các bước (ID cố định được giữ nguyên).");
      })
      .catch(function (err) {
        if (!handleAuthError(err)) {
          setBoxError(dom.workspaceError, err.message || "Không thể thay đổi thứ tự bước.");
        }
      })
      .finally(function () {
        state.busy = false;
      });
  }

  /* --------------------------------------------------------------------------
     FORM SUBMISSIONS
     -------------------------------------------------------------------------- */
  function handleLoginSubmit(e) {
    e.preventDefault();
    var password = dom.passwordInput.value;
    if (!password) {
      setBoxError(dom.loginError, "Vui lòng nhập mật khẩu quản lý.");
      return;
    }

    dom.loginSubmit.disabled = true;
    setBoxError(dom.loginError, "");

    apiRequest("/api/admin/login", {
      method: "POST",
      body: { password: password }
    })
      .then(function () {
        dom.passwordInput.value = "";
        showWorkspaceView();
        showToast("Đăng nhập quản trị thành công.");
        return loadWorkflow();
      })
      .catch(function (err) {
        setBoxError(dom.loginError, err.message || "Đăng nhập thất bại.");
        dom.passwordInput.focus();
        dom.passwordInput.select();
      })
      .finally(function () {
        dom.loginSubmit.disabled = false;
      });
  }

  function handleLogout() {
    dom.logoutBtn.disabled = true;
    apiRequest("/api/admin/logout", { method: "POST" })
      .catch(function () {})
      .finally(function () {
        dom.logoutBtn.disabled = false;
        showLoginView("");
        showToast("Đã đăng xuất khỏi khu vực quản lý.");
      });
  }

  function handleMetaSubmit(e) {
    e.preventDefault();
    setBoxError(dom.metaError, "");
    dom.saveMetaBtn.disabled = true;

    var payload = {
      title: dom.metaTitle.value.trim(),
      eyebrowCategory: dom.metaCategory.value.trim() || "Quy trình nội bộ",
      eyebrowModule: dom.metaModule.value.trim() || "Quy trình báo giá",
      version: dom.metaVersion.value.trim() || DEFAULT_PLACEHOLDER,
      organization: dom.metaOrg.value.trim() || DEFAULT_PLACEHOLDER,
      sourceDocument: dom.metaSource.value.trim() || DEFAULT_PLACEHOLDER,
      maintainerContact: dom.metaContact.value.trim() || DEFAULT_PLACEHOLDER,
      dek: dom.metaDek.value.trim(),
      isDraftPlaceholder: dom.metaIsDraft.checked,
      draftBannerText: dom.metaDraftBanner.value.trim()
    };

    apiRequest("/api/admin/meta", {
      method: "PUT",
      body: payload
    })
      .then(function (result) {
        state.meta = result.meta || payload;
        populateMetaForm();
        showToast("Đã lưu thông tin chung của quy trình.");
      })
      .catch(function (err) {
        if (!handleAuthError(err)) {
          setBoxError(dom.metaError, err.message || "Không thể lưu thông tin chung.");
        }
      })
      .finally(function () {
        dom.saveMetaBtn.disabled = false;
      });
  }

  function handleStepSubmit(e) {
    e.preventDefault();
    setBoxError(dom.stepEditorError, "");

    var payload = {
      code: dom.stepCodeInput.value.trim(),
      title: dom.stepTitleInput.value.trim(),
      isPlaceholder: dom.stepPlaceholderInput.checked,
      description: textToFieldValue(dom.stepDescInput.value),
      lead: textToFieldValue(dom.stepLeadInput.value),
      collaborators: textToFieldValue(dom.stepCollabInput.value),
      inputs: textToFieldValue(dom.stepInputsInput.value),
      outputs: textToFieldValue(dom.stepOutputsInput.value),
      risks: collectRiskRows()
    };

    if (!payload.code || !payload.title) {
      setBoxError(dom.stepEditorError, "Vui lòng nhập đầy đủ mã bước và tên bước.");
      return;
    }

    var isEdit = Boolean(state.editingStepId);
    if (isEdit) {
      payload.id = state.editingStepId;
    }

    dom.stepModalSaveBtn.disabled = true;

    apiRequest("/api/admin/steps", {
      method: isEdit ? "PUT" : "POST",
      body: payload
    })
      .then(function () {
        closeStepModal();
        showToast(isEdit ? "Đã cập nhật bước (ID cố định được giữ nguyên)." : "Đã thêm bước mới vào quy trình.");
        return loadWorkflow();
      })
      .catch(function (err) {
        if (!handleAuthError(err)) {
          setBoxError(dom.stepEditorError, err.message || "Không thể lưu thông tin bước.");
        }
      })
      .finally(function () {
        dom.stepModalSaveBtn.disabled = false;
      });
  }

  function handleConfirmDelete() {
    if (!state.deletingStep) return;
    var stepId = state.deletingStep.id;
    dom.deleteConfirmBtn.disabled = true;

    apiRequest("/api/admin/steps?id=" + encodeURIComponent(stepId), {
      method: "DELETE"
    })
      .then(function () {
        closeDeleteModal();
        showToast("Đã xóa bước khỏi quy trình.");
        return loadWorkflow();
      })
      .catch(function (err) {
        if (!handleAuthError(err)) {
          closeDeleteModal();
          setBoxError(dom.workspaceError, err.message || "Không thể xóa bước.");
        }
      })
      .finally(function () {
        dom.deleteConfirmBtn.disabled = false;
      });
  }

  /* --------------------------------------------------------------------------
     EVENTS & INITIALIZATION
     -------------------------------------------------------------------------- */
  function bindEvents() {
    dom.themeToggle.addEventListener("click", toggleTheme);
    dom.loginForm.addEventListener("submit", handleLoginSubmit);
    dom.logoutBtn.addEventListener("click", handleLogout);
    dom.refreshBtn.addEventListener("click", function () {
      loadWorkflow().then(function () {
        showToast("Đã đồng bộ dữ liệu mới nhất từ máy chủ.");
      });
    });
    dom.addStepBtn.addEventListener("click", function () {
      openStepModal(null);
    });
    dom.metaForm.addEventListener("submit", handleMetaSubmit);
    dom.stepEditorForm.addEventListener("submit", handleStepSubmit);
    dom.addRiskRowBtn.addEventListener("click", function () {
      var row = appendRiskRow({ title: "", detail: "", solution: "" });
      syncEmptyRisksHint();
      var titleInput = row.querySelector('[data-risk-field="title"]');
      if (titleInput) titleInput.focus();
    });
    dom.stepModalCancelBtn.addEventListener("click", closeStepModal);
    dom.deleteCancelBtn.addEventListener("click", closeDeleteModal);
    dom.deleteConfirmBtn.addEventListener("click", handleConfirmDelete);

    dom.stepModal.addEventListener("click", function (e) {
      if (e.target === dom.stepModal) closeStepModal();
    });
    dom.deleteModal.addEventListener("click", function (e) {
      if (e.target === dom.deleteModal) closeDeleteModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (!dom.deleteModal.hidden) {
          closeDeleteModal();
        } else if (!dom.stepModal.hidden) {
          closeStepModal();
        }
      }
    });
  }

  function init() {
    updateThemeButton();
    bindEvents();
    showLoadingView();

    apiRequest("/api/admin/session")
      .then(function () {
        showWorkspaceView();
        return loadWorkflow();
      })
      .catch(function (err) {
        if (err && err.status === 503) {
          showLoginView(err.message);
        } else {
          showLoginView("");
        }
      });
  }

  init();
})(window);
