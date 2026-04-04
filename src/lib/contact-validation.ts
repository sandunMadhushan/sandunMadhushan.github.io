/** Public contact form → API payload validation. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidContactPayload = {
  name: string;
  email: string;
  subject: string | null;
  message: string;
};

export function validateContactMessage(body: unknown):
  | { ok: true; data: ValidContactPayload }
  | { ok: false; error: string } {
  if (body === null || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }
  const o = body as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const subjectRaw = typeof o.subject === "string" ? o.subject.trim() : "";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (!name || name.length > 200) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!message || message.length > 20000) {
    return { ok: false, error: "Please enter a message." };
  }
  const subject = subjectRaw.length > 0 ? subjectRaw.slice(0, 500) : null;

  return {
    ok: true,
    data: { name, email, subject, message },
  };
}
