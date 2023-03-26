import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ProjectImage } from './project-image.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    unique: true,
  })
  title: string;
  @Column('text', {
    unique: true,
  })
  slug: string;
  @Column('text')
  description: string;
  @Column('date')
  date: Date;
  @OneToMany(() => ProjectImage, (projectImage) => projectImage.project, {
    cascade: true,
    eager: true,
  })
  images?: ProjectImage[];
  
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
