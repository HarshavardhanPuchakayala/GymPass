import { Resend } from "resend";
const resend = new Resend(process.env.MAIL);

export const sendReminderEmail = async ({ to, gymName, members }) => {
  const memberList = members
    .map(
      (m) =>
        `- ${m.name} (due: ${new Date(m.dueDate).toDateString()})`
    )
    .join("\n");

  await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'projects9h@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});
};