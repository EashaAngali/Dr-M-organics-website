import { Resend } from "resend";

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    console.log("Email skipped: RESEND_API_KEY missing");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Dr M Organics <onboarding@resend.dev>",
    to,
    subject,
    html
  });
};

export default sendEmail;
