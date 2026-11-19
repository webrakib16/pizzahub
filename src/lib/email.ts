/**
 * Email helpers used by the auth forms and the server-side duplicate check
 * in `src/lib/auth.ts`.
 */

/** Trim + lowercase — the form that is stored in MongoDB. */
export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

/**
 * Canonical form used only for duplicate detection.
 *
 * Gmail ignores dots and anything after "+" in the local part, so all of these
 * deliver to the same inbox:
 *   rafik@gmail.com
 *   r.afik@gmail.com
 *   rafik+pizza@gmail.com
 *   rafik@googlemail.com
 *
 * We reduce them to one value ("rafik@gmail.com") so a person cannot create
 * several accounts with the same Gmail address.
 */
export function canonicalEmail(value: string) {
  const email = normalizeEmail(value);
  const at = email.lastIndexOf("@");

  if (at < 1) return email;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (domain === "gmail.com" || domain === "googlemail.com") {
    const withoutTag = local.split("+")[0];
    return `${withoutTag.replace(/\./g, "")}@gmail.com`;
  }

  return email;
}
