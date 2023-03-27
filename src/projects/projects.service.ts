import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UploadProjectDto } from './dto/upload-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger('ProjectService');
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectImage)
    private readonly projectImageRepository: Repository<ProjectImage>,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const { images = [], ...projectDetails } = createProjectDto;
      const project = this.projectRepository.create({ ...projectDetails });
      await this.projectRepository.save(project);
      return {
        project,
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    const projects = await this.projectRepository.findAndCount();
    return {
      projects,
    };
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    return {
      project,
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const { images = [], ...projectDetails } = updateProjectDto;
      const project = await this.projectRepository
        .createQueryBuilder()
        .update(Project)
        .set({
          ...projectDetails,
        })
        .where('id = :id', { id })
        .returning(['id', 'title', 'slug', 'description', 'date', 'images'])
        .execute();
      const { raw } = project;
      return raw[0];
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const project = await this.projectRepository
      .createQueryBuilder()
      .update(Project)
      .set({ isActive: false })
      .where('id = :id', { id })
      .returning([
        'id',
        'title',
        'slug',
        'description',
        'date',
        'images',
        'isActive',
      ])
      .execute();
    const { raw } = project;
    return raw[0];
  }

  async upload(id: string, files: Array<Express.Multer.File>) {
    let project = await this.projectRepository.findOne({ where: { id } });
    const images = await Promise.all(
      files.map(async (file) => {
        const { url } = await this.cloudinary.uploadImage(file);
        const images = this.projectImageRepository.create({ url });
        return images;
      }),
    );
    project.images = [...project.images, ...images];
    await this.projectRepository.save(project);
    return {
      project,
    };
  }

  async removeImages(id: string, uploadProjectDto: UploadProjectDto) {
    let urls:string[];
    if (uploadProjectDto.images && uploadProjectDto.images.length > 0) {
      const projects = await this.projectImageRepository.find({
        where:{
          id: In([...uploadProjectDto.images]),
          project:{ id}
        }
      })
      const urls = projects.map(project => project.url);
      const ids =  projects.map(project => project.id);
      this.cloudinary.deleteMoreThanOne(urls);
      await this.projectImageRepository
      .createQueryBuilder()
      .delete()
      .from(ProjectImage)
      .where('id IN (:...ids)',{ids})
      .execute();
      return await this.findOne(id);
    } else {
      const project = await this.projectRepository.findOne({
        where: { id },
      });
      urls = project.images.map(({ url }) => url);
      this.cloudinary.deleteMoreThanOne(urls);
      await this.projectImageRepository
        .createQueryBuilder()
        .delete()
        .from(ProjectImage)
        .where('projectId=:id',{id})
        .execute();
      return await this.findOne(id);
    }
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
