import { Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { SendgridController } from './sendgrid.controller';
import { SendGridProvider } from './sendgrid.provider';

@Module({
  controllers: [SendgridController],
  providers: [SendgridService, SendGridProvider],
})
export class SendgridModule {}
