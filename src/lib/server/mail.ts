import nodemailer from 'nodemailer'
import { getEmailEnvironment } from './env'

export async function sendTransactionalEmail(input: {
  to: string
  subject: string
  text: string
  html: string
  headers?: Record<string, string>
}): Promise<void> {
  const env = getEmailEnvironment()
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === 'true',
    ...(env.SMTP_USER && env.SMTP_PASSWORD
      ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } }
      : {}),
  })
  try {
    await transport.sendMail({
      from: env.EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      headers: input.headers,
    })
  } finally {
    transport.close()
  }
}

export function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return replacements[character] ?? character
  })
}
