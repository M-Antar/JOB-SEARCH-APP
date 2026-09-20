export const ACCEPT_APPLICATION_EMAIL = (
  applicantName: string,
  jobTitle: string,
  companyName: string,
) => ({
  subject: `Application Accepted - ${jobTitle}`,
  html: `
    <h2>Congratulations ${applicantName}!</h2>

    <p>
      We are pleased to inform you that your application for
      <strong>${jobTitle}</strong> at
      <strong>${companyName}</strong> has been accepted.
    </p>

    <p>
      Congratulations, and we wish you the best!
    </p>
  `,
});

export const REJECT_APPLICATION_EMAIL = (
  applicantName: string,
  jobTitle: string,
  companyName: string,
) => ({
  subject: `Application Update - ${jobTitle}`,
  html: `
    <h2>Hello ${applicantName},</h2>

    <p>
      Thank you for applying for
      <strong>${jobTitle}</strong> at
      <strong>${companyName}</strong>.
    </p>

    <p>
      Unfortunately, your application was not selected at this time.
    </p>

    <p>
      We appreciate your interest and wish you the best in your job search.
    </p>
  `,
});