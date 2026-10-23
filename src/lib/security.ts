import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export function sameSecret(candidate: string, expected: string) {
  if (!expected || candidate.length > 512) return false;
  return timingSafeEqual(createHash("sha256").update(candidate).digest(), createHash("sha256").update(expected).digest());
}
export function keyedHash(value: string) {
  const key = process.env.ADMIN_SECRET_KEY;
  if (!key || key.length < 32) throw new Error("Admin security configuration missing.");
  return createHmac("sha256", key).update(value).digest("hex");
}
export function csvCell(value: unknown) {
  let text = value == null ? "" : String(value);
  const isPhone = /^\+\d[\d\s().-]*$/u.test(text);
  if ((!isPhone && /^[\s\u0000-\u001f]*[=+\-@]/u.test(text)) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
export function csvRow(values: unknown[]) { return values.map(csvCell).join(";") + "\r\n"; }
