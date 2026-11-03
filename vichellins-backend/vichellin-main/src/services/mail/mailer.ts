import { Transporter, createTransport } from 'nodemailer';
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

import getTemplate from './getTemplate';
import { MailApiService } from '../../apis/MailApiService';

export type MailParams<T> = {
  to: string;
  subject: string;
  template: string;
  data: T;
};

export type MailParamsApi = {
  to: string;
  subject: string;
  html: any;
};

export interface IMailProvider {
  sendMail<T>(mailParams: MailParams<T>): Promise<void>;
  sendMailApi(mailParamsApi: MailParamsApi): Promise<void>;
}

export class MailProvider implements IMailProvider {
  private readonly transporter!: Transporter;
  private readonly mailApiService!: MailApiService;

  constructor() {
    this.mailApiService = new MailApiService();

    if (process.env.MAIL_STRATEGY === 'aws-ses') {
      console.log('Using AWS SES for mail service');
      this.transporter = createTransport({
        SES: {
          sesClient: new SESv2Client({
            region: String(process.env.AWS_REGION),
            credentials: defaultProvider()
          }),
          SendEmailCommand
        }
      });
    } else if (process.env.MAIL_STRATEGY === 'smtp') {
      console.log('Using SMTP for mail service');
      this.transporter = createTransport({
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: true,
        auth: {
          user: String(process.env.MAIL_USER),
          pass: String(process.env.MAIL_PASS)
        },
        tls: { rejectUnauthorized: false }
      });
    }
  }

  async sendMail<T>(params: MailParams<T>) {
    const response = await this.transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.MAIL_FROM}>`,
      to: params.to,
      subject: params.subject,
      html: getTemplate(params.template, params.data)
    });
    console.log('MAIL_RESPONSE:', response.envelope);
  }

  async sendMailApi(mailParamsApi: MailParamsApi) {
    const { to, subject, html } = mailParamsApi;
    const from = `${process.env.APP_NAME} <${process.env.MAIL_FROM}>`;
    return this.mailApiService.sendEmail(from, to, subject, html);
  }
}

let _instance: IMailProvider;

const getMailInstance = () => {
  return _instance || (_instance = new MailProvider());
};

export default getMailInstance;
