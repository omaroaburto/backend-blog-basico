import { Column, Entity,  PrimaryGeneratedColumn } from "typeorm"; 

@Entity('partners')
export class Partner {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    fullName:string;
    @Column('text')
    description: string;
    @Column('text')
    profession:string;
    @Column('bool',{
        default: true,
    })
    isActive:boolean;
    @Column('text',{
        unique: true,
        nullable: true
    })
    image?:string;
}
