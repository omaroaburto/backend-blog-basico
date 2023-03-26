import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  //*CREATE USER
  async create(createAuthDto: CreateAuthDto) {
    try {
      const { email, password } = createAuthDto;
      const user = this.userRepository.create({
        email,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  //*Listar usuarios
  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }
  
  //*login
  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user)
      throw new UnauthorizedException(`Credentials are not valid (email)`);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credentials are not valid (password)`);

    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
      }),
    };
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    try {
      if (updateAuthDto.password)
        updateAuthDto.password = bcrypt.hashSync(updateAuthDto.password, 10);
      //*OPCION1: const user = this.userRepository.update({ id }, { ...updateAuthDto });
      //*OPCION2: const user = this.userRepository
      //   .createQueryBuilder()
      //   .update(User)
      //   .set({ ...updateAuthDto })
      //   .where('id = :id', { id })
      //.execute();
      //*FIN OPCION2
      let user = await this.userRepository.findOne({
        where: { id },
      });
      user = await this.userRepository.save({ ...user, ...updateAuthDto });
      delete user.password;
      return {
        user,
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: {id},
    });
    return this.userRepository.save({...user, isActive: false});
  }

  //*CREATE TOKEN
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  //*ERROR
  private handleException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
