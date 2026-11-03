import { HTTP_AUTH_STRATEGY, HttpClient } from 'http-client';

export class MailApiService {
  private httpClient;
  private entity = 'Vichellins Service';

  constructor() {
    this.httpClient = HttpClient.getForEntity(this.entity);
    this.httpClient.setHttpConfig({
      baseUrl: process.env.MAIL_API_URL,
      apiKey: process.env.MAIL_API_KEY
    });
    this.httpClient.setHttpAuthStrategy(HTTP_AUTH_STRATEGY.API_KEY);
  }

  async sendEmail(from: string, to: string, subject: string, html: string) {
    return this.httpClient.post(`/send-email`, { from, to, subject, html });
  }
}
