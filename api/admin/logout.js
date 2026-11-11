import { buildLogoutCookie } from "../../server/auth.js";
import { methodNotAllowed, sendJson } from "../../server/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }
  return sendJson(
    res,
    200,
    { authenticated: false },
    { "Set-Cookie": buildLogoutCookie(req) }
  );
}
