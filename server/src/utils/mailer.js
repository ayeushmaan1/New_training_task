import nodemailer from 'nodemailer';

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransport() {
  if (!hasSmtpConfig()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendMail({ to, subject, text, html }) {
  const transport = createTransport();

  if (!transport) {
    console.log('[mail:preview]', { to, subject, text });
    return { preview: true };
  }

  return transport.sendMail({
    from: process.env.MAIL_FROM || 'Blog Platform <no-reply@example.com>',
    to,
    subject,
    text,
    html
  });
}

export async function sendPasswordResetEmail(user, token) {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  return sendMail({
    to: user.email,
    subject: 'Reset your Inkline password',
    text: `Use this link to reset your password: ${resetUrl}`,
    html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });
}

export async function sendContactEmail(payload) {
  return sendMail({
    to: process.env.CONTACT_TO || process.env.SMTP_USER || 'owner@example.com',
    subject: `New contact message: ${payload.subject}`,
    text: `${payload.name} <${payload.email}> wrote:\n\n${payload.message}`
  });
}
