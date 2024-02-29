import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL;

// send a password reset email
export const sendPasswordResetEmail = async (
    email: string,
    token: string,
  ) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    await resend.emails.send({
      from: `${fromEmail}`,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    });
  };

  // send a 2FA token email
  export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
  ) => {
    await resend.emails.send({
      from: `${fromEmail}`,
      to: email,
      subject: "2FA Code",
      html: `<p>Your 2FA code: ${token}</p>`
    });
  };

// send a verification email
export const sendVerificationEmail = async (
  email: string,
  token: string
) => {

  // append the verification token to the confirmation link
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: `${fromEmail}`,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  });
};
