import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) return null;
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
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

  return client.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to,
    subject: `Mensaje de ${data.name} — Portfolio`,
    text: `Nombre: ${data.name}\nEmail: ${data.email}\n\nMensaje:\n${data.message}`,
    html: `
      <p><strong>Nombre:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <br/>
      <p><strong>Mensaje:</strong></p>
      <p>${data.message.replace(/\n/g, "<br/>")}</p>
    `,
  });
}
