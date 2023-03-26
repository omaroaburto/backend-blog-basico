import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
@Entity('project_images')
export class ProjectImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  url: string;
  @ManyToOne(() => Project, (project) => project.images, {
    onDelete: 'CASCADE',
  })
  project: Project;
}
