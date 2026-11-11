/**
 * QUẢN LÝ LƯU TRỮ CỤC BỘ (LOCALSTORAGE)
 * -----------------------------------------------------------------------------
 * Lưu ý phạm vi theo Quy_Trinh.md:
 * Trạng thái hoàn thành chỉ được lưu cục bộ trên trình duyệt và thiết bị hiện tại,
 * KHÔNG đồng bộ giữa nhiều người dùng hoặc nhiều thiết bị khác nhau.
 */
(function (global) {
  "use strict";

  function checkStorageAvailable() {
    try {
      var testKey = "__qw_storage_test__";
      global.localStorage.setItem(testKey, "1");
      global.localStorage.removeItem(testKey);
      return true;
    } catch (err) {
      return false;
    }
  }

  function loadProgress(storageKey, validIds) {
    var result = {};
    if (!checkStorageAvailable()) {
      return { completed: result, persistent: false };
    }
    try {
      var raw = global.localStorage.getItem(storageKey);
      if (!raw) {
        return { completed: result, persistent: true };
      }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return { completed: result, persistent: true };
      }
      var completedSource = parsed.completed && typeof parsed.completed === "object"
        ? parsed.completed
        : parsed;

      validIds.forEach(function (id) {
        if (completedSource[id] === true) {
          result[id] = true;
        }
      });
      return { completed: result, persistent: true };
    } catch (err) {
      return { completed: {}, persistent: true };
    }
  }

  function saveProgress(storageKey, completedMap) {
    if (!checkStorageAvailable()) {
      return false;
    }
    try {
      var payload = {
        completed: completedMap,
        updatedAt: new Date().toISOString()
      };
      global.localStorage.setItem(storageKey, JSON.stringify(payload));
      return true;
    } catch (err) {
      return false;
    }
  }

  function clearProgress(storageKey) {
    if (!checkStorageAvailable()) {
      return false;
    }
    try {
      global.localStorage.removeItem(storageKey);
      return true;
    } catch (err) {
      return false;
    }
  }

  function loadTheme(themeKey) {
    if (!checkStorageAvailable()) {
      return null;
    }
    try {
      var theme = global.localStorage.getItem(themeKey);
      return theme === "dark" || theme === "light" ? theme : null;
    } catch (err) {
      return null;
    }
  }

  function saveTheme(themeKey, theme) {
    if (!checkStorageAvailable()) {
      return false;
    }
    try {
      if (theme === "dark" || theme === "light") {
        global.localStorage.setItem(themeKey, theme);
      } else {
        global.localStorage.removeItem(themeKey);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  global.QuotationApp = global.QuotationApp || {};
  global.QuotationApp.storage = {
    isAvailable: checkStorageAvailable,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    clearProgress: clearProgress,
    loadTheme: loadTheme,
    saveTheme: saveTheme
  };
})(window);
