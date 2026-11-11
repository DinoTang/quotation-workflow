(function (global) {
  "use strict";

  var app = global.QuotationApp || {};
  var DATA = app.PROCESS_DATA;
  var storage = app.storage;

  if (!DATA || !storage) {
    return;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";
  var PLACEHOLDER_VAL = DATA.placeholderText || "Chưa được cung cấp";
  var COL_PATTERN = [1, 2, 3, 2];

  var activeMeta = DATA.meta || {};
  var steps = [];
  var stepIds = [];

  var state = {
    completed: {},
    persistentStorage: true,
    activeStepId: null,
    activeView: "ov",
    filter: "all",
    lastFocusedElement: null
  };

  // DOM References
  var dom = {
    eyebrowCategory: document.getElementById("eyebrowCategory"),
    eyebrowModule: document.getElementById("eyebrowModule"),
    eyebrowCount: document.getElementById("eyebrowCount"),
    eyebrowVersion: document.getElementById("eyebrowVersion"),
    eyebrowOrg: document.getElementById("eyebrowOrg"),
    pageTitle: document.getElementById("pageTitle"),
    pageDek: document.getElementById("pageDek"),
    themeToggle: document.getElementById("themeToggle"),
    themeLabel: document.getElementById("themeLabel"),
    tabOv: document.getElementById("tabOv"),
    tabFlow: document.getElementById("tabFlow"),
    stepRail: document.getElementById("stepRail"),
    shell: document.getElementById("shell"),
    syncStatusBanner: document.getElementById("syncStatusBanner"),
    syncStatusText: document.getElementById("syncStatusText"),
    syncRetryBtn: document.getElementById("syncRetryBtn"),
    draftBanner: document.getElementById("draftBanner"),
    draftBannerText: document.getElementById("draftBannerText"),
    progressHeading: document.getElementById("progressHeading"),
    clearAllBtn: document.getElementById("clearAllBtn"),
    metricTotal: document.getElementById("metricTotal"),
    metricDone: document.getElementById("metricDone"),
    metricTodo: document.getElementById("metricTodo"),
    metricPercent: document.getElementById("metricPercent"),
    progressText: document.getElementById("progressText"),
    progressBar: document.getElementById("progressBar"),
    progressBarFill: document.getElementById("progressBarFill"),
    progressStatus: document.getElementById("progressStatus"),
    filterGroup: document.getElementById("filterGroup"),
    filterCountAll: document.getElementById("filterCountAll"),
    filterCountTodo: document.getElementById("filterCountTodo"),
    filterCountDone: document.getElementById("filterCountDone"),
    storageWarning: document.getElementById("storageWarning"),
    overview: document.getElementById("overview"),
    bandNum: document.getElementById("bandNum"),
    bandCount: document.getElementById("bandCount"),
    stepList: document.getElementById("stepList"),
    filterEmpty: document.getElementById("filterEmpty"),
    flowview: document.getElementById("flowview"),
    flowCanvas: document.getElementById("flowCanvas"),
    wires: document.getElementById("wires"),
    flowEmpty: document.getElementById("flowEmpty"),
    panel: document.getElementById("panel"),
    panelInner: document.getElementById("panelInner"),
    scrim: document.getElementById("scrim"),
    footerSource: document.getElementById("footerSource"),
    footerContact: document.getElementById("footerContact"),
    clearModal: document.getElementById("clearModal"),
    modalDoneCount: document.getElementById("modalDoneCount"),
    modalCancelBtn: document.getElementById("modalCancelBtn"),
    modalConfirmBtn: document.getElementById("modalConfirmBtn"),
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

  function isDarkActive() {
    var forced = document.documentElement.getAttribute("data-theme");
    if (forced === "dark") return true;
    if (forced === "light") return false;
    return Boolean(global.matchMedia && global.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function getStepColor(index) {
    var accents = DATA.stepAccents || [{ light: "#3357D7", dark: "#91A7FF" }];
    var pair = accents[index % accents.length];
    return isDarkActive() ? pair.dark : pair.light;
  }

  function getStepById(id) {
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].id === id) return steps[i];
    }
    return null;
  }

  function getStepIndex(id) {
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].id === id) return i;
    }
    return -1;
  }

  function isMissingValue(val) {
    if (val === null || val === undefined) return true;
    if (typeof val === "string") {
      var trimmed = val.trim();
      return trimmed === "" || trimmed === PLACEHOLDER_VAL;
    }
    if (Array.isArray(val)) {
      return val.length === 0;
    }
    return false;
  }

  function hasValidRisks(step) {
    return Array.isArray(step.risks) && step.risks.length > 0;
  }

  function getStats() {
    var total = steps.length;
    var done = 0;
    for (var i = 0; i < steps.length; i++) {
      if (state.completed[steps[i].id]) done++;
    }
    var todo = total - done;
    var percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total: total, done: done, todo: todo, percent: percent };
  }

  function getFilteredSteps() {
    if (state.filter === "done") {
      return steps.filter(function (s) { return Boolean(state.completed[s.id]); });
    }
    if (state.filter === "todo") {
      return steps.filter(function (s) { return !state.completed[s.id]; });
    }
    return steps;
  }

  function getEmptyFilterMessage() {
    var stats = getStats();
    if (state.filter === "todo" && stats.total > 0 && stats.todo === 0) {
      return "Tất cả các bước trong lượt này đều đã được đánh dấu hoàn thành.";
    }
    if (state.filter === "done" && stats.done === 0) {
      return "Chưa có bước nào được đánh dấu hoàn thành. Hãy tick vào ô hoàn thành sau khi thực hiện xong công việc của một bước.";
    }
    return "Không có bước nào phù hợp với bộ lọc hiện tại.";
  }

  /* --------------------------------------------------------------------------
     THEME MANAGEMENT
     -------------------------------------------------------------------------- */
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
    storage.saveTheme(DATA.themeStorageKey, next);
    updateThemeButton();
    renderAllStepsAndFlow();
    if (state.activeStepId) {
      renderPanel(state.activeStepId, false);
    }
  }

  /* --------------------------------------------------------------------------
     METADATA & PROGRESS UI
     -------------------------------------------------------------------------- */
  function renderMetadata() {
    var meta = activeMeta || {};
    var total = steps.length;

    dom.eyebrowCategory.textContent = meta.eyebrowCategory || "Quy trình nội bộ";
    dom.eyebrowModule.textContent = meta.eyebrowModule || "Quy trình báo giá";
    dom.eyebrowCount.textContent = meta.isDraftPlaceholder
      ? "Dự kiến ~" + total + " bước sơ bộ"
      : "Gồm " + total + " bước";
    dom.eyebrowVersion.textContent = meta.version || PLACEHOLDER_VAL;
    dom.eyebrowOrg.textContent = meta.organization || PLACEHOLDER_VAL;
    dom.pageTitle.textContent = meta.title || "Quy trình báo giá";
    if (meta.dek) {
      dom.pageDek.textContent = meta.dek;
    }

    if (meta.isDraftPlaceholder) {
      dom.draftBanner.hidden = false;
      dom.draftBannerText.textContent = meta.draftBannerText;
    } else {
      dom.draftBanner.hidden = true;
    }

    dom.footerSource.textContent = meta.sourceDocument || PLACEHOLDER_VAL;
    dom.footerContact.textContent = meta.maintainerContact || PLACEHOLDER_VAL;
  }

  function renderProgress() {
    var stats = getStats();
    var firstStepLabel = steps.length > 0 ? steps[0].code : "Bước 01";

    dom.metricTotal.textContent = stats.total + " bước";
    dom.metricDone.textContent = stats.done + " bước";
    dom.metricTodo.textContent = stats.todo + " bước";
    dom.metricPercent.textContent = stats.percent + "%";

    dom.progressText.textContent =
      "Đã hoàn thành " + stats.done + " / " + stats.total + " bước (" + stats.percent + "%)";
    dom.progressBar.setAttribute("aria-valuenow", String(stats.percent));
    dom.progressBarFill.style.width = stats.percent + "%";

    dom.bandNum.textContent = pad2(stats.total);
    dom.bandCount.textContent = stats.done + " / " + stats.total + " hoàn thành";

    dom.filterCountAll.textContent = String(stats.total);
    dom.filterCountTodo.textContent = String(stats.todo);
    dom.filterCountDone.textContent = String(stats.done);

    if (stats.total === 0) {
      dom.progressStatus.textContent = "Chưa có bước nào được cấu hình trong dữ liệu quy trình.";
    } else if (stats.done === 0) {
      dom.progressStatus.textContent =
        "Sẵn sàng cho lượt báo giá mới. Hãy chọn " + firstStepLabel +
        " để xem hướng dẫn chi tiết và bắt đầu thực hiện.";
    } else if (stats.percent < 50) {
      dom.progressStatus.textContent =
        "Đang thực hiện quy trình (" + stats.done + "/" + stats.total +
        " bước đã xong). Tiếp tục kiểm tra các bước còn lại để đảm bảo đủ chứng từ và kiểm soát rủi ro.";
    } else if (stats.percent < 100) {
      dom.progressStatus.textContent =
        "Đã qua hơn nửa chặng đường (" + stats.done + "/" + stats.total + " bước). Còn " +
        stats.todo + " bước chưa hoàn thành — vui lòng rà soát kỹ đầu ra trước khi kết thúc lượt báo giá.";
    } else {
      dom.progressStatus.textContent =
        "Hoàn tất 100% các bước trong quy trình báo giá. Khi cần thực hiện một báo giá mới, hãy nhấn \"Clear All\" để đặt lại toàn bộ dấu hoàn thành.";
    }

    dom.clearAllBtn.disabled = stats.done === 0;
    dom.clearAllBtn.title = stats.done === 0
      ? "Hiện chưa có bước nào được đánh dấu hoàn thành."
      : "Xóa toàn bộ dấu tick hoàn thành để bắt đầu một lượt báo giá mới. Nội dung quy trình vẫn được giữ nguyên.";

    dom.storageWarning.hidden = state.persistentStorage;
  }

  /* --------------------------------------------------------------------------
     STEP RAIL (QUICK JUMP IN FLOW VIEW)
     -------------------------------------------------------------------------- */
  function renderStepRail() {
    dom.stepRail.innerHTML = "";
    steps.forEach(function (step, index) {
      var done = Boolean(state.completed[step.id]);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ph" + (done ? " is-done" : "");
      btn.style.setProperty("--phc", getStepColor(index));
      btn.setAttribute("aria-current", String(state.activeStepId === step.id));
      btn.innerHTML =
        '<span class="n">' + pad2(step.order) + "</span>" +
        '<span class="t">' + escapeHtml(step.title) +
        "<span>" + (done ? "Đã hoàn thành ✓" : "Chưa hoàn thành") + "</span></span>";

      btn.addEventListener("click", function () {
        var nodeEl = document.getElementById("flow-node-" + step.id);
        if (nodeEl) {
          nodeEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        openStep(step.id);
      });
      dom.stepRail.appendChild(btn);
    });
  }

  /* --------------------------------------------------------------------------
     OVERVIEW STEP LIST RENDERING
     -------------------------------------------------------------------------- */
  function renderOverview() {
    var filtered = getFilteredSteps();
    dom.stepList.innerHTML = "";

    if (filtered.length === 0) {
      dom.filterEmpty.hidden = false;
      dom.filterEmpty.textContent = getEmptyFilterMessage();
      return;
    }

    dom.filterEmpty.hidden = true;

    filtered.forEach(function (step) {
      var originalIndex = getStepIndex(step.id);
      var color = getStepColor(originalIndex);
      var done = Boolean(state.completed[step.id]);
      var isActive = state.activeStepId === step.id;

      var row = document.createElement("div");
      row.className = "rib-row" +
        (done ? " is-done" : "") +
        (isActive ? " is-active" : "") +
        (step.isPlaceholder ? " is-placeholder" : "");
      row.style.setProperty("--pc", color);
      row.dataset.stepId = step.id;

      var checkWrap = document.createElement("div");
      checkWrap.className = "rib-check-wrap";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "step-checkbox";
      checkbox.checked = done;
      checkbox.setAttribute(
        "aria-label",
        "Đánh dấu hoàn thành công việc của " + step.code + " — " + step.title
      );
      checkbox.title = "Đánh dấu hoàn thành công việc (không phải chỉ đã đọc)";
      checkbox.addEventListener("change", function () {
        toggleStepCompletion(step.id, checkbox.checked);
      });
      checkWrap.appendChild(checkbox);

      var trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "rib-trigger";
      trigger.setAttribute("aria-expanded", String(isActive));

      var badgesHtml = "";
      badgesHtml += done
        ? '<span class="rpill rpill-done">Đã hoàn thành ✓</span>'
        : '<span class="rpill rpill-todo">Chưa hoàn thành</span>';

      if (step.isPlaceholder) {
        badgesHtml += '<span class="rpill rpill-ph">Placeholder minh họa</span>';
      }
      if (hasValidRisks(step)) {
        badgesHtml += '<span class="rpill rpill-risk">Lưu ý rủi ro</span>';
      }

      var leadDisplay = isMissingValue(step.lead) ? PLACEHOLDER_VAL : step.lead;

      trigger.innerHTML =
        '<span class="rcode">' + escapeHtml(step.code) + "</span>" +
        '<span class="rmid">' +
          '<span class="rttl">' + escapeHtml(step.title) + "</span>" +
          '<span class="rmeta"><span class="rmeta-lead">Chủ trì: ' + escapeHtml(leadDisplay) + "</span></span>" +
        "</span>" +
        '<span class="rbadges">' + badgesHtml + "</span>" +
        '<span class="rcar" aria-hidden="true"></span>';

      trigger.addEventListener("click", function () {
        openStep(step.id, trigger);
      });

      row.appendChild(checkWrap);
      row.appendChild(trigger);
      dom.stepList.appendChild(row);
    });
  }

  /* --------------------------------------------------------------------------
     FLOWCHART VIEW & ANIMATED SVG WIRES
     -------------------------------------------------------------------------- */
  function clearWires() {
    while (dom.wires.firstChild) {
      dom.wires.removeChild(dom.wires.firstChild);
    }
  }

  function renderFlow() {
    var filtered = getFilteredSteps();
    // Remove previous rows while keeping #wires SVG element intact
    Array.prototype.slice.call(dom.flowCanvas.querySelectorAll(".flow-row")).forEach(function (el) {
      el.parentNode.removeChild(el);
    });

    var scrollerEl = dom.flowview.querySelector(".scroller");

    if (filtered.length === 0) {
      scrollerEl.hidden = true;
      dom.flowEmpty.hidden = false;
      dom.flowEmpty.textContent = getEmptyFilterMessage();
      clearWires();
      return;
    }

    scrollerEl.hidden = false;
    dom.flowEmpty.hidden = true;

    filtered.forEach(function (step, visIndex) {
      var originalIndex = getStepIndex(step.id);
      var color = getStepColor(originalIndex);
      var done = Boolean(state.completed[step.id]);
      var isActive = state.activeStepId === step.id;
      var colIndex = COL_PATTERN[visIndex % COL_PATTERN.length];

      var row = document.createElement("div");
      row.className = "flow-row";

      var marker = document.createElement("div");
      marker.className = "pmark";
      marker.style.setProperty("--phc", color);
      marker.innerHTML = pad2(step.order) + "<i>" + (done ? "Xong" : "Bước") + "</i>";
      row.appendChild(marker);

      var card = document.createElement("article");
      card.id = "flow-node-" + step.id;
      card.className = "node" + (done ? " is-done" : "") + (isActive ? " is-active" : "");
      card.style.gridColumn = String(colIndex);
      card.style.setProperty("--phc", color);

      var top = document.createElement("div");
      top.className = "node-top";

      var codeEl = document.createElement("span");
      codeEl.className = "node-code";
      codeEl.textContent = step.code;

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "step-checkbox";
      cb.checked = done;
      cb.setAttribute(
        "aria-label",
        "Đánh dấu hoàn thành công việc của " + step.code + " — " + step.title
      );
      cb.addEventListener("change", function () {
        toggleStepCompletion(step.id, cb.checked);
      });

      top.appendChild(codeEl);
      top.appendChild(cb);

      var openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "node-open";

      var leadDisplay = isMissingValue(step.lead) ? PLACEHOLDER_VAL : step.lead;
      var tagsHtml = done
        ? '<span class="rpill rpill-done">Đã hoàn thành ✓</span>'
        : '<span class="rpill rpill-todo">Chưa hoàn thành</span>';
      if (step.isPlaceholder) {
        tagsHtml += '<span class="rpill rpill-ph">Placeholder</span>';
      }
      if (hasValidRisks(step)) {
        tagsHtml += '<span class="rpill rpill-risk">Lưu ý rủi ro</span>';
      }

      openBtn.innerHTML =
        "<h3>" + escapeHtml(step.title) + "</h3>" +
        '<span class="node-lead">Chủ trì: ' + escapeHtml(leadDisplay) + "</span>" +
        '<span class="node-tags">' + tagsHtml + "</span>";

      openBtn.addEventListener("click", function () {
        openStep(step.id, openBtn);
      });

      card.appendChild(top);
      card.appendChild(openBtn);
      row.appendChild(card);
      dom.flowCanvas.appendChild(row);
    });

    scheduleWireRedraw();
  }

  function drawWires() {
    clearWires();
    if (state.activeView !== "flow") return;
    if (global.matchMedia && global.matchMedia("(max-width: 900px)").matches) return;
    if (dom.flowCanvas.clientWidth < 200) return;

    var nodes = Array.prototype.slice.call(dom.flowCanvas.querySelectorAll(".node"));
    if (nodes.length < 2) return;

    var canvasRect = dom.flowCanvas.getBoundingClientRect();
    var width = dom.flowCanvas.clientWidth;
    var height = dom.flowCanvas.clientHeight;
    dom.wires.setAttribute("viewBox", "0 0 " + width + " " + height);

    var defs = document.createElementNS(SVG_NS, "defs");
    var marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "flowArrow");
    marker.setAttribute("viewBox", "0 0 12 12");
    marker.setAttribute("refX", "10.5");
    marker.setAttribute("refY", "6");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("orient", "auto-start-reverse");

    var arrowPath = document.createElementNS(SVG_NS, "path");
    arrowPath.setAttribute("d", "M1,1 L11,6 L1,11 L3.5,6 z");
    arrowPath.setAttribute("fill", "var(--rule-strong)");
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    dom.wires.appendChild(defs);

    for (var i = 0; i < nodes.length - 1; i++) {
      var rectA = nodes[i].getBoundingClientRect();
      var rectB = nodes[i + 1].getBoundingClientRect();

      var ax = rectA.left - canvasRect.left + rectA.width / 2;
      var ay = rectA.bottom - canvasRect.top;
      var bx = rectB.left - canvasRect.left + rectB.width / 2;
      var by = rectB.top - canvasRect.top;
      var midY = ay + (by - ay) / 2;

      var d = Math.abs(ax - bx) < 2
        ? "M" + ax + "," + ay + " L" + bx + "," + by
        : "M" + ax + "," + ay + " L" + ax + "," + midY + " L" + bx + "," + midY + " L" + bx + "," + by;

      var basePath = document.createElementNS(SVG_NS, "path");
      basePath.setAttribute("d", d);
      basePath.setAttribute("fill", "none");
      basePath.setAttribute("stroke", "var(--rule-strong)");
      basePath.setAttribute("stroke-width", "2.6");
      basePath.setAttribute("stroke-linejoin", "round");
      basePath.setAttribute("stroke-linecap", "round");
      basePath.setAttribute("marker-end", "url(#flowArrow)");
      basePath.setAttribute("class", "wire-base");
      dom.wires.appendChild(basePath);

      var pulsePath = document.createElementNS(SVG_NS, "path");
      pulsePath.setAttribute("d", d);
      pulsePath.setAttribute("fill", "none");
      pulsePath.setAttribute("stroke", "var(--accent)");
      pulsePath.setAttribute("stroke-width", "3");
      pulsePath.setAttribute("stroke-linejoin", "round");
      pulsePath.setAttribute("opacity", "0.55");
      pulsePath.setAttribute("class", "wire-pulse");
      dom.wires.appendChild(pulsePath);
    }
  }

  var wireTimer = null;
  function scheduleWireRedraw() {
    clearTimeout(wireTimer);
    wireTimer = setTimeout(function () {
      global.requestAnimationFrame(drawWires);
    }, 50);
  }

  /* --------------------------------------------------------------------------
     DETAIL SIDE PANEL RENDERING (6 MANDATORY GROUPS)
     -------------------------------------------------------------------------- */
  function renderFieldContent(val) {
    if (isMissingValue(val)) {
      return '<span class="missing-val">' + escapeHtml(PLACEHOLDER_VAL) + " (đang chờ tài liệu chính thức)</span>";
    }
    if (Array.isArray(val)) {
      return '<ul class="list">' + val.map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") + "</ul>";
    }
    return "<p>" + escapeHtml(val) + "</p>";
  }

  function renderRisksBlock(risks) {
    if (!Array.isArray(risks) || risks.length === 0) {
      return '<span class="missing-val">' + escapeHtml(PLACEHOLDER_VAL) + " (đang chờ tài liệu chính thức)</span>";
    }
    return risks.map(function (item) {
      if (typeof item === "string") {
        return '<div class="riskitem"><b>' + escapeHtml(item) + "</b></div>";
      }
      var title = item.title ? escapeHtml(item.title) : "Rủi ro phát sinh";
      var detail = item.detail ? escapeHtml(item.detail) : "";
      var solution = item.solution ? escapeHtml(item.solution) : PLACEHOLDER_VAL;
      return (
        '<div class="riskitem">' +
          "<b>" + title + "</b>" +
          (detail ? "<span>" + detail + "</span>" : "") +
          "<em>" + solution + "</em>" +
        "</div>"
      );
    }).join("");
  }

  function renderPanel(stepId, resetScroll) {
    var step = getStepById(stepId);
    if (!step) return;

    var index = getStepIndex(stepId);
    var color = getStepColor(index);
    var done = Boolean(state.completed[stepId]);
    var prevStep = index > 0 ? steps[index - 1] : null;
    var nextStep = index < steps.length - 1 ? steps[index + 1] : null;

    var statusBadge = done
      ? '<span class="rpill rpill-done">Đã hoàn thành ✓</span>'
      : '<span class="rpill rpill-todo">Chưa hoàn thành</span>';
    var placeholderBadge = step.isPlaceholder
      ? '<span class="rpill rpill-ph">Placeholder minh họa</span>'
      : "";

    var html =
      '<div class="pbar" style="--phc:' + color + '">' +
        '<div class="grow">' +
          '<div class="pbar-meta">' +
            '<span class="code">' + escapeHtml(step.code) + " / " + pad2(steps.length) + "</span>" +
            statusBadge +
            placeholderBadge +
          "</div>" +
          "<h2>" + escapeHtml(step.title) + "</h2>" +
        "</div>" +
        '<button class="xbtn" type="button" id="closePanelBtn" aria-label="Đóng bảng chi tiết bước">✕</button>' +
      "</div>" +
      '<div class="pbody">' +
        '<div class="sec">' +
          "<h4>1. Nội dung công việc</h4>" +
          renderFieldContent(step.description) +
        "</div>" +
        '<div class="sec">' +
          "<h4>2. Chủ trì &amp; Phối hợp</h4>" +
          '<dl class="raci">' +
            '<div class="raci-row"><dt>Chủ trì</dt><dd>' + renderFieldContent(step.lead) + "</dd></div>" +
            '<div class="raci-row"><dt>Liên hệ / Phối hợp</dt><dd>' + renderFieldContent(step.collaborators) + "</dd></div>" +
          "</dl>" +
        "</div>" +
        '<div class="sec">' +
          "<h4>3. Chứng từ đầu vào → Kết quả đầu ra</h4>" +
          '<div class="io">' +
            '<div class="iobox in"><h5>Chứng từ / Tài liệu đầu vào</h5>' + renderFieldContent(step.inputs) + "</div>" +
            '<div class="iobox out"><h5>Kết quả / Chứng từ đầu ra</h5>' + renderFieldContent(step.outputs) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="sec">' +
          "<h4>4. Rủi ro phát sinh &amp; Cách giải quyết</h4>" +
          renderRisksBlock(step.risks) +
        "</div>" +
      "</div>" +
      '<div class="pfoot">' +
        '<label class="panel-check' + (done ? " is-done" : "") + '">' +
          '<input class="step-checkbox" type="checkbox" id="panelStepCheck"' + (done ? " checked" : "") + ">" +
          '<span class="panel-check-text">' +
            "<strong>Xác nhận đã hoàn thành công việc của bước này</strong>" +
            "<span>Chỉ đánh dấu khi toàn bộ công việc và chứng từ đầu ra của bước đã được thực hiện xong.</span>" +
          "</span>" +
        "</label>" +
        '<div class="pnav">' +
          '<button class="pnav-btn" type="button" id="panelPrevBtn"' + (prevStep ? "" : " disabled") + ">← Bước trước</button>" +
          '<button class="pnav-btn" type="button" id="panelNextBtn"' + (nextStep ? "" : " disabled") + ">" +
            (nextStep ? "Bước tiếp theo →" : "Đã ở bước cuối cùng") +
          "</button>" +
        "</div>" +
      "</div>";

    dom.panelInner.innerHTML = html;

    var closeBtn = document.getElementById("closePanelBtn");
    var panelCheck = document.getElementById("panelStepCheck");
    var prevBtn = document.getElementById("panelPrevBtn");
    var nextBtn = document.getElementById("panelNextBtn");

    closeBtn.addEventListener("click", closePanel);
    panelCheck.addEventListener("change", function () {
      toggleStepCompletion(stepId, panelCheck.checked);
    });
    if (prevStep) {
      prevBtn.addEventListener("click", function () {
        openStep(prevStep.id);
      });
    }
    if (nextStep) {
      nextBtn.addEventListener("click", function () {
        openStep(nextStep.id);
      });
    }

    if (resetScroll) {
      var bodyEl = dom.panelInner.querySelector(".pbody");
      if (bodyEl) bodyEl.scrollTop = 0;
    }
  }

  function openStep(stepId, triggerEl) {
    if (!getStepById(stepId)) return;
    if (triggerEl) {
      state.lastFocusedElement = triggerEl;
    }
    state.activeStepId = stepId;
    renderPanel(stepId, true);

    dom.shell.classList.add("open");
    dom.panel.classList.add("open");
    if (global.innerWidth < 1240) {
      dom.scrim.classList.add("on");
      document.body.classList.add("panel-open");
    }

    renderAllStepsAndFlow();
    scheduleWireRedraw();

    try {
      dom.panel.focus({ preventScroll: true });
    } catch (e) {
      dom.panel.focus();
    }
  }

  function closePanel() {
    state.activeStepId = null;
    dom.shell.classList.remove("open");
    dom.panel.classList.remove("open");
    dom.scrim.classList.remove("on");
    document.body.classList.remove("panel-open");

    dom.panelInner.innerHTML =
      '<div class="empty">' +
        '<span class="big" aria-hidden="true">◇</span>' +
        "Chọn một bước trong quy trình báo giá để xem hướng dẫn công việc, đơn vị phối hợp, " +
        "chứng từ đầu vào/đầu ra và cách xử lý rủi ro." +
      "</div>";

    renderAllStepsAndFlow();
    scheduleWireRedraw();

    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
      try {
        state.lastFocusedElement.focus({ preventScroll: true });
      } catch (e) {}
    }
  }

  /* --------------------------------------------------------------------------
     COMPLETION TOGGLE, CLEAR ALL MODAL & TOASTS
     -------------------------------------------------------------------------- */
  function showToast(message) {
    while (dom.toastRegion.children.length >= 3) {
      dom.toastRegion.removeChild(dom.toastRegion.firstChild);
    }
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    dom.toastRegion.appendChild(el);

    setTimeout(function () {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 3800);
  }

  function toggleStepCompletion(stepId, isDone) {
    var step = getStepById(stepId);
    if (!step) return;

    if (isDone) {
      state.completed[stepId] = true;
    } else {
      delete state.completed[stepId];
    }

    var saved = storage.saveProgress(DATA.storageKey, state.completed);
    state.persistentStorage = saved;

    renderProgress();
    renderAllStepsAndFlow();
    if (state.activeStepId === stepId) {
      renderPanel(stepId, false);
    }

    var stats = getStats();
    if (isDone) {
      if (stats.total > 0 && stats.done === stats.total) {
        showToast(
          "Chúc mừng! Bạn đã đánh dấu hoàn thành toàn bộ " + stats.total + " bước của quy trình báo giá."
        );
      } else {
        showToast(
          "Đã đánh dấu hoàn thành " + step.code + ". Tiến độ hiện tại: " +
          stats.done + "/" + stats.total + " bước (" + stats.percent + "%)."
        );
      }
    } else {
      showToast("Đã chuyển " + step.code + " về trạng thái chưa hoàn thành.");
    }
  }

  function openClearModal() {
    var stats = getStats();
    if (stats.done === 0) return;

    dom.modalDoneCount.textContent = stats.done + " bước đã hoàn thành";
    dom.clearModal.hidden = false;
    document.body.classList.add("modal-open");
    dom.modalCancelBtn.focus();
  }

  function closeClearModal(restoreFocus) {
    dom.clearModal.hidden = true;
    document.body.classList.remove("modal-open");
    if (restoreFocus && dom.clearAllBtn && !dom.clearAllBtn.disabled) {
      dom.clearAllBtn.focus();
    }
  }

  function confirmClearAll() {
    state.completed = {};
    storage.clearProgress(DATA.storageKey);
    closeClearModal(false);

    renderProgress();
    renderAllStepsAndFlow();
    if (state.activeStepId) {
      renderPanel(state.activeStepId, false);
    }

    showToast("Đã xóa toàn bộ dấu hoàn thành. Quy trình đã sẵn sàng cho lượt báo giá mới.");
    dom.progressHeading.setAttribute("tabindex", "-1");
    try {
      dom.progressHeading.focus({ preventScroll: true });
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     VIEW TABS & FILTERS
     -------------------------------------------------------------------------- */
  function setView(view) {
    state.activeView = view === "flow" ? "flow" : "ov";
    var isOv = state.activeView === "ov";

    document.body.classList.toggle("ov", isOv);
    dom.overview.hidden = !isOv;
    dom.flowview.hidden = isOv;
    dom.tabOv.setAttribute("aria-selected", String(isOv));
    dom.tabFlow.setAttribute("aria-selected", String(!isOv));

    if (!isOv) {
      scheduleWireRedraw();
    }
  }

  function setFilter(nextFilter) {
    state.filter = nextFilter;
    Array.prototype.slice.call(dom.filterGroup.querySelectorAll(".filter-pill")).forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.filter === nextFilter));
    });
    renderAllStepsAndFlow();
  }

  function renderAllStepsAndFlow() {
    renderStepRail();
    renderOverview();
    renderFlow();
  }

  /* --------------------------------------------------------------------------
     EVENT BINDINGS & INITIALIZATION
     -------------------------------------------------------------------------- */
  function bindEvents() {
    dom.themeToggle.addEventListener("click", toggleTheme);

    if (dom.syncRetryBtn) {
      dom.syncRetryBtn.addEventListener("click", function () {
        loadRemoteWorkflow();
      });
    }

    dom.tabOv.addEventListener("click", function () { setView("ov"); });
    dom.tabFlow.addEventListener("click", function () { setView("flow"); });

    Array.prototype.slice.call(dom.filterGroup.querySelectorAll(".filter-pill")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        setFilter(btn.dataset.filter || "all");
      });
    });

    dom.clearAllBtn.addEventListener("click", openClearModal);
    dom.modalCancelBtn.addEventListener("click", function () { closeClearModal(true); });
    dom.modalConfirmBtn.addEventListener("click", confirmClearAll);

    dom.clearModal.addEventListener("click", function (e) {
      if (e.target === dom.clearModal) {
        closeClearModal(true);
      }
    });

    dom.scrim.addEventListener("click", closePanel);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (!dom.clearModal.hidden) {
          closeClearModal(true);
          return;
        }
        if (state.activeStepId) {
          closePanel();
        }
      }
    });

    global.addEventListener("resize", function () {
      scheduleWireRedraw();
      if (state.activeStepId && global.innerWidth >= 1240) {
        dom.scrim.classList.remove("on");
        document.body.classList.remove("panel-open");
      } else if (state.activeStepId && global.innerWidth < 1240) {
        dom.scrim.classList.add("on");
        document.body.classList.add("panel-open");
      }
    });

    if (global.matchMedia) {
      var mq = global.matchMedia("(prefers-color-scheme: dark)");
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", function () {
          updateThemeButton();
          renderAllStepsAndFlow();
          if (state.activeStepId) renderPanel(state.activeStepId, false);
        });
      }
    }

    if (typeof global.ResizeObserver === "function") {
      var ro = new global.ResizeObserver(scheduleWireRedraw);
      ro.observe(dom.flowCanvas);
    }
  }

  function setSyncStatus(message, isError) {
    if (!dom.syncStatusBanner || !dom.syncStatusText || !dom.syncRetryBtn) return;
    if (!message) {
      dom.syncStatusBanner.hidden = true;
      dom.syncStatusBanner.classList.remove("is-error");
      dom.syncRetryBtn.hidden = true;
      return;
    }
    dom.syncStatusBanner.hidden = false;
    dom.syncStatusBanner.classList.toggle("is-error", Boolean(isError));
    dom.syncStatusText.textContent = message;
    dom.syncRetryBtn.hidden = !isError;
  }

  function applyWorkflowData(meta, nextSteps) {
    activeMeta = meta || {};
    steps = (Array.isArray(nextSteps) ? nextSteps : []).slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
    stepIds = steps.map(function (s) { return s.id; });

    var loaded = storage.loadProgress(DATA.storageKey, stepIds);
    state.completed = loaded.completed;
    state.persistentStorage = loaded.persistent;

    if (state.activeStepId && !getStepById(state.activeStepId)) {
      closePanel();
    }

    renderMetadata();
    renderProgress();
    renderAllStepsAndFlow();

    if (state.activeStepId) {
      renderPanel(state.activeStepId, false);
    }
    if (state.activeView === "flow") {
      scheduleWireRedraw();
    }
  }

  function loadRemoteWorkflow() {
    setSyncStatus("Đang tải dữ liệu quy trình mới nhất từ máy chủ...", false);
    return global.fetch("/api/workflow", {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        return res.json().catch(function () {
          return null;
        }).then(function (payload) {
          if (!res.ok) {
            var serverMsg = payload && payload.error ? payload.error : ("HTTP " + res.status);
            throw new Error(serverMsg);
          }
          if (!payload || !Array.isArray(payload.steps)) {
            throw new Error("Dữ liệu trả về từ máy chủ không hợp lệ.");
          }
          return payload;
        });
      })
      .then(function (payload) {
        setSyncStatus("", false);
        applyWorkflowData(payload.meta || {}, payload.steps);
      })
      .catch(function (err) {
        var detail = err && err.message ? err.message : "Lỗi kết nối máy chủ";
        setSyncStatus(
          "Không thể tải dữ liệu quy trình tập trung (" + detail + "). Vui lòng kiểm tra cấu hình Supabase/API và thử lại.",
          true
        );
      });
  }

  function init() {
    updateThemeButton();
    setView("ov");
    bindEvents();

    if (global.location && global.location.protocol === "file:") {
      setSyncStatus("", false);
      applyWorkflowData(DATA.meta || {}, DATA.steps || []);
      return;
    }

    renderMetadata();
    renderProgress();
    renderAllStepsAndFlow();
    loadRemoteWorkflow();
  }

  init();
})(window);
