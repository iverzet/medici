import test from "node:test";
import assert from "node:assert/strict";
import { csvCell, csvRow, sameSecret } from "../src/lib/security";
import { leadSchema, normalizePhone, validPreferredDate, partnershipSchema } from "../src/lib/validation";
import { isKnownMunicipality } from "../src/lib/municipalities";

test("telefonul acceptă formate românești și respinge numere invalide", () => {
  for (const phone of ["0722 123 456", "+40 722 123 456", "0040722123456"]) assert.equal(normalizePhone(phone), "+40722123456");
  const input = { patientName: "Test Automat", patientPhone: "+40722123456", city: "București", patientEmail: "", preferredDate: "", message: "", consent: true };
  assert.equal(leadSchema.safeParse(input).success, true);
  for (const patientPhone of ["123", "+44722123456", "0000000000", "+407221234567"]) assert.equal(leadSchema.safeParse({ ...input, patientPhone }).success, false);
  assert.equal(leadSchema.safeParse({ ...input, consent: false }).success, false);
  assert.equal(leadSchema.safeParse({ ...input, message: "a".repeat(1001) }).success, false);
});
test("data preferată respectă calendarul și ziua din București", () => {
  const now = new Date("2026-10-23T22:30:00Z");
  assert.equal(validPreferredDate("", now), true);
  assert.equal(validPreferredDate("2026-10-23", now), false);
  assert.equal(validPreferredDate("2026-10-24", now), true);
  assert.equal(validPreferredDate("2027-02-30", now), false);
  assert.equal(validPreferredDate("2028-01-01", now), false);
});
test("CSV neutralizează formule și păstrează ghilimele, diacritice și linii", () => {
  for (const text of ["=1+1", "+cmd", "-1", "@SUM(A1)", "  =1", "\tformula", "\ntext"]) assert.ok(csvCell(text).startsWith('"\''));
  assert.equal(csvCell('Iași; "Centru"'), '"Iași; ""Centru"""');
  assert.equal(csvRow([null, "Brașov"]), '"";"Brașov"\r\n');
});
test("secretul este verificat fără acceptarea configurației goale", () => {
  assert.equal(sameSecret("", ""), false);
  assert.equal(sameSecret("abc", "abd"), false);
  assert.equal(sameSecret("abc", "abc"), true);
  assert.equal(sameSecret("a".repeat(513), "a".repeat(513)), false);
});
test("parteneriatele cer email și acord explicit", () => {
  const data = { clinicName: "Clinica Test", city: "Iași", contactName: "Test Automat", phone: "0722123456", email: "test@example.invalid", consent: true };
  assert.equal(partnershipSchema.safeParse(data).success, true);
  assert.equal(partnershipSchema.safeParse({ ...data, consent: false }).success, false);
  assert.equal(partnershipSchema.safeParse({ ...data, email: "incorect" }).success, false);
});
test("lista completă de municipii acceptă cereri din afara orașelor seed", () => {
  assert.equal(isKnownMunicipality("Sibiu"), true);
  assert.equal(isKnownMunicipality("București"), true);
  assert.equal(isKnownMunicipality("Oraș inventat"), false);
});
