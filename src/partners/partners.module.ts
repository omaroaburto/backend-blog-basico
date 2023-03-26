import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity'; 
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PartnersController],
  providers: [PartnersService],
  imports: [
    TypeOrmModule.forFeature([Partner]),
    CloudinaryModule,
    AuthModule
  ],
  exports:[
    TypeOrmModule
  ]
})
export class PartnersModule {}
