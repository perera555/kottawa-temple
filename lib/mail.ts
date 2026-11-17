import "server-only";

/**
 * Sends an email when SMTP is configured (e.g. Gmail with an App Password):
 *   SMTP_HOST=smtp.gmail.com  SMTP_PORT=465  SMTP_USER=you@gmail.com  SMTP_PASS=app-password
 * Returns false when email is not configured, so callers can fall back.
 */
export async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
  try {
    const nodemailer = await import("nodemailer");
    const port = Number(SMTP_PORT || 465);
    const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
    await transport.sendMail({ from: SMTP_FROM || `Sri Punyabhiwardhanaramaya <${SMTP_USER}>`, to, subject, text });
    return true;
  } catch (err) {
    console.error("[mail]", err);
    return false;
  }
}
