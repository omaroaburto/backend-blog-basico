import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PartnersService {
  private readonly logger = new Logger('PartnerService');
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(createPartnerDto: CreatePartnerDto) {
    const partner = this.partnerRepository.create({ ...createPartnerDto });
    await this.partnerRepository.save(partner);
    return {
      partner,
    };
  }

  async findAll() {
    const partners = await this.partnerRepository.find();
    return { partners };
  }

  async findOne(id: string) {
    const partner = await this.partnerRepository.findOne({
      where: { id },
    });
    return {
      partner,
    };
  }
  // TODO .returning(['id', 'email']) para retonar valor
  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    delete updatePartnerDto.image;
    const partner = await this.partnerRepository
      .createQueryBuilder()
      .update(Partner)
      .set({ ...updatePartnerDto })
      .where('id = :id', { id })
      .execute();
    return {
      partner,
    };
  }

  async remove(id: string) {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    return this.partnerRepository.save({ ...partner, isActive: false });
  }

  async upload(id: string, file: Express.Multer.File) {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (partner.image) {
      this.cloudinary.deleteImage(partner.image);
    }
    const { url } = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
    this.partnerRepository.save({ ...partner, image: url });
    return {
      ...partner,
      image: url,
    };
  }
}
