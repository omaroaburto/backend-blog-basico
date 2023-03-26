import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    TypeOrmModule.forFeature([Project, ProjectImage]),
    CloudinaryModule
  ],
  exports:[
    TypeOrmModule,
  ]
})
export class ProjectsModule {}
