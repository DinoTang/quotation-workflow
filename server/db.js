import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

var DEFAULT_META = {
  eyebrowCategory: "Quy trình nội bộ",
  eyebrowModule: "Quy trình báo giá",
  title: "Quy trình báo giá",
  dek: null,
  version: "Chưa được cung cấp",
  organization: "Chưa được cung cấp",
  sourceDocument: "Chưa được cung cấp",
  maintainerContact: "Chưa được cung cấp",
  isDraftPlaceholder: true,
  draftBannerText:
    "Dữ liệu nghiệp vụ hiện đang ở trạng thái Placeholder minh họa (dự kiến khoảng 7 bước sơ bộ). Tên bước, chủ trì, phối hợp, chứng từ và rủi ro sẽ được điền chính xác sau khi nhận tài liệu quy trình báo giá chính thức."
};

function getSupabaseServiceKey() {
  return (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "").trim();
}

function isLegacyJwtKey(key) {
  // Legacy service_role keys are 3-segment JWTs; new sb_secret_ keys are opaque tokens and must NOT be sent as Bearer JWTs.
  return typeof key === "string" && !key.startsWith("sb_") && key.split(".").length === 3;
}

function useLocalDevStore() {
  return (
    process.env.QUOTATION_LOCAL_DEV_DB === "1" &&
    process.env.VERCEL !== "1" &&
    (!process.env.SUPABASE_URL || !getSupabaseServiceKey())
  );
}

function getSupabaseConfig() {
  var url = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  var serviceKey = getSupabaseServiceKey();
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
  if (serviceKey.startsWith("sb_publishable_")) {
    throw new Error("SUPABASE_PUBLISHABLE_KEY_NOT_ALLOWED");
  }
  return { url: url, serviceKey: serviceKey };
}

