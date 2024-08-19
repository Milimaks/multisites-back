import { Resend } from 'resend';

export class MailerService {
  private readonly mailer: Resend;
  constructor() {
    this.mailer = new Resend(process.env.RESEND_API_KEY);
  }

  async sendCreatedAccountEmail({ recipient, firstName }) {
    const { data, error } = await this.mailer.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [`${recipient}`],
      subject: `Hello ${firstName}!`,
      html: `<strong>It works ${firstName} !</strong>`,
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  }
}
