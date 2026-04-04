import type { Message } from "@prisma/client";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type ContactEmailResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the contact submission to your inbox via Resend.
 * Configure RESEND_API_KEY + CONTACT_NOTIFY_EMAIL (+ RESEND_FROM after domain verify).
 * Reply in your mail client — Reply-To is set to the visitor.
 *
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
export async function sendContactInboxEmail(row: Message): Promise<ContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_NOTIFY_EMAIL?.trim();

  if (!apiKey || !to) {
    return {
      ok: false,
      error: "Email not configured (RESEND_API_KEY / CONTACT_NOTIFY_EMAIL).",
    };
  }

  const from =
    process.env.RESEND_FROM?.trim() || "Portfolio contact <onboarding@resend.dev>";
  const subject = row.subject
    ? `[Portfolio] ${row.subject}`
    : `[Portfolio] Message from ${row.name}`;

  const text = [
    `New message from your portfolio contact form.`,
    ``,
    `Name: ${row.name}`,
    `Email: ${row.email}`,
    row.subject ? `Subject: ${row.subject}` : null,
    ``,
    row.message,
    ``,
    `— Message ID: ${row.id}`,
    `— Received: ${row.createdAt.toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const adminLink = baseUrl ? `${baseUrl}/admin/messages` : "";

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1c1b1c;background:#f4f4f5;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e4e4e7;">
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4f46e5;">New contact form</p>
    <h1 style="margin:0 0 16px;font-size:20px;">${escapeHtml(row.subject ?? "New message")}</h1>
    <p style="margin:0 0 8px;"><strong>From:</strong> ${escapeHtml(row.name)} &lt;${escapeHtml(row.email)}&gt;</p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:20px 0;" />
    <div style="white-space:pre-wrap;font-size:15px;color:#3f3f46;">${escapeHtml(row.message)}</div>
    ${
      adminLink
        ? `<p style="margin-top:24px;font-size:13px;"><a href="${escapeHtml(adminLink)}" style="color:#4f46e5;">Open admin Messages</a> (same thread is stored in your dashboard).</p>`
        : ""
    }
  </div>
</body>
</html>`.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: row.email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return { ok: false, error: `Resend ${res.status}: ${errText.slice(0, 200)}` };
  }

  return { ok: true };
}