async function supabaseFetch(endpoint, options) {
  var cfg = getSupabaseConfig();
  var baseHeaders = {
    apikey: cfg.serviceKey,
    "Content-Type": "application/json"
  };
  if (isLegacyJwtKey(cfg.serviceKey)) {
    baseHeaders.Authorization = "Bearer " + cfg.serviceKey;
  }

  var headers = Object.assign(
    baseHeaders,
    (options && options.headers) || {}
  );

  var response = await fetch(cfg.url + "/rest/v1/" + endpoint, {
    method: (options && options.method) || "GET",
    headers: headers,
    body: options && options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    var detail = await response.text();
    throw new Error("SUPABASE_ERROR_" + response.status + ": " + detail);
  }

  if (response.status === 204) {
    return null;
  }
  var text = await response.text();
  return text ? JSON.parse(text) : null;
}

function mapMetaFromDb(row) {
  if (!row) return Object.assign({}, DEFAULT_META);
  return {
    eyebrowCategory: row.eyebrow_category || DEFAULT_META.eyebrowCategory,
    eyebrowModule: row.eyebrow_module || DEFAULT_META.eyebrowModule,
    title: row.title || DEFAULT_META.title,
    dek: row.dek || null,
    version: row.version || "Chưa được cung cấp",
    organization: row.organization || "Chưa được cung cấp",
    sourceDocument: row.source_document || "Chưa được cung cấp",
    maintainerContact: row.maintainer_contact || "Chưa được cung cấp",
    isDraftPlaceholder: Boolean(row.is_draft_placeholder),
    draftBannerText: row.draft_banner_text || DEFAULT_META.draftBannerText,
    updatedAt: row.updated_at || null
  };
}

function mapMetaToDb(meta) {
  return {
    id: 1,
    eyebrow_category: meta.eyebrowCategory,
    eyebrow_module: meta.eyebrowModule,
    title: meta.title,
    dek: meta.dek,
    version: meta.version,
    organization: meta.organization,
    source_document: meta.sourceDocument,
    maintainer_contact: meta.maintainerContact,
    is_draft_placeholder: meta.isDraftPlaceholder,
    draft_banner_text: meta.draftBannerText,
    updated_at: new Date().toISOString()
  };
}

function mapStepFromDb(row) {
  return {
    id: row.id,
    order: Number(row.sort_order),
    code: row.code,
    title: row.title,
    isPlaceholder: Boolean(row.is_placeholder),
    description: row.description !== undefined ? row.description : "Chưa được cung cấp",
    lead: row.lead !== undefined ? row.lead : "Chưa được cung cấp",
    collaborators: row.collaborators !== undefined ? row.collaborators : "Chưa được cung cấp",
    inputs: row.inputs !== undefined ? row.inputs : "Chưa được cung cấp",
    outputs: row.outputs !== undefined ? row.outputs : "Chưa được cung cấp",
    risks: row.risks !== undefined ? row.risks : "Chưa được cung cấp",
    updatedAt: row.updated_at || null
  };
}

/* --------------------------------------------------------------------------
   LOCAL DEV JSON STORE (CHỈ DÙNG KHI CHẠY LOCAL DEV KHÔNG CÓ SUPABASE)
   -------------------------------------------------------------------------- */
function getLocalDbPath() {
  return process.env.QUOTATION_LOCAL_DB_PATH ||
    path.resolve(process.cwd(), "scripts/.local-db.json");
}

function createInitialLocalDb() {
  var steps = [];
  for (var i = 1; i <= 7; i++) {
    var padded = i < 10 ? "0" + i : String(i);
    steps.push({
      id: crypto.randomUUID(),
      order: i,
      code: "Bước " + padded,
      title: "Chưa được cung cấp tên bước",
      isPlaceholder: true,
      description: "Chưa được cung cấp",
      lead: "Chưa được cung cấp",
      collaborators: "Chưa được cung cấp",
      inputs: "Chưa được cung cấp",
      outputs: "Chưa được cung cấp",
      risks: "Chưa được cung cấp",
      updatedAt: new Date().toISOString()
    });
  }
  return { meta: Object.assign({}, DEFAULT_META), steps: steps };
}

function readLocalDb() {
  var dbPath = getLocalDbPath();
  if (!fs.existsSync(dbPath)) {
    var init = createInitialLocalDb();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(init, null, 2), "utf8");
    return init;
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeLocalDb(db) {
  var dbPath = getLocalDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

/* --------------------------------------------------------------------------
   PUBLIC REPOSITORY API
   -------------------------------------------------------------------------- */
export async function getWorkflow() {
  if (useLocalDevStore()) {
    var local = readLocalDb();
    local.steps.sort(function (a, b) { return a.order - b.order; });
    return local;
  }

  var metaRows = await supabaseFetch("workflow_meta?id=eq.1&select=*");
  var stepRows = await supabaseFetch("workflow_steps?select=*&order=sort_order.asc,created_at.asc");

  return {
    meta: mapMetaFromDb(metaRows && metaRows[0]),
    steps: (stepRows || []).map(mapStepFromDb)
  };
}

export async function updateMeta(metaData) {
  if (useLocalDevStore()) {
    var local = readLocalDb();
    local.meta = Object.assign({}, metaData, { updatedAt: new Date().toISOString() });
    writeLocalDb(local);
    return local.meta;
  }

  var rows = await supabaseFetch("workflow_meta?id=eq.1", {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: mapMetaToDb(metaData)
  });

  if (!rows || rows.length === 0) {
    rows = await supabaseFetch("workflow_meta", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: mapMetaToDb(metaData)
    });
  }
  return mapMetaFromDb(rows && rows[0]);
}

export async function createStep(stepData) {
  if (useLocalDevStore()) {
    var local = readLocalDb();
    var maxOrder = local.steps.reduce(function (m, s) { return Math.max(m, s.order); }, 0);
    var created = Object.assign(
      {
        id: crypto.randomUUID(),
        order: maxOrder + 1,
        updatedAt: new Date().toISOString()
      },
      stepData
    );
    local.steps.push(created);
    writeLocalDb(local);
    return created;
  }

  var existing = await supabaseFetch("workflow_steps?select=sort_order&order=sort_order.desc&limit=1");
  var nextOrder = existing && existing[0] ? Number(existing[0].sort_order) + 1 : 1;
  var now = new Date().toISOString();

  var rows = await supabaseFetch("workflow_steps", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: {
      id: crypto.randomUUID(),
      sort_order: nextOrder,
      code: stepData.code,
      title: stepData.title,
      is_placeholder: stepData.isPlaceholder,
      description: stepData.description,
      lead: stepData.lead,
      collaborators: stepData.collaborators,
      inputs: stepData.inputs,
      outputs: stepData.outputs,
      risks: stepData.risks,
      created_at: now,
      updated_at: now
    }
  });
  return mapStepFromDb(rows[0]);
}

export async function updateStep(stepId, stepData) {
  if (useLocalDevStore()) {
    var local = readLocalDb();
    var idx = local.steps.findIndex(function (s) { return s.id === stepId; });
    if (idx === -1) return null;
    var updated = Object.assign({}, local.steps[idx], stepData, {
      id: local.steps[idx].id, // Bảo lưu ID cố định
      order: local.steps[idx].order,
      updatedAt: new Date().toISOString()
    });
    local.steps[idx] = updated;
    writeLocalDb(local);
    return updated;
  }

  var rows = await supabaseFetch("workflow_steps?id=eq." + encodeURIComponent(stepId), {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: {
      code: stepData.code,
      title: stepData.title,
      is_placeholder: stepData.isPlaceholder,
      description: stepData.description,
      lead: stepData.lead,
      collaborators: stepData.collaborators,
      inputs: stepData.inputs,
      outputs: stepData.outputs,
      risks: stepData.risks,
      updated_at: new Date().toISOString()
    }
  });
  if (!rows || rows.length === 0) return null;
  return mapStepFromDb(rows[0]);
}

export async function deleteStep(stepId) {
  if (useLocalDevStore()) {
    var local = readLocalDb();
    var beforeLen = local.steps.length;
    local.steps = local.steps.filter(function (s) { return s.id !== stepId; });
    if (local.steps.length === beforeLen) return false;
    local.steps.sort(function (a, b) { return a.order - b.order; });
    local.steps.forEach(function (s, idx) { s.order = idx + 1; });
    writeLocalDb(local);
    return true;
  }

  var deleted = await supabaseFetch("workflow_steps?id=eq." + encodeURIComponent(stepId), {
    method: "DELETE",
    headers: { Prefer: "return=representation" }
  });
  if (!deleted || deleted.length === 0) return false;

  var remaining = await supabaseFetch("workflow_steps?select=id&order=sort_order.asc,created_at.asc");
  var now = new Date().toISOString();
  await Promise.all(
    (remaining || []).map(function (row, idx) {
      return supabaseFetch("workflow_steps?id=eq." + encodeURIComponent(row.id), {
        method: "PATCH",
        body: { sort_order: idx + 1, updated_at: now }
      });
    })
  );
  return true;
}

export async function reorderSteps(orderedIds) {
  if (useLocalDevStore()) {
    var local = readLocalDb();
    var byId = new Map(local.steps.map(function (s) { return [s.id, s]; }));
    if (orderedIds.length !== local.steps.length) {
      return { error: "Danh sách thứ tự không khớp với số lượng bước hiện có." };
    }
    var seen = new Set();
    var reordered = [];
    for (var i = 0; i < orderedIds.length; i++) {
      var id = orderedIds[i];
      if (seen.has(id) || !byId.has(id)) {
        return { error: "Danh sách ID sắp xếp không hợp lệ." };
      }
      seen.add(id);
      var item = Object.assign({}, byId.get(id), {
        order: i + 1,
        updatedAt: new Date().toISOString()
      });
      reordered.push(item);
    }
    local.steps = reordered;
    writeLocalDb(local);
    return { steps: reordered };
  }

  var currentRows = await supabaseFetch("workflow_steps?select=id");
  var existingIds = new Set((currentRows || []).map(function (r) { return r.id; }));
  if (orderedIds.length !== existingIds.size) {
    return { error: "Danh sách thứ tự không khớp với số lượng bước hiện có." };
  }
  var seenRemote = new Set();
  for (var j = 0; j < orderedIds.length; j++) {
    if (seenRemote.has(orderedIds[j]) || !existingIds.has(orderedIds[j])) {
      return { error: "Danh sách ID sắp xếp không hợp lệ." };
    }
    seenRemote.add(orderedIds[j]);
  }

  var now = new Date().toISOString();
  await Promise.all(
    orderedIds.map(function (id, idx) {
      return supabaseFetch("workflow_steps?id=eq." + encodeURIComponent(id), {
        method: "PATCH",
        body: { sort_order: idx + 1, updated_at: now }
      });
    })
  );

  var fresh = await getWorkflow();
  return { steps: fresh.steps };
}
