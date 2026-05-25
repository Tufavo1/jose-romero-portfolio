import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) return null;
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  const client = getResend();
  if (!client) throw new Error("Resend not configured");

  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error("CONTACT_TO_EMAIL not set");

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const message = escapeHtml(data.message).replace(/\n/g, "<br/>");

  return client.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    subject: `Mensaje de ${data.name} — Portfolio`,
    text: `Nombre: ${data.name}\nEmail: ${data.email}\n\nMensaje:\n${data.message}`,
    html: `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <br/>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
  });
}
