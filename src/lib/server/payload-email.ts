import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import type { EmailAdapter } from 'payload'
import { getEmailEnvironment } from './env'

const smtpVariables = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'EMAIL_FROM',
] as const

export async function createPayloadEmailAdapter(
  environment: NodeJS.ProcessEnv = process.env,
): Promise<EmailAdapter> {
  const anySMTPConfiguration = smtpVariables.some(
    (variable) => Boolean(environment[variable]?.trim()),
  )

  if (!anySMTPConfiguration) {
    return () => ({
      defaultFromAddress: 'no-reply@invalid.invalid',
      defaultFromName: 'Sara Gibby',
      name: 'smtp-not-configured',
      sendEmail: async () => {
        throw new Error(
          'SMTP delivery is not configured. Set SMTP_HOST, SMTP_PORT, and EMAIL_FROM.',
        )
      },
    })
  }

  const env = getEmailEnvironment(environment)
  return nodemailerAdapter({
    defaultFromAddress: env.EMAIL_FROM,
    defaultFromName: 'Sara Gibby',
    skipVerify: true,
    transportOptions: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE === 'true',
      ...(env.SMTP_USER && env.SMTP_PASSWORD
        ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } }
        : {}),
    },
  })
}
