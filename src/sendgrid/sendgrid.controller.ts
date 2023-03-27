import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { SendgridDto } from './dto/sendgrid.dto'; 

@Controller('sendgrid')
export class SendgridController {
  constructor(private readonly sendgridService: SendgridService) {}

  @Post()
  create(@Body() sendgridDto: SendgridDto) {
    return this.sendgridService.sendEmail(sendgridDto);
  } 
}
