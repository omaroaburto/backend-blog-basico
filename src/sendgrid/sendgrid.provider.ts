import * as SendGrid from '@sendgrid/mail';
import { SENDGRID } from './constants';

export const SendGridProvider = {
  provide: SENDGRID,
  useFactory: () => {
    return SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  },
};
