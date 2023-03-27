import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SendgridDto } from './dto/sendgrid.dto';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  private readonly logger = new Logger('SendGridService');

  async sendEmail(sendgridDto: SendgridDto) {
    try {
      const { phone, text, from, subject } = sendgridDto;
      const html = `<div>
                      <p>${text}</p>
                      <span>teléfono: ${phone}</span>
                      <span>email: ${from}  </span>
                    </div>`;
      const respuesta = await this.send({
        to: process.env.EMAIL,
        from: process.env.EMAIL,
        html,
        subject,
      });
      return {
        code: respuesta[0].statusCode,
        message: `Email successfully dispatched to ${process.env.EMAIL}`
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
  private async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);

    console.log(`Email successfully dispatched to ${mail.to}`);
    return transport;
  }
}
