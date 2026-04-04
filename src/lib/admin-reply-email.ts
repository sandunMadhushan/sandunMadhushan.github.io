import type { Message } from "@prisma/client";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSubmittedAt(d: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(d);
}

export type AdminReplyResult = { ok: true } | { ok: false; error: string };

/**
 * Sends an admin-authored reply to the visitor’s email (same Resend account as contact form).
 * `reply_to` is your inbox so if they hit “Reply” in Gmail it comes back to you.
 */
export async function sendVisitorReplyEmail(
  message: Message,
  bodyText: string,
  subjectLine: string,
): Promise<AdminReplyResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured." };
  }

  const from =
    process.env.RESEND_FROM?.trim() || "Portfolio <onboarding@resend.dev>";
  const notifyInbox = process.env.CONTACT_NOTIFY_EMAIL?.trim();

  const footerNote =
    "This is a reply regarding your earlier message to our portfolio contact form.";

  const submittedAt = formatSubmittedAt(message.createdAt);
  const originalTitle = message.subject?.trim() || "(no subject)";

  const text = [
    bodyText.trim(),
    "",
    "—",
    "",
    footerNote,
    "",
    "Your original submission",
    "",
    `Title: ${originalTitle}`,
    `Submitted: ${submittedAt}`,
    "",
    "Message:",
    message.message.trim(),
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1c1b1c;background:#f4f4f5;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e4e4e7;">
    <p style="margin:0 0 16px;font-size:15px;white-space:pre-wrap;color:#3f3f46;">${escapeHtml(bodyText)}</p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:20px 0;" />
    <p style="margin:0 0 16px;font-size:12px;color:#71717a;">${escapeHtml(footerNote)}</p>
    <p style="margin:0 0 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#71717a;">Your original submission</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;color:#52525b;margin-bottom:12px;">
      <tr>
        <td style="padding:6px 0;vertical-align:top;width:120px;color:#71717a;">Title</td>
        <td style="padding:6px 0;font-weight:500;color:#3f3f46;">${escapeHtml(originalTitle)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;vertical-align:top;color:#71717a;">Submitted</td>
        <td style="padding:6px 0;font-weight:500;color:#3f3f46;">${escapeHtml(submittedAt)}</td>
      </tr>
    </table>
    <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#71717a;">Message</p>
    <div style="font-size:14px;color:#3f3f46;white-space:pre-wrap;background:#fafafa;border-radius:8px;padding:14px;border:1px solid #f4f4f5;">${escapeHtml(message.message)}</div>
  </div>
</body>
</html>`.trim();

  const payload: Record<string, unknown> = {
    from,
    to: [message.email],
    subject: subjectLine,
    text,
    html,
  };

  if (notifyInbox) {
    payload.reply_to = notifyInbox;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return { ok: false, error: `Email could not be sent (${res.status}). ${errText.slice(0, 120)}` };
  }

  return { ok: true };
}
